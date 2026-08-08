<#
PowerShell script para inicializar git, commitear y subir a GitHub.
Uso:
  1) Abrir PowerShell en la carpeta del proyecto
  2) Ejecutar:
     .\upload_to_github.ps1 -RemoteUrl 'https://github.com/usuario/tecnoinnova.git'

Requiere: Git instalado y (opcional) `gh` CLI si quieres crear el repo desde la línea.
#>
param(
  [Parameter(Mandatory=$false)]
  [string]$RemoteUrl
)

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Error "Git no está instalado o no está en PATH. Instala Git antes de continuar."
  exit 1
}

$cwd = Get-Location
Write-Host "Inicializando repo en: $cwd"

if (-not (Test-Path .git)) {
  git init
  git add .
  git commit -m "Initial import: TecnoInnova frontend + backend"
  Write-Host "Commit inicial creado."
} else {
  Write-Host "Repositorio ya inicializado. Haciendo commit de cambios nuevos si existen..."
  git add .
  git commit -m "Update: cambios locales" -q || Write-Host "No hay cambios para commitear."
}

if (-not $RemoteUrl) {
  Write-Host "No se proporcionó RemoteUrl. Puedes crear el repo en GitHub y luego ejecutar este script con -RemoteUrl '<URL>'"
  exit 0
}

# Configurar remote y push
git remote remove origin 2>$null
git remote add origin $RemoteUrl
git branch -M main
Write-Host "Enviando a $RemoteUrl (branch main)..."
git push -u origin main
if ($LASTEXITCODE -eq 0) { Write-Host "Push exitoso." } else { Write-Error "Error al empujar al remoto." }
