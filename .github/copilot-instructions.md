# Instrukcje dla AI Copilot - Aplikacja do Śledzenia Finansów

## Opis Projektu

Tworzymy **otwartoźródłową (open-source)** aplikację webową do śledzenia finansów osobistych. Kluczowym założeniem jest możliwość łatwego **samodzielnego hostowania (self-hosting)** całej aplikacji za pomocą **Docker Compose**.

**Stack technologiczny:**
*   **Frontend:** Next.js, TypeScript, Tailwind CSS
*   **Backend:** NestJS, TypeScript
*   **Baza Danych:** PostgreSQL
*   **ORM:** Prisma
*   **Środowisko:** Docker i Docker Compose

## Filozofia Projektu

1.  **Prostota i Pragmatyzm (KISS & YAGNI):**
    *   **Keep It Simple, Stupid (KISS):** Zawsze proponuj najprostsze możliwe rozwiązanie, które spełnia aktualne wymagania. Unikaj skomplikowanych wzorców projektowych i abstrakcji, jeśli nie są absolutnie konieczne.
    *   **You Ain't Gonna Need It (YAGNI):** Nie implementuj funkcjonalności "na zapas". Skupiajmy się tylko na tym, co jest potrzebne tu i teraz. Rozbudujemy aplikację, gdy pojawi się realna potrzeba.

2.  **MVP (Minimum Viable Product) First:**
    *   Naszym pierwszym celem jest stworzenie działającej, użytecznej aplikacji z kluczowymi funkcjonalnościami. Dopiero po osiągnięciu tego celu będziemy dodawać bardziej zaawansowane opcje.

## Szczegółowe Zasady Pracy

Jako mój asystent AI, proszę, abyś przestrzegał poniższych zasad:

**1. Docker First:**
*   Cała aplikacja musi być uruchamiana za pomocą `docker-compose up`.
*   Pamiętaj o tworzeniu i aktualizowaniu plików `Dockerfile` dla frontendu i backendu oraz głównego pliku `docker-compose.yml`.
*   Konfiguracja usług (porty, dane do bazy) musi odbywać się poprzez zmienne środowiskowe (`.env`).

**2. System Kontroli Wersji (Git i GitHub):**
*   **Zawsze pracuj z Gitem.** Po każdej znaczącej zmianie w kodzie, przygotuj commit z jasnym i zwięzłym opisem, zgodnym z konwencją Conventional Commits (np. `feat: dodanie logowania przez JWT`, `fix: walidacja formularza transakcji`).
*   Regularnie wypychaj zmiany do zdalnego repozytorium na GitHub.

**3. Jakość Kodu:**
*   Pisz czysty, czytelny i samo-dokumentujący się kod.
*   **Struktura folderów:** Utrzymuj logiczną i spójną strukturę folderów, najlepiej zorientowaną na funkcjonalności (np. `src/users`, `src/transactions`).
*   **TypeScript:** Konsekwentnie używaj TypeScriptu, dbaj o silne typowanie i unikaj typu `any` jak ognia.
*   **Dokumentacja kodu:** Dodawaj komentarze JSDoc/TSDoc do bardziej skomplikowanych funkcji i komponentów, wyjaśniając *dlaczego* coś jest zrobione w dany sposób, a nie tylko *co* robi.

**4. Testowanie jest Kluczowe:**
*   **"Zrobione" znaczy "przetestowane".** Żadna funkcjonalność nie jest ukończona, dopóki nie jest pokryta odpowiednimi testami.
*   Pisz testy jednostkowe (unit tests) dla logiki biznesowej (np. funkcje obliczające budżet) i testy integracyjne (integration tests) dla endpointów API.
*   Do testowania będziemy używać frameworka **Jest**.
*   Zanim oznaczysz zadanie jako zakończone, upewnij się, że wszystkie istniejące i nowe testy przechodzą pomyślnie.

**5. Bezpieczeństwo:**
*   **Nigdy nie umieszczaj wrażliwych danych** (klucze API, hasła, sekrety JWT) bezpośrednio w kodzie. Zawsze instruuj mnie, jak korzystać ze zmiennych środowiskowych i plików `.env`, które będą ignorowane przez Git w pliku `.gitignore`.
*   Zwracaj uwagę na podstawowe zasady bezpieczeństwa aplikacji webowych (walidacja danych wejściowych, ochrona przed SQL Injection przez ORM, itp.).

**6. Dostępność (Accessibility, a11y):**
*   Tworząc komponenty frontendowe, pamiętaj o podstawowych zasadach dostępności. Używaj semantycznego HTML (np. `<button>` zamiast `<div onClick={...}>`), dbaj o odpowiednie atrybuty ARIA i zapewnij możliwość nawigacji za pomocą klawiatury.

**7. Wykorzystanie Narzędzi MCP (OBOWIĄZKOWE!):**

**DO KAŻDEGO złożonego zadania używaj tych narzędzi:**

**a) #mcp_sequentialthi_sequentialthinking** - Myślenie krok po kroku
*   Używaj do analizy problemów (min 8-15 kroków)
*   Rozpisuj hipotezy przed implementacją
*   Weryfikuj założenia systematycznie
*   Przykład: debugging, architektura, code review

**b) #memory** (create_entities, add_observations, search_nodes)
*   Zapisuj wzorce błędów i rozwiązania
*   Twórz bazę wiedzy projektu
*   Szukaj podobnych problemów z przeszłości
*   Przykład: Po naprawie buga → zapisz w memory

**c) #mcp_upstash_conte_get-library-docs**
*   Sprawdzaj dokumentację przed zmianami
*   Weryfikuj API i best practices
*   Używaj zamiast cache/assumptions
*   Przykład: Zustand persist → pobierz docs → sprawdź hydration pattern

**Workflow z MCP:**
```
1. Problem pojawił się
2. #mcp_sequentialthi_sequentialthinking - rozpisz 8-15 kroków analizy
3. #memory search_nodes - czy podobny problem był wcześniej?
4. #mcp_upstash_conte_get-library-docs - sprawdź dokumentację
5. Implementuj rozwiązanie
6. #memory create_entities - zapisz wzorzec + fix
```

**⚠️ Bez MCP tools = słaba jakość pracy!**

**8. Aktywne Wyszukiwanie:**
*   **Aktywnie korzystaj z wyszukiwania w sieci.** Zanim udzielisz odpowiedzi, zwłaszcza dotyczącej bibliotek, konfiguracji czy rozwiązywania problemów, **zawsze** przeprowadź wyszukiwanie, aby upewnić się, że informacje są aktualne i dokładne na dzień 1 października 2025.
*   Nie udawaj, że korzystasz z wyszukiwania. Oczekuję, że będziesz faktycznie weryfikować informacje.

**Przykład komendy:**
"Stwórz endpoint w NestJS do dodawania nowej transakcji. Pamiętaj o walidacji DTO (Data Transfer Object) przy użyciu `class-validator`. Napisz również podstawowy test integracyjny w Jest, który sprawdzi scenariusz pomyślnego dodania transakcji oraz scenariusz z błędnymi danymi wejściowymi."