# 🐳 Docker 開發環境設定指南

## 📋 課前準備

### 1. 安裝 Docker Desktop
- **Windows/Mac**: 下載並安裝 [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Linux**: 安裝 Docker Engine 和 Docker Compose

### 2. 驗證安裝
```bash
docker --version
docker-compose --version
```

## 🚀 快速啟動

### 1. Clone 專案
```bash
git clone https://github.com/prodsence-training/training-jira-dashboard-workshop-base.git
cd training-jira-dashboard-workshop-base
```

### 2. 啟動所有服務
```bash
docker-compose up
```

### 3. 訪問應用程式
- **前端 (Next.js)**: http://localhost:3000
- **後端 API**: http://localhost:8000
- **API 文件**: http://localhost:8000/docs

## 🛠️ 開發指令

### 啟動服務
```bash
# 啟動所有服務
docker-compose up

# 在背景執行
docker-compose up -d

# 重新建構並啟動
docker-compose up --build
```

### 停止服務
```bash
# 停止所有服務
docker-compose down

# 停止並刪除 volumes
docker-compose down -v

# 停止並刪除 images
docker-compose down --rmi all
```

### 查看服務狀態
```bash
# 查看運行中的容器
docker-compose ps

# 查看服務 logs
docker-compose logs

# 查看特定服務 logs
docker-compose logs frontend
docker-compose logs backend
```

### 進入容器
```bash
# 進入 backend 容器
docker-compose exec backend bash

# 進入 frontend 容器
docker-compose exec frontend sh
```

## 🔧 開發模式

### Hot Reload
- **前端**: 程式碼變更會自動重新載入
- **後端**: FastAPI 會自動重新載入

### Volume 掛載
- 本機的程式碼會即時同步到容器內
- 修改本機檔案，容器內立即生效

## 🐛 故障排除

### 常見問題

#### 1. Port 被占用
```bash
# 查看 port 使用情況
lsof -i :3000
lsof -i :8000

# 或使用不同 port
docker-compose down
# 修改 docker-compose.yml 中的 ports 設定
```

#### 2. 容器無法啟動
```bash
# 查看詳細錯誤訊息
docker-compose logs [service-name]

# 重新建構容器
docker-compose build --no-cache
docker-compose up
```

#### 3. 依賴安裝問題
```bash
# 進入容器手動安裝
docker-compose exec frontend npm install
docker-compose exec backend pip install -r requirements.txt
```

#### 4. 完全重置環境
```bash
# 停止所有服務
docker-compose down

# 刪除所有相關 images
docker-compose down --rmi all

# 清理 volumes
docker volume prune

# 重新啟動
docker-compose up --build
```

## 📊 服務架構

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   (Next.js)     │◄──►│   (FastAPI)     │
│   Port: 3000    │    │   Port: 8000    │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
            ┌─────────────────┐
            │ Google Sheets   │
            │   (Data Source) │
            └─────────────────┘
```

## 🎯 課程中的使用

### Sprint 開發流程
1. 修改程式碼（本機編輯器）
2. 自動 hot reload（容器內）
3. 測試功能（瀏覽器）
4. Git commit & push

### AI 工具整合
- Cursor 可以直接編輯專案檔案
- GitHub Copilot 在容器環境中正常運作
- 所有變更即時反映在運行中的應用程式

## 💡 進階用法

### 只啟動特定服務
```bash
# 只啟動 backend
docker-compose up backend

# 啟動 backend 和相依服務
docker-compose up --build backend
```

### 開發工具容器
```bash
# 啟動開發工具容器
docker-compose --profile dev up devtools

# 進入開發環境
docker-compose exec devtools sh
```

### 生產模式模擬
```bash
# 使用生產設定
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

---

**如有任何問題，請聯繫講師或參考 Docker 官方文件！** 🚀