# Jira Dashboard MVP v1 - 產品需求文件

## 概述
Jira Dashboard MVP v1 是一個簡化的專案管理儀表板，整合 Google Sheets 作為資料來源，提供即時的專案健康度監控和 Issue 統計視覺化。本版本專注於核心的統計資訊展示和狀態分布圖表，移除複雜的管理功能。

## 產品定位
- **目標用戶**：專案經理、團隊領導、開發團隊成員
- **使用場景**：快速查看專案整體狀態、Sprint 進度追蹤、Issue 分布分析
- **核心價值**：一目了然的專案概覽，支援即時資料更新和 Sprint 篩選

## 已實作功能概述
本產品已完成開發並投入使用，包含以下核心功能：

## 核心功能架構

### 1. 頂部導航與控制區
- **應用程式標題**：Jira Dashboard
- **Sprint 篩選器**：
  - 動態載入 Sprint 選項（來源：Google Sheets GetJiraSprintValues 工作表）
  - 支援「All」、有效 Sprint 名稱、「No Sprints」選項
  - 即時篩選，選擇後所有資料同步更新
- **使用者頭像**：簡化的使用者識別

### 2. 關鍵指標卡片（Score Cards）
四個即時統計卡片，資料來源於 Google Sheets rawData 工作表：

1. **Total Issue Count**
   - 顯示總 Issue 數量
   - 圖示：文件圖標
   - 說明：Total issues tracked

2. **Total Story Points**
   - 顯示總故事點數（支援小數點）
   - 圖示：目標圖標
   - 說明：Total story points

3. **Total Done Item Count**
   - 顯示已完成 Issue 數量
   - 圖示：勾選圖標
   - 說明：Completed issues

4. **Done Story Points**
   - 顯示已完成故事點數（支援小數點）
   - 圖示：時鐘圖標
   - 說明：Completed story points

### 3. Issue 狀態分布圖表（Bar Chart）
- **圖表類型**：長條圖
- **資料來源**：Google Sheets rawData 工作表 Status 欄位
- **顯示順序**（固定排序）：
  1. Backlog
  2. Evaluated
  3. To Do
  4. In Progress
  5. Waiting
  6. Ready to Verify
  7. Done
  8. Invalid
  9. Routine
- **互動功能**：
  - 滑鼠懸停顯示詳細數值和百分比
  - 顯示總 Issue 數量統計
- **空狀態處理**：無資料時顯示友善提示

## 技術架構

### 前端技術棧
- **框架**：Next.js 15 + React 19 + TypeScript
- **UI 庫**：shadcn/ui + Tailwind CSS
- **圖表庫**：Recharts（Bar Chart）
- **狀態管理**：React Hooks（useState, useEffect, useCallback）
- **API 呼叫**：Custom hooks（useDashboard）

### 後端技術棧
- **.NET Core**：ASP.NET Core Web API
- **資料來源**：Google Sheets（CSV API）
- **快取機制**：記憶體快取（5分鐘過期）
- **API 設計**：RESTful API 端點

### 資料流架構
1. **Google Sheets** → 2. **.NET API** → 3. **React Frontend**

### API 端點
1. **`GET /api/dashboard/stats`**
   - 支援 Sprint 篩選參數
   - 返回：total_issues, total_story_points, done_issues, done_story_points

2. **`GET /api/dashboard/status-distribution`**
   - 支援 Sprint 篩選參數
   - 返回：各狀態的 count 和 percentage（按固定順序）

3. **`GET /api/table/sprints`**
   - 返回：可用的 Sprint 選項清單

### Google Sheets 整合
- **主要工作表**：rawData（A:W 欄位範圍）
- **Sprint 工作表**：GetJiraSprintValues（Column C）
- **存取方式**：公開 CSV API
- **Story Points 偵測**：自動尋找包含 "story" 和 "point" 的欄位名稱
- **Done 狀態偵測**：包含 "done", "resolved", "closed" 的狀態值

## 使用者體驗設計

### 視覺設計
- **設計系統**：shadcn/ui 元件庫
- **顏色主題**：藍色主題（#3b82f6）
- **圖示系統**：Lucide React 圖示
- **字體**：系統預設字體棧

## 效能特性

### 快取策略
- **後端快取**：5分鐘記憶體快取，避免頻繁請求 Google Sheets
- **前端最佳化**：React Hooks 管理狀態，避免不必要的重新渲染

## 產品成功指標

### 功能完整性
- ✅ 4個關鍵指標卡片正常運作
- ✅ 狀態分布圖表正確顯示
- ✅ Sprint 篩選功能正常
- ✅ 即時資料更新正常
- ✅ 固定狀態排序正確

## 版本資訊
- **當前版本**：MVP v1.0
- **發布狀態**：已完成開發並投入使用
- **最後更新**：2025-08-17
- **維護團隊**：開發團隊
