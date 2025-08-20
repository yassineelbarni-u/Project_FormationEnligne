@echo off
REM Script de migration pour appliquer les migrations existantes
echo Application des migrations...
call alembic upgrade heads
echo Migration terminée avec succès!
