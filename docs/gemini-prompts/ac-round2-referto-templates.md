# Acceptance Criteria 生成 Prompt 模板

## 基礎 Prompt 模板

```
作為產品需求分析專家，請為以下 User Story 生成詳細的驗收標準：

**User Story：**
[在此輸入您的 User Story]

**Acceptance Criteria 格式要求：**
- 使用 Given-When-Then (Gherkin) 語法
- 使用商業語言（非技術術語）
- 涵蓋正常流程 (Happy Path)
- 包含邊界條件 (Edge Cases)
- 考慮異常情況 (Error Handling)
- 聚焦使用者行為與價值

**請生成至少 3 個場景：**
1. 正常流程場景
2. 邊界條件場景
3. 異常情況場景

**每個場景格式：**
場景：[簡潔描述場景]
Given [前置條件]
And [額外條件]
When [使用者行為]
And [額外行為]
Then [系統預期反應]
And [額外驗證點]
```

## 進階 Prompt 模板（適用於複雜功能）

```
請為以下 User Story 生成完整的驗收標準，並考慮以下面向：

**User Story：**
[輸入 User Story]

**需要涵蓋的場景類型：**
- ✅ 正常流程（Happy Path）
- ⚠️ 邊界條件（數值限制、空值處理）
- ❌ 異常情況（錯誤處理、網路異常）
- 🔒 權限控制（未登入、權限不足）
- 📱 不同裝置（桌面、手機、平板）

**輸出格式：**
每個場景請包含：
1. 場景名稱
2. Given-When-Then 結構
3. 具體的測試數據
4. 預期的使用者體驗

**注意事項：**
- 使用非技術語言
- 聚焦使用者價值
- 可被團隊成員理解
- 避免實作細節
```

## 範例 Prompt（含實際 User Story）

```
作為產品需求分析專家，請為以下 User Story 生成詳細的驗收標準：

**User Story：**
ID-005: 作為註冊使用者，我希望能透過帳號密碼登入系統，以便存取我的個人儀表板。

**Acceptance Criteria 格式要求：**
- 使用 Given-When-Then (Gherkin) 語法
- 使用商業語言（非技術術語）
- 涵蓋正常流程 (Happy Path)
- 包含邊界條件 (Edge Cases)
- 考慮異常情況 (Error Handling)
- 聚焦使用者行為與價值

**請生成至少 3 個場景：**
1. 正常流程場景
2. 邊界條件場景
3. 異常情況場景

**預期輸出範例：**

場景：成功登入系統
Given 用戶帳號 "test@example.com" 已註冊並啟用
And 用戶位於登入頁面
When 用戶輸入正確密碼 "ValidPassword123"
And 點擊登入按鈕
Then 系統應驗證身份並導向至首頁
And 頁面顯示歡迎訊息

場景：帳號不存在
Given 用戶位於登入頁面
When 用戶輸入不存在的帳號 "nonexist@example.com"
And 輸入任意密碼
And 點擊登入按鈕
Then 系統應顯示錯誤訊息 "帳號或密碼錯誤"
And 使用者停留在登入頁面

場景：密碼錯誤
Given 用戶帳號 "test@example.com" 已註冊並啟用
And 用戶位於登入頁面
When 用戶輸入錯誤密碼 "WrongPassword"
And 點擊登入按鈕
Then 系統應顯示錯誤訊息 "帳號或密碼錯誤"
And 密碼欄位應清空
```

## 特定領域 Prompt 模板

### 電商系統 AC 生成

```
請為以下電商相關的 User Story 生成驗收標準：

**User Story：**
[輸入電商相關 User Story]

**特別考慮：**
- 金額計算與顯示
- 庫存限制
- 付款流程
- 購物車狀態
- 訂單狀態變化

**輸出要求：**
使用 Gherkin 語法，包含具體的金額、數量等測試數據
```

### 權限管理 AC 生成

```
請為以下權限管理相關的 User Story 生成驗收標準：

**User Story：**
[輸入權限相關 User Story]

**必須涵蓋的角色：**
- 管理員
- 一般使用者
- 訪客（未登入）

**權限場景：**
- 有權限存取
- 無權限存取
- 權限變更後的行為
```

## 使用建議

1. **選擇合適的模板**：根據功能複雜度選擇基礎或進階模板
2. **提供完整的 User Story**：包含角色、需求、價值說明
3. **根據需要調整場景類型**：可以要求 AI 生成更多特定場景
4. **檢視並調整輸出**：AI 生成後仍需人工檢視是否符合專案需求

## 撰寫原則提醒

- **SMART 原則**：
  - S：具體（Specific）
  - M：可衡量（Measurable）
  - A：可達成（Achievable）
  - R：相關性高（Relevant）
  - T：具時效性（Time-bound）

- **避免技術實作細節**：AC 應聚焦於「什麼」而非「如何」
- **使用具體數據**：提供明確的測試數據讓驗證更清楚
- **考慮真實使用情境**：思考使用者實際操作時可能遇到的情況