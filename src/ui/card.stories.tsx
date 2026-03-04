import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "./card";
import { Skeleton } from "./skeleton";

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================
// 1. Default - 基本使用範例
// ============================================
export const Default: Story = {
  render: () => (
    <Card className="w-[21.875rem]">
      <CardHeader>
        <CardTitle>訂單摘要</CardTitle>
        <CardDescription>顯示您的訂單詳細資訊</CardDescription>
      </CardHeader>
      <CardContent>
        <p>訂單編號: #12345</p>
        <p>總金額: NT$ 1,500</p>
      </CardContent>
      <CardFooter>
        <button className="rounded-md bg-green-500 px-4 py-2 text-white">
          確認訂單
        </button>
      </CardFooter>
    </Card>
  ),
};

// ============================================
// 2. Loading State - 資料載入中的樣貌
// ============================================
export const Loading: Story = {
  render: () => (
    <Card className="w-[21.875rem]">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "當資料正在載入時，使用 Skeleton 元件顯示佔位符。",
      },
    },
  },
};

// ============================================
// 3. Empty State - 當資料為空時的處理
// ============================================
export const Empty: Story = {
  render: () => (
    <Card className="w-[21.875rem]">
      <CardHeader>
        <CardTitle>訂單列表</CardTitle>
        <CardDescription>您的所有訂單</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
        <svg
          className="mb-4 h-12 w-12 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="text-gray-500">目前沒有任何訂單</p>
        <p className="text-sm text-gray-400">開始建立您的第一筆訂單吧！</p>
      </CardContent>
      <CardFooter className="justify-center">
        <button className="rounded-md bg-green-500 px-4 py-2 text-white">
          建立訂單
        </button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "當沒有資料時，顯示空狀態提示與引導操作。",
      },
    },
  },
};

// ============================================
// 4. Error State - 當資料格式錯誤時的處理
// ============================================
export const Error: Story = {
  render: () => (
    <Card className="w-[21.875rem] border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-700">載入失敗</CardTitle>
        <CardDescription className="text-red-500">
          無法取得訂單資料
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center py-6 text-center">
        <svg
          className="mb-4 h-12 w-12 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-sm text-red-600">發生錯誤，請檢查網路連線後重試。</p>
        <p className="mt-1 text-xs text-red-400">
          錯誤代碼: ERR_NETWORK_TIMEOUT
        </p>
      </CardContent>
      <CardFooter className="justify-center">
        <button className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600">
          重新載入
        </button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "當發生錯誤時，使用紅色主題顯示錯誤訊息與重試按鈕。",
      },
    },
  },
};

// ============================================
// 5. Long Content - 測試文字極長時的排版
// ============================================
export const LongContent: Story = {
  render: () => (
    <Card className="w-[21.875rem]">
      <CardHeader>
        <CardTitle>
          這是一個非常非常非常非常非常非常非常非常非常非常非常非常長的標題，用來測試標題換行的情況
        </CardTitle>
        <CardDescription>
          這是一段很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長的描述文字，用來測試描述換行與溢出處理。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p>
          這是一段中文的長內容測試。當內容非常長的時候，卡片元件應該要能夠正確地處理換行與排版，而不會出現破版或溢出的情況。這對於多語言支援和響應式設計來說都是非常重要的考量。
        </p>
      </CardContent>
      <CardFooter className="flex-wrap gap-2">
        <button className="rounded-md bg-green-500 px-4 py-2 text-white">
          確認
        </button>
        <button className="rounded-md border border-gray-300 px-4 py-2">
          取消
        </button>
        <button className="rounded-md border border-gray-300 px-4 py-2">
          更多選項
        </button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "測試當內容極長時，Card 是否能正確處理文字換行與溢出，確保排版不會跑掉。",
      },
    },
  },
};

// ============================================
// 6. Long Content with Truncation - 截斷長文字
// ============================================
export const LongContentTruncated: Story = {
  render: () => (
    <Card className="w-[21.875rem]">
      <CardHeader>
        <CardTitle className="truncate">
          這是一個非常非常非常非常非常非常非常非常非常非常非常非常長的標題會被截斷
        </CardTitle>
        <CardDescription className="line-clamp-2">
          這是一段很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長很長的描述文字，設定最多顯示兩行。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
      </CardContent>
      <CardFooter>
        <button className="rounded-md bg-green-500 px-4 py-2 text-white">
          閱讀更多
        </button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "使用 truncate 和 line-clamp 來截斷過長的文字內容。",
      },
    },
  },
};

// ============================================
// 7. Mobile View - 小螢幕下的表現
// ============================================
export const MobileView: Story = {
  render: () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>行動版訂單</CardTitle>
        <CardDescription>在小螢幕裝置上的顯示</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-500">訂單編號</span>
          <span className="font-medium">#12345</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-500">日期</span>
          <span className="font-medium">2024/01/15</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-500">狀態</span>
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-sm text-green-700">
            已完成
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">總金額</span>
          <span className="text-lg font-bold text-green-600">NT$ 1,500</span>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <button className="w-full rounded-md bg-green-500 px-4 py-2 text-white">
          查看詳情
        </button>
        <button className="w-full rounded-md border border-gray-300 px-4 py-2">
          聯絡客服
        </button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "強制設定為行動裝置視窗大小（320px），測試小螢幕下的表現。",
      },
    },
  },
};

// ============================================
// 8. Mobile View Compact - 緊湊的行動版
// ============================================
export const MobileViewCompact: Story = {
  render: () => (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">訂單 #12345</CardTitle>
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
            已完成
          </span>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">2024/01/15</span>
          <span className="font-bold text-green-600">NT$ 1,500</span>
        </div>
      </CardContent>
    </Card>
  ),
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "更緊湊的行動版卡片設計，適合列表顯示。",
      },
    },
  },
};

// ============================================
// 9. With Card Action - 帶有操作按鈕
// ============================================
export const WithAction: Story = {
  render: () => (
    <Card className="w-[21.875rem]">
      <CardHeader>
        <CardTitle>訂單詳情</CardTitle>
        <CardDescription>訂單編號: #12345</CardDescription>
        <CardAction>
          <button className="rounded-md p-2 hover:bg-gray-100">
            <svg
              className="h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>顯示 CardAction 元件的使用方式，通常用於放置更多操作選項。</p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: "使用 CardAction 元件在標題區域添加操作按鈕。",
      },
    },
  },
};

// ============================================
// 10. Dark Mode Preview - 深色模式預覽
// ============================================
export const DarkMode: Story = {
  render: () => (
    <div className="dark rounded-lg bg-gray-900 p-4">
      <Card className="w-[21.875rem]">
        <CardHeader>
          <CardTitle>深色模式</CardTitle>
          <CardDescription>測試深色主題下的顯示效果</CardDescription>
        </CardHeader>
        <CardContent>
          <p>此範例展示 Card 元件在深色模式下的外觀。</p>
        </CardContent>
        <CardFooter>
          <button className="rounded-md bg-green-500 px-4 py-2 text-white">
            確認
          </button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    backgrounds: {
      default: "dark",
    },
    docs: {
      description: {
        story: "測試 Card 在深色模式下的顯示效果。",
      },
    },
  },
};
