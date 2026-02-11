"use client";

import { forwardRef, createContext, useContext } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { IconCross } from "@/icon/IconCross";
import { cn } from "@/lib/utils";

export interface DialogProps {
  /** 是否顯示右上角的關閉 X 按鈕 */
  isClosable?: boolean;
  /** 對話框尺寸：sm / md / lg */
  size?: "sm" | "md" | "lg";
  /** 對話框標題文字 */
  title: string;
  /**
   * 對話框說明文字。
   * - 可選
   * - 傳入空字串 '' 會直接隱藏描述區塊
   */
  description?: string;
  /** 是否顯示「取消」按鈕。預設 false */
  haveCancel?: boolean;
  /**
   * 是否顯示 Loading Skeleton 狀態。
   * - true: 顯示 Skeleton 並隱藏按鈕
   */
  needLoadingState?: boolean;
  /**
   * 是否在關閉 Dialog 後將焦點還原到原本的操作位置。
   * - 預設 true（對應 Radix 的 modal 行為）
   */
  needReturnFocus?: boolean;
  /**
   * 是否顯示上方的 handle bar。
   * - 預設 true
   */
  handleBar?: boolean;
  /**
   * 是否顯示 overlay 遮罩。
   * - true：顯示背景遮罩（預設）
   * - false：隱藏遮罩
   */
  overlay?: boolean;
}

type DialogRootProps = React.ComponentPropsWithoutRef<typeof RadixDialog.Root> &
  Pick<DialogProps, "overlay">;

const DialogOverlay = forwardRef<
  React.ElementRef<typeof RadixDialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Overlay>
>(({ className, ...props }, ref) => (
  <RadixDialog.Overlay
    ref={ref}
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
      className
    )}
    {...props}
  />
));

const DialogConfigContext = createContext<
  Pick<DialogProps, "overlay"> | undefined
>(undefined);

const useDialogConfig = () => useContext(DialogConfigContext);

const DialogRoot: React.FC<DialogRootProps> = (props) => {
  const { overlay = true, children, ...restProps } = props;

  return (
    <DialogConfigContext.Provider value={{ overlay }}>
      <RadixDialog.Root {...restProps}>{children}</RadixDialog.Root>
    </DialogConfigContext.Provider>
  );
};

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixDialog.Content> {
  /**
   * 控制 RadixDialog 寬度尺寸
   * - sm: 適合較精簡的提示
   * - md: 一般對話框（預設）
   * - lg: 內容較多時使用
   */
  size?: DialogProps["size"];
}

const DialogContent = forwardRef<
  React.ElementRef<typeof RadixDialog.Content>,
  DialogContentProps & Pick<DialogProps, "overlay">
>(({ className, children, size = "md", overlay, ...props }, ref) => {
  const ctxOverlay = useDialogConfig();
  const shouldShowOverlay = overlay ?? ctxOverlay ?? true;

  return (
    <RadixDialog.Portal>
      {shouldShowOverlay && <DialogOverlay className="hidden sm:block" />}
      <RadixDialog.Content
        ref={ref}
        className={cn(
          // 動畫與位置
          getSizeClass(size),
          // 通用樣式定義
          "fixed grid gap-4 z-50 origin-center sm:slide-in-from-top-50 sm:left-1/2 sm:top-1/2 sm:translate-x-[-50%] sm:translate-y-[-50%] sm:bottom-auto sm:rounded-lg p-6 shadow-lg border bg-background",
          "data-[state=open]:animate-in data-[state=closed]:animate-out duration-200",
          // 桌面版
          "sm:data-[state=open]:fade-in-0 sm:data-[state=closed]:fade-out-0 sm:data-[state=open]:zoom-in-95 sm:data-[state=closed]:zoom-out-95",
          // 手機版
          "bottom-0 rounded-t-lg w-full",
          "data-[state=open]:slide-in-from-bottom-full data-[state=closed]:slide-out-to-bottom-full",
          className
        )}
        {...props}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
});

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 是否顯示右上角的關閉 X 按鈕。
   * - 預設 false
   */
  isClosable?: boolean;
  /**
   * 是否顯示上方的 handle bar。
   * - 預設 false
   * - 在手機尺寸下更像 bottom sheet，可提示使用者可以拖曳展開更多內容
   */
  handleBar?: boolean;
}

const DialogHeader = ({
  className,
  isClosable = false,
  handleBar = false,
  children,
  ...props
}: DialogHeaderProps) => (
  <div
    className={cn(
      "relative flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  >
    {isClosable && (
      <RadixDialog.Close className="absolute right-0 top-0 rounded-md p-1 text-muted-foreground transition hover:bg-muted">
        <IconCross />
        <span className="sr-only">關閉</span>
      </RadixDialog.Close>
    )}

    {handleBar && (
      <div className="mb-3 flex justify-center sm:hidden">
        <div className="h-1.5 w-12 rounded-full bg-muted" />
      </div>
    )}

    {children}
  </div>
);

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);

const DialogTitle = forwardRef<
  React.ElementRef<typeof RadixDialog.Title>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Title>
>(({ className, ...props }, ref) => (
  <RadixDialog.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));

const DialogDescription = forwardRef<
  React.ElementRef<typeof RadixDialog.Description>,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Description>
>(({ className, ...props }, ref) => (
  <RadixDialog.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

DialogOverlay.displayName = RadixDialog.Overlay.displayName;
DialogContent.displayName = RadixDialog.Content.displayName;
DialogHeader.displayName = "DialogHeader";
DialogFooter.displayName = "DialogFooter";
DialogTitle.displayName = RadixDialog.Title.displayName;
DialogDescription.displayName = RadixDialog.Description.displayName;

const Dialog = {
  ...RadixDialog,
  Header: DialogHeader,
  Footer: DialogFooter,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Overlay: DialogOverlay,
  Root: DialogRoot,
} as const;

export { Dialog };

function getSizeClass(size: DialogProps["size"]): string {
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
