#!/bin/bash

# Tracker Kasy - Helper Script
# Skrypt pomocniczy do zarządzania aplikacją

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

function print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

function print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

function print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

function check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker nie jest zainstalowany!"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose nie jest zainstalowany!"
        exit 1
    fi
}

function start() {
    print_info "Uruchamianie Tracker Kasy..."
    docker-compose up -d
    print_info "Aplikacja uruchomiona!"
    print_info "Frontend: http://localhost:3000"
    print_info "Backend API: http://localhost:3001"
}

function stop() {
    print_info "Zatrzymywanie Tracker Kasy..."
    docker-compose stop
    print_info "Aplikacja zatrzymana"
}

function restart() {
    print_info "Restartowanie Tracker Kasy..."
    docker-compose restart
    print_info "Aplikacja zrestartowana"
}

function logs() {
    if [ -z "$1" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$1"
    fi
}

function status() {
    print_info "Status aplikacji:"
    docker-compose ps
}

function backup() {
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    print_info "Tworzenie backupu bazy danych: $BACKUP_FILE"
    docker-compose exec -T db pg_dump -U tracker_user tracker_kasy > "$BACKUP_FILE"
    print_info "Backup utworzony: $BACKUP_FILE"
}

function restore() {
    if [ -z "$1" ]; then
        print_error "Podaj ścieżkę do pliku backup!"
        print_info "Użycie: $0 restore <plik_backup.sql>"
        exit 1
    fi
    
    print_warning "To nadpisze obecną bazę danych!"
    read -p "Czy na pewno chcesz kontynuować? (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
        print_info "Anulowano"
        exit 0
    fi
    
    print_info "Przywracanie backupu z: $1"
    docker-compose exec -T db psql -U tracker_user tracker_kasy < "$1"
    print_info "Backup przywrócony"
}

function clean() {
    print_warning "To usunie WSZYSTKIE dane aplikacji (w tym bazę danych)!"
    read -p "Czy na pewno chcesz kontynuować? (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy]es$ ]]; then
        print_info "Anulowano"
        exit 0
    fi
    
    print_info "Usuwanie kontenerów i wolumenów..."
    docker-compose down -v
    print_info "Wyczyszczono"
}

function update() {
    print_info "Aktualizowanie aplikacji..."
    git pull
    print_info "Przebudowywanie i uruchamianie..."
    docker-compose up -d --build
    print_info "Aplikacja zaktualizowana"
}

function help() {
    echo "Tracker Kasy - Helper Script"
    echo ""
    echo "Użycie: $0 <komenda>"
    echo ""
    echo "Komendy:"
    echo "  start       - Uruchom aplikację"
    echo "  stop        - Zatrzymaj aplikację"
    echo "  restart     - Restartuj aplikację"
    echo "  logs [serwis] - Pokaż logi (opcjonalnie dla konkretnego serwisu)"
    echo "  status      - Sprawdź status kontenerów"
    echo "  backup      - Utwórz backup bazy danych"
    echo "  restore <plik> - Przywróć backup bazy danych"
    echo "  update      - Aktualizuj aplikację (git pull + rebuild)"
    echo "  clean       - Usuń wszystkie dane (OSTROŻNIE!)"
    echo "  help        - Pokaż tę pomoc"
    echo ""
}

# Main
check_docker

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs "$2"
        ;;
    status)
        status
        ;;
    backup)
        backup
        ;;
    restore)
        restore "$2"
        ;;
    update)
        update
        ;;
    clean)
        clean
        ;;
    help|--help|-h)
        help
        ;;
    *)
        print_error "Nieznana komenda: $1"
        help
        exit 1
        ;;
esac
