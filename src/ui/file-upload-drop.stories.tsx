import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { useState } from "react";

import FileUploadDrop from "./file-upload-drop";

interface FileUploadDropStoryProps {
  accept?: string;
  description?: string;
  hint?: string;
  error?: string | null;
  disabled?: boolean;
}

const FileUploadDropShell: React.FC<FileUploadDropStoryProps> = (props) => {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="w-[400px] space-y-2">
      <FileUploadDrop {...props} onChange={(file) => setFileName(file.name)} />
      {fileName && <p className="text-sm text-gray-600">已選擇：{fileName}</p>}
    </div>
  );
};

const meta = {
  title: "UI/FileUploadDrop",
  component: FileUploadDropShell,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    accept: {
      control: "text",
      description: "允許的檔案類型（HTML accept 屬性）",
    },
    description: {
      control: "text",
      description: "主要提示文字",
    },
    hint: {
      control: "text",
      description: "次要說明文字",
    },
    error: {
      control: "text",
      description: "錯誤訊息",
    },
    disabled: {
      control: "boolean",
      description: "是否停用",
    },
  },
} satisfies Meta<typeof FileUploadDropShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hint: "支援 CSV、Excel (.xlsx / .xls)",
  },
  parameters: {
    docs: {
      description: {
        story: "預設的檔案拖放上傳區域，點擊或拖曳檔案皆可觸發。",
      },
    },
  },
};

export const WithCustomDescription: Story = {
  args: {
    description: "上傳您的報表檔案",
    hint: "僅支援 .xlsx 格式，最大 10MB",
    accept: ".xlsx",
  },
  parameters: {
    docs: {
      description: {
        story: "自訂描述文字和檔案類型限制。",
      },
    },
  },
};

export const WithError: Story = {
  args: {
    hint: "支援 CSV、Excel (.xlsx / .xls)",
    error: "檔案格式不正確，請上傳 CSV 或 Excel 檔案",
  },
  parameters: {
    docs: {
      description: {
        story: "檔案解析失敗或格式不符時的錯誤狀態。",
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    hint: "支援 CSV、Excel (.xlsx / .xls)",
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: "停用狀態，無法點擊或拖曳。",
      },
    },
  },
};
