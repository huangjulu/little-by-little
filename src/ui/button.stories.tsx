import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import {
  Download as IconDownload,
  Plus as IconPlus,
  Trash2 as IconTrash,
  Upload as IconUpload,
} from "lucide-react";

import Button from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "critical"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    fullWidth: { control: "boolean" },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    iconOnly: { control: "boolean" },
  },
  args: {
    label: "按鈕",
    variant: "secondary",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ─── Variants ────────────────────────────────────────────────────────────────

export const Primary: Story = {
  args: { label: "確認下載", variant: "primary" },
};

export const Secondary: Story = {
  args: { label: "全選", variant: "secondary" },
};

export const Tertiary: Story = {
  args: { label: "取消", variant: "tertiary" },
};

export const Critical: Story = {
  args: { label: "刪除訂單", variant: "critical" },
};

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const SizeSmall: Story = {
  args: { label: "下載通知", variant: "secondary", size: "sm" },
};

export const SizeMedium: Story = {
  args: { label: "確認", variant: "primary", size: "md" },
};

export const SizeLarge: Story = {
  args: { label: "登入", variant: "primary", size: "lg", fullWidth: true },
};

// ─── All Sizes Comparison ────────────────────────────────────────────────────

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Button label="Small" variant="primary" size="sm" />
      <Button label="Medium" variant="primary" size="md" />
      <Button label="Large" variant="primary" size="lg" />
    </div>
  ),
};

// ─── Icon + Text ─────────────────────────────────────────────────────────────

export const IconWithText: Story = {
  args: {
    label: "下載繳費通知",
    variant: "secondary",
    icon: IconDownload,
    size: "sm",
  },
};

export const IconUploadWithText: Story = {
  args: { label: "匯入", variant: "secondary", icon: IconUpload, size: "sm" },
};

// ─── Icon Only ───────────────────────────────────────────────────────────────

export const IconOnlySmall: Story = {
  args: { label: "新增訂單", icon: IconPlus, iconOnly: true, size: "sm" },
};

export const IconOnlyMedium: Story = {
  args: { label: "新增訂單", icon: IconPlus, iconOnly: true, size: "md" },
};

export const IconOnlyLarge: Story = {
  args: { label: "新增訂單", icon: IconPlus, iconOnly: true, size: "lg" },
};

// ─── States ──────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  args: { label: "無法操作", variant: "primary", disabled: true },
};

export const Loading: Story = {
  args: { label: "處理中", variant: "primary", loading: true },
};

export const FullWidth: Story = {
  args: { label: "登入系統", variant: "primary", size: "lg", fullWidth: true },
};

// ─── All Variants Comparison ─────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button label="Primary" variant="primary" />
        <Button label="Secondary" variant="secondary" />
        <Button label="Tertiary" variant="tertiary" />
        <Button label="Critical" variant="critical" />
      </div>
      <div className="flex items-center gap-4">
        <Button label="Primary" variant="primary" disabled />
        <Button label="Secondary" variant="secondary" disabled />
        <Button label="Tertiary" variant="tertiary" disabled />
        <Button label="Critical" variant="critical" disabled />
      </div>
      <div className="flex items-center gap-4">
        <Button label="Primary" variant="primary" loading />
        <Button label="Secondary" variant="secondary" loading />
        <Button label="Tertiary" variant="tertiary" loading />
        <Button label="Critical" variant="critical" loading />
      </div>
    </div>
  ),
};

// ─── All Icon-Only Variants ──────────────────────────────────────────────────

export const AllIconOnly: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button
        label="新增"
        icon={IconPlus}
        iconOnly
        variant="primary"
        size="sm"
      />
      <Button
        label="新增"
        icon={IconPlus}
        iconOnly
        variant="secondary"
        size="sm"
      />
      <Button
        label="新增"
        icon={IconPlus}
        iconOnly
        variant="tertiary"
        size="sm"
      />
      <Button
        label="刪除"
        icon={IconTrash}
        iconOnly
        variant="critical"
        size="sm"
      />
    </div>
  ),
};

// ─── Real-World Examples ─────────────────────────────────────────────────────

export const DialogFooter: Story = {
  render: () => (
    <div className="flex gap-3 border-t border-gray-100 pt-4">
      <Button label="取消" variant="secondary" className="flex-1" />
      <Button
        label="確認下載"
        variant="primary"
        icon={IconDownload}
        className="flex-1"
      />
    </div>
  ),
};

export const ToolbarActions: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button label="新增訂單" icon={IconPlus} iconOnly size="sm" />
      <Button label="匯入" icon={IconUpload} size="sm" />
      <Button label="下載繳費通知" icon={IconDownload} size="sm" />
    </div>
  ),
};
