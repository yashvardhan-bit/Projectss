powershell -ExecutionPolicy Bypass -NoProfile -Command "
Write-Host 'Starting Project...' -ForegroundColor Cyan
Write-Host ''

# Start Backend
Write-Host 'Starting Backend on http://localhost:8000' -ForegroundColor Green
Start-Process powershell -ArgumentList '-ExecutionPolicy Bypass -NoProfile -Command \"cd x:\pro_ject\backend; x:\pro_ject\backend\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000\"'

# Wait for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host 'Starting Frontend on http://localhost:5173' -ForegroundColor Green
Start-Process powershell -ArgumentList '-ExecutionPolicy Bypass -NoProfile -Command \"cd x:\pro_ject\frontend; npm run dev\"'

Write-Host ''
Write-Host '===================================' -ForegroundColor Yellow
Write-Host 'BOTH SERVERS STARTING!' -ForegroundColor Yellow
Write-Host ''
Write-Host 'Frontend: http://localhost:5173' -ForegroundColor Cyan
Write-Host 'Backend:  http://localhost:8000' -ForegroundColor Cyan
Write-Host 'API Docs: http://localhost:8000/docs' -ForegroundColor Cyan
Write-Host '===================================' -ForegroundColor Yellow
Write-Host ''
Write-Host 'Two new windows will open. Leave them open while using the app.' -ForegroundColor White
Read-Host 'Press Enter to close this window'
"
