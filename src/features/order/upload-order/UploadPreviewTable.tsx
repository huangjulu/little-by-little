"use client";

import type { RawRow, ValidationError } from "@/lib/csv-parser";

import type { CreateOrderParams } from "../types";

interface UploadPreviewTableProps {
  valid: CreateOrderParams[];
  errors: ValidationError[];
  rawRows: RawRow[];
}

const COLUMNS = [
  { key: "customerName", label: "客戶姓名" },
  { key: "mobilePhone", label: "手機號碼" },
  { key: "communityName", label: "社區名稱" },
  { key: "houseUnit", label: "門牌/戶號" },
  { key: "basePrice", label: "基礎價格" },
  { key: "currentPrice", label: "目前價格" },
  { key: "contractStartDate", label: "合約起始日" },
  { key: "contractEndDate", label: "合約到期日" },
  { key: "paymentDeadline", label: "繳費期限" },
  { key: "nextBillingDate", label: "下次帳單日" },
] as const;

const UploadPreviewTable: React.FC<UploadPreviewTableProps> = (props) => {
  const errorRowSet = new Set(props.errors.map((e) => e.row));
  const errorByRow = new Map<number, string[]>();
  for (const e of props.errors) {
    const msgs = errorByRow.get(e.row) ?? [];
    msgs.push(e.message);
    errorByRow.set(e.row, msgs);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-sm">
        <span className="text-green-700">有效：{props.valid.length} 筆</span>
        <span className="text-red-600">錯誤：{props.errors.length} 筆</span>
        <span className="text-gray-500">共解析 {props.rawRows.length} 行</span>
      </div>

      <div className="max-h-64 overflow-auto rounded-md border">
        <table className="min-w-[800px] w-full text-sm">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-600">
                行
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.rawRows.map((row, idx) => {
              const rowNum = idx + 2;
              const hasError = errorRowSet.has(rowNum);
              const msgs = errorByRow.get(rowNum);
              return (
                <tr
                  key={idx}
                  className={hasError ? "bg-red-50" : "hover:bg-gray-50"}
                >
                  <td className="px-3 py-1.5 text-gray-400">{rowNum}</td>
                  {COLUMNS.map((col) => (
                    <td
                      key={col.key}
                      className="px-3 py-1.5 whitespace-nowrap"
                      title={msgs?.join("; ")}
                    >
                      {row[col.key] ?? ""}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

UploadPreviewTable.displayName = "UploadPreviewTable";

export default UploadPreviewTable;
