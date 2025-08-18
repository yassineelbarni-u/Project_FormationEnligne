@echo off
echo 🔄 Génération de la migration pour le champ image_filename...
alembic revision --autogenerate -m "add_image_filename_to_courses"
echo ✅ Migration générée avec succès!
echo.
echo 📋 Prochaines étapes:
echo 1. Vérifiez le fichier de migration généré dans alembic\versions\
echo 2. Exécutez: scripts\apply_migration.bat
echo.
echo 🚀 Pour appliquer la migration maintenant, exécutez:
echo alembic upgrade head
pause
