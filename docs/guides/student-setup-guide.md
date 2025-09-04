# 🎓 學員參與工作坊完整指南

## 📋 參與步驟

### 步驟 1: 安裝必要工具

#### 所有平台學員都需要安裝：
1. **Docker Desktop** (推薦)
   - [Docker Desktop 下載頁面](https://docs.docker.com/get-started/get-docker/)
   - 包含 Docker Engine、Docker Compose 和圖形化介面
   - 最適合初學者，一鍵安裝即可使用

2. **Git** (通常已安裝)
   - [Git 下載頁面](https://git-scm.com/downloads)

3. **程式碼編輯器**
   - [Cursor](https://cursor.sh/) (推薦)
   - [VS Code](https://code.visualstudio.com/)
   

### 步驟 2: Clone 專案

```bash
# 所有平台學員執行
git clone https://github.com/prodsence-training/training-jira-dashboard-workshop-base
cd training-jira-dashboard-workshop-base
```

### 步驟 2.5: 切換到工作分支

```bash
# 講師會預先為學員準備好分支
# 學員只需要切換到指定的分支

# 查看可用分支
git branch -a

# 切換到工作分支 (講師會告知具體分支名稱)
git checkout training-20250804-team-pilot1

# 確認當前分支
git branch
```

### 步驟 3: 確認開發環境

#### macOS/Linux 學員:
```bash
# 檢查 Docker 是否正確安裝
docker --version
docker-compose --version

# 啟動 Docker 環境
make workshop-start

# 等待約 30-60 秒讓服務完全啟動
```

#### Windows 學員:
```cmd
# 檢查 Docker 是否正確安裝
docker --version
docker-compose --version

# 啟動 Docker 環境
workshop.bat workshop-start

# 等待約 30-60 秒讓服務完全啟動
```

### 步驟 4: 驗證環境運作

1. **檢查服務狀態**
   ```bash
   # macOS/Linux
   make health
   
   # Windows
   workshop.bat health
   ```

2. **訪問應用程式**
   - 前端: http://localhost:3000
   - 後端: http://localhost:8000
   - API 文件: http://localhost:8000/docs

3. **測試第一個修改**
   - 在編輯器中開啟 `frontend/app/page.tsx`
   - 修改第 6 行的文字內容
   - 儲存檔案
   - 重新整理瀏覽器，應該看到修改立即生效

### 步驟 5: 開始工作坊

✅ **環境準備完成！** 現在可以開始參與工作坊內容。

## 🛠️ 常用指令

### macOS/Linux 學員:
```bash
make workshop-start    # 啟動環境
make health           # 檢查狀態
make logs             # 查看 logs
make workshop-reset   # 重置環境
make workshop-stop    # 停止環境
```

### Windows 學員:
```cmd
workshop.bat workshop-start    # 啟動環境
workshop.bat health           # 檢查狀態
workshop.bat logs             # 查看 logs
workshop.bat workshop-reset   # 重置環境
workshop.bat workshop-stop    # 停止環境
```

## 🔍 故障排除

### 問題 1: Docker 無法啟動
```bash
# 檢查 Docker Desktop 是否正在運行
# 重新啟動 Docker Desktop
```

### 問題 2: Port 被占用
```bash
# 檢查 port 使用情況
lsof -i :3000  # macOS/Linux
netstat -an | findstr :3000  # Windows
```

### 問題 3: 容器無法啟動
```bash
# 重置環境
make workshop-reset  # macOS/Linux
workshop.bat workshop-reset  # Windows
```

### 問題 4: 修改沒有生效
1. 確認檔案已儲存
2. 檢查瀏覽器是否重新整理
3. 查看 logs 是否有錯誤
   ```bash
   make logs  # macOS/Linux
   workshop.bat logs  # Windows
   ```

### 問題 5: 分支相關問題
```bash
# 如果切換分支失敗
git fetch origin
git checkout training-20250804-team-pilot1

# 如果分支不存在
# 請聯繫講師確認分支名稱
```

## 📚 下一步

環境設定完成後，請參考：
- [工作坊指南](./workshop-guide/README.md)
- [Docker 設定指南](./docker_setup_guide.md)

## 🎯 成功指標

✅ 看到綠色成功訊息在頁面頂部  
✅ 可以訪問 http://localhost:3000  
✅ 修改程式碼後立即在瀏覽器看到效果  
✅ 可以訪問 http://localhost:8000/docs  

**準備好開始工作坊了嗎？** 🚀 