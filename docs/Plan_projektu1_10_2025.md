### 1. Plan techniczny aplikacji (wersja zaktualizowana)

**Plan Techniczny Aplikacji do Śledzenia Finansów (Open-Source, Self-Hosted)**

**Data:** 1 października 2025

**Opis projektu:**
Otwartoźródłowa aplikacja webowa do śledzenia finansów osobistych. Umożliwia użytkownikom monitorowanie dochodów i wydatków, kategoryzowanie transakcji, ustalanie budżetów i generowanie raportów. Aplikacja jest zaprojektowana z myślą o łatwym samodzielnym hostowaniu za pomocą Docker Compose.

**1. Architektura aplikacji:**

Aplikacja będzie oparta o architekturę klient-serwer. Frontend (Next.js) będzie renderowany po stronie serwera i będzie komunikował się z backendem (NestJS) za pomocą wewnętrznego API.

**2. Stack technologiczny:**

*   **Frontend (Aplikacja Webowa):**
    *   **Framework:** Next.js 14+
    *   **Opis:** Zapewnia wysoką wydajność i doskonałe doświadczenie użytkownika dzięki renderowaniu po stronie serwera (SSR).
    *   **Język:** TypeScript
    *   **Styling:** Tailwind CSS - dla szybkiego tworzenia nowoczesnych i responsywnych interfejsów.
    *   **Biblioteki dodatkowe:**
        *   **Zarządzanie stanem:** Zustand
        *   **Wykresy:** Chart.js lub Recharts
        *   **Formularze:** React Hook Form

*   **Backend:**
    *   **Framework:** NestJS
    *   **Opis:** Nowoczesny framework Node.js oparty na TypeScript, który zapewnia skalowalną i modułową architekturę, idealną do budowy solidnego API.
    *   **Język:** TypeScript
    *   **Biblioteki dodatkowe:**
        *   **Uwierzytelnianie:** Passport.js z obsługą JWT.
        *   **Walidacja:** `class-validator`, `class-transformer`.

*   **Baza Danych:**
    *   **System:** PostgreSQL
    *   **Opis:** Niezawodna, relacyjna baza danych, idealna do przechowywania danych finansowych ze względu na silną integralność i transakcyjność (ACID).
    *   **ORM (Object-Relational Mapping):** Prisma - nowoczesne narzędzie do interakcji z bazą danych, zapewniające bezpieczeństwo typów i łatwość użycia.

**3. Konteneryzacja i Uruchamianie (Docker):**

*   **Podstawowe narzędzie:** Docker i Docker Compose.
*   **Cel:** Umożliwienie uruchomienia całej aplikacji (frontend, backend, baza danych) za pomocą jednej komendy: `docker-compose up`. To kluczowe dla projektu open-source i łatwego wdrożenia.
*   **Struktura `docker-compose.yml`:**
    *   **Serwis `backend`:** Będzie budować obraz z `Dockerfile` umieszczonego w folderze backendu i uruchamiał aplikację NestJS.
    *   **Serwis `frontend`:** Będzie budować obraz z `Dockerfile` umieszczonego w folderze frontendu i uruchamiał aplikację Next.js.
    *   **Serwis `db`:** Będzie korzystać z oficjalnego obrazu `postgres`. Dane będą przechowywane w wolumenie Docker (`pgdata`), aby zapewnić ich trwałość między restartami kontenera.
*   **Konfiguracja:** Wszystkie wrażliwe dane (sekrety, klucze API, dane dostępowe do bazy) będą zarządzane za pomocą zmiennych środowiskowych i pliku `.env`.

**4. Dodatkowe narzędzia i dobre praktyki:**

*   **System kontroli wersji:** Git, z repozytorium na GitHub.
*   **CI/CD (Ciągła Integracja):** GitHub Actions do automatycznego uruchamiania testów i budowania obrazów Docker po każdym pushu do repozytorium.
*   **Dokumentacja:** Solidny plik `README.md` z instrukcjami, jak sklonować repozytorium i uruchomić projekt lokalnie za pomocą Docker Compose.