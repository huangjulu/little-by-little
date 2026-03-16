import * as XLSX from "xlsx";

import type { CreateOrderParams } from "@/features/order/types";

// ─── Types ───────────────────────────────────────────────────────────────────

export type RawRow = Record<string, string | undefined>;

export interface ParseResult {
  rows: RawRow[];
  warnings?: string[];
}

export interface ValidationError {
  row: number;
  message: string;
}

export interface ValidationResult {
  valid: CreateOrderParams[];
  errors: ValidationError[];
  truncated?: boolean;
}

// ─── 中文欄位名 → CreateOrderParams key ─────────────────────────────────────

const COLUMN_MAP: Record<string, string> = {
  客戶姓名: "customerName",
  手機號碼: "mobilePhone",
  社區名稱: "communityName",
  "門牌/戶號": "houseUnit",
  基礎價格: "basePrice",
  目前價格: "currentPrice",
  合約起始日: "contractStartDate",
  合約到期日: "contractEndDate",
  繳費期限: "paymentDeadline",
  下次帳單日: "nextBillingDate",
};

const MAX_ROWS = 500;

const PRICE_FIELDS = ["basePrice", "currentPrice"] as const;
const DATE_FIELDS = [
  "contractStartDate",
  "contractEndDate",
  "paymentDeadline",
  "nextBillingDate",
] as const;

const PRICE_LABEL: Record<string, string> = {
  basePrice: "基礎價格",
  currentPrice: "目前價格",
};
const DATE_LABEL: Record<string, string> = {
  contractStartDate: "合約起始日",
  contractEndDate: "合約到期日",
  paymentDeadline: "繳費期限",
  nextBillingDate: "下次帳單日",
};

// ─── Public API ──────────────────────────────────────────────────────────────

export function parseSpreadsheet(buffer: ArrayBuffer): ParseResult {
  const wb = readWorkbook(buffer);
  const sheetName = wb.SheetNames[0] as string;
  if (!sheetName) return { rows: [], warnings: ["檔案中沒有工作表"] };

  const sheet = wb.Sheets[sheetName];
  const raw: string[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
  });

  if (raw.length === 0) return { rows: [] };

  const headerRow = raw[0].map((h) =>
    String(h)
      .trim()
      .replace(/^\uFEFF/, "")
  );
  const mappedHeaders = headerRow.map((h) => COLUMN_MAP[h]);
  const matchedCount = mappedHeaders.filter(Boolean).length;

  if (matchedCount === 0) {
    return { rows: [], warnings: ["未偵測到任何已知欄位"] };
  }

  const rows: RawRow[] = [];
  for (let i = 1; i < raw.length; i++) {
    const row: RawRow = {};
    for (let j = 0; j < mappedHeaders.length; j++) {
      const key = mappedHeaders[j];
      if (key) {
        const val = String(raw[i]?.[j] ?? "").trim();
        if (val) row[key] = val;
      }
    }
    if (Object.keys(row).length > 0) rows.push(row);
  }

  return { rows };
}

export function validateRows(rows: RawRow[]): ValidationResult {
  const valid: CreateOrderParams[] = [];
  const errors: ValidationError[] = [];
  let truncated = false;

  const limit = Math.min(rows.length, MAX_ROWS);
  if (rows.length > MAX_ROWS) truncated = true;

  for (let i = 0; i < limit; i++) {
    const raw = rows[i];
    const rowNum = i + 2; // +1 for 0-index, +1 for header row

    if (isEmptyRow(raw)) continue;

    const rowErrors = validateSingleRow(raw, rowNum);
    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
      continue;
    }

    valid.push(buildCreateOrderParams(raw));
  }

  return { valid, errors, truncated };
}

// ─── 內部輔助函式 ────────────────────────────────────────────────────────────

function readWorkbook(buffer: ArrayBuffer): XLSX.WorkBook {
  try {
    // 嘗試以 UTF-8 文字讀取（CSV 格式）
    if (looksLikeText(buffer)) {
      const text = new TextDecoder("utf-8").decode(buffer);
      const wb = XLSX.read(text, { type: "string", raw: true });
      if (wb.SheetNames.length > 0 && wb.Sheets[wb.SheetNames[0]]?.["!ref"]) {
        return wb;
      }
    }

    // 非文字檔案必須是已知的二進位格式（ZIP/XLSX 或 OLE/XLS）
    const head = new Uint8Array(buffer, 0, Math.min(buffer.byteLength, 4));
    const isZip = head[0] === 0x50 && head[1] === 0x4b;
    const isOle = head[0] === 0xd0 && head[1] === 0xcf;
    if (!isZip && !isOle) {
      throw new Error("無法解析此檔案格式");
    }

    // 嘗試以二進位讀取（Excel 格式）
    const wb = XLSX.read(buffer, { type: "array" });
    if (!wb.SheetNames || wb.SheetNames.length === 0) {
      throw new Error("無法解析此檔案格式");
    }
    const sheet = wb.Sheets[wb.SheetNames[0]];
    if (!sheet || !sheet["!ref"]) {
      throw new Error("無法解析此檔案格式");
    }
    return wb;
  } catch (e) {
    if (e instanceof Error && e.message === "無法解析此檔案格式") throw e;
    throw new Error("無法解析此檔案格式");
  }
}

/** 簡易判斷 buffer 是否看起來像 text（非 binary） */
function looksLikeText(buffer: ArrayBuffer): boolean {
  const bytes = new Uint8Array(buffer, 0, Math.min(buffer.byteLength, 512));
  // Excel 檔案以 PK（zip）或特定 magic bytes 開頭
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) return false; // ZIP/XLSX
  if (bytes[0] === 0xd0 && bytes[1] === 0xcf) return false; // OLE/XLS
  // 如果大部分 bytes 都在可列印範圍，視為文字
  let printable = 0;
  for (let i = 0; i < bytes.length; i++) {
    if (bytes[i] >= 0x09 && bytes[i] !== 0x7f) printable++;
  }
  return printable / bytes.length > 0.85;
}

function isEmptyRow(row: RawRow): boolean {
  return Object.values(row).every((v) => !v || !String(v).trim());
}

function validateSingleRow(row: RawRow, rowNum: number): ValidationError[] {
  const errs: ValidationError[] = [];

  if (!row.customerName?.trim()) {
    errs.push({ row: rowNum, message: "客戶姓名 為必填" });
  }
  if (!row.mobilePhone?.trim()) {
    errs.push({ row: rowNum, message: "手機號碼 為必填" });
  }

  for (const field of PRICE_FIELDS) {
    const val = row[field];
    if (!val) continue;
    const cleaned = val.replace(/,/g, "");
    if (Number.isNaN(Number(cleaned)) || Number(cleaned) < 0) {
      errs.push({
        row: rowNum,
        message: `${PRICE_LABEL[field]} 必須為非負數字`,
      });
    }
  }

  for (const field of DATE_FIELDS) {
    const val = row[field];
    if (!val) continue;
    if (!isValidDateString(val)) {
      errs.push({ row: rowNum, message: `${DATE_LABEL[field]} 日期格式無效` });
    }
  }

  return errs;
}

function isValidDateString(s: string): boolean {
  const normalized = s.replace(/\//g, "-");
  // 拒絕民國年格式（如 115/03/15 → 115-03-15）
  if (/^\d{3}-/.test(normalized)) return false;
  const d = new Date(normalized);
  return !Number.isNaN(d.getTime());
}

function normalizeDate(s: string): string {
  return s.replace(/\//g, "-");
}

function normalizePrice(s: string): number {
  return Number(s.replace(/,/g, ""));
}

function buildCreateOrderParams(raw: RawRow): CreateOrderParams {
  const params: CreateOrderParams = {
    customerName: raw.customerName!.trim(),
    mobilePhone: raw.mobilePhone!.trim(),
  };

  if (raw.communityName) params.communityName = raw.communityName.trim();
  if (raw.houseUnit) params.houseUnit = raw.houseUnit.trim();

  for (const field of PRICE_FIELDS) {
    if (raw[field]) {
      (params as unknown as Record<string, unknown>)[field] = normalizePrice(
        raw[field]!
      );
    }
  }

  for (const field of DATE_FIELDS) {
    if (raw[field]) {
      (params as unknown as Record<string, unknown>)[field] = normalizeDate(
        raw[field]!
      );
    }
  }

  return params;
}
