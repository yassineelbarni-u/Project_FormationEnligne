@echo off
echo ========================================
echo    MIGRATION AUTOMATIQUE ALEMBIC
echo ========================================
echo.

echo [1/3] Generation de la migration automatique...
alembic revision --autogenerate -m "auto_migration_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%"

if %errorlevel% neq 0 (
    echo ERREUR: Echec de la generation de la migration
    pause
    exit /b 1
)

echo.
echo [2/3] Application de la migration...
alembic upgrade head

if %errorlevel% neq 0 (
    echo ERREUR: Echec de l'application de la migration
    pause
    exit /b 1
)

echo.
echo [3/3] Verification du statut...
alembic current

echo.
echo ========================================
echo    MIGRATION TERMINEE AVEC SUCCES!
echo ========================================
echo.
echo Vos changements dans models.py ont ete appliques a la base de donnees.
pause
