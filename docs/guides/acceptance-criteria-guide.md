# Acceptance Criteria 撰寫指引

## 🔗 與 User Story 的關係

Acceptance Criteria（驗收標準）是 **User Story 的具體化**，將抽象的使用者需求轉換為可驗證的具體條件。

### User Story → Acceptance Criteria 流程
```
User Story: 作為 [角色]，我希望 [功能]，以便 [價值]
       ↓
Acceptance Criteria: 具體描述「功能」如何運作的情境
```

**核心價值**：
- 明確定義 User Story 的「完成標準」
- 確保開發團隊理解需求細節
- 提供開發和驗收的共同基準

### 撰寫 AC 的好處
- 🎯 **聚焦價值**：幫助 PO 與團隊聚焦於「使用者價值」與「行為預期」
- 🔍 **避免誤解**：協助開發團隊避免過度詮釋或誤解需求
- 📋 **驗收基準**：提供明確的功能驗收標準
- 🔄 **溝通橋樑**：成為產品、開發、QA 團隊的共同語言

## 📝 撰寫格式：Gherkin

### 標準格式
```gherkin
場景：[簡要描述情境]
Given [前置條件]
And [額外前置條件]
When [用戶操作]
Then [預期結果]
And [額外驗證點]
```

## 🎯 撰寫原則

### 涵蓋情境
- ✅ **正常流程**：主要使用路徑
- ⚠️ **邊界條件**：數值上下限、空值處理
- ❌ **異常情況**：錯誤狀況、權限不足
- 🔒 **安全控制**：未登入、權限驗證

### SMART 原則
| 原則 | 說明 |
|------|------|
| **S - Specific** | 具體明確的行為描述 |
| **M - Measurable** | 可驗證的結果 |
| **T - Testable** | 可執行的測試步驟 |

## 🚀 從 User Story 到 AC 的步驟

### 步驟 1：分析 User Story
```
User Story: 作為登入用戶，我希望能重設密碼，以便恢復帳戶存取權限
           ↓
分析要素：角色（登入用戶）、功能（重設密碼）、價值（恢復存取）
```

### 步驟 2：識別關鍵情境
- **正常情境**：成功重設密碼
- **邊界情境**：密碼格式限制
- **異常情境**：重設失敗處理

### 步驟 3：撰寫 AC
針對每個情境寫出 Given-When-Then

## 🤖 AI 生成提示

### 基本提示
```
請為以下 User Story 生成 Acceptance Criteria：

User Story: [輸入 User Story]

要求：
- 使用 Gherkin 格式 (Given-When-Then)
- 涵蓋正常流程、邊界條件、異常情況
- 聚焦使用者行為，避免技術術語
- 至少 3 個場景

格式：
場景：[場景描述]
Given [前置條件]
When [用戶操作]  
Then [預期結果]
```

## 📝 實際範例

### User Story
```
作為註冊使用者，我希望能透過帳號密碼登入系統，以便存取我的個人儀表板
```

### 對應的 Acceptance Criteria

#### AC01: 成功登入
```gherkin
場景：使用者成功登入系統
Given 用戶已註冊帳號
And 用戶位於登入頁面
When 用戶輸入正確的帳號密碼
And 點擊登入按鈕
Then 系統應導向至儀表板頁面
And 顯示歡迎訊息
```

#### AC02: 帳號不存在
```gherkin
場景：登入不存在的帳號
Given 用戶位於登入頁面
When 用戶輸入不存在的帳號
And 點擊登入按鈕
Then 系統應顯示錯誤訊息 "帳號或密碼錯誤"
And 使用者停留在登入頁面
```

#### AC03: 密碼錯誤
```gherkin
場景：輸入錯誤密碼
Given 用戶已註冊帳號
And 用戶位於登入頁面
When 用戶輸入錯誤密碼
And 點擊登入按鈕
Then 系統應顯示錯誤訊息
And 密碼欄位應清空
```

## 💡 撰寫技巧

### 從 User Story 提取 AC 要素
| User Story 元素 | AC 對應 |
|----------------|---------|
| **角色** | Given 中的使用者狀態 |
| **功能** | When 中的用戶操作 |
| **價值** | Then 中的預期結果 |

### 常見 AC 模式
- **資料驗證**：輸入格式、必填欄位
- **權限控制**：登入狀態、角色權限
- **流程控制**：步驟順序、狀態轉換
- **錯誤處理**：例外狀況、錯誤訊息

## 🔗 相關文件

| 文件 | 用途 |
|------|------|
| [PRD.md](../mvp-v1/PRD.md) | PRD 範例（含多組 User Story + AC） |
| [feature-spec-template.md](./feature-spec-template.md) | 輕量功能規格模板（含 AC 撰寫） |
| [user-story-guide.md](./user-story-guide.md) | User Story 撰寫指引 |
| [testcase-guide.md](./testcase-guide.md) | 測試案例撰寫指引 |