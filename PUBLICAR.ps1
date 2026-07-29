$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
quarto render
git add -A
$changes = git status --porcelain
if ($changes) {
  git commit -m "Update MeteoAndes scientific website"
  git push
} else {
  Write-Host "No hay cambios por publicar."
}
