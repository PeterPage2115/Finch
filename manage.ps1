# Tracker Kasy - Helper Script (PowerShell)
# Skrypt pomocniczy do zarządzania aplikacją

param(
    [Parameter(Position=0)]
    [string]$Command,
    [Parameter(Position=1)]
    [string]$Argument
)

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Test-Docker {
    try {
        docker --version | Out-Null
    } catch {
        Write-Error "Docker nie jest zainstalowany!"
        exit 1
    }
    
    try {
        docker-compose --version | Out-Null
    } catch {
        Write-Error "Docker Compose nie jest zainstalowany!"
        exit 1
    }
}

function Start-App {
    Write-Info "Uruchamianie Tracker Kasy..."
    docker-compose up -d
    Write-Info "Aplikacja uruchomiona!"
    Write-Info "Frontend: http://localhost:3000"
    Write-Info "Backend API: http://localhost:3001"
}

function Stop-App {
    Write-Info "Zatrzymywanie Tracker Kasy..."
    docker-compose stop
    Write-Info "Aplikacja zatrzymana"
}

function Restart-App {
    Write-Info "Restartowanie Tracker Kasy..."
    docker-compose restart
    Write-Info "Aplikacja zrestartowana"
}

function Show-Logs {
    param([string]$Service)
    if ([string]::IsNullOrEmpty($Service)) {
        docker-compose logs -f
    } else {
        docker-compose logs -f $Service
    }
}

function Show-Status {
    Write-Info "Status aplikacji:"
    docker-compose ps
}

function Backup-Database {
    $BackupFile = "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
    Write-Info "Tworzenie backupu bazy danych: $BackupFile"
    docker-compose exec -T db pg_dump -U tracker_user tracker_kasy > $BackupFile
    Write-Info "Backup utworzony: $BackupFile"
}

function Restore-Database {
    param([string]$BackupFile)
    
    if ([string]::IsNullOrEmpty($BackupFile)) {
        Write-Error "Podaj ścieżkę do pliku backup!"
        Write-Info "Użycie: .\manage.ps1 restore <plik_backup.sql>"
        exit 1
    }
    
    if (-not (Test-Path $BackupFile)) {
        Write-Error "Plik nie istnieje: $BackupFile"
        exit 1
    }
    
    Write-Warning "To nadpisze obecną bazę danych!"
    $response = Read-Host "Czy na pewno chcesz kontynuować? (yes/no)"
    if ($response -ne "yes") {
        Write-Info "Anulowano"
        exit 0
    }
    
    Write-Info "Przywracanie backupu z: $BackupFile"
    Get-Content $BackupFile | docker-compose exec -T db psql -U tracker_user tracker_kasy
    Write-Info "Backup przywrócony"
}

function Clean-All {
    Write-Warning "To usunie WSZYSTKIE dane aplikacji (w tym bazę danych)!"
    $response = Read-Host "Czy na pewno chcesz kontynuować? (yes/no)"
    if ($response -ne "yes") {
        Write-Info "Anulowano"
        exit 0
    }
    
    Write-Info "Usuwanie kontenerów i wolumenów..."
    docker-compose down -v
    Write-Info "Wyczyszczono"
}

function Update-App {
    Write-Info "Aktualizowanie aplikacji..."
    git pull
    Write-Info "Przebudowywanie i uruchamianie..."
    docker-compose up -d --build
    Write-Info "Aplikacja zaktualizowana"
}

function Show-Help {
    Write-Host @"
Tracker Kasy - Helper Script (PowerShell)

Użycie: .\manage.ps1 <komenda> [argumenty]

Komendy:
  start              - Uruchom aplikację
  stop               - Zatrzymaj aplikację
  restart            - Restartuj aplikację
  logs [serwis]      - Pokaż logi (opcjonalnie dla konkretnego serwisu)
  status             - Sprawdź status kontenerów
  backup             - Utwórz backup bazy danych
  restore <plik>     - Przywróć backup bazy danych
  update             - Aktualizuj aplikację (git pull + rebuild)
  clean              - Usuń wszystkie dane (OSTROŻNIE!)
  help               - Pokaż tę pomoc

Przykłady:
  .\manage.ps1 start
  .\manage.ps1 logs backend
  .\manage.ps1 backup
  .\manage.ps1 restore backup_20250101_120000.sql
"@
}

# Main
Test-Docker

switch ($Command) {
    "start" { Start-App }
    "stop" { Stop-App }
    "restart" { Restart-App }
    "logs" { Show-Logs -Service $Argument }
    "status" { Show-Status }
    "backup" { Backup-Database }
    "restore" { Restore-Database -BackupFile $Argument }
    "update" { Update-App }
    "clean" { Clean-All }
    "help" { Show-Help }
    default {
        Write-Error "Nieznana komenda: $Command"
        Show-Help
        exit 1
    }
}
