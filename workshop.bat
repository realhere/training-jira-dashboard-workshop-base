@echo off
setlocal enabledelayedexpansion

REM Jira Dashboard Workshop - Windows 批次檔案
REM 提供與 Makefile 相同的功能

if "%1"=="" goto help
if "%1"=="help" goto help
if "%1"=="workshop-start" goto workshop-start
if "%1"=="workshop-stop" goto workshop-stop
if "%1"=="workshop-reset" goto workshop-reset
if "%1"=="health" goto health
if "%1"=="logs" goto logs
if "%1"=="ps" goto ps
if "%1"=="test" goto test
if "%1"=="test-frontend" goto test-frontend
if "%1"=="test-backend" goto test-backend
if "%1"=="shell-frontend" goto shell-frontend
if "%1"=="shell-backend" goto shell-backend
if "%1"=="logs-backend" goto logs-backend
if "%1"=="start" goto workshop-start
if "%1"=="stop" goto workshop-stop
if "%1"=="reset" goto workshop-reset
goto unknown

:help
echo 🐳 Jira Dashboard Workshop - Windows 指令
echo.
echo 可用指令:
echo   workshop-start  - 啟動所有服務
echo   workshop-stop   - 停止所有服務
echo   workshop-reset  - 重置環境
echo   health         - 檢查服務健康狀態
echo   logs           - 查看所有服務 logs
echo   logs-backend   - 查看 .NET 後端 logs
echo   ps             - 查看服務狀態
echo   test           - 執行所有測試
echo   test-frontend  - 執行前端測試
echo   test-backend   - 執行 .NET 後端測試
echo   shell-frontend - 進入前端容器
echo   shell-backend  - 進入 .NET 後端容器
echo   help           - 顯示此說明
echo.
echo 範例: workshop.bat workshop-start
goto end

:workshop-start
echo 🚀 啟動 Jira Dashboard Workshop 環境...
docker-compose up --build -d
echo ⏳ 等待服務啟動...
timeout /t 10 /nobreak >nul
call :health
echo.
echo 🎉 環境已就緒！
echo 📱 前端: http://localhost:3000
echo 🔧 .NET 後端: http://localhost:8001
goto end

:workshop-stop
echo 🛑 停止 Workshop 環境...
docker-compose down
echo ✅ 環境已停止
goto end

:workshop-reset
echo 🔄 重置 Workshop 環境...
docker-compose down --rmi all -v
docker-compose up --build -d
timeout /t 10 /nobreak >nul
call :health
echo ✅ 環境已重置
goto end

:health
echo 🔍 檢查前端服務...
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing | Out-Null; Write-Host '✅ 前端正常' } catch { Write-Host '❌ 前端異常' }"
echo 🔍 檢查 .NET 後端服務...
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:8001/api/table/summary' -UseBasicParsing | Out-Null; Write-Host '✅ .NET 後端正常' } catch { Write-Host '❌ .NET 後端異常' }"
goto end

:logs
docker-compose logs -f
goto end

:logs-backend
docker-compose logs -f backend-dotnet
goto end

:ps
docker-compose ps
goto end

:test
echo 🧪 執行所有測試...
echo.
echo 執行前端測試...
docker-compose exec frontend npm test
echo.
echo 執行 .NET 後端測試...
docker-compose exec backend-dotnet dotnet test
goto end

:test-frontend
echo 🧪 執行前端測試...
docker-compose exec frontend npm test
goto end

:test-backend
echo 🧪 執行 .NET 後端測試...
docker-compose exec backend-dotnet dotnet test
goto end

:shell-frontend
echo 進入前端容器...
docker-compose exec frontend sh
goto end

:shell-backend
echo 進入 .NET 後端容器...
docker-compose exec backend-dotnet bash
goto end

:unknown
echo ❌ 未知指令: %1
echo 使用 'workshop.bat help' 查看可用指令
goto end

:end 