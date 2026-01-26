# AI智慧合約審閱系統 (DocuMind)

這是一個利用 AI (Gemini Pro) 進行自動化合約風險掃描與審閱的系統。包含前端儀表板與後端分析服務。

## 專案結構

- `backend/`: Python FastAPI 後端
- `frontend/`: React + Vite 前端

## 安裝與執行說明

### 前置需求
- Python 3.9+
- Node.js 16+
- Google Gemini API Key

### 1. 設定後端 (Backend)

1. 進入 `backend` 資料夾：
   ```bash
   cd backend
   ```
2. 安裝 Python 套件：
   ```bash
   pip install -r requirements.txt
   ```
3. 設定環境變數：
   - 在 `backend` 資料夾中建立 `.env` 檔案
   - 填入內容：`GEMINI_API_KEY=你的API_KEY_1,你的API_KEY_2,你的API_KEY_3` (支援多組 Key 以逗號分隔，系統將隨機輪播)
4. 啟動伺服器：
   ```bash
   python app.py
   ```
   伺服器將在 `http://localhost:8000` 啟動。

### 2. 設定前端 (Frontend)

1. 進入 `frontend` 資料夾 (開啟新終端機)：
   ```bash
   cd frontend
   ```
2. 安裝 Node 套件：
   ```bash
   npm install
   ```
3. 啟動開發伺服器：
   - **方法 A (推薦)**: 直接雙擊執行 `start_frontend.bat` (會自動設定環境變數)。
   - **方法 B (手動)**:
     ```bash
     npm run dev
     ```
   前端將在 `http://localhost:5173` 啟動。

## 功能介紹

- **風險掃描 Risk Scanner**: 上傳合約，AI 自動標註紅綠燈風險等級。
- **條款重寫 The Rewriter**: 針對高風險條款，一鍵生成修改建議 (強硬/平衡/溫和)。
- **RAG 問答**: 針對合約內容進行 AI 問答。

## 專案亮點

- **Premium UI**: 類似 StockWinner 的暗色系高質感儀表板。
- **Interactive**: 動態動畫與即時互動。
- **Diff View**: 直觀的修改前後對比。
