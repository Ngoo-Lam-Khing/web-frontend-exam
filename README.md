# 前端工程師職缺平台

一個以 React 開發的職缺瀏覽平台，提供條件篩選、分頁瀏覽及職缺詳情查看功能，並具備互動式 Banner 角色眼球跟隨效果。
瀏覽示範網址: [https://ngoo-lam-khing.github.io/web-frontend-exam/](https://ngoo-lam-khing.github.io/web-frontend-exam/)

---

## 技術棧

| 類別       | 技術                      |
| ---------- | ------------------------- |
| 框架       | React 18 + TypeScript     |
| 建構工具   | Vite                      |
| 套件管理   | Bun                       |
| UI 元件庫  | Material UI (MUI)         |
| 資料請求   | TanStack React Query v5   |
| API Mock   | MSW (Mock Service Worker) |
| 輪播元件   | Swiper                    |
| HTML 淨化  | DOMPurify                 |
| 工具函式庫 | react-use                 |

---

## 如何執行此專案

### 環境需求

- [Bun](https://bun.sh/) >= 1.0

### 安裝與啟動

```bash
# 安裝依賴
bun install

# 啟動開發伺服器（MSW 會自動在瀏覽器中攔截 API 請求）
bun dev
```

開啟瀏覽器前往 [http://localhost:5173](http://localhost:5173)

### 建置

```bash
bun run build
```

---

## 專案架構

```
src/
├── assets/                  # 靜態圖片資源（mobile / desktop 兩套）
├── components/              # UI 元件
│   ├── Banner.tsx           # 頂部 Banner，含眼球跟隨動畫
│   ├── Filter.tsx           # 條件篩選列
│   ├── Select.tsx           # 通用下拉選單元件
│   ├── JobCard.tsx          # 職缺卡片
│   ├── JobCardSkeleton.tsx  # 職缺卡片載入中骨架屏
│   ├── JobDialog.tsx        # 職缺詳情對話框
│   └── JobDialogSkeleton.tsx
├── composables/             # 自訂 Hook
│   ├── useJobs.ts           # 職缺列表資料請求（含分頁、篩選）
│   ├── useJobDetail.ts      # 職缺詳情資料請求
│   ├── useFetchList.ts      # 教育程度 / 薪資範圍靜態列表請求
│   └── useEye.ts            # 眼球跟隨滑鼠偏移計算
├── context/
│   └── FilterListContext.tsx # 教育 / 薪資 列表全域狀態
├── mocks/                   # MSW mock 定義
│   ├── handlers.ts
│   └── browser.ts
├── types/
│   └── index.ts             # 全域 TypeScript 型別定義
├── App.tsx
└── main.tsx
```

---

## 邏輯說明

### 資料請求策略

職缺列表（`useJobs`）使用 TanStack React Query，queryKey 包含 `page`、`pageSize` 及所有篩選條件，搭配 `keepPreviousData` 在換頁時保留舊資料，避免畫面閃爍。`staleTime` 設為 5 分鐘，靜態列表（教育程度、薪資範圍）則設為 `Infinity`，只在第一次載入時發送請求。

### Skeleton 顯示邏輯

利用 `isFetching` 與 `isPlaceholderData` 的組合區分三種載入情境：

- **第一次載入**：`isFetching === true` 且 `data === undefined` → 顯示 Skeleton
- **新篩選條件無快取**：`isFetching === true` 且 `isPlaceholderData === true` 且使用者剛觸發搜尋 → 顯示 Skeleton
- **換頁有快取**：`isFetching === true` 但 `isPlaceholderData === false` → 不顯示 Skeleton，Pagination 保持可見

`isFilterChanged` 這個 state 用來區分「換頁」與「新篩選條件」兩種觸發來源。

### 眼球跟隨效果

`useEye.ts` 透過 `react-use` 的 `useMouse` 取得滑鼠在文件中的座標，計算滑鼠相對眼球中心的偏移量，經 normalize、`easeOutQuad` 非線性緩動後，mapping 至各眼睛設定的位移範圍（xMin/xMax/yMin/yMax），讓左右眼有不同的移動幅度，更接近自然視覺效果。

為避免每次 render 傳入新的 range 物件導致 `useMemo` 失效，range 常數定義在 `Banner.tsx` 的 module 層級。

### 全域篩選列表 Context

`FilterListContext` 統一管理教育程度與薪資範圍列表，並預先計算 `educationLabelMap` 與 `salaryLabelMap`，供 `App.tsx` 做職缺卡片的 label 轉換，以及 `Filter.tsx` 渲染下拉選單，避免 prop drilling 跨越三層元件。

---

## 遇到的困難與解決方法

### 1. 篩選條件不變情況下且換新頁 導致 `Pagination` 會顯示 `Skeletong` 動畫

**問題**：篩選條件不變時，點擊新頁碼，發送api，會導致 `Pagination`顯示載入動畫，即使總頁數不變。

**解法**：改用 `JobsFetching` 搭配自訂 `page === 1` 區分「換頁」與「新篩選條件」，確保只要篩選條件改變，
會觸發 `handleSearch` 並觸發 `SetPage(1)`，代表`jobs`已經是不同清單資料，必須顯示載入動畫：

- 換頁 → 不顯示 Skeleton（Pagination 保持可操作）
- 新篩選條件無快取 → 顯示 Skeleton

---

### 2. `useEyeOffset` 的 range 物件每次 render 重新建立

**問題**：`Banner.tsx` 每次 render 時傳入新的物件字面量作為 range，導致 `useEyeOffset` 內的 `useMemo` dependency 每次都不同，等同沒有快取，造成不必要的重複計算。

**解法**：將 range 常數提升至 module 層級定義，確保參考穩定。

---

### 3. json-server 改為 MSW

**問題**：json-server 需要額外啟動 server 程序，且在 Vite 環境下需設定 proxy，部署時也需要額外處理。

**解法**：改用 MSW（Mock Service Worker），在瀏覽器 Service Worker 層攔截請求，不需要額外程序，開發與建置流程統一，且支援完整的 Request/Response 控制，方便模擬分頁、篩選等複雜 API 行為。

---

### 4. dangerouslySetInnerHTML XSS 風險

**問題**：職缺詳情的 `description` 欄位為後端回傳的 HTML 字串，直接渲染存在 XSS 風險。

**解法**：引入 DOMPurify，在渲染前對 HTML 做 sanitize，移除潛在的惡意腳本，僅保留安全的 HTML 標籤與屬性。

---

### 5. Filter 重複送出請求

**問題**：在 API 請求進行中，使用者可以繼續操作 Filter 並再次送出搜尋，造成多次請求競爭、UI 頻繁更新。

**解法**：將 `jobsFetching` 作為 `disabled` prop 傳入 `Filter`，在 fetch 進行中鎖住所有輸入欄位與搜尋按鈕，等待回應完成後才允許再次操作。
