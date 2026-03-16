import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { addDays } from "date-fns";
import React from "react";
import { useState } from "react";

import DateRangePicker from "./date-range-picker";

type DateRangePickerProps = React.ComponentPropsWithoutRef<
  typeof DateRangePicker
>;
type DateRangeValue = NonNullable<DateRangePickerProps["value"]>;

const meta = {
  title: "UI/DateRangePicker",
  component: DateRangePicker,
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
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Default - 預設狀態
export const Default: Story = {
  render: function DefaultPicker(args) {
    const [value, setValue] = useState<DateRangeValue | undefined>();
    return (
      <div className="w-[18.75rem]">
        <DateRangePicker {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  args: {
    placeholder: "選擇日期區間",
  },
  parameters: {
    docs: {
      description: {
        story: "預設的日期區間選擇器，點擊後展開日曆選取開始與結束日期。",
      },
    },
  },
};

// 2. With Value - 已選擇日期
export const WithValue: Story = {
  render: function WithValuePicker(args) {
    const [value, setValue] = useState<DateRangeValue | undefined>({
      from: new Date(),
      to: addDays(new Date(), 7),
    });
    return (
      <div className="w-[18.75rem]">
        <DateRangePicker {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "已選擇日期區間的狀態，顯示「開始日 ~ 結束日」格式。",
      },
    },
  },
};

// 3. Partial Selection - 僅選擇開始日
export const PartialSelection: Story = {
  render: function PartialPicker(args) {
    const [value, setValue] = useState<DateRangeValue | undefined>({
      from: new Date(),
      to: undefined,
    });
    return (
      <div className="w-[18.75rem]">
        <DateRangePicker {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "僅選擇開始日時的中間狀態，提示使用者選擇結束日。",
      },
    },
  },
};

// 4. Disabled - 停用狀態
export const Disabled: Story = {
  render: function DisabledPicker(args) {
    return (
      <div className="w-[18.75rem]">
        <DateRangePicker {...args} disabled />
      </div>
    );
  },
  args: {
    placeholder: "無法選擇",
  },
  parameters: {
    docs: {
      description: {
        story: "停用狀態，無法點擊或選擇日期。",
      },
    },
  },
};

// 5. Long Date Range - 長期區間
export const LongDateRange: Story = {
  render: function LongRangePicker(args) {
    const [value, setValue] = useState<DateRangeValue | undefined>({
      from: new Date(2024, 0, 1),
      to: new Date(2024, 11, 31),
    });
    return (
      <div className="w-[18.75rem]">
        <DateRangePicker {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "長期日期區間的顯示，確保文字不會溢出。",
      },
    },
  },
};

// 6. Mobile View - 行動版
export const MobileView: Story = {
  render: function MobilePicker(args) {
    const [value, setValue] = useState<DateRangeValue | undefined>();
    return (
      <div className="w-full px-4">
        <DateRangePicker {...args} value={value} onChange={setValue} />
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "行動裝置視窗下的日期區間選擇器。",
      },
    },
  },
};

// 7. In Form Context - 表單情境
export const InFormContext: Story = {
  render: function FormContextPicker() {
    const [value, setValue] = useState<DateRangeValue | undefined>();
    return (
      <div className="w-[21.875rem] space-y-4 rounded-lg border p-4">
        <div className="space-y-2">
          <label htmlFor="contractRange" className="text-sm font-medium">
            合約期間 <span className="text-destructive">*</span>
          </label>
          <DateRangePicker
            id="contractRange"
            value={value}
            onChange={setValue}
            placeholder="選擇合約開始與結束日"
          />
          <p className="text-xs text-muted-foreground">
            請選擇合約的開始日期與結束日期
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "在表單中使用的情境，搭配 label 與說明文字。",
      },
    },
  },
};
