# 💰 Tracker Kasy - Aplikacja do Śledzenia Finansów

**Otwartoźródłowa aplikacja webowa do zarządzania finansami osobistymi**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

## 📋 O Projekcie

Tracker Kasy to nowoczesna aplikacja webowa zaprojektowana z myślą o prostocie i łatwości samodzielnego hostowania. Umożliwia śledzenie przychodów, wydatków, kategoryzowanie transakcji, ustalanie budżetów i generowanie raportów finansowych.

### ✨ Kluczowe Cechy

- 🔒 **Prywatność** - Twoje dane pozostają u Ciebie (self-hosted)
- 🐳 **Łatwe wdrożenie** - Jedna komenda: `docker-compose up`
- 📊 **Intuicyjny interfejs** - Przejrzysty dashboard z wykresami
- 💼 **Zarządzanie budżetami** - Ustaw limity i monitoruj wydatki
- 📈 **Raporty** - Analizuj swoje finanse w czasie

## 🛠️ Stack Technologiczny

- **Frontend:** Next.js 14+, TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeScript
- **Baza Danych:** PostgreSQL
- **ORM:** Prisma
- **Konteneryzacja:** Docker & Docker Compose

## 🚀 Szybki Start

### Wymagania

- Docker (wersja 20.10+)
- Docker Compose (wersja 2.0+)
- Git

### Instalacja

1. **Sklonuj repozytorium:**
   ```bash
   git clone https://github.com/[twoja-nazwa-uzytkownika]/Tracker_kasy.git
   cd Tracker_kasy
   ```

2. **Skonfiguruj zmienne środowiskowe:**
   ```bash
   # Skopiuj przykładowe pliki .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # Edytuj pliki .env i ustaw odpowiednie wartości
   ```

3. **Uruchom aplikację:**
   ```bash
   docker-compose up -d
   ```

4. **Otwórz przeglądarkę:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:3001](http://localhost:3001)

### Pierwsza konfiguracja

Po uruchomieniu aplikacji:
1. Zarejestruj nowe konto użytkownika
2. Zaloguj się do aplikacji
3. Dodaj swoje pierwsze kategorie wydatków/przychodów
4. Zacznij śledzić transakcje!

## 📚 Dokumentacja

Szczegółowa dokumentacja dostępna w folderze [`docs/`](./docs/):

- [Architektura aplikacji](./docs/architecture.md) *(wkrótce)*
- [API Reference](./docs/api.md) *(wkrótce)*
- [Przewodnik developera](./docs/developer-guide.md) *(wkrótce)*

## 🧪 Rozwój Lokalny

### Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

### Uruchamianie Testów

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

## 🤝 Współpraca

Chcesz pomóc w rozwoju projektu? Świetnie! 

1. Fork'nij repozytorium
2. Utwórz branch z nową funkcjonalnością (`git checkout -b feat/amazing-feature`)
3. Commit'uj zmiany (`git commit -m 'feat: dodanie niesamowitej funkcji'`)
4. Push'nij do branch'a (`git push origin feat/amazing-feature`)
5. Otwórz Pull Request

Więcej informacji w pliku [CONTRIBUTING.md](./CONTRIBUTING.md) *(wkrótce)*.

## 📝 Konwencje Commitów

Projekt używa [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - nowa funkcjonalność
- `fix:` - naprawa błędu
- `docs:` - zmiany w dokumentacji
- `test:` - dodanie lub modyfikacja testów
- `refactor:` - refaktoryzacja kodu
- `chore:` - zmiany w toolingu, konfiguracji

## 📄 Licencja

Ten projekt jest udostępniony na licencji MIT. Zobacz plik [LICENSE](./LICENSE) po szczegóły.

## 🙏 Podziękowania

Projekt wykorzystuje następujące open-source'owe technologie:
- [Next.js](https://nextjs.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📧 Kontakt

Pytania? Sugestie? Otwórz [Issue](https://github.com/[twoja-nazwa-uzytkownika]/Tracker_kasy/issues)!

---

**Zbudowane z ❤️ dla społeczności open-source**
