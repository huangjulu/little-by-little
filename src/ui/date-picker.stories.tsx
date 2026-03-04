import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { DatePicker } from "./date-picker";

const meta = {
  title: "UI/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
      description: "未選擇時的佔位文字",
    },
    disabled: {
      control: "boolean",
      description: "是否停用",
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================
// 1. Default - 預設狀態
// ============================================
export const Default: Story = {
  render: function DefaultPicker(args) {
    const [value, setValue] = useState<Date | undefined>();
    return (
      <div className="w-[17.5rem]">
        <DatePicker {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    placeholder: "選擇日期",
  },
  parameters: {
    docs: {
      description: {
        story: "單日選擇器，點擊後展開日曆選取日期。",
      },
    },
  },
};

// ============================================
// 2. With Value - 已選擇日期
// ============================================
export const WithValue: Story = {
  render: function WithValuePicker(args) {
    const [value, setValue] = useState<Date | undefined>(new Date());
    return (
      <div className="w-[17.5rem]">
        <DatePicker {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "已選擇日期的狀態。",
      },
    },
  },
};

// ============================================
// 3. Disabled - 停用狀態
// ============================================
export const Disabled: Story = {
  render: function DisabledPicker(args) {
    return (
      <div className="w-[17.5rem]">
        <DatePicker {...args} disabled />
      </div>
    );
  },
  args: {
    placeholder: "無法選擇",
  },
  parameters: {
    docs: {
      description: {
        story: "停用狀態。",
      },
    },
  },
};

// ============================================
// 4. Mobile View - 行動版
// ============================================
export const MobileView: Story = {
  render: function MobilePicker(args) {
    const [value, setValue] = useState<Date | undefined>();
    return (
      <div className="w-full px-4">
        <DatePicker {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "行動裝置視窗下的單日選擇器。",
      },
    },
  },
};
