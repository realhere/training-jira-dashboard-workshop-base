# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jira Dashboard training workshop application demonstrating AI-driven full-stack development. The project is structured as a monorepo with separate frontend and backend applications, designed for rapid prototyping workshops.

### 在開始任何任務之前

- 請用平輩的方式跟我說話討論，不要對我用您這類敬語。
- 不要因爲我的語氣而去揣測我想聽什麼樣的答案。
- 如果你認爲自己是對的，請堅持立場，不用爲了討好我而改變回答。
- 請保持直接、清楚、理性。
- 如果不知道，請跟我討論。

## Monorepo Structure

```
training-jira-dashboard-workshop-base/
├── frontend/                    # Next.js 15 + React 19 + TypeScript
├── backend-dotnet/              # .NET 8 Web API (port 8001)
├── docs/                        # Technical documentation
```

## Development Commands

**Docker 環境 (推薦):**
- **啟動所有服務**: `make workshop-start` (啟動前端 + .NET 後端)
- **停止所有服務**: `make workshop-stop`
- **健康檢查**: `make health`
- **執行所有測試**: `make test`

**前端 (Next.js):**
- **開發伺服器**: `cd frontend && npm run dev` (port 3000)
- **測試**: `make test-frontend`

**.NET 後端 (Web API):**
- **開發伺服器**: port 8001
- **測試**: `make test-backend-dotnet`

## Architecture

### Frontend (v0.dev Generated)
- **Framework**: Next.js 15 with app router
- **UI Library**: shadcn/ui components with Tailwind CSS
- **Charts**: Recharts for data visualization
- **Key Components**: 
  - `frontend/components/jira-dashboard.tsx` - MVP Dashboard with 4 key metrics + status distribution chart
  - `frontend/components/completion-rate-card.tsx` - Sprint progress with burndown chart visualization
  - `frontend/components/burndown-chart.tsx` - Interactive burndown chart with health status
- **API Integration**: Custom hooks in `frontend/hooks/use-dashboard.ts` for backend communication

### Backend (.NET Core 架構)

#### .NET 後端 (Web API)
- **Framework**: .NET 8 Web API
- **Port**: 8001
- **Data Source**: Google Sheets API (CSV format)
- **Key Files**:
  - `backend-dotnet/Program.cs`: Web API 配置
  - `backend-dotnet/GoogleSheetsService.cs`: Google Sheets 服務
  - `backend-dotnet/Models.cs`: 資料模型定義
  - `backend-dotnet/SimpleTests.cs`: 基本測試案例

### Data Integration
- **Google Sheets**: .NET 後端整合 Google Sheets 作為資料來源 (CSV format)
- **API 格式**: RESTful endpoints for dashboard stats, status distribution, and sprint burndown
- **前端整合**: React hooks 整合 .NET Core API
- **核心功能**: Sprint 燃盡圖視覺化與進度健康狀態警示

## Configuration Files

**Frontend:**
- `frontend/components.json`: shadcn/ui configuration
- `frontend/tailwind.config.ts`: Tailwind CSS configuration
- `frontend/next.config.mjs`: Next.js config (ESLint/TypeScript errors ignored for workshop)
- `frontend/.env.local`: Environment variables (API_URL)

**.NET 後端:**
- `backend-dotnet/backend-dotnet.csproj`: 專案檔案與 NuGet 套件
- `backend-dotnet/appsettings.json`: 應用程式配置

## Workshop Learning Path

本專案包含完整的技術文件在 `/docs/` 目錄：
1. 環境設定與 Docker 容器化
2. 前端探索 (Next.js + shadcn/ui)
3. .NET Web API 開發與 Google Sheets 整合
4. Sprint 燃盡圖與進度視覺化功能實現
5. 測試策略 (前端 Jest + 後端 xUnit)

## Development Notes

- **容器化**: 使用 Docker Compose 管理多服務環境
- **API 端點**:
  - Frontend: `http://localhost:3000`
  - .NET 後端: `http://localhost:8001`
- **資料來源**: Google Sheets API 整合，支援即時資料存取和 5分鐘快取
- **核心功能**: Sprint 燃盡圖、進度條顏色同步、健康狀態警示
- **測試覆蓋**: 前端 Jest + .NET xUnit
- **開發工具**: Makefile (Linux/Mac) + workshop.bat (Windows) 提供統一指令介面
