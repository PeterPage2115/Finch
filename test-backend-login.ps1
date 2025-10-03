# Test API Logowania - Backend

Write-Host "🔍 Test Backend API" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Healthcheck
Write-Host "1️⃣ Test healthcheck..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing
    Write-Host "✅ Backend odpowiada: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Content: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend nie odpowiada!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 2: Login z niepoprawnym hasłem
Write-Host "2️⃣ Test login (niepoprawne hasło)..." -ForegroundColor Yellow
$body = @{
    email = "piotr.paz04@gmail.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -ErrorAction Stop
    Write-Host "⚠️ Nieoczekiwane: logowanie zaakceptowane!" -ForegroundColor Yellow
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Poprawnie odrzucono (401 Unauthorized)" -ForegroundColor Green
    } else {
        Write-Host "❌ Nieoczekiwany błąd: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 3: Pytanie o hasło i próba logowania
Write-Host "3️⃣ Test login (interaktywny)..." -ForegroundColor Yellow
Write-Host "Wprowadź hasło dla piotr.paz04@gmail.com:" -ForegroundColor Cyan
$securePassword = Read-Host -AsSecureString
$password = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword))

$body = @{
    email = "piotr.paz04@gmail.com"
    password = $password
} | ConvertTo-Json

Write-Host "📡 Wysyłanie żądania..." -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -ErrorAction Stop
    
    Write-Host "✅ SUKCES! Zalogowano pomyślnie" -ForegroundColor Green
    Write-Host ""
    Write-Host "📦 Odpowiedź z serwera:" -ForegroundColor Cyan
    Write-Host "   User ID: $($response.user.id)" -ForegroundColor White
    Write-Host "   Email: $($response.user.email)" -ForegroundColor White
    Write-Host "   Name: $($response.user.name)" -ForegroundColor White
    Write-Host "   Token length: $($response.accessToken.Length) znaków" -ForegroundColor White
    Write-Host "   Token preview: $($response.accessToken.Substring(0, 30))..." -ForegroundColor Gray
    
    Write-Host ""
    Write-Host "✅ To hasło DZIAŁA! Użyj go na stronie /login-debug" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Logowanie nie powiodło się" -ForegroundColor Red
    Write-Host "   Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "   Błąd: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🏁 Test zakończony" -ForegroundColor Cyan
