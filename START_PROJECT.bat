@echo off
cd /d "%~dp0"
echo.
echo ===================================
echo AI Learning Path Assistant
echo ===================================
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo ERROR: backend folder not found!
    echo Make sure you run this script from the project root folder.
    pause
    exit /b 1
)

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && python -m uvicorn app.main:app --reload --port 8000"

timeout /t 4

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

timeout /t 3

echo.
echo ===================================
echo SERVERS STARTING!
echo ===================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
echo.
echo Two new windows should have opened.
echo If they didn't, check the errors above.
echo.
pause
