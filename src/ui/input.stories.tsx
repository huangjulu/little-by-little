import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  AlertTriangle as IconAlertTriangle,
  Plus as IconPlus,
} from "lucide-react";
import React from "react";
import { useState } from "react";

import Input from "./input";

type InputStatus = "default" | "success" | "warning" | "error";

interface InputStoryProps {
  /** 輸入框類型（text / password 等） */
  type?: string;
  /** 目前輸入的值，主要用於展示受控行為 */
  value?: string;
  /** 佔位文字 */
  placeholder?: string;
  /** 是否顯示左側 icon */
  hasLeftIcon?: boolean;
  /** 是否顯示右側 icon（例如清除、狀態指示） */
  hasRightIcon?: boolean;
  /** 輸入框狀態：預設 / 成功 / 警告 / 錯誤 */
  status?: InputStatus;
  /** 是否為密碼輸入模式（會覆寫 type 為 password） */
  isPassword?: boolean;
}

const getStatusClassName = (status: InputStatus = "default") => {
  switch (status) {
    case "success":
      return "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/30";
    case "warning":
      return "border-yellow-500 focus-visible:border-yellow-500 focus-visible:ring-yellow-500/30";
    case "error":
      return "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30";
    case "default":
    default:
      return "";
  }
};

const InputShell: React.FC<InputStoryProps> = ({
  type = "text",
  value: initialValue = "",
  placeholder = "請輸入文字",
  hasLeftIcon = false,
  hasRightIcon = false,
  status = "default",
  isPassword = false,
}) => {
  const [value, setValue] = useState(initialValue);

  const inputType = isPassword ? "password" : type;

  return (
    <div className="space-y-2">
      <div
        className={[
          "flex items-center rounded-md border bg-background px-2 py-1 shadow-xs transition-colors",
          "focus-within:border-ring focus-within:ring-ring/40 focus-within:ring-[0.1875rem]",
          getStatusClassName(status),
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {hasLeftIcon && (
          <span className="mr-2 inline-flex text-muted-foreground">
            <IconPlus className="h-4 w-4" />
          </span>
        )}

        <Input
          type={inputType}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={[
            "border-0 bg-transparent px-0 shadow-none outline-none focus-visible:ring-0",
            hasLeftIcon ? "pl-0" : "",
            hasRightIcon ? "pr-0" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={status === "error"}
        />

        {hasRightIcon && (
          <span className="ml-2 inline-flex text-muted-foreground">
            {status === "default" && <IconPlus className="h-4 w-4" />}
            {status === "success" && (
              <span className="h-2 w-2 rounded-full bg-green-500" />
            )}
            {status === "warning" && (
              <IconAlertTriangle className="h-[1.125rem] w-[1.125rem] text-yellow-500" />
            )}
            {status === "error" && (
              <IconAlertTriangle className="h-[1.125rem] w-[1.125rem] text-destructive" />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

const meta = {
  title: "UI/Input",
  component: InputShell,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: { type: "select" },
      options: ["default", "success", "warning", "error"],
      description: "輸入框的狀態樣式",
    },
    hasLeftIcon: {
      control: "boolean",
      description: "是否顯示左側 icon（例如功能提示）",
    },
    hasRightIcon: {
      control: "boolean",
      description: "是否顯示右側 icon（例如狀態提示或清除按鈕）",
    },
    isPassword: {
      control: "boolean",
      description: "切換為密碼輸入樣式",
    },
  },
} satisfies Meta<typeof InputShell>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Default - 一般文字輸入
export const Default: Story = {
  render: (args) => <InputShell {...args} />,
  args: {
    type: "text",
    placeholder: "請輸入帳號",
    hasLeftIcon: false,
    hasRightIcon: false,
    status: "default",
    isPassword: false,
  },
  parameters: {
    docs: {
      description: {
        story: "最基本的文字輸入框，示範一般狀態、hover、focus 等互動樣式。",
      },
    },
  },
};

// 2. WithIcons - 左右 icon 樣式
export const WithIcons: Story = {
  render: (args) => <InputShell {...args} />,
  args: {
    type: "text",
    placeholder: "左側功能 icon、右側狀態 icon",
    hasLeftIcon: true,
    hasRightIcon: true,
    status: "default",
    isPassword: false,
  },
  parameters: {
    docs: {
      description: {
        story: "展示輸入框內含有左側與右側 icon 的使用情境。",
      },
    },
  },
};

// 3. Password - 密碼輸入樣式
export const Password: Story = {
  render: (args) => <InputShell {...args} />,
  args: {
    type: "password",
    isPassword: true,
    placeholder: "請輸入密碼",
    hasLeftIcon: false,
    hasRightIcon: false,
    status: "default",
  },
  parameters: {
    docs: {
      description: {
        story: "密碼輸入框樣式，遮蔽輸入內容。",
      },
    },
  },
};

// 4. StatusVariants - 成功 / 警告 / 錯誤 樣式
export const StatusVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <InputShell placeholder="正確格式的輸入" status="success" hasRightIcon />
      <InputShell
        placeholder="可能有風險的輸入"
        status="warning"
        hasRightIcon
      />
      <InputShell placeholder="格式錯誤的輸入" status="error" hasRightIcon />
    </div>
  ),
  args: {
    status: "default",
  },
  parameters: {
    docs: {
      description: {
        story:
          "展示不同狀態（成功 / 警告 / 錯誤）下的輸入框邊框與右側 icon 樣式，方便視覺與互動校對。",
      },
    },
  },
};
