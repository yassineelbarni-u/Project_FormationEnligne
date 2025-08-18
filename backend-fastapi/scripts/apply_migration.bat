@echo off
echo 🔄 Application des migrations à la base de données...
alembic upgrade head
echo ✅ Migrations appliquées avec succès!
echo.
echo 📊 Pour vérifier l'état des migrations:
echo alembic current
echo.
echo 📋 Pour voir l'historique des migrations:
echo alembic history
pause
