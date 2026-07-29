@echo off
setlocal
cd /d "%~dp0"
where quarto >nul 2>&1 || (echo ERROR: Quarto no esta disponible en PATH.& exit /b 1)
quarto render || exit /b 1
where python >nul 2>&1 && (python scripts\check_source_quality.py || exit /b 1) || echo AVISO: Python no disponible; se omite el control fuente adicional.
where git >nul 2>&1 || (echo ERROR: Git no esta disponible en PATH.& exit /b 1)
git rev-parse --is-inside-work-tree >nul 2>&1 || (echo ERROR: Esta carpeta no conserva .git. Copie el contenido dentro de su repositorio existente.& exit /b 1)
git add -A
git diff --cached --quiet && (echo No hay cambios por publicar.& exit /b 0)
git commit -m "Implement audited MeteoAndes redesign" || exit /b 1
git push || exit /b 1
echo Publicacion enviada a GitHub. Revise Actions y GitHub Pages.
