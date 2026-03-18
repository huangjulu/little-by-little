"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { X as CloseIcon } from "lucide-react";
import { createContext, useContext } from "react";

import { cn } from "@/lib/utils";

import Skeleton from "./skeleton";

// TODO: 需要處理 Dialog 在手機版 bottom sheet 模式下，
// 透過 handle bar 的拖曳在「半高」與「全高」之間切換。

const DialogConfigContext = createContext<{ overlay: boolean } | undefined>(
  undefined
);

const DialogRoot: React.FC<DialogRootProps> = (props) => {
  const { overlay = true, children, ...restProps } = props;

  return (
    <DialogConfigContext.Provider value={{ overlay }}>
      <RadixDialog.Root {...restProps}>{children}</RadixDialog.Root>
    </DialogConfigContext.Provider>
  );
};

const DialogContent: React.FC<DialogContentProps> = (props) => {
  const { size = "md", overlay, children, className, ref } = props;
  const useDialogConfig = () => useContext(DialogConfigContext);

  const ctxOverlay = useDialogConfig();
  const shouldShowOverlay = overlay ?? ctxOverlay?.overlay;

  return (
    <RadixDialog.Portal>
      <DialogOverlay isShow={shouldShowOverlay ?? false} />
      <RadixDialog.Content
        ref={ref}
        className={cn(
          getSizeClass(size),
          "fixed flex flex-col gap-4 z-50 origin-center max-h-[90vh] overflow-hidden sm:slide-in-from-top-50 sm:left-1/2 sm:top-1/2 sm:translate-x-[-50%] sm:translate-y-[-50%] sm:bottom-auto sm:rounded-lg p-6 shadow-lg border bg-background",
          "data-[state=open]:animate-in data-[state=closed]:animate-out duration-200",
          "sm:data-[state=open]:fade-in-0 sm:data-[state=closed]:fade-out-0 sm:data-[state=open]:zoom-in-95 sm:data-[state=closed]:zoom-out-95",
          "bottom-0 rounded-t-lg w-full",
          "data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-bottom-full",
          className
        )}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
};

const DialogBody: React.FC<DialogBodyProps> = (props) => {
  const { loadingState = false, className, children, ...rest } = props;
  return (
    <div
      className={cn("min-h-0 flex-1 p-2 overflow-y-auto", className)}
      {...rest}
    >
      {loadingState ? (
        <div className="space-y-3">
          <Skeleton rows={3} rowClassName="h-4" />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

const DialogHeader: React.FC<DialogHeaderProps> = (props) => {
  return (
    <div
      className={cn(
        "relative flex flex-col space-y-1.5 text-center sm:text-left shrink-0",
        props.isSticky &&
          "sticky top-0 z-10 -mx-6 -mt-6 mb-0 px-6 pb-4 bg-background",
        props.className
      )}
    >
      {props.isClosable && (
        <RadixDialog.Close className="absolute cursor-pointer right-0 top-0 -translate-2 rounded-md p-1 text-muted-foreground transition hover:bg-muted">
          <CloseIcon className="h-4 w-4" />
          <span className="sr-only">關閉</span>
        </RadixDialog.Close>
      )}

      {props.handleBar && (
        <div className="mb-3 flex cursor-pointer justify-center sm:hidden">
          <div className="h-1.5 w-12 rounded-full bg-muted" />
        </div>
      )}

      {props.children}
    </div>
  );
};

const DialogTitle: React.FC<React.ComponentProps<typeof RadixDialog.Title>> = (
  props
) => {
  const { className, ref, ...rest } = props;
  return (
    <RadixDialog.Title
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...rest}
    />
  );
};

const DialogDescription: React.FC<
  React.ComponentProps<typeof RadixDialog.Description>
> = (props) => {
  const { className, ref, ...rest } = props;
  return (
    <RadixDialog.Description
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...rest}
    />
  );
};

const DialogFooter: React.FC<DialogFooterProps> = (props) => {
  if (props.children) {
    return (
      <div
        className={cn(
          "flex shrink-0 flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
          props.className
        )}
      >
        {props.children}
      </div>
    );
  }

  const confirmButton = (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        props.onConfirm?.();
      }}
      className="inline-flex flex-1 justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
    >
      {props.confirmText}
    </button>
  );

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col-reverse gap-4 sm:flex-row sm:justify-end",
        props.className
      )}
    >
      {props.haveCancel && (
        <RadixDialog.Close asChild>
          <button
            type="button"
            className="inline-flex flex-1 justify-center rounded-md border px-4 py-2 text-sm"
          >
            {props.cancelText}
          </button>
        </RadixDialog.Close>
      )}

      {props.isAutoClose !== false ? (
        <RadixDialog.Close asChild>{confirmButton}</RadixDialog.Close>
      ) : (
        confirmButton
      )}
    </div>
  );
};

const DialogOverlay: React.FC<DialogOverlayProps> = (props) => {
  const { className, isShow, ref, ...rest } = props;
  return (
    <RadixDialog.Overlay
      ref={ref}
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
        isShow ? "" : "hidden",
        className
      )}
      {...rest}
    />
  );
};

DialogRoot.displayName = "DialogRoot";
DialogContent.displayName = "DialogContent";
DialogBody.displayName = "DialogBody";
DialogHeader.displayName = "DialogHeader";
DialogTitle.displayName = "DialogTitle";
DialogDescription.displayName = "DialogDescription";
DialogFooter.displayName = "DialogFooter";
DialogOverlay.displayName = "DialogOverlay";

const Dialog = {
  Trigger: RadixDialog.Trigger,
  Close: RadixDialog.Close,
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Overlay: DialogOverlay,
  Root: DialogRoot,
} as const;

// Types

type DialogSize = "sm" | "md" | "lg";

interface DialogProps
  extends React.ComponentPropsWithoutRef<typeof RadixDialog.Root>,
    Pick<
      React.HTMLAttributes<HTMLDivElement>,
      "className" | "children" | "onClick"
    > {
  /**
   * 是否顯示 overlay 遮罩。
   * - 預設 true
   * - 可透過 DialogContent 的 overlay prop 進一步覆寫
   */
  overlay?: boolean;
  /**
   * 控制 Dialog 寬度尺寸
   * - sm: 適合較精簡的提示
   * - md: 一般對話框（預設）
   * - lg: 內容較多時使用
   */
  size?: DialogSize;
  /**
   * 是否顯示右上角的關閉 X 按鈕。
   * - 預設 false
   */
  isClosable?: boolean;
  /**
   * 對話框的標題。
   */
  title: string;
  /**
   * 對話框的描述。
   */
  description?: string;
  /**
   * 是否需要顯示 Loading Skeleton。
   */
  loadingState?: boolean;
  /**
   * 是否需要返回焦點。
   */
  needReturnFocus?: boolean;
  /**
   * 是否顯示上方的 handle bar。
   * - 預設 false
   * - 在手機尺寸下更像 bottom sheet，可提示使用者可以拖曳展開更多內容
   */
  handleBar?: boolean;
  /**
   * 是否顯示「取消」按鈕。
   * - 預設 false
   */
  haveCancel?: boolean;
  /**
   * 確認按鈕的點擊事件處理函式。
   * - 可選，未提供時確認按鈕不會有 onClick 行為
   */
  onConfirm?: () => void;
  /**
   * 確認按鈕的文字。
   * - 預設「確認」
   */
  confirmText?: string;
  /**
   * 取消按鈕的文字。
   * - 預設「取消」
   */
  cancelText?: string;
  /**
   * 確認按鈕點擊後是否自動關閉 Dialog。
   * - 預設 true（點擊後自動關閉）
   * - false 時，點擊確認按鈕後不會自動關閉，需手動控制 Dialog 的開關
   */
  isAutoClose?: boolean;
}

type DialogRootProps = React.ComponentPropsWithoutRef<typeof RadixDialog.Root> &
  Pick<DialogProps, "overlay">;

type DialogOverlayProps = Pick<
  React.ComponentPropsWithoutRef<typeof RadixDialog.Overlay>,
  "className"
> & {
  isShow: boolean;
  ref?: React.Ref<React.ElementRef<typeof RadixDialog.Overlay>>;
};

type DialogContentProps = Pick<
  DialogProps,
  "className" | "children" | "size" | "overlay"
> & {
  ref?: React.Ref<React.ElementRef<typeof RadixDialog.Content>>;
};

type DialogHeaderProps = Pick<
  DialogProps,
  "className" | "children" | "onClick" | "isClosable" | "handleBar"
> & {
  /**
   * 是否固定 Header 於上方，捲動時不隨內容往上移出視窗。
   * - 預設 false
   */
  isSticky?: boolean;
};

type DialogBodyProps = Pick<
  React.HTMLAttributes<HTMLDivElement>,
  "className" | "children"
> & {
  /**
   * 是否顯示 Loading Skeleton，取代 children。
   */
  loadingState?: boolean;
};

type DialogFooterProps = Pick<
  DialogProps,
  | "className"
  | "children"
  | "onClick"
  | "haveCancel"
  | "onConfirm"
  | "confirmText"
  | "cancelText"
  | "isAutoClose"
>;

export default Dialog;

// Helpers

function getSizeClass(size: DialogSize): string {
  switch (size) {
    case "sm":
      return "sm:max-w-sm";
    case "lg":
      return "sm:max-w-2xl";
    case "md":
    default:
      return "sm:max-w-lg";
  }
}
