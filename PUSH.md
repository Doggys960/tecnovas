Pasos rápidos para subir el proyecto a GitHub

1) Abrir PowerShell y situarse en la carpeta del proyecto:

```powershell
cd "C:\Users\ElMejor\Desktop\tecnova"
```

2) Usar el script PowerShell (recomendado en Windows):

```powershell
# Ejecuta desde la carpeta del proyecto
.\upload_to_github.ps1 -RemoteUrl 'https://github.com/usuario/tecnoinnova.git'
```

3) O usar comandos manuales:

```powershell
git init
git add .
git commit -m "Initial import: TecnoInnova frontend + backend"
git remote add origin <REMOTE_URL>
git branch -M main
git push -u origin main
```

Notas:
- Asegúrate de que `api_backend.php` y la base de datos están configuradas antes de publicar en producción.
- Si necesitas que cree el repositorio remoto usando la CLI `gh`, dime y puedo añadir un script para eso.