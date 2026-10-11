@echo off
echo ========================================================
echo   Starting Online Canteen Spring Boot Application
echo ========================================================
echo.

where mvn >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Found Maven in PATH. Starting Spring Boot...
    mvn spring-boot:run
) else (
    echo [WARNING] Maven is not found in your system PATH!
    echo.
    echo To run this Spring Boot project:
    echo 1. Open VS Code in this directory.
    echo 2. Open src/main/java/com/canteen/OnlineCanteenApplication.java
    echo 3. Click the "Run" button above the main() method.
    echo.
    echo Alternatively, you can open src/main/resources/static/index.html
    echo directly in your browser or with Live Server to test the full UI!
    echo ========================================================
    pause
)
