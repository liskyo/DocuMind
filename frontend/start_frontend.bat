@echo off
chcp 65001 > nul
echo 正在設定 Node.js 環境變數...
set PATH=%PATH%;C:\Users\sky.lo\node

echo 正在檢查 Node.js 版本...
node -v
echo.

if not exist "node_modules" (
    echo 首次執行，正在安裝依賴套件...
    call npm install
)

echo 啟動前端伺服器...
call npm run dev
pause
