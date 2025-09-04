# 🚀 Jira Dashboard Workshop

使用 AI 驅動開發工具建構全端應用程式的綜合工作坊

## 給學員的連結

- Slide: https://gamma.app/docs/Agile-AI-AI--nlmavw76yyt3hy8
- 大組共享文件 CheckList: https://docs.google.com/spreadsheets/d/1npVh5Rlljy4S-YNpu5pwD4e6KSmoeO3PXQIhWqxxgmA/edit?usp=sharing
- 資料文件複本: https://docs.google.com/spreadsheets/d/1RmJjghgiV3XWLl2BaxT-md8CP3pqb1Wuk-EhFoqp1VM/edit?usp=sharing

## 📋 系統需求

請確保已安裝：
- **Docker Desktop** (必須)
- **Git** (必須)
- **文字編輯器** (VS Code 推薦)

## 🎯 快速開始 (3 步驟)

### 步驟 1：Clone 專案
```bash
git clone <repository-url>
cd training-jira-dashboard-workshop-base
```

### 步驟 2：啟動環境

**Mac/Linux 使用者：**
```bash
make start
```

**Windows 使用者：**
```cmd
workshop.bat start
```

### 步驟 3：開啟瀏覽器

等待約 10 秒後，訪問：
- 📱 **前端應用**: http://localhost:3000
- 🔧 **.NET API**: http://localhost:8001

## ✅ 測試環境

確認開發環境正常運作：

1. **開啟檔案** `frontend/app/page.tsx`
2. **找到第 9 行**，修改文字：
   ```tsx
   請修改這行文字並 commit 到 GitHub 確認是否能修改！
   ```
3. **儲存檔案** (Ctrl+S 或 Cmd+S)
4. **查看結果**：瀏覽器會自動更新顯示你的修改

## 📝 常用指令 (只需記住 3 個)

| 操作 | Mac/Linux | Windows | 說明 |
|------|-----------|---------|------|
| **啟動** | `make start` | `workshop.bat start` | 開始工作 |
| **停止** | `make stop` | `workshop.bat stop` | 結束工作 |
| **重置** | `make reset` | `workshop.bat reset` | 故障排除 |

## 📂 專案結構

```
training-jira-dashboard-workshop-base/
├── frontend/           # Next.js 前端應用
│   ├── app/           # 頁面路由
│   ├── components/    # React 組件
│   └── hooks/         # 自定義 Hooks
├── backend-dotnet/    # .NET Core API
│   ├── Program.cs    # 主程式
│   └── *.cs          # API 實作
└── docker-compose.yml # Docker 配置
```

## 🔧 進階指令

**查看 logs：**
```bash
# Mac/Linux
make logs

# Windows
workshop.bat logs
```

**健康檢查：**
```bash
# Mac/Linux
make health

# Windows
workshop.bat health
```

**進入容器 (除錯用)：**
```bash
# Mac/Linux
make shell-frontend  # 前端容器
make shell-backend   # 後端容器

# Windows
docker-compose exec frontend sh
docker-compose exec backend-dotnet bash
```

## 🔄 何時需要重啟？

**✅ 即時生效 (無需重啟)：**
- 修改前端檔案 (`.tsx`, `.ts`, `.css`)
- 修改 .NET 後端檔案 (`.cs`)

**🔄 需要重啟：**
- 修改 Docker 相關檔案
- 新增套件依賴
- 修改環境變數

**重啟方式：**
```bash
# 重啟特定服務
docker-compose restart frontend
docker-compose restart backend-dotnet

# 完全重置 (最後手段)
make reset  # 或 workshop.bat reset
```

## 🆘 故障排除

### 問題 1: Port 已被佔用
```bash
# 停止所有容器
docker-compose down

# Mac/Linux 查看佔用 port
lsof -i :3000
lsof -i :8001

# Windows 查看佔用 port
netstat -ano | findstr :3000
netstat -ano | findstr :8001
```

### 問題 2: Docker 未啟動
確保 Docker Desktop 已經啟動並運行

### 問題 3: 環境異常
```bash
# Mac/Linux
make reset

# Windows
workshop.bat reset
```

## 🛠️ 技術棧

### 前端
- **Next.js 15** - React 框架
- **shadcn/ui** - UI 組件庫
- **Tailwind CSS** - CSS 框架
- **TypeScript** - 型別安全

### 後端
- **.NET 8** - Web API 框架
- **Google Sheets** - 資料來源
- **CSV 處理** - 資料格式

## 💡 小提示

1. 前端會自動熱重載，修改後儲存即可
2. .NET 後端使用 `dotnet watch` 自動重新編譯
3. 所有服務的 logs 都可透過 `make logs` 查看
4. 遇到問題先執行 `make health` 檢查狀態

## 延伸閱讀

- [Docker 設定指南](./docs/docker_setup_guide.md)
- [技術架構說明](./docs/tech-overview.md)
- [MVP 產品需求](./docs/mvp-v1/PRD.md)

---

**Happy Coding! 🎉**

準備好了嗎？執行 `make start` 或 `workshop.bat start` 開始你的開發之旅！