# 技術架構概覽

本文件提供 Training Jira Dashboard MVP v1.0 專案的技術架構深度解析，旨在協助工程師快速理解系統設計、技術選型和實作細節。

## 專案概述

這是一個功能完整的 Jira Dashboard MVP v1.0 應用，採用現代化技術堆疊建構敏捷開發儀表板。專案整合 Google Sheets 作為真實資料來源，支援 Docker 容器化部署，專注於核心的統計視覺化功能。

### 專案定位
- **Jira Dashboard MVP v1.0**：生產就緒的 Dashboard 應用，整合 Google Sheets 真實資料
- **核心功能**：4 個關鍵指標卡片 + 1 個狀態分布圖表 + Sprint 篩選
- **Google Sheets Table**：完整的資料表格檢視功能
- **目標**：展示在嚴格資料限制下的 vibe coding 開發流程

## 系統架構圖

```
┌─────────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Google Sheets     │────>│   Backend API    │────>│    Frontend     │
│ ┌─────────────────┐ │ CSV │  (.NET Core)     │ API │   (Next.js)     │
│ │ rawData (23欄) │ │     │                  │     │                 │
│ │ GetJiraSprintV. │ │     │                  │     │                 │
│ └─────────────────┘ │     │                  │     │                 │
└─────────────────────┘     └──────────────────┘     └─────────────────┘
                                    │                           │
                                    ▼                           ▼
                              ┌──────────┐               ┌──────────┐
                              │  Cache   │               │Dashboard │
                              │ (5 min)  │               │Components│
                              └──────────┘               └──────────┘
                                                                │
                                                                ▼
                                                         ┌──────────┐
                                                         │4 Cards + │
                                                         │1 Chart + │
                                                         │Sprint    │
                                                         └──────────┘
```

## 技術堆疊

### 前端技術

| 技術 | 版本 | 用途 |
|------|------|------|
| **Next.js** | 15.2.4 | React 框架，使用 App Router |
| **React** | 19.0.0 | UI 函式庫 |
| **TypeScript** | 5.x | 型別安全 |
| **shadcn/ui** | latest | UI 元件庫（基於 Radix UI） |
| **Tailwind CSS** | 3.4.x | 實用優先的 CSS 框架 |
| **Recharts** | 2.x | 資料視覺化圖表 |
| **React Hook Form** | 7.x | 表單管理 |
| **Zod** | 3.x | Schema 驗證 |

#### 前端測試工具
| 技術 | 版本 | 用途 |
|------|------|------|
| **Jest** | 29.x | JavaScript 測試框架 |
| **React Testing Library** | 14.x | React 元件測試 |
| **@testing-library/jest-dom** | 6.x | DOM 測試擴充匹配器 |

### 後端技術

| 技術 | 版本 | 用途 |
|------|------|------|
| **.NET Core** | 8.0 | 主要執行環境 |
| **ASP.NET Core** | 8.0 | Web API 框架 |
| **C#** | 12.0 | 程式語言 |
| **Google Sheets CSV API** | - | 資料來源整合 |
| **記憶體快取** | 內建 | 5分鐘資料快取 |

#### 備用後端（Python）
| 技術 | 版本 | 用途 |
|------|------|------|
| **Python** | 3.11 | 備用執行環境 |
| **FastAPI** | 0.104.1 | 備用 Web 框架 |
| **Uvicorn** | 0.24.0 | ASGI 伺服器 |
| **Pandas** | 2.1.3 | 資料處理 |

#### 後端測試工具
| 技術 | 版本 | 用途 |
|------|------|------|
| **pytest** | 7.4.3 | Python 測試框架 |
| **pytest-asyncio** | 0.21.1 | 非同步測試支援 |
| **httpx** | 0.25.2 | 測試用 HTTP 客戶端 |

### 基礎設施

| 技術 | 用途 |
|------|------|
| **Docker** | 容器化 |
| **Docker Compose** | 容器編排 |
| **npm workspaces** | Monorepo 管理 |
| **Makefile** | 自動化指令 |

## 專案結構

```
training-jira-dashboard-workshop-base/
├── frontend/                 # Next.js 前端應用
│   ├── app/                 # App Router 路由
│   │   ├── page.tsx        # 主 Dashboard 頁面
│   │   └── google-sheets/  # Google Sheets Table 頁面
│   ├── components/          # React 元件
│   │   ├── jira-dashboard.tsx      # MVP Dashboard 元件
│   │   └── google-sheets-table.tsx # 資料表格元件
│   ├── hooks/              # 自訂 React Hooks
│   │   ├── use-dashboard.ts        # Dashboard API Hook
│   │   └── use-google-sheets.ts    # Google Sheets Hook
│   ├── lib/                # 工具函式
│   ├── public/             # 靜態資源
│   ├── __tests__/          # 前端測試檔案
│   ├── jest.config.js      # Jest 配置
│   └── jest.setup.js       # Jest 設定
├── backend-dotnet/          # .NET Core 主要後端
│   ├── Program.cs          # API 路由定義
│   ├── GoogleSheetsService.cs  # Google Sheets 服務
│   ├── Models.cs           # 資料模型
│   └── Dockerfile          # Docker 配置
├── backend/                 # Python FastAPI 備用後端
│   ├── main.py            # 應用入口
│   ├── config.py          # 配置管理
│   ├── models.py          # Pydantic 模型
│   ├── services/          # 商業邏輯
│   ├── tests/             # 後端測試檔案
│   └── pytest.ini         # pytest 配置
├── docs/                   # 技術文件
│   ├── table-schema.md    # 嚴格資料架構定義
│   ├── mvp-v1/           # MVP v1.0 文件
│   └── guides/           # 開發指引
├── docker-compose.yml      # Docker 配置
├── Makefile               # 快速指令
└── package.json           # Monorepo 配置
```

## 核心功能模組

### 前端核心元件

1. **JiraDashboard** (`/frontend/components/jira-dashboard.tsx`) **[MVP v1.0 生產版]**
   - 完整整合 Google Sheets 資料的 Dashboard
   - **4 個關鍵指標卡片**：Total Issues, Total Story Points, Done Issues, Done Story Points
   - **1 個狀態分布圖表**：Bar Chart 顯示各狀態的 Issue 分布（固定排序）
   - **Sprint 篩選器**：動態載入 Sprint 選項，支援 "All", 有效 Sprint, "No Sprints"
   - 使用 `useDashboard` Hook 整合 .NET Core API

2. **GoogleSheetsTable** (`/frontend/components/google-sheets-table.tsx`) **[資料檢視工具]**
   - 嚴格按照 23 欄位架構顯示（Column A-W）
   - 表頭凍結與滾動支援
   - 分頁、排序、Sprint 篩選功能
   - 響應式設計

3. **useDashboard Hook** (`/frontend/hooks/use-dashboard.ts`) **[主要 API Hook]**
   - Dashboard 統計資料獲取
   - Sprint 篩選邏輯
   - 狀態分布資料處理
   - 5分鐘快取機制

4. **useGoogleSheets Hook** (`/frontend/hooks/use-google-sheets.ts`) **[表格資料 Hook]**
   - 原始 Google Sheets 資料獲取
   - 分頁和排序處理
   - 錯誤處理和重試機制

### 後端 API 端點 (.NET Core)

| 端點 | 方法 | 功能 | 參數 |
|------|------|------|------|
| `/api/dashboard/stats` | GET | Dashboard 統計資料 | sprint (optional) |
| `/api/dashboard/status-distribution` | GET | 狀態分布資料 | sprint (optional) |
| `/api/table/sprints` | GET | Sprint 篩選選項 | - |
| `/api/table/data` | GET | 分頁資料查詢 | page, page_size, sort_by, sort_order, sprint |
| `/api/table/summary` | GET | 表格摘要資訊 | - |

### API 回應格式

**Dashboard Stats API**:
```json
{
  "total_issues": 1250,
  "total_story_points": 89.5,
  "done_issues": 485,
  "done_story_points": 42.0,
  "last_updated": "2024-08-17T12:00:00Z"
}
```

**Status Distribution API**:
```json
{
  "distribution": [
    {"status": "Backlog", "count": 320, "percentage": 25.6},
    {"status": "To Do", "count": 445, "percentage": 35.6},
    {"status": "Done", "count": 485, "percentage": 38.8}
  ],
  "total_count": 1250,
  "last_updated": "2024-08-17T12:00:00Z"
}
```

### 資料模型

**前端 TypeScript 介面：**
```typescript
interface TableRow {
  [key: string]: any  // 動態欄位支援
}

interface TableSummary {
  sheet_id: string
  sheet_name: string
  total_rows: number
  total_columns: number
  columns: TableColumn[]
  last_updated: string
}
```

**後端 C# 模型：**
```csharp
public record SprintBurndownResponse
{
    public List<DayProgress> IdealBurndown { get; init; } = new();
    public List<DayProgress> ActualBurndown { get; init; } = new();
    public string HealthStatus { get; init; } = "";
    public double CompletionRate { get; init; }
    public int TotalDays { get; init; }
    public int CurrentWorkingDay { get; init; }
    public int RemainingDays { get; init; }
}
```

## Google Sheets 整合

### 資料存取機制

1. **無需 API 金鑰**：使用公開分享的 Google Sheets CSV 匯出 URL
2. **自動更新**：透過 5 分鐘快取機制平衡效能與即時性
3. **資料處理**：
   - CSV 格式自動解析
   - 日期時間欄位自動轉換
   - 數值型別智慧偵測
   - 欄位限制（僅讀取到 Column W）

## 資料來源架構

### MVP v1.0 資料來源架構

1. **Jira Dashboard 頁面** **[MVP v1.0 生產版]**：
   - **完整整合 Google Sheets**：使用 .NET Core API 即時讀取真實資料
   - **4 個核心指標**：從 rawData 表動態計算統計資料
   - **狀態分布圖表**：按照固定業務流程順序顯示 9 個狀態
   - **Sprint 篩選功能**：從 GetJiraSprintValues 表動態載入選項
   - **5分鐘快取**：平衡效能與即時性

2. **Google Sheets Table 頁面** **[資料檢視工具]**：
   - **嚴格 23 欄位架構**：完全按照 table-schema.md 定義的結構
   - **vibe coding 限制**：展示在資料結構限制下的開發
   - **完整 CRUD 檢視**：分頁、排序、篩選功能
   - **響應式設計**：適配不同螢幕尺寸

3. **資料表結構** (詳見 [table-schema.md](./table-schema.md))：
   - **rawData (23 欄位)**：主要 Issue 資料，從 Column A 到 W
   - **GetJiraSprintValues (9 欄位)**：Sprint 管理資料，從 Column A 到 I

### 嚴格資料架構限制

詳細的資料表架構說明請參考 [Table Schema 文件](./table-schema.md)。

#### rawData 資料表（23 欄位嚴格限制）
**Vibe Coding 開發限制**：
- **欄位順序固定**：必須按照 1-23 順序存取，使用 `row[index]` 模式
- **禁止結構修改**：不可新增、刪除或重新排列欄位
- **類型安全**：string, number, date 三種類型，空值必須妥善處理
- **業務邏輯限制**：Status 必須為 9 個預定義狀態之一

**關鍵欄位**：
- **欄位 1 (Key)**：唯一識別碼，絕對不可重複
- **欄位 6 (Status)**：9 個固定狀態，決定 Dashboard 圖表排序
- **欄位 7 (Sprint)**：對應 GetJiraSprintValues 的 Sprint Name
- **欄位 16 (Story Points)**：數值型，用於統計計算

#### GetJiraSprintValues 資料表（9 欄位）
**Sprint 管理架構**：
- **Column A-I 固定結構**：Board ID, Board Name, Sprint Name, Sprint ID, state, startDate, endDate, completeDate, goal
- **關鍵整合欄位**：Column C (Sprint Name) 對應 rawData 欄位 7
- **狀態管理**：future, active, closed 三種 Sprint 狀態

#### rawStatusTime 資料表 **[架構已定義，尚未整合]**
狀態變更歷史追蹤表，為未來擴展預留的架構定義。

## 開發環境設定

### 環境需求

- Node.js >= 18.0.0
- npm >= 8.0.0
- .NET 8 SDK
- Docker Desktop (可選)

### 快速啟動

```bash
# 方式一：使用 Docker（推薦）
make workshop-start

# 方式二：本地開發
npm run setup  # 安裝所有依賴
npm run dev    # 啟動前後端

# 方式三：分別啟動
cd frontend && npm run dev  # 前端 (http://localhost:3000)
cd backend-dotnet && dotnet run  # 後端 (http://localhost:8001)
```

### 環境變數

**前端** (`frontend/.env.local`)：
```
NEXT_PUBLIC_API_URL=http://localhost:8001
```

**後端 (.NET Core)** (`backend-dotnet/appsettings.json`)：
```json
{
  "GoogleSheets": {
    "SheetId": "1RmJjghgiV3XWLl2BaxT-md8CP3pqb1Wuk-EhFoqp1VM",
    "RawDataSheet": "rawData",
    "SprintSheet": "GetJiraSprintValues"
  },
  "CacheDuration": 300,
  "Urls": "http://localhost:8001"
}
```


## 效能優化策略

### 前端優化

1. **資料快取**：使用 React hooks 實現客戶端快取
2. **虛擬滾動**：大量資料時的效能優化（未來功能）
3. **懶加載**：元件按需載入
4. **預設分頁大小**：100 筆資料

### 後端優化

1. **資料快取**：5 分鐘 Google Sheets 資料快取
2. **分頁處理**：避免一次載入所有資料
3. **欄位限制**：僅讀取必要欄位（到 Column W）
4. **非同步處理**：ASP.NET Core 原生支援

## 安全性考量

1. **CORS 設定**：限制允許的來源
2. **輸入驗證**：ASP.NET Core 模型驗證
3. **錯誤處理**：避免敏感資訊洩露
4. **無需憑證**：使用公開 Google Sheets，避免金鑰管理

## 部署架構

### Docker 容器配置

```yaml
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8001
    
  backend-dotnet:
    build: ./backend-dotnet
    ports: ["8001:8001"]
    environment:
      - GoogleSheets__SheetId=1RmJjghgiV3XWLl2BaxT-md8CP3pqb1Wuk-EhFoqp1VM
      - GoogleSheets__RawDataSheet=rawData
      - GoogleSheets__SprintSheet=GetJiraSprintValues
      - CacheDuration=300
    
```

### 生產環境建議

1. **前端**：部署至 Vercel/Netlify
2. **後端**：部署至 Cloud Run/App Engine
3. **快取**：考慮使用 Redis
4. **監控**：整合 Datadog/New Relic

## 已知限制與挑戰

### 技術限制

1. **Google Sheets API 限制**：
   - 公開分享的安全性考量
   - 無法寫入資料（唯讀）
   - 大量請求可能觸發限流

2. **效能限制**：
   - 大量資料（>10,000 筆）的處理效能
   - 即時更新延遲（5 分鐘快取）

3. **功能限制**：
   - 無使用者認證機制
   - 無資料寫入功能
   - 無即時協作功能

4. **Vibe Coding 設計限制**：
   - 嚴格限制資料架構，不可修改 rawData 23 欄位結構
   - 強制使用 `row[index]` 存取模式，避免欄位名稱依賴
   - MVP 功能範圍限制：僅 4 個 Score Cards + 1 個 Bar Chart
   - 展示在真實約束條件下的快速開發能力

### 擴展建議

1. **資料庫整合**：考慮整合 PostgreSQL 提升效能
2. **認證系統**：加入 JWT/OAuth 認證
3. **即時功能**：使用 WebSocket 實現即時更新
4. **API Gateway**：加入 Kong/Traefik 管理 API

## 開發最佳實踐

### 程式碼規範

1. **前端**：
   - 使用 TypeScript 確保型別安全
   - 遵循 React Hooks 規則
   - 元件拆分保持單一職責

2. **後端**：
   - 使用 C# 型別安全
   - 遵循 .NET 編碼規範
   - 適當的錯誤處理和記錄

### Git 工作流程

1. 功能分支開發
2. 提交訊息遵循約定式提交
3. Code Review 流程
4. CI/CD 整合（GitHub Actions）

## 測試架構

### 測試策略

專案採用 Docker 容器內執行測試的策略，確保測試環境的一致性，學員無需在本地安裝測試工具。

### 前端測試

- **測試框架**：Jest + React Testing Library
- **測試位置**：`frontend/__tests__/`
- **執行方式**：`make test-frontend` 或 `workshop.bat test-frontend`
- **測試範例**：
  ```typescript
  // 測試首頁是否正確顯示環境測試訊息
  it('renders the environment test success message', () => {
    render(<Home />)
    const successMessage = screen.getByText(/Docker 環境測試成功/)
    expect(successMessage).toBeInTheDocument()
  })
  ```

### 後端測試

- **測試框架**：xUnit + ASP.NET Core Test Host
- **測試位置**：`backend-dotnet/SimpleTests.cs`
- **執行方式**：`make test-backend-dotnet` 或 `dotnet test`
- **測試範例**：
  ```csharp
  [Fact]
  public async Task GetSprintBurndown_ReturnsValidResponse()
  {
      // Arrange & Act
      var response = await _client.GetAsync("/api/sprint-burndown");
      
      // Assert
      response.EnsureSuccessStatusCode();
      var content = await response.Content.ReadAsStringAsync();
      Assert.Contains("idealBurndown", content);
  }
  ```

### 測試執行指令

```bash
# 前置條件：確保容器正在運行
make workshop-start

# 執行所有測試
make test

# 只執行前端測試
make test-frontend

# 只執行後端測試
make test-backend-dotnet
```

## 相關文件

- [Table Schema 文件](./table-schema.md) - 詳細的資料表欄位說明
- [測試指南](./testing-guide.md) - 完整的測試框架說明與執行方式
- [API Overview](./api-overview.md) - API 端點詳細說明（如存在）
- [CLAUDE.md](../CLAUDE.md) - AI 開發助手指引

## 結論

這個 Jira Dashboard MVP v1.0 專案展示了在嚴格資料架構限制下的現代全端開發最佳實踐，特別適合作為 vibe coding 快速開發的範例。透過整合 Google Sheets、.NET Core API 和現代化前端框架，提供了一個完整且功能聚焦的解決方案。

### 核心價值

對於開發者而言，這個專案提供：
- **資料架構約束下的開發經驗**：學習在嚴格限制中保持開發效率
- **MVP 功能聚焦**：理解如何快速實現核心業務價值
- **現代技術整合**：.NET Core + React + Google Sheets 的完整整合
- **容器化部署**：Docker 環境下的一致性開發體驗

### 技術示範

1. **嚴格資料結構管理**：23 欄位固定架構的實作模式
2. **前後端分離**：.NET Core API + React SPA 架構
3. **雲端資料整合**：無需複雜設定的 Google Sheets 整合
4. **效能優化策略**：5分鐘快取機制平衡即時性與效能

這個專案為快速原型開發和受限環境下的產品開發提供了實用的參考範例。