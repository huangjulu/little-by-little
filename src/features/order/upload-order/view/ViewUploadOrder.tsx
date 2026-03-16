"use client";

import type { DialogProps } from "@radix-ui/react-dialog";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import {
  parseSpreadsheet,
  type RawRow,
  validateRows,
  type ValidationResult,
} from "@/lib/csv-parser";
import Dialog from "@/ui/dialog";
import FileUploadDrop from "@/ui/file-upload-drop";

import { orderApi } from "../../order.api";
import UploadPreviewTable from "../UploadPreviewTable";

type Step = "upload" | "preview" | "importing" | "result";

interface ViewUploadOrderProps extends DialogProps {
  className?: string;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: { index: number; message: string }[];
}

const ACCEPT =
  ".csv,.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv";

const ViewUploadOrder: React.FC<ViewUploadOrderProps> = (props) => {
  const [step, setStep] = useState<Step>("upload");
  const [rawRows, setRawRows] = useState<RawRow[]>([]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const importMutation = orderApi.import.useMutation();

  const handleReset = useCallback(() => {
    setStep("upload");
    setRawRows([]);
    setValidation(null);
    setImportResult(null);
    setFileError(null);
  }, []);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) handleReset();
      props.onOpenChange?.(open);
    },
    [props, handleReset]
  );

  const handleFileChange = useCallback((file: File) => {
    setFileError(null);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const buffer = reader.result as ArrayBuffer;
        const parsed = parseSpreadsheet(buffer);

        if (parsed.warnings?.length) {
          setFileError(parsed.warnings.join("；"));
          return;
        }
        if (parsed.rows.length === 0) {
          setFileError("檔案中無資料行");
          return;
        }

        const result = validateRows(parsed.rows);
        setRawRows(parsed.rows);
        setValidation(result);
        setStep("preview");
      } catch (err) {
        setFileError(err instanceof Error ? err.message : "無法解析此檔案格式");
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleImport = useCallback(() => {
    if (!validation || validation.valid.length === 0) return;
    setStep("importing");

    importMutation.mutate(validation.valid, {
      onSuccess: (res) => {
        setImportResult(res.data);
        setStep("result");
        if (res.data.success > 0) {
          toast.success(`成功匯入 ${res.data.success} 筆訂單`);
        }
        if (res.data.failed > 0) {
          toast.error(`${res.data.failed} 筆匯入失敗`);
        }
      },
      onError: (err) => {
        toast.error(err.message);
        setStep("preview");
      },
    });
  }, [validation, importMutation]);

  return (
    <Dialog.Root open={props.open} onOpenChange={handleOpenChange}>
      <Dialog.Content size="lg" className={props.className}>
        <Dialog.Header isSticky isClosable>
          <Dialog.Title>匯入訂單</Dialog.Title>
          <Dialog.Description>
            {step === "upload" && "上傳 CSV 或 Excel 檔案以批量匯入訂單。"}
            {step === "preview" && "預覽解析結果，確認無誤後點擊匯入。"}
            {step === "importing" && "正在匯入中，請稍候..."}
            {step === "result" && "匯入完成。"}
          </Dialog.Description>
        </Dialog.Header>

        <Dialog.Body>
          <div className="py-4">
            {step === "upload" && (
              <div className="space-y-4">
                <FileUploadDrop
                  accept={ACCEPT}
                  hint="支援 CSV、Excel (.xlsx / .xls)"
                  error={fileError}
                  onChange={handleFileChange}
                />
                <p className="text-center text-xs text-gray-500">
                  不確定格式？
                  <a
                    href="/templates/import-template.xlsx"
                    download
                    className="ml-1 text-blue-600 underline hover:text-blue-800"
                  >
                    下載範本檔案
                  </a>
                </p>
              </div>
            )}

            {step === "preview" && validation && (
              <UploadPreviewTable
                valid={validation.valid}
                errors={validation.errors}
                rawRows={rawRows}
              />
            )}

            {step === "importing" && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-600" />
                  <p className="text-sm text-gray-500">
                    正在匯入 {validation?.valid.length} 筆訂單...
                  </p>
                </div>
              </div>
            )}

            {step === "result" && importResult && (
              <ResultStep result={importResult} />
            )}

            {validation?.truncated && step === "preview" && (
              <p className="mt-2 text-sm text-amber-600">
                檔案超過 500 行，僅處理前 500 行。
              </p>
            )}
          </div>
        </Dialog.Body>

        {step === "preview" && (
          <div className="flex justify-end gap-2 border-t px-6 py-4">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-md border px-4 py-2 text-sm font-medium"
            >
              重新選檔
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={!validation || validation.valid.length === 0}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              匯入 {validation?.valid.length ?? 0} 筆
            </button>
          </div>
        )}

        {step === "result" && (
          <div className="flex justify-end border-t px-6 py-4">
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              完成
            </button>
          </div>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};

ViewUploadOrder.displayName = "ViewUploadOrder";

export default ViewUploadOrder;

function ResultStep(props: {
  result: {
    success: number;
    failed: number;
    errors: { index: number; message: string }[];
  };
}) {
  const { result } = props;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-sm">
        <span className="text-green-700">成功：{result.success} 筆</span>
        {result.failed > 0 && (
          <span className="text-red-600">失敗：{result.failed} 筆</span>
        )}
      </div>
      {result.errors.length > 0 && (
        <div className="max-h-40 overflow-auto rounded-md border bg-red-50 p-3 text-sm">
          <p className="mb-1 font-medium text-red-800">失敗明細：</p>
          <ul className="space-y-0.5 text-red-700">
            {result.errors.map((e, i) => (
              <li key={i}>
                第 {e.index + 1} 筆：{e.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
