"use client";

import {
  useFormContext,
  Controller,
  type Path,
  type ControllerRenderProps,
} from "react-hook-form";
import { Input } from "@/ui/input";
import { DatePicker } from "@/ui/date-picker";
import { DateRangePicker } from "@/ui/date-range-picker";
import type { CreateOrderFormValues } from "./create-order.schema";
import React from "react";

export const CreateOrderFormFields: React.FC = () => {
  const {
    formState: { errors },
  } = useFormContext<CreateOrderFormValues>();

  return (
    <div className="space-y-4">
      {/* 客戶資訊 - 對應 customers.customer_info */}
      <InputField
        name="customerName"
        label="客戶姓名"
        required
        placeholder="請輸入客戶姓名"
        errorMessage={errors.customerName?.message}
      />

      <InputField
        name="mobilePhone"
        label="手機號碼"
        required
        type="tel"
        placeholder="請輸入手機號碼"
        errorMessage={errors.mobilePhone?.message}
      />

      <InputField
        name="communityName"
        label="社區名稱"
        placeholder="請輸入社區名稱"
        errorMessage={errors.communityName?.message}
      />

      <InputField
        name="houseUnit"
        label="棟／室"
        placeholder="例：A 棟 12 樓"
        errorMessage={errors.houseUnit?.message}
      />

      {/* 訂單資訊 - 對應 orders */}
      <div className="border-t pt-4">
        <h4 className="mb-3 text-sm font-medium text-muted-foreground">
          訂單與合約
        </h4>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              name="basePrice"
              label="基礎價格"
              type="number"
              min={0}
              step="0.01"
              placeholder="0"
              errorMessage={errors.basePrice?.message}
            />
            <InputField
              name="currentPrice"
              label="目前價格"
              type="number"
              min={0}
              step="0.01"
              placeholder="0"
              errorMessage={errors.currentPrice?.message}
            />
          </div>

          <ControlledField
            name="contractDateRange"
            label="合約期間"
            errorMessage={errors.contractDateRange?.message}
          >
            {(field) => (
              <DateRangePicker
                id="contractDateRange"
                value={field.value}
                onChange={field.onChange}
                placeholder="選擇合約開始與結束日"
              />
            )}
          </ControlledField>

          <ControlledField
            name="paymentDeadline"
            label="繳費期限"
            errorMessage={errors.paymentDeadline?.message}
          >
            {(field) => (
              <DatePicker
                id="paymentDeadline"
                value={field.value}
                onChange={field.onChange}
                placeholder="選擇繳費期限"
              />
            )}
          </ControlledField>

          <ControlledField
            name="nextBillingDate"
            label="下次帳單日"
            errorMessage={errors.nextBillingDate?.message}
          >
            {(field) => (
              <DatePicker
                id="nextBillingDate"
                value={field.value}
                onChange={field.onChange}
                placeholder="選擇下次帳單日"
              />
            )}
          </ControlledField>
        </div>
      </div>
    </div>
  );
};

CreateOrderFormFields.displayName = "CreateOrderFormFields";

type ControlledFieldProps<T extends Path<CreateOrderFormValues>> = {
  name: T;
  label: string;
  errorMessage?: string;
  children: (
    field: ControllerRenderProps<CreateOrderFormValues, T>
  ) => React.ReactElement;
};

function ControlledField<T extends Path<CreateOrderFormValues>>(
  props: ControlledFieldProps<T>
) {
  const { name, label, errorMessage, children } = props;
  const { control } = useFormContext<CreateOrderFormValues>();

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => children(field)}
      />
      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  );
}

type InputFieldProps = {
  name: Path<CreateOrderFormValues>;
  label: string;
  required?: boolean;
  errorMessage?: string;
} & Omit<React.ComponentProps<"input">, "id" | "name" | "aria-invalid">;

const InputField: React.FC<InputFieldProps> = (props) => {
  const { name, label, required, errorMessage, ...inputProps } = props;
  const { register } = useFormContext<CreateOrderFormValues>();

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      <Input
        id={name}
        aria-invalid={!!errorMessage}
        {...inputProps}
        {...register(name)}
      />
      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  );
};
