@echo off
chcp 65001 > nul
title DocuMind Launcher
echo ==================================================
echo       DocuMind AI Contract System Launcher
echo ==================================================
echo.

:: Add custom Node path
set PATH=%PATH%;C:\Users\sky.lo\node

:: Check for Node.js
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] 尚未偵測到 Node.js (npm)！
    echo.
    echo 這是執行前端介面所必須的。
    echo 請前往以下網址下載並安裝 "LTS" 版本：
    echo https://nodejs.org/
    echo.
    echo ★重要★ 安裝完成後，請務必「完全關閉並重新開啟」VS Code 或終端機，設定才會生效。
    echo.
    pause
    exit /b
)

:: Check for Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] 尚未偵測到 Python！
    echo 請安裝 Python 3.9+ 並確保已加入環境變數 (PATH)。
    pause
    exit /b
)

echo [1/2] 正在啟動後端伺服器 (Backend)...
echo 視窗將會在背景開啟...
start "DocuMind Backend" cmd /k "cd backend && python -m uvicorn app:app --host 127.0.0.1 --port 8000"

echo [2/2] 正在檢查並啟動前端 (Frontend)...
cd frontend

if not exist "node_modules" (
    echo 首次執行，正在安裝依賴套件 (npm install)...
    call npm install
)

echo 啟動 Vite 開發伺服器...
echo.
call npm run dev
