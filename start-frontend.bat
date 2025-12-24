@echo off
setlocal enabledelayedexpansion
echo Starting Expo Frontend...
echo.

cd frontend-app

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Get WiFi/LAN IP address (filtering out virtual adapters)
REM Strategy: Look for common home/office network ranges and exclude virtual adapters

REM First, try to find WiFi adapter specifically
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"Wireless LAN adapter" /A:2 ^| findstr /C:"IPv4 Address"') do (
    set TEMP_IP=%%a
    set TEMP_IP=!TEMP_IP:~1!
    set LOCAL_IP=!TEMP_IP!
    goto :ip_found
)

REM Second, try 192.168.x.x range (most common home WiFi)
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set TEMP_IP=%%a
    set TEMP_IP=!TEMP_IP:~1!
    echo !TEMP_IP! | findstr /b "192.168." >nul && set LOCAL_IP=!TEMP_IP!
)
if defined LOCAL_IP goto :ip_found

REM Third, try 10.x.x.x range (some office/home networks)
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set TEMP_IP=%%a
    set TEMP_IP=!TEMP_IP:~1!
    echo !TEMP_IP! | findstr /b "10." >nul && set LOCAL_IP=!TEMP_IP!
)
if defined LOCAL_IP goto :ip_found

REM Last resort: Use first non-virtual adapter IP (exclude 172.x which is often virtual)
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set TEMP_IP=%%a
    set TEMP_IP=!TEMP_IP:~1!
    echo !TEMP_IP! | findstr /b "172." >nul || (
        set LOCAL_IP=!TEMP_IP!
        goto :ip_found
    )
)
:ip_found
set REACT_NATIVE_PACKAGER_HOSTNAME=%LOCAL_IP%

REM Set backend API URL for the app to use (auto-detected)
set EXPO_PUBLIC_API_URL=http://%LOCAL_IP%:8082/api

REM Start Expo
echo.
echo Starting Expo on %LOCAL_IP%...
echo Metro bundler will run on port 8080
echo Backend API: http://%LOCAL_IP%:8082/api
echo Scan QR code with Expo Go app or press 'a' for Android / 'i' for iOS
echo.
call npm start -- --port 8080 --tunnel

