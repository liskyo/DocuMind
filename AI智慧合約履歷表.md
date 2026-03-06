# 專案經歷：DocuMind - AI 智慧合約審閱與風險分析系統

## 💡 亮點技術 (Key Technologies)
**`Generative AI (Google Gemini)`** **`RAG (Retrieval-Augmented Generation)`** **`Python FastAPI`** **`React`** **`Prompt Engineering`**

---

## 📝 專案描述 (Project Summary)
開發一套基於 **LLM (Large Language Model)** 的智慧合約審閱系統，解決傳統人工審閱合約耗時且易遺漏風險痛點。系統能自動解析 PDF/Word 合約，識別潛在法律風險條款，並結合 **RAG (檢索增強生成)** 技術，讓使用者能針對特定合約內容進行問答。

---

## 🚀 專業貢獻與技術細節 (Key Contributions)

### 1. 構建 GenAI 驅動的核心分析引擎 (Back-end & AI)
*   **整合 Google Gemini Pro 模型**：設計多階段 **Prompt Engineering (提示工程)** 流程，將合約分析拆解為「風險掃描」、「條款重寫」與「法律諮詢」三大模組，顯著提升模型輸出的穩定性與 JSON 格式正確率。
*   **實作 RAG (檢索增強生成)**：解決 LLM 對於長篇合約的 Context Window 限制與幻覺問題。將合約文本切塊 (Chunking) 並動態檢索相關段落，使 AI 能精準回答 "這份合約中關於賠償上限的規定為何？" 等具體問題。
*   **高效能 API 開發**：使用 **FastAPI (Python)** 打造非同步 RESTful API，支援文件串流上傳與即時分析回饋，並透過優化非同步處理 (Async/Await) 提升高併發下的回應速度。

### 2. 打造現代化互動式前端 (Front-end)
*   **React + Vite 高效開發**：採用 **React 18** 搭配 **Vite** 建構 SPA (單頁應用)，實現秒級熱更新 (HMR) 開發體驗，並確保產物最佳化。
*   **直覺式資料視覺化**：設計 **RiskMonitor** 元件，將 AI 判讀的風險等級 (High/Medium/Low) 以動態儀表板呈現；實作 **Deep Diff** 邏輯，直觀比對「原條款」與 AI 建議的「修正條款」差異。
*   **響應式與質感設計**：使用 **TailwindCSS** 實作 Dark Mode (深色模式) 與 Glassmorphism (毛玻璃) 介面風格，結合 **Framer Motion** 增加微互動動畫，大幅提升 B2B 工具的使用者體驗 (UX)。

### 3. CI/CD 與系統整合
*   **跨環境部署策略**：編寫自動化腳本 (`run.bat`) 整合 Python 虛擬環境與 Node.js 依賴檢查，實現 Windows 環境下的一鍵部署與啟動，降低非技術人員的試用門檻。
*   **文件處理自動化**：整合 `pypdf` 與 `python-docx`，實現從「讀取原始檔」到「生成修正後 Word 檔」的全自動化 Pipeline，保留原始文件格式。

---

## 🏆 具體成果 (Achievements)
*   成功將合約初審時間由平均 **30 分鐘縮短至 3 分鐘**，效率提升 **90%**。
*   實現 **RAG 架構**，使 AI 回答合約細節的準確度大幅提升，有效降低非法律專業人員的誤判風險。
*   獨立完成從 **System Design**、**Prompt Tuning** 到 **Full Stack Implementation** 的完整開發週期。
