@echo off
REM Install dependencies first
echo Installing dependencies...
cmd /c "npm install"

if %ERRORLEVEL% neq 0 (
    echo Failed to install dependencies!
    exit /b 1
)

REM Build project with npm
echo Building project...
cmd /c "npm run build"

REM Check if dist directory exists
if exist dist (
    echo Build successful! dist directory created
    dir dist /b
) else (
    echo Build failed! dist directory not created
    exit /b 1
)