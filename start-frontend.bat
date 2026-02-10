@echo off
echo ========================================
echo   SimuAI Frontend Setup and Start
echo ========================================
echo.

cd frontend

echo [1/2] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo ========================================
echo   Starting Frontend Server...
echo ========================================
echo.
echo Frontend will start at: http://localhost:3000
echo.
echo Login with test accounts:
echo   Admin: admin@simuai.com / Admin@123
echo   Employer: employer@simuai.com / Employer@123
echo   Candidate: candidate@simuai.com / Candidate@123
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev
