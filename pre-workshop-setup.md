# Agile × AI 工作坊 - 驗證與 AI 應用
## 📋 行前通知與環境準備

### 🎯 課程資訊
- **日期**：2025-09-04
- **時間**：09:30 - 17:00 (含中午休息)
- **課程目標**：體驗完整的 AI 協作開發流程，從想法到產品的快速驗證

---

## 🔧 環境準備 (各組分工)

### 🎯 重要：各組至少需要 2 台電腦完成環境設定

**分工建議**：
- **Team Lead / Scrum Master**：協調溝通、流程引導（請自組織選出）
- **PM組**：負責需求文件撰寫、擔任 Stakeholder 角色
- **Dev組**：負責開發實作、測試執行、環境設定


### 1. 安裝 Docker Desktop ⭐ **各組 2 台電腦**

**安裝步驟**：
- 下載連結：https://www.docker.com/products/docker-desktop/
- 選擇對應的作業系統版本 (Windows/Mac/Linux)
- 安裝完成後啟動應用程式
- **重要**：選擇 **"Docker Personal"** 模式 (免費)
- 確認可以看到 Docker Desktop 主介面且狀態顯示 **"Engine running"**

**驗證安裝**：
```bash
# 打開終端機/命令提示字元，執行以下指令
docker --version
# 應該看到類似：Docker version 24.0.x

docker run hello-world
# 應該看到 "Hello from Docker!" 訊息
```

### 2. Git 環境設定 ⭐ **各組 2 台電腦**

**確認 Git 安裝**：
```bash
git --version
# 如果未安裝，請到 https://git-scm.com/ 下載安裝
# 可請同組工程師協助
```

### 3. 程式編輯器準備 ⭐ **各組 2 台電腦**

**推薦使用 Visual Studio Code**：
- 下載連結：https://code.visualstudio.com/
- 安裝 GitHub Copilot 擴充套件 (如有授權)
- 確認可以正常開啟資料夾
- 重點是能夠編輯程式碼和 Markdown 文件

### 4. AI 工具準備 ⭐ **建議所有學員**

**Google Gemini**：
- 確認可以正常存取：https://gemini.google.com/

**GitHub Copilot** (選用)：
- 從 VS Code Extensions 安裝 GitHub Copilot 擴充套件

---

## 🏗️ 專案環境說明

### Repository 分配
- **各組將有獨立的 GitHub Repository**，避免開發衝突
- **起始開發分支：`mvp-v1`** ⚠️ 請勿使用 main 分支
- Repository 連結將在**課程當天**提供給各組

---

## ✅ 課前檢查清單

### 各組環境負責人 (必須完成)
- [ ] 確認組內至少 2 台電腦有 10GB+ 可用磁碟空間：
  - [ ] Docker Desktop 已安裝並選擇 Personal 模式
  - [ ] 執行 `docker --version` 顯示版本號
  - [ ] 執行 `docker run hello-world` 成功
  - [ ] Git 已安裝並設定使用者資訊
  - [ ] 程式編輯器已安裝 (推薦 VS Code)
  - [ ] GitHub Copilot 已安裝至 VS Code
  - [ ] 可以正常存取 Google Gemini

### 硬體需求
- [ ] 筆記型電腦電力充足
- [ ] 確認網路連線穩定
- [ ] 負責環境的電腦可用磁碟空間 >= 10GB (Docker 映像檔需求)

### 重要說明：

此次課程為了讓大家專注在 Agile × AI 協作體驗，因而選用 Docker 作為統一開發環境。請確保您的電腦有 10GB 以上的可用磁碟空間。課程結束後，所有 Docker 映像檔和容器都可以完全移除，不會佔用您的長期儲存空間。

---

