# Test Transactions API - Complete
# PowerShell script do testowania wszystkich endpointów transakcji

$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:3001"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  TEST TRANSACTIONS API - BACKEND" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# KROK 1: Logowanie
Write-Host "1️⃣  Logowanie..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body (@{
        email = "testapi@example.com"
        password = "Test123!"
    } | ConvertTo-Json) -ErrorAction Stop

    $token = $loginResponse.accessToken
    Write-Host "✅ Zalogowano pomyślnie" -ForegroundColor Green
    Write-Host "   Token: $($token.Substring(0, 30))...`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Błąd logowania: $_" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# KROK 2: Pobieranie profilu
Write-Host "2️⃣  Pobieranie profilu użytkownika..." -ForegroundColor Yellow
try {
    $userProfile = Invoke-RestMethod -Uri "$baseUrl/auth/me" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "✅ Profil pobrany: $($userProfile.email)" -ForegroundColor Green
    Write-Host "   User ID: $($userProfile.id)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Błąd pobierania profilu: $_" -ForegroundColor Red
    exit 1
}

# KROK 3: Pobieranie listy transakcji (GET /transactions)
Write-Host "3️⃣  Pobieranie listy transakcji (GET /transactions)..." -ForegroundColor Yellow
try {
    $transactionsList = Invoke-RestMethod -Uri "$baseUrl/transactions" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "✅ Lista pobrана pomyślnie" -ForegroundColor Green
    Write-Host "   Total: $($transactionsList.meta.total)" -ForegroundColor Gray
    Write-Host "   Page: $($transactionsList.meta.page)/$($transactionsList.meta.totalPages)" -ForegroundColor Gray
    Write-Host "   Transactions count: $($transactionsList.data.Count)`n" -ForegroundColor Gray
    
    if ($transactionsList.data.Count -gt 0) {
        Write-Host "   Pierwsza transakcja:" -ForegroundColor Cyan
        $firstTx = $transactionsList.data[0]
        Write-Host "   - ID: $($firstTx.id)" -ForegroundColor Gray
        Write-Host "   - Amount: $($firstTx.amount)" -ForegroundColor Gray
        Write-Host "   - Type: $($firstTx.type)" -ForegroundColor Gray
        Write-Host "   - Description: $($firstTx.description)" -ForegroundColor Gray
        Write-Host "   - Category: $($firstTx.category.name)`n" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Błąd pobierania listy: $_" -ForegroundColor Red
    Write-Host "   Response: $($_.Exception.Response | ConvertTo-Json -Depth 5)" -ForegroundColor DarkRed
}

# KROK 4: Test filtrowania (GET /transactions?type=EXPENSE)
Write-Host "4️⃣  Test filtrowania po typie (GET /transactions?type=EXPENSE)..." -ForegroundColor Yellow
try {
    $expensesList = Invoke-RestMethod -Uri "$baseUrl/transactions?type=EXPENSE&limit=5" -Method GET -Headers $headers -ErrorAction Stop
    Write-Host "✅ Filtrowanie działa" -ForegroundColor Green
    Write-Host "   Expenses count: $($expensesList.data.Count)" -ForegroundColor Gray
    Write-Host "   Total expenses: $($expensesList.meta.total)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Błąd filtrowania: $_" -ForegroundColor Red
}

# KROK 5: Pobieranie pojedynczej transakcji (GET /transactions/:id)
if ($transactionsList.data.Count -gt 0) {
    Write-Host "5️⃣  Pobieranie pojedynczej transakcji (GET /transactions/:id)..." -ForegroundColor Yellow
    $testId = $transactionsList.data[0].id
    try {
        $singleTransaction = Invoke-RestMethod -Uri "$baseUrl/transactions/$testId" -Method GET -Headers $headers -ErrorAction Stop
        Write-Host "✅ Transakcja pobrana" -ForegroundColor Green
        Write-Host "   ID: $($singleTransaction.id)" -ForegroundColor Gray
        Write-Host "   Amount: $($singleTransaction.amount)" -ForegroundColor Gray
        Write-Host "   Description: $($singleTransaction.description)`n" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Błąd pobierania pojedynczej transakcji: $_" -ForegroundColor Red
    }
}

# KROK 6: Tworzenie nowej transakcji (POST /transactions)
Write-Host "6️⃣  Tworzenie nowej transakcji (POST /transactions)..." -ForegroundColor Yellow

# Jeśli brak transakcji, musimy pobrać kategorię z bazy
$categoryId = $null
if ($transactionsList.data.Count -gt 0) {
    $categoryId = $transactionsList.data[0].categoryId
} else {
    # Pobierz kategorie z API jeśli istnieje endpoint, lub zapytaj bazę
    Write-Host "   Pobieranie kategorii z bazy..." -ForegroundColor Gray
    try {
        $dbQuery = "SELECT id FROM categories WHERE \`"userId\`" = '$($userProfile.id)' LIMIT 1;"
        $categoryResult = docker exec tracker_kasy_db psql -U tracker_user -d tracker_kasy -t -c $dbQuery 2>&1 | Out-String
        $categoryId = $categoryResult.Trim()
        Write-Host "   Znaleziono kategorię: $categoryId" -ForegroundColor Gray
    } catch {
        Write-Host "   ❌ Nie można pobrać kategorii" -ForegroundColor Red
    }
}

if ($categoryId) {
    
    $newTransaction = @{
        amount = 123.45
        description = "Test transaction from API test"
        date = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        type = "EXPENSE"
        categoryId = $categoryId
    }
    
    try {
        $createdTransaction = Invoke-RestMethod -Uri "$baseUrl/transactions" -Method POST -Headers $headers -Body ($newTransaction | ConvertTo-Json) -ErrorAction Stop
        Write-Host "✅ Transakcja utworzona" -ForegroundColor Green
        Write-Host "   ID: $($createdTransaction.id)" -ForegroundColor Gray
        Write-Host "   Amount: $($createdTransaction.amount)" -ForegroundColor Gray
        Write-Host "   Description: $($createdTransaction.description)`n" -ForegroundColor Gray
        
        $createdId = $createdTransaction.id
        
        # KROK 7: Aktualizacja transakcji (PATCH /transactions/:id)
        Write-Host "7️⃣  Aktualizacja transakcji (PATCH /transactions/:id)..." -ForegroundColor Yellow
        $updateData = @{
            amount = 999.99
            description = "Updated description"
        }
        
        try {
            $updatedTransaction = Invoke-RestMethod -Uri "$baseUrl/transactions/$createdId" -Method PATCH -Headers $headers -Body ($updateData | ConvertTo-Json) -ErrorAction Stop
            Write-Host "✅ Transakcja zaktualizowana" -ForegroundColor Green
            Write-Host "   New amount: $($updatedTransaction.amount)" -ForegroundColor Gray
            Write-Host "   New description: $($updatedTransaction.description)`n" -ForegroundColor Gray
        } catch {
            Write-Host "❌ Błąd aktualizacji: $_" -ForegroundColor Red
        }
        
        # KROK 8: Usuwanie transakcji (DELETE /transactions/:id)
        Write-Host "8️⃣  Usuwanie transakcji (DELETE /transactions/:id)..." -ForegroundColor Yellow
        try {
            $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/transactions/$createdId" -Method DELETE -Headers $headers -ErrorAction Stop
            Write-Host "✅ Transakcja usunięta" -ForegroundColor Green
            Write-Host "   Response: $($deleteResponse.message)`n" -ForegroundColor Gray
        } catch {
            Write-Host "❌ Błąd usuwania: $_" -ForegroundColor Red
        }
        
    } catch {
        Write-Host "❌ Błąd tworzenia transakcji: $_" -ForegroundColor Red
        Write-Host "   Body: $($newTransaction | ConvertTo-Json)" -ForegroundColor DarkRed
    }
} else {
    Write-Host "⚠️  Brak kategorii dla użytkownika" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  ✅ TEST ZAKOŃCZONY" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan
