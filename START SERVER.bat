@echo off
echo Starting One More Thing website server...
echo Open your browser to: http://localhost:3080/
echo.
echo Press Ctrl+C to stop the server.
echo.
cd /d "%~dp0"
node serve.mjs
pause
