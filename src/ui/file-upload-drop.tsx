"use client";

import { CloudUpload as IconCloudUpload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface FileUploadDropProps {
  accept?: string;
  description?: string;
  hint?: string;
  error?: string | null;
  disabled?: boolean;
  className?: string;
  onChange?: (file: File) => void;
}

const FileUploadDrop: React.FC<FileUploadDropProps> = (props) => {
  const { accept, description, hint, error, disabled, className, onChange } =
    props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file || disabled) return;
      onChange?.(file);
    },
    [disabled, onChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFile(e.target.files?.[0]);
      if (inputRef.current) inputRef.current.value = "";
    },
    [handleFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFile(e.dataTransfer.files?.[0]);
    },
    [handleFile]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className={cn("space-y-2", className)}>
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors",
          isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100",
          error && "border-red-300 bg-red-50 hover:border-red-400",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <IconCloudUpload
          className={cn(
            "mb-3 h-10 w-10",
            error ? "text-red-400" : "text-gray-400"
          )}
        />
        <p className="text-sm font-medium text-gray-700">
          {description ?? "點擊選擇檔案或拖曳至此"}
        </p>
        {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

FileUploadDrop.displayName = "FileUploadDrop";

export default FileUploadDrop;
