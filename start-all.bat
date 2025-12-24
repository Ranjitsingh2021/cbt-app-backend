@echo off
echo Starting CBT Therapy App (Backend + Frontend)...
echo.

start "Backend Server" cmd /k "start-backend.bat"
start "Frontend App" cmd /k "start-frontend.bat"

echo Backend and Frontend have been launched in separate windows.
echo.
pause
