# Acceptance Criteria: US001 Sprint 燃盡圖視覺化與進度警示

> **檔案編號**: AC-001-sprint-burndown-visualization  
> **建立日期**: 2025-08-18  
> **最後更新**: 2025-08-28  
> **狀態**: 已實現  
> **對應 User Story**: [US001](./spec01-us01-sprintprogress.md#us-001-sprint-燃盡圖視覺化)  
> **對應 Feature Spec**: [SPEC-001-sprint-progress-visualization](./spec01-progress-v2.md)

## 📋 User Story 回顧

**US001**: 作為 Scrum Master，我希望能在儀表板上看到即時更新的 Sprint 燃盡圖，並根據進度健康狀態顯示不同顏色的進度條和燃盡線，以便在每日站會中快速識別進度是否落後於預期，並引導團隊討論真正的障礙。

## 🎯 驗收標準 (Acceptance Criteria)

### AC01: Sprint 燃盡圖正常顯示與健康狀態

```gherkin
場景：Scrum Master 查看正常進度的 Sprint
Given 有一個正在進行的 Sprint
And 實際進度符合或超前理想進度
When Scrum Master 進入儀表板頁面
Then 應顯示完整的 Sprint 燃盡圖
And 燃盡圖顯示灰色虛線理想線
And 燃盡圖顯示綠色實際線（僅到當前工作日）
And 進度條顯示綠色
And 右上角顯示綠色 "正常進度" 健康狀態
And 顯示完成率百分比和故事點數統計
```

---

### AC02: 進度落後時的黃色警示狀態

```gherkin
場景：Sprint 進度稍微落後的警示
Given 有一個正在進行的 Sprint
And 實際進度落後理想進度 10-25% 之間
When Scrum Master 查看儀表板
Then 進度條應顯示黃色
And 右上角健康狀態 badge 顯示黃色 "稍微落後"
And 燃盡圖實際線應為黃色
And 系統提供適當的警示提醒
```

---

### AC03: 嚴重落後時的紅色危險警示

```gherkin
場景：Sprint 進度嚴重落後的危險警示
Given 有一個正在進行的 Sprint
And 實際進度落後理想進度 25% 以上
When Scrum Master 查看儀表板
Then 進度條應顯示紅色
And 右上角健康狀態 badge 顯示紅色 "嚴重落後"
And 燃盡圖實際線應為紅色
And 系統提供明顯的危險警示
```

---

### AC04: 燃盡圖時間邊界正確處理

```gherkin
場景：實際燃盡線只顯示到當前工作日
Given Sprint 為期 10 個工作日
And 今天是第 8 個工作日
When 系統生成燃盡圖資料
Then 理想線應顯示完整的 Day 1 到 Day 10
And 實際線應只顯示 Day 1 到 Day 8 的數據
And Day 9 和 Day 10 不應有實際數據點
And hover 未來日期時應顯示 "實際剩餘: 未來日期"
```

---

### AC05: 空資料或無效資料處理

**場景：** Google Sheets 資料為空或無效時的錯誤處理

```gherkin
Given Scrum Master 進入儀表板
When Google Sheets 中沒有 Sprint 資料
Or 總故事點數為 0
Or 無法連接到 Google Sheets
Then 應顯示友善的錯誤訊息 "無法載入 Sprint 資料，請檢查資料來源"
And 燃盡圖區域顯示占位符
And 完成率顯示 "資料載入中..."
And 提供重新載入按鈕
```

---

### AC06: Sprint 時間邊界處理

**場景：** Sprint 開始第一天的顯示

```gherkin
Given 今天是 Sprint 的第 1 天
And 尚未有任何完成的故事點數
When Scrum Master 查看儀表板
Then 完成率應顯示 "0% 完成"
And 燃盡圖應只顯示理想線的起始點
And 實際線應從起始點開始
And 進度條應為空白狀態
```

**場景：** Sprint 最後一天的顯示

```gherkin
Given 今天是 Sprint 的最後一天
And 已完成 18 SP，剩餘 2 SP
When Scrum Master 查看儀表板
Then 完成率應顯示 "90% 完成"
And 應顯示剩餘工作提醒 "剩餘 2 SP 待完成"
And 如果進度落後應顯示明顯的風險警示
```

---

### AC07: 燃盡圖資料點精確性

**場景：** 燃盡圖資料點的準確計算

```gherkin
Given Sprint 為期 10 天
And 總故事點數為 20 SP
And 每天都有進度更新
When 系統計算理想燃盡線
Then 第 1 天應為 20 SP
And 第 5 天應為 10 SP
And 第 10 天應為 0 SP
And 理想線應為直線遞減

When 系統計算實際燃盡線
Then 每個資料點應對應該日的累積完成故事點數
And 實際線應準確反映每日的進度變化
And 週末或非工作日應正確處理（不計入工作天數）
```

---

## 🔗 與其他 User Stories 的關聯

| 相關 US | 關聯點 | 注意事項 |
|---------|--------|----------|
| US-002 | 視覺警示功能 | 確保警示邏輯一致 |
| US-003 | 時間計算 | 共用 Sprint 時間邏輯 |
| US-005 | 資料同步 | 依賴即時資料更新 |

---

## 📝 變更記錄

| 日期       | 版本 | 變更內容 | 變更人 |
| ---------- | ---- | -------- | ------ |
| 2025-08-18 | 1.0  | 初版建立，基於 US-001 需求設計完整的驗收標準 | PM Team |
| 2025-08-28 | 1.1  | 更新實現狀態，確認核心 AC 項目已完成 | Dev Team |
| 2025-08-28 | 2.0  | 同步新版 Feature Spec，簡化 AC 描述專注行為邏輯 | Dev Team |

## 🔗 相關文件

- **User Story**: [`spec01-us01-sprintprogress.md`](./spec01-us01-sprintprogress.md)
- **Feature Spec**: [`spec01-progress-v2.md`](./spec01-progress-v2.md)
- **下一階段**: Test Cases（待建立）
