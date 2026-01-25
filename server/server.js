/**
 * Server Utilities
 *
 * 注意：Next.js 的 API Routes 應該放在 src/app/api/ 目錄下
 * 這個檔案可以放置共用的 server 工具函數或 middleware
 */

/**
 * API 錯誤處理工具
 */
export function createErrorResponse(message, statusCode = 400) {
  return Response.json(
    {
      error: true,
      message,
    },
    { status: statusCode }
  );
}

/**
 * API 成功回應工具
 */
export function createSuccessResponse(data, statusCode = 200) {
  return Response.json(
    {
      error: false,
      data,
    },
    { status: statusCode }
  );
}

/**
 * 驗證請求 body 的工具
 */
export function validateRequestBody(body, requiredFields) {
  const missingFields = requiredFields.filter((field) => !(field in body));

  if (missingFields.length > 0) {
    return {
      valid: false,
      error: `缺少必要欄位: ${missingFields.join(", ")}`,
    };
  }

  return { valid: true };
}
