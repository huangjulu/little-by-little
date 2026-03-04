"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error(props: ErrorProps) {
  const { error, reset } = props;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 text-gray-800">
      <div className="rounded-2xl bg-white/80 p-8 shadow-sm ring-1 ring-gray-200 text-center max-w-md">
        <h2 className="text-lg font-semibold text-red-600 mb-2">
          發生了一些問題
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {error.message ?? "頁面發生非預期的錯誤，請嘗試重新整理。"}
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-btn-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          重試
        </button>
      </div>
    </div>
  );
}
