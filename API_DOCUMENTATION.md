# API 文件

## 訂單 API

### 取得訂單列表

**GET** `/api/orders`

#### 查詢參數

| 參數      | 類型   | 必填 | 說明                                                            |
| --------- | ------ | ---- | --------------------------------------------------------------- |
| `status`  | string | 否   | 訂單狀態篩選 (`all`, `pending`, `paid`, `shipped`, `cancelled`) |
| `keyword` | string | 否   | 關鍵字搜尋（訂單編號、客戶姓名、Email）                         |

#### 範例請求

```bash
# 取得所有訂單
GET /api/orders

# 取得待付款訂單
GET /api/orders?status=pending

# 關鍵字搜尋
GET /api/orders?keyword=王小明
```

#### 回應格式

```json
{
  "error": false,
  "data": [
    {
      "id": "ORD-240101-001",
      "customerName": "王小明",
      "email": "xiaoming@example.com",
      "createdAt": "2026-01-10T10:21:00Z",
      "total": 1680,
      "status": "pending",
      "items": [
        {
          "name": "Standard Plan",
          "quantity": 1,
          "price": 980
        }
      ]
    }
  ],
  "total": 1
}
```

---

### 建立新訂單

**POST** `/api/orders`

#### 請求 Body

```json
{
  "customerName": "張三",
  "email": "zhangsan@example.com",
  "items": [
    {
      "name": "Pro Plan",
      "quantity": 1,
      "price": 2990
    }
  ]
}
```

#### 必要欄位

- `customerName` (string): 客戶姓名
- `email` (string): 客戶 Email
- `items` (array): 訂單項目陣列
  - `name` (string): 項目名稱
  - `quantity` (number): 數量
  - `price` (number): 單價

#### 範例請求

```bash
POST /api/orders
Content-Type: application/json

{
  "customerName": "張三",
  "email": "zhangsan@example.com",
  "items": [
    {
      "name": "Pro Plan",
      "quantity": 1,
      "price": 2990
    }
  ]
}
```

#### 回應格式

```json
{
  "error": false,
  "data": {
    "id": "ORD-240119-001",
    "customerName": "張三",
    "email": "zhangsan@example.com",
    "createdAt": "2026-01-19T10:30:00Z",
    "total": 2990,
    "status": "pending",
    "items": [
      {
        "name": "Pro Plan",
        "quantity": 1,
        "price": 2990
      }
    ]
  },
  "message": "訂單建立成功"
}
```

---

### 取得單筆訂單

**GET** `/api/orders/[id]`

#### 路徑參數

| 參數 | 類型   | 說明     |
| ---- | ------ | -------- |
| `id` | string | 訂單編號 |

#### 範例請求

```bash
GET /api/orders/ORD-240101-001
```

#### 回應格式

```json
{
  "error": false,
  "data": {
    "id": "ORD-240101-001",
    "customerName": "王小明",
    "email": "xiaoming@example.com",
    "createdAt": "2026-01-10T10:21:00Z",
    "total": 1680,
    "status": "pending",
    "items": [...]
  }
}
```

---

### 更新訂單狀態

**PATCH** `/api/orders/[id]`

#### 路徑參數

| 參數 | 類型   | 說明     |
| ---- | ------ | -------- |
| `id` | string | 訂單編號 |

#### 請求 Body

```json
{
  "status": "paid"
}
```

#### 允許的狀態值

- `pending`: 待付款
- `paid`: 已付款
- `shipped`: 已出貨
- `cancelled`: 已取消

#### 範例請求

```bash
PATCH /api/orders/ORD-240101-001
Content-Type: application/json

{
  "status": "paid"
}
```

#### 回應格式

```json
{
  "error": false,
  "data": {
    "id": "ORD-240101-001",
    "status": "paid",
    ...
  },
  "message": "訂單更新成功"
}
```

---

## 錯誤回應格式

所有 API 在發生錯誤時都會返回以下格式：

```json
{
  "error": true,
  "message": "錯誤訊息"
}
```

### 常見錯誤狀態碼

- `400`: 請求參數錯誤
- `404`: 資源不存在
- `500`: 伺服器內部錯誤

---

## 在 React 元件中使用

```typescript
// 取得訂單列表
const response = await fetch("/api/orders?status=pending");
const result = await response.json();

// 建立新訂單
const response = await fetch("/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    customerName: "張三",
    email: "zhangsan@example.com",
    items: [
      {
        name: "Pro Plan",
        quantity: 1,
        price: 2990,
      },
    ],
  }),
});
const result = await response.json();

// 更新訂單狀態
const response = await fetch("/api/orders/ORD-240101-001", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    status: "paid",
  }),
});
const result = await response.json();
```
