"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { DialogProps } from "@radix-ui/react-dialog";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns";
import Dialog from "@/ui/dialog";
import type { CreateOrderParams } from "../../types";
import { orderApi } from "../../order.api";
import {
  createOrderSchema,
  type CreateOrderFormValues,
} from "../create-order.schema";
import { CreateOrderFormFields } from "../CreateOrderFormFields";

interface ViewCreateOrderProps extends DialogProps {
  className?: string;
}

export const ViewCreateOrder: React.FC<ViewCreateOrderProps> = (props) => {
  const createMutation = orderApi.create.useMutation();
  const methods = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    defaultValues,
  });

  const handleSubmit = methods.handleSubmit((values) => {
    const params = mapFormValuesToParams(values);
    createMutation.mutate(params, {
      onSuccess: () => {
        methods.reset(defaultValues);
        props.onOpenChange?.(false);
        toast.success("訂單建立成功");
      },
    });
  });

  return (
    <Dialog.Root open={props.open} onOpenChange={props.onOpenChange}>
      <Dialog.Content className={props.className}>
        <Dialog.Header isSticky isClosable>
          <Dialog.Title>建立新訂單</Dialog.Title>
          <Dialog.Description>請填寫訂單資訊以建立新訂單。</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit} className="py-4">
              <CreateOrderFormFields />
              {createMutation.error && (
                <p className="mt-3 text-sm text-destructive">
                  {createMutation.error.message}
                </p>
              )}
              <div className="mt-6 flex justify-end gap-2">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="rounded-md border px-4 py-2 text-sm font-medium"
                  >
                    取消
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                >
                  {createMutation.isPending ? "建立中..." : "建立訂單"}
                </button>
              </div>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

ViewCreateOrder.displayName = "ViewCreateOrder";

const defaultValues: CreateOrderFormValues = {
  customerName: "",
  mobilePhone: "",
  communityName: "",
  houseUnit: "",
  basePrice: "",
  currentPrice: "",
  contractDateRange: undefined,
  paymentDeadline: undefined,
  nextBillingDate: undefined,
};

function mapFormValuesToParams(
  values: CreateOrderFormValues
): CreateOrderParams {
  const formatDateToString = (date: Date | undefined): string | undefined => {
    return date ? format(date, "yyyy-MM-dd") : undefined;
  };

  return {
    customerName: values.customerName,
    mobilePhone: values.mobilePhone,
    communityName: values.communityName || undefined,
    houseUnit: values.houseUnit || undefined,
    basePrice: values.basePrice ? Number(values.basePrice) : undefined,
    currentPrice: values.currentPrice ? Number(values.currentPrice) : undefined,
    contractStartDate: formatDateToString(values.contractDateRange?.from),
    contractEndDate: formatDateToString(values.contractDateRange?.to),
    paymentDeadline: formatDateToString(values.paymentDeadline),
    nextBillingDate: formatDateToString(values.nextBillingDate),
  };
}
