@echo off
echo 📊 État actuel des migrations:
echo.
echo 🔍 Version actuelle:
alembic current
echo.
echo 📋 Historique des migrations:
alembic history
echo.
echo 🔄 Migrations en attente:
alembic show head
pause
