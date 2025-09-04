# Test Case 撰寫指引

## 為什麼要撰寫 Test Case？

測試案例（Test Case）是基於 **Acceptance Criteria** 撰寫的具體測試步驟，用來驗證系統是否按照驗收標準正確實作。每個 Test Case 都應該直接對應一個 AC 場景。

**Test Case 與 AC 的關係：**
- 🔗 **一對一對應**：每個 AC 場景至少對應一個 Test Case
- 🎯 **直接驗證**：測試步驟直接對應 AC 中的 Given-When-Then
- 🔄 **回歸測試**：確保新功能不影響既有功能
- 📋 **自動化基礎**：提供測試腳本撰寫的詳細規格

## 測試案例格式建議

每個 Test Case 包含以下欄位：

| 欄位 | 說明 | 範例 |
|------|------|------|
| **測試案例編號** | 唯一識別碼，方便追蹤與關聯 | TC-001, TC-LOGIN-001 |
| **測試目標** | 驗證的具體行為或條件 | 驗證使用者成功登入系統 |
| **相關 User Story** | 對應的功能需求或故事 | US005: 作為註冊使用者... |
| **相關 AC 場景** | 對應的 Acceptance Criteria 場景 | 場景：成功登入系統 |
| **測試前置條件** | 必要系統狀態、資料準備 | 使用者帳號已註冊並啟用 |
| **測試步驟** | 實際操作流程（具體、可執行） | 1. 開啟登入頁面<br>2. 輸入帳號... |
| **預期結果** | 每步操作後的系統行為 | 頁面導向儀表板，顯示歡迎訊息 |
| **測試資料** | 具體的測試輸入值 | 帳號: test@example.com |
| **測試類型** | 功能/邊界/異常/權限/效能測試 | 功能測試 |
| **自動化程度** | 手動/半自動/全自動 | 全自動（適合 E2E 測試） |

## 標準範例

### 從 User Story → AC → Test Case 的完整流程

**User Story：**
US005: 作為註冊使用者，我希望能透過帳號密碼登入系統，以便存取我的個人儀表板。

**對應的 Acceptance Criteria：**
```gherkin
場景：成功登入系統
Given 用戶帳號 "test@example.com" 已註冊並啟用
And 用戶位於登入頁面
When 用戶輸入正確密碼 "ValidPassword123"
And 點擊登入按鈕
Then 系統應驗證身份並導向至首頁
And 頁面顯示歡迎訊息
```

**生成的 Test Case：**

| 欄位 | 內容 |
|------|------|
| **測試案例編號** | TC-LOGIN-001 |
| **測試目標** | 驗證註冊使用者能成功登入並存取儀表板 |
| **相關 User Story** | US005: 作為註冊使用者，我希望能透過帳號密碼登入系統... |
| **相關 AC 場景** | 場景：成功登入系統 |
| **測試前置條件** | 1. 測試帳號 "test@example.com" 已存在於系統<br>2. 帳號狀態為啟用<br>3. 瀏覽器已開啟登入頁面 |
| **測試步驟** | 1. 在帳號欄位輸入 "test@example.com"<br>2. 在密碼欄位輸入 "ValidPassword123"<br>3. 點擊 "登入" 按鈕<br>4. 等待頁面載入完成 |
| **預期結果** | 1. 頁面成功導向至儀表板 (URL: /dashboard)<br>2. 頁面右上角顯示歡迎訊息<br>3. 使用者名稱正確顯示<br>4. 主要功能選單正常載入 |
| **測試資料** | 帳號: test@example.com<br>密碼: ValidPassword123 |
| **測試類型** | 功能測試（正常流程） |
| **自動化程度** | 全自動（適合 E2E 測試工具如 Playwright, Cypress） |

⸻

## 🤖 AI 提示模板

### ✅ 基礎 Test Case 生成 Prompt

```
作為測試工程師，請根據以下 User Story 和 Acceptance Criteria 生成詳細的測試案例：

**User Story：**
[輸入 User Story]

**Acceptance Criteria：**
[輸入 AC 場景]

**Test Case 格式要求：**
- 每個 AC 場景對應至少一個 Test Case
- 測試步驟要具體、可執行
- 預期結果要明確、可驗證
- 包含具體的測試資料
- 考慮自動化測試的可行性

**請生成包含以下欄位的測試案例：**
1. 測試案例編號
2. 測試目標
3. 相關 User Story
4. 相關 AC 場景
5. 測試前置條件
6. 測試步驟（具體操作）
7. 預期結果（可驗證的行為）
8. 測試資料
9. 測試類型
10. 自動化程度
```

### 🎯 進階 Prompt（包含多種測試類型）

```
請為以下需求生成完整的測試案例集合：

**User Story：**
[輸入 User Story]

**Acceptance Criteria：**
[輸入所有 AC 場景]

**需要涵蓋的測試類型：**
- ✅ 功能測試（正常流程）
- ⚠️ 邊界測試（極值、邊界條件）
- ❌ 異常測試（錯誤處理）
- 🔒 權限測試（存取控制）
- 📱 相容性測試（不同裝置/瀏覽器）

**自動化考量：**
- 標示哪些適合 Unit Test
- 標示哪些適合 Integration Test
- 標示哪些適合 E2E Test
- 提供具體的測試工具建議（如 Jest, Playwright, Cypress）

**輸出格式：**
每個測試案例請使用表格格式，並按測試類型分組
```

## 撰寫建議

### ✅ 良好實務
- **聚焦單一行為**：每個測試案例驗證一個具體功能
- **步驟具體化**：避免模糊描述，如「系統應正確反應」
- **資料明確化**：提供具體的測試輸入值
- **結果可驗證**：預期結果要能明確判斷通過/失敗
- **自動化友善**：撰寫時考慮後續自動化腳本的可行性

### ❌ 常見錯誤
- 測試步驟過於籠統或模糊
- 重複描述 AC 內容而非具體化操作
- 缺乏明確的驗證點
- 測試資料不完整或不現實
- 忽略異常情況和邊界條件

## 進階建議

### 測試組織
- **Test Suite 分類**：按功能模組或使用者流程分組
- **優先級標示**：P0（核心功能）、P1（重要功能）、P2（一般功能）
- **依賴關係**：標示測試案例間的執行順序

### 工具整合
- **管理工具**：TestRail、Xray、Azure DevOps Test Plans
- **自動化工具**：Jest（Unit）、Playwright（E2E）、Postman（API）
- **CI/CD 整合**：標示哪些測試適合在 Pipeline 中執行

⸻

## 🔗 相關文件

| 文件 | 用途 |
|------|------|
| [user-story-guide.md](./user-story-guide.md) | User Story 撰寫指引 |
| [acceptance-criteria-guide.md](./acceptance-criteria-guide.md) | Acceptance Criteria 撰寫指引 |
| [feature-spec-template.md](./feature-spec-template.md) | 功能規格模板（含 Test Cases） |
| [PRD.md](../mvp-v1/PRD.md) | PRD 範例（含完整測試案例） |

> **工作流程**：User Story → Acceptance Criteria → **Test Cases** → 開發實作 → 測試驗證