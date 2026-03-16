import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";

import Badge from "./badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "success", "info", "warning", "alert"],
      description:
        "語意色彩（default: 灰、success: 綠、info: 藍、warning: 琥珀、alert: 紅）",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "Badge 的尺寸（sm: 表格內、md: 搜尋列、lg: 大型標籤）",
    },
    onClose: {
      description: "傳入後會顯示關閉按鈕",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Default — 預設樣式
export const Default: Story = {
  args: {
    children: "Badge",
  },
};

// 2. VariantColors — 五種語意色彩
export const VariantColors: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="alert">Alert</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "五種語意色彩的視覺對照：default（灰）、success（綠）、info（藍）、warning（琥珀）、alert（紅）。",
      },
    },
  },
};

// 3. SizeVariants — 三種尺寸對照
export const SizeVariants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "sm 用於表格、md 用於搜尋列、lg 預留大型標籤場景。",
      },
    },
  },
};

// 4. SizeByVariantMatrix — 尺寸 × 色彩矩陣
export const SizeByVariantMatrix: Story = {
  render: () => {
    const sizes = ["sm", "md", "lg"] as const;
    const variants = [
      "default",
      "success",
      "info",
      "warning",
      "alert",
    ] as const;

    return (
      <div className="flex flex-col gap-4">
        {sizes.map((size) => (
          <div key={size} className="flex items-center gap-3">
            <span className="w-8 text-xs text-gray-400">{size}</span>
            {variants.map((variant) => (
              <Badge key={variant} size={size} variant={variant}>
                {variant}
              </Badge>
            ))}
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "所有尺寸與色彩組合的完整矩陣。",
      },
    },
  },
};

// 5. WithCloseButton — 含關閉按鈕
export const WithCloseButton: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Badge size="sm" onClose={() => {}}>
        Small
      </Badge>
      <Badge size="md" variant="info" onClose={() => {}}>
        Medium
      </Badge>
      <Badge size="lg" variant="success" onClose={() => {}}>
        Large
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "帶有關閉按鈕的 Badge，按鈕與 icon 會隨尺寸縮放。",
      },
    },
  },
};
