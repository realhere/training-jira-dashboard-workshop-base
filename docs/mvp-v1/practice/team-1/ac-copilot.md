# Acceptance Criteria: Sprint 進度視覺化提升團隊危機感

> **檔案編號**: AC-001-sprint-progress-visualization  
> **建立日期**: 2025-09-03  
> **對應 User Stories**: [spec01-us01-sprintprogress.md](../../example/spec01-us01-sprintprogress.md)  
> **參考格式**: [acceptance-criteria-guide.md](../../../guides/acceptance-criteria-guide.md)

## 🎯 文件概述

本文件針對 Sprint 進度視覺化相關的 6 個 User Stories 提供詳細的驗收標準，使用 Gherkin 格式 (Given-When-Then) 確保功能的可測試性和明確性。

---

## 📊 US-001: Sprint 燃盡圖視覺化

**User Story**: 作為 Scrum Master，我希望能在儀表板上看到即時更新的 Sprint 燃盡圖，並根據進度健康狀態顯示不同顏色的進度條和燃盡線，以便在每日站會中快速識別進度是否落後於預期，並引導團隊討論真正的障礙。

### AC01-001: 燃盡圖正常顯示
```gherkin
場景：Scrum Master 查看燃盡圖
Given 使用者已登入系統
And 當前有進行中的 Sprint
And Sprint 包含已分配的 Story Points
When 使用者進入 Dashboard 頁面
Then 系統應顯示 Sprint 燃盡圖
And 燃盡圖應包含理想燃盡線（直線遞減）
And 燃盡圖應包含實際燃盡線（根據每日完成進度）
And X 軸應顯示 Sprint 工作日（Day 1 到 Day N）
And Y 軸應顯示剩餘 Story Points
```

### AC01-002: Sprint 完成率視覺化
```gherkin
場景：顯示 Sprint 完成率指標
Given 當前 Sprint 總計 20 Story Points
And 已完成 13 Story Points
When 使用者查看燃盡圖區域
Then 系統應在燃盡圖上方顯示完成率進度條
And 進度條應顯示 "65% 完成"
And 應顯示 "已完成: 13 SP | 剩餘: 7 SP | 總計: 20 SP"
And 進度條填充比例應為 65%
```

### AC01-003: 健康狀態顏色編碼
```gherkin
場景：進度正常時的綠色顯示
Given Sprint 進度符合或超前理想進度
When 系統計算進度健康狀態
Then 進度條應顯示為綠色
And 實際燃盡線應顯示為綠色
And 右上角應顯示綠色 "健康" 標籤

場景：進度稍微落後的黃色警示
Given Sprint 進度落後理想進度 10-20%
When 系統計算進度健康狀態
Then 進度條應顯示為黃色
And 實際燃盡線應顯示為黃色
And 右上角應顯示黃色 "注意" 標籤

場景：進度嚴重落後的紅色警示
Given Sprint 進度落後理想進度超過 20%
When 系統計算進度健康狀態
Then 進度條應顯示為紅色
And 實際燃盡線應顯示為紅色
And 右上角應顯示紅色 "危險" 標籤
```

### AC01-004: 資料即時更新
```gherkin
場景：燃盡圖資料即時同步
Given Google Sheets 中有新的任務狀態更新
When 系統快取時間超過 5 分鐘
And 使用者重新整理頁面
Then 燃盡圖應反映最新的完成進度
And 完成率百分比應即時更新
And 健康狀態顏色應根據新進度調整
```

---

## ⚠️ US-002: 進度落後視覺警示

**User Story**: 作為開發團隊成員，我希望當 Sprint 進度明顯落後時能看到明顯的視覺警示（進度條和燃盡線變為黃色或紅色），以便我能及時感受到時程壓力並主動調整工作優先級。

### AC02-001: 黃色警示觸發條件
```gherkin
場景：進度輕微落後觸發黃色警示
Given 今天是 Sprint 第 5 天（共 10 天）
And 理想進度應完成 50% Story Points
And 實際僅完成 35% Story Points（落後 15%）
When 系統評估進度健康狀態
Then 進度條應變為黃色
And 燃盡線應變為黃色
And 應顯示黃色警示圖示
And 健康狀態標籤應顯示 "⚠️ 注意"
```

### AC02-002: 紅色警示觸發條件
```gherkin
場景：進度嚴重落後觸發紅色警示
Given 今天是 Sprint 第 8 天（共 10 天）
And 理想進度應完成 80% Story Points
And 實際僅完成 55% Story Points（落後 25%）
When 系統評估進度健康狀態
Then 進度條應變為紅色
And 燃盡線應變為紅色
And 應顯示紅色警示圖示
And 健康狀態標籤應顯示 "🚨 危險"
```

### AC02-003: 警示狀態恢復
```gherkin
場景：進度追上後警示解除
Given 目前顯示紅色警示狀態
And 團隊加速完成多個任務
And 實際進度重新接近理想進度
When 系統重新計算健康狀態
Then 警示顏色應從紅色變為黃色或綠色
And 健康狀態標籤應相應更新
And 視覺警示效果應移除
```

---

## ⏰ US-003: Sprint 時間進度計時器

**User Story**: 作為團隊成員，我希望能看到 Sprint 的時間進度計時器（如：Day 7/10，剩餘 3 個工作日），以便直觀感受到時間的流逝，增強對截止日期的緊迫感。

### AC03-001: 時間進度正常顯示
```gherkin
場景：顯示 Sprint 時間進度
Given 當前 Sprint 開始日期為 2025-09-01
And Sprint 結束日期為 2025-09-15（10 個工作日）
And 今天是 2025-09-09（第 7 個工作日）
When 使用者查看完成率卡片
Then 卡片底部應顯示 "已過天數: 7"
And 應顯示 "剩餘天數: 3"
And 應顯示 "總工作日: 10"
And 時間進度應以易讀格式呈現
```

### AC03-002: 工作日計算邏輯
```gherkin
場景：正確計算工作日（排除週末）
Given Sprint 開始日期為週一
And Sprint 跨越 2 個完整週（包含 4 個週末天）
And Sprint 總共 14 個日曆天
When 系統計算工作日
Then 總工作日應顯示為 10 天
And 週末日期不應計入工作日
And 計時器應僅基於工作日計算
```

### AC03-003: 時間緊迫感視覺化
```gherkin
場景：接近截止日期時的視覺提醒
Given 剩餘工作日少於 2 天
When 使用者查看時間進度
Then 剩餘天數應以紅色字體顯示
And 應添加閃爍或醒目的視覺效果
And 可考慮添加 "⚡ 最後衝刺" 圖示
```

### AC03-004: 即時時間更新
```gherkin
場景：跨日時時間自動更新
Given 昨天顯示 "已過天數: 6, 剩餘天數: 4"
When 系統時間跨越到新的工作日
And 使用者重新進入頁面
Then 應自動更新為 "已過天數: 7, 剩餘天數: 3"
And 不需要手動刷新頁面
```

---

## 📊 US-004: 進度與時間對比儀表

**User Story**: 作為產品經理，我希望能看到「時間消耗百分比」與「工作完成百分比」的對比儀表盤，以便快速判斷當前進度是否健康，並在必要時及時介入調整。

### AC04-001: 雙重進度對比顯示
```gherkin
場景：顯示時間與工作進度對比
Given Sprint 總共 10 個工作日
And 已過 7 個工作日（時間消耗 70%）
And 已完成 13/20 Story Points（工作完成 65%）
When 使用者查看進度對比儀表
Then 應顯示時間進度條：70%
And 應顯示工作進度條：65%
And 應清楚標示 "時間消耗: 70%" 和 "工作完成: 65%"
And 兩個進度條應並排或上下排列便於比較
```

### AC04-002: 健康度判斷邏輯
```gherkin
場景：進度健康（工作進度 ≥ 時間進度）
Given 時間消耗 60%，工作完成 65%
When 系統計算進度健康度
Then 儀表盤應顯示綠色健康指示
And 應顯示 "✅ 進度正常" 訊息
And 可顯示 "+5% 超前進度" 等額外資訊

場景：進度警示（工作進度略低於時間進度）
Given 時間消耗 70%，工作完成 60%
When 系統計算進度健康度
Then 儀表盤應顯示黃色警示指示
And 應顯示 "⚠️ 需要注意" 訊息
And 可顯示 "-10% 落後進度" 等風險提示

場景：進度危險（工作進度明顯低於時間進度）
Given 時間消耗 80%，工作完成 55%
When 系統計算進度健康度
Then 儀表盤應顯示紅色危險指示
And 應顯示 "🚨 需要介入" 訊息
And 可顯示 "-25% 嚴重落後" 等緊急提示
```

### AC04-003: 視覺化設計要求
```gherkin
場景：儀表盤視覺設計驗證
Given 使用者查看進度對比儀表
When 頁面完全載入
Then 時間進度條和工作進度條應使用不同顏色區分
And 應有清楚的圖例說明每個進度條的含義
And 百分比數字應足夠大且清晰可讀
And 健康度指示應醒目且直觀
```

---

## 🔄 US-005: Sprint 資料即時同步

**User Story**: 作為技術主管，我希望 Sprint 進度資料能從 Google Sheets 即時同步更新，以便團隊看到的進度資訊始終是最新的，避免基於過時資料做出錯誤判斷。

### AC05-001: 資料自動同步機制
```gherkin
場景：定期自動同步 Google Sheets 資料
Given Google Sheets 中有新的任務狀態更新
And 上次資料同步時間超過 5 分鐘
When 使用者進入或刷新 Dashboard 頁面
Then 系統應自動從 Google Sheets 獲取最新資料
And 燃盡圖應反映新的完成狀態
And 完成率百分比應即時更新
And 頁面不應有明顯的載入延遲（<3 秒）
```

### AC05-002: 資料同步狀態指示
```gherkin
場景：顯示資料最後更新時間
Given 資料已成功從 Google Sheets 同步
When 使用者查看 Dashboard
Then 頁面應顯示 "最後更新: YYYY-MM-DD HH:mm:ss"
And 更新時間應位於顯眼但不干擾的位置
And 如果同步失敗，應顯示警示訊息
```

### AC05-003: 離線或同步失敗處理
```gherkin
場景：Google Sheets 無法存取時的錯誤處理
Given Google Sheets API 暫時無法存取
When 系統嘗試同步資料
Then 應顯示 "⚠️ 資料同步失敗，顯示快取資料" 訊息
And 應繼續顯示上次成功同步的資料
And 應提供 "重新同步" 按鈕供使用者手動重試
And 不應導致頁面崩潰或空白
```

### AC05-004: 快取機制驗證
```gherkin
場景：5分鐘快取機制正常運作
Given 資料在 3 分鐘前已同步
When 使用者重新整理頁面
Then 系統應使用快取資料，不重新請求 Google Sheets
And 頁面載入應快速（<1 秒）
And "最後更新" 時間應維持 3 分鐘前的時間戳

場景：快取過期後自動更新
Given 資料在 6 分鐘前已同步（超過 5 分鐘快取時間）
When 使用者重新整理頁面
Then 系統應重新從 Google Sheets 獲取資料
And "最後更新" 時間應更新為當前時間
And 所有進度資料應反映最新狀態
```

---

## 🎯 US-006: 站會前進度快速掃描

**User Story**: 作為 Scrum Master，我希望能在站會開始前快速掃描儀表板，瞭解哪些項目需要重點討論，以便讓站會聚焦在真正的障礙上，而不是例行的進度報告。

### AC06-001: 重點關注項目識別
```gherkin
場景：識別需要重點討論的項目
Given Sprint 中有多個任務處於不同狀態
And 某些任務在 "In Progress" 狀態超過 3 天
And 某些高優先級任務尚未開始
When Scrum Master 查看站會準備摘要
Then 系統應突出顯示停滯過久的任務
And 應標示高優先級但未開始的任務
And 應提供 "⚠️ 需要討論" 的視覺標籤
```

### AC06-002: 快速掃描介面設計
```gherkin
場景：站會準備區域的資訊呈現
Given Scrum Master 需要快速了解當前狀況
When 查看站會準備區域（可能在 Dashboard 側邊或專區）
Then 應以清單形式顯示需要關注的項目
And 每個項目應包含：任務標題、負責人、狀態、停滯天數
And 應使用顏色編碼區分緊急程度（紅/黃/綠）
And 整個區域應能在 10 秒內快速掃描完畢
```

### AC06-003: 障礙識別邏輯
```gherkin
場景：自動識別潛在障礙
Given 任務在 "In Progress" 狀態超過預期時間
Or 任務在 "Ready to Verify" 狀態超過 1 天
Or 高優先級任務在 "To Do" 狀態超過 2 天
When 系統執行障礙識別演算法
Then 應將這些任務標記為 "潛在障礙"
And 應提供簡短的原因說明（如 "停滯 3 天"）
And 應建議在站會中討論這些項目
```

### AC06-004: 站會效率提升驗證
```gherkin
場景：快速掃描功能的實用性驗證
Given Scrum Master 在站會前使用快速掃描功能
When 站會進行中討論這些預先識別的重點項目
Then 應能有效引導團隊聚焦在真正的障礙
And 減少例行性的進度報告時間
And 提高站會的問題解決效率
And 團隊成員應能更主動地提出協助或解決方案
```

---

## 🧪 整體測試策略

### 端到端測試場景
```gherkin
場景：完整 Sprint 進度追蹤流程
Given 新的 Sprint 開始，包含 20 Story Points
When 團隊在 10 天內逐步完成任務
Then 燃盡圖應正確反映每日進度變化
And 健康狀態顏色應根據進度適時調整
And 時間計時器應每日更新
And 站會準備功能應識別出真正的障礙
And 所有視覺化元件應保持同步更新
```

### 效能測試要求
- 頁面載入時間 < 3 秒
- 資料同步響應時間 < 5 秒
- 圖表渲染時間 < 2 秒
- 支援同時 50+ 用戶存取

### 相容性測試範圍
- 瀏覽器：Chrome, Firefox, Safari, Edge（最新 2 個版本）
- 裝置：桌面、平板、手機（響應式設計）
- 螢幕解析度：1920x1080, 1366x768, 414x896

---

## 📝 附註與限制

### 技術限制考量
1. **Google Sheets API 限制**：每 5 分鐘同步一次，無法做到真正即時
2. **瀏覽器快取**：可能影響資料更新的即時性
3. **網路連線**：離線時僅能顯示快取資料

### 業務邏輯假設
1. **工作日計算**：僅包含週一至週五，排除週末和國定假日
2. **健康度閾值**：可能需要根據團隊實際情況調整百分比標準
3. **Story Points 計算**：基於 rawData 表格中的 Story Points 欄位

### 未來擴展考量
- 支援多個並行 Sprint
- 整合團隊行事曆系統
- 自訂警示閾值設定
- 歷史 Sprint 對比分析

---

## 🔗 相關文件

| 文件 | 用途 |
|------|------|
| [spec01-us01-sprintprogress.md](../../example/spec01-us01-sprintprogress.md) | 原始 User Stories |
| [acceptance-criteria-guide.md](../../../guides/acceptance-criteria-guide.md) | AC 撰寫指引 |
| [table-schema.md](../../../table-schema.md) | 資料結構定義 |
| [tech-overview.md](../../../tech-overview.md) | 技術架構說明 |

---

**建立者**: GitHub Copilot Assistant  
**審核者**: Team 1  
**最後更新**: 2025-09-03
