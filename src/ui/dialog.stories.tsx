import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dialog, type DialogProps } from "./dialog";
import { Skeleton } from "./skeleton";

const DialogStoryShell: React.FC<DialogProps> = (props) => {
  const {
    isClosable = true,
    size = "md",
    title,
    description = "",
    haveCancel = false,
    needLoadingState = false,
    needReturnFocus = true,
    handleBar = true,
    overlay = true,
  } = props;

  return (
    <Dialog.Root modal={needReturnFocus} overlay={overlay}>
      {/* 外層 Trigger：示意實際使用情境的開啟流程 */}
      <Dialog.Trigger asChild>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
          開啟 Dialog
        </button>
      </Dialog.Trigger>

      {/* Dialog 主體：維持 Dialog → Header → Content → Footer 的閱讀順序 */}
      <Dialog.Content size={size}>
        {/* Header：標題、說明、右上角關閉按鈕 */}
        <Dialog.Header isClosable={isClosable} handleBar={handleBar}>
          <Dialog.Title>{title}</Dialog.Title>
          {description !== "" && (
            <Dialog.Description>{description}</Dialog.Description>
          )}
        </Dialog.Header>

        {/* Content：可切換為 Skeleton 狀態 */}
        <div className="py-4">
          {needLoadingState ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              這裡是對話框的主要內容區域，可以放入表單、說明文字或其他元件。
            </p>
          )}
        </div>

        {/* Footer：最多兩個按鈕，必要時可完全隱藏（例如 Loading 狀態） */}
        {!needLoadingState && (
          <Dialog.Footer>
            <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
              {haveCancel && (
                <Dialog.Close asChild>
                  <button className="inline-flex flex-1 justify-center rounded-md border px-4 py-2 text-sm">
                    取消
                  </button>
                </Dialog.Close>
              )}
              <button className="inline-flex flex-1 justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                確認
              </button>
            </div>
          </Dialog.Footer>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};

const meta = {
  title: "UI/Dialog",
  component: DialogStoryShell,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "控制對話框寬度尺寸（sm / md / lg）",
    },
    description: {
      description: "對話框的描述文字，放入空字串''會直接隱藏描述區塊",
    },
    haveCancel: {
      control: "boolean",
      description: "是否顯示『取消』按鈕，預設是 false",
    },
    needLoadingState: {
      control: "boolean",
      description: "若對話框會打API，可選擇是否顯示 Loading Skeleton",
    },
    needReturnFocus: {
      control: "boolean",
      description:
        "是否在關閉 Dialog 後將焦點還原到原本的操作位置，預設是 true",
    },
    handleBar: {
      control: "boolean",
      description: "是否顯示上方的 handle bar",
    },
    overlay: {
      control: "boolean",
      description: "是否顯示遮罩，預設是 true。若在手機版則預設隱藏",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DialogStoryShell>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================
// 1. Default - 一般使用情境
// ============================================
export const Default: Story = {
  render: (args) => <DialogStoryShell {...args} />,
  args: {
    isClosable: true,
    size: "md",
    title: "基本對話框",
    description: "提供基本標題與描述的對話框範例。",
    haveCancel: true,
    needLoadingState: false,
    needReturnFocus: true,
    handleBar: true,
    overlay: true,
  },
  parameters: {
    docs: {
      description: {
        story: "最常見的對話框樣式，包含標題、描述、確認與取消按鈕。",
      },
    },
  },
};

// ============================================
// 2. LoadingState - 內容由 API 載入
// ============================================
export const LoadingState: Story = {
  render: (args) => <DialogStoryShell {...args} />,
  args: {
    isClosable: false,
    size: "md",
    title: "載入中",
    description: "正在載入對話框內容…",
    haveCancel: false,
    needLoadingState: true,
    needReturnFocus: true,
    handleBar: true,
    overlay: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "當對話框主要資訊需要從 API 取得時，可以切換成 Skeleton 狀態並暫時隱藏所有按鈕。",
      },
    },
  },
};

// ============================================
// 3. SizeVariants - 不同尺寸示意
// ============================================
export const SizeVariants: Story = {
  // 這個 Story 主要用來展示不同尺寸的視覺差異，不透過 controls 操作。
  render: () => (
    <div className="flex flex-col gap-6">
      <DialogStoryShell
        title="Small 對話框"
        description="適合放置簡單訊息或確認提示。"
        size="sm"
        haveCancel={false}
      />
      <DialogStoryShell
        title="Medium 對話框"
        description="預設尺寸，適合大部分情境。"
        size="md"
        haveCancel
      />
      <DialogStoryShell
        title="Large 對話框"
        description="內容較多、包含多段文字或表單時可使用。"
        size="lg"
        haveCancel
      />
    </div>
  ),
  args: {
    title: "Medium 對話框",
  },
  parameters: {
    docs: {
      description: {
        story: "展示 sm、md、lg 三種尺寸差異，方便在設計階段對齊期望。",
      },
    },
  },
};
