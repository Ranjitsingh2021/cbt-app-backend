@echo off
setlocal enabledelayedexpansion
echo Starting CBT Therapy Backend...
echo.

cd backend

REM Check if venv exists
if not exist "venv\Scripts\activate.bat" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install/update dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Read PORT from .env file if it exists
if exist ".env" (
    for /f "tokens=1,2 delims==" %%a in ('findstr /B "PORT=" .env') do set %%a=%%b
)

REM Set PORT environment variable (default to 8000 if not set)
if not defined PORT set PORT=8000

REM Get WiFi/LAN IP address (filtering out virtual adapters)
REM Strategy: Look for common home/office network ranges and exclude virtual adapters

REM First, try to find WiFi adapter specifically
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"Wireless LAN adapter" /A:2 ^| findstr /C:"IPv4 Address"') do (
    set TEMP_IP=%%a
    set TEMP_IP=!TEMP_IP:~1!
    set IP=!TEMP_IP!
    goto :ip_found
)

REM Second, try 192.168.x.x range (most common home WiFi)
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set TEMP_IP=%%a
    set TEMP_IP=!TEMP_IP:~1!
    echo !TEMP_IP! | findstr /b "192.168." >nul && set IP=!TEMP_IP!
)
if defined IP goto :ip_found

REM Third, try 10.x.x.x range (some office/home networks)
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set TEMP_IP=%%a
    set TEMP_IP=!TEMP_IP:~1!
    echo !TEMP_IP! | findstr /b "10." >nul && set IP=!TEMP_IP!
)
if defined IP goto :ip_found

REM Last resort: Use first non-virtual adapter IP (exclude 172.x which is often virtual)
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set TEMP_IP=%%a
    set TEMP_IP=!TEMP_IP:~1!
    echo !TEMP_IP! | findstr /b "172." >nul || (
        set IP=!TEMP_IP!
        goto :ip_found
    )
)
:ip_found

REM Start the server
echo.
echo ========================================
echo Backend server started successfully!
echo ========================================
echo Local:    http://localhost:%PORT%
echo Network:  http://%IP%:%PORT%
echo ========================================
echo Press CTRL+C to stop
echo.
python main.py

