@echo off
echo ========================================
echo   SimuAI Platform - Starting Servers
echo ========================================
echo.

echo Checking if servers are already running...
netstat -ano | findstr :5000 >nul
if %ERRORLEVEL% EQU 0 (
    echo WARNING: Port 5000 is already in use!
    echo Please close the existing backend server or change the port.
    pause
    exit /b 1
)

netstat -ano | findstr :5173 >nul
if %ERRORLEVEL% EQU 0 (
    echo WARNING: Port 5173 is already in use!
    echo Please close the existing frontend server or change the port.
    pause
    exit /b 1
)

echo.
echo Starting Backend Server (Port 5000)...
start "SimuAI Backend" cmd /k "cd backend && npm run dev"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend Server (Port 5173)...
start "SimuAI Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo The browser should open automatically.
echo If not, open: http://localhost:5173
echo.
echo To stop servers: Close the terminal windows
echo.
echo Waiting 10 seconds before opening browser...
timeout /t 10 /nobreak >nul

start http://localhost:5173

echo.
echo ========================================
echo   SimuAI is now running!
echo ========================================
echo.
pause
