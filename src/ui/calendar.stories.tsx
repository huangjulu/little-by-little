import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import Calendar from "./calendar";

const meta = {
  title: "UI/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Default - 單日選擇
export const Default: Story = {
  render: function DefaultCalendar() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "基本的單日選擇日曆，點擊日期即可選取。",
      },
    },
  },
};

// 2. Range - 日期區間選擇
export const Range: Story = {
  render: function RangeCalendar() {
    const [range, setRange] = useState<DateRange | undefined>({
      from: new Date(),
      to: undefined,
    });
    return (
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={2}
        className="rounded-md border"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "日期區間選擇模式，可選擇開始日與結束日。顯示兩個月份方便選取。",
      },
    },
  },
};

// 3. Multiple - 多日選擇
export const Multiple: Story = {
  render: function MultipleCalendar() {
    const [dates, setDates] = useState<Date[] | undefined>([]);
    return (
      <Calendar
        mode="multiple"
        selected={dates}
        onSelect={setDates}
        className="rounded-md border"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "多日選擇模式，可同時選取多個日期。",
      },
    },
  },
};

// 4. Disabled Dates - 停用特定日期
export const DisabledDates: Story = {
  render: function DisabledCalendar() {
    const [date, setDate] = useState<Date | undefined>();
    const disabledDays = [{ dayOfWeek: [0, 6] }, { before: new Date() }];
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={disabledDays}
        className="rounded-md border"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: "停用週末與過去的日期，僅可選擇未來的平日。",
      },
    },
  },
};

// 5. Mobile View - 行動版
export const MobileView: Story = {
  render: function MobileCalendar() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
      <div className="w-[18.75rem]">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "行動裝置視窗下的日曆顯示。",
      },
    },
  },
};
