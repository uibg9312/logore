# Script para crear un acceso directo en el escritorio
$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Logore AI.lnk")
$Shortcut.TargetPath = "$PSScriptRoot\iniciar-logore.bat"
$Shortcut.WorkingDirectory = $PSScriptRoot
$Shortcut.WindowStyle = 1
$Shortcut.Description = "Iniciar Logore AI - Herramienta Inteligente de Logos"
$Shortcut.Save()

Write-Host ""
Write-Host " Acceso directo creado en el Escritorio exitosamente!" -ForegroundColor Green
Write-Host " Busca el icono 'Logore AI' en tu escritorio." -ForegroundColor Cyan
Write-Host ""
