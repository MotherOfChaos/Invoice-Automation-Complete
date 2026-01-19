@echo off
echo ========================================
echo GitHub Authentication Setup
echo ========================================
echo.
echo This will set up GitHub authentication so Claude can push automatically.
echo.
echo Please follow these steps:
echo.
echo 1. You'll be prompted to login to GitHub
echo 2. A browser window will open
echo 3. Login to GitHub and authorize
echo 4. Come back here when done
echo.
pause
echo.
echo Starting GitHub CLI authentication...
echo.
gh auth login
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Claude can now push to GitHub automatically.
echo Close this window and tell Claude to continue.
echo.
pause
