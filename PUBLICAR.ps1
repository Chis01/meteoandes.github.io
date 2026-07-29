$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
quarto render
if (Get-Command python -ErrorAction SilentlyContinue) { python .\scripts\check_source_quality.py } else { Write-Warning "Python no disponible; se omite el control fuente adicional." }
if (-not (Test-Path .git)) { throw "No existe .git. Copie estos archivos dentro de su repositorio MeteoAndes existente." }
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -eq 0) { Write-Host "No hay cambios por publicar."; exit 0 }
git commit -m "Implement audited MeteoAndes redesign"
git push
