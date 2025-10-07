# Script to seed test data for demo@tracker.com user
Write-Host "Creating test data for demo@tracker.com..." -ForegroundColor Cyan

$BASE_URL = "http://localhost:3001"

# Login
$loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body (@{ email = "demo@tracker.com"; password = "Demo123!" } | ConvertTo-Json)

$TOKEN = $loginResponse.accessToken

# Get categories
$categories = Invoke-RestMethod -Uri "$BASE_URL/categories" `
    -Method GET `
    -Headers @{ Authorization = "Bearer $TOKEN" }

Write-Host "Found $($categories.Count) categories" -ForegroundColor Green

# Create sample transactions for the last 3 months
$expenseCategories = $categories | Where-Object { $_.type -eq "EXPENSE" }
$incomeCategories = $categories | Where-Object { $_.type -eq "INCOME" }

$transactionsCreated = 0

# Last 3 months of transactions
for ($monthOffset = 0; $monthOffset -lt 3; $monthOffset++) {
    $date = (Get-Date).AddMonths(-$monthOffset)
    
    # 10 expenses per month
    for ($i = 0; $i -lt 10; $i++) {
        $randomCategory = $expenseCategories | Get-Random
        $randomDay = Get-Random -Minimum 1 -Maximum 28
        $randomAmount = Get-Random -Minimum 50 -Maximum 500
        
        $txDate = Get-Date -Year $date.Year -Month $date.Month -Day $randomDay -Format "yyyy-MM-dd"
        
        $transaction = @{
            amount = $randomAmount
            categoryId = $randomCategory.id
            date = $txDate
            description = "Test transaction $i for $(Get-Date $txDate -Format 'MMMM')"
            type = "EXPENSE"
        } | ConvertTo-Json
        
        try {
            Invoke-RestMethod -Uri "$BASE_URL/transactions" `
                -Method POST `
                -ContentType "application/json" `
                -Headers @{ Authorization = "Bearer $TOKEN" } `
                -Body $transaction | Out-Null
            $transactionsCreated++
        } catch {
            Write-Host "Failed to create expense: $_" -ForegroundColor Red
        }
    }
    
    # 5 incomes per month
    for ($i = 0; $i -lt 5; $i++) {
        $randomCategory = $incomeCategories | Get-Random
        $randomDay = Get-Random -Minimum 1 -Maximum 28
        $randomAmount = Get-Random -Minimum 1000 -Maximum 3000
        
        $txDate = Get-Date -Year $date.Year -Month $date.Month -Day $randomDay -Format "yyyy-MM-dd"
        
        $transaction = @{
            amount = $randomAmount
            categoryId = $randomCategory.id
            date = $txDate
            description = "Income $i for $(Get-Date $txDate -Format 'MMMM')"
            type = "INCOME"
        } | ConvertTo-Json
        
        try {
            Invoke-RestMethod -Uri "$BASE_URL/transactions" `
                -Method POST `
                -ContentType "application/json" `
                -Headers @{ Authorization = "Bearer $TOKEN" } `
                -Body $transaction | Out-Null
            $transactionsCreated++
        } catch {
            Write-Host "Failed to create income: $_" -ForegroundColor Red
        }
    }
}

Write-Host "✅ Created $transactionsCreated test transactions!" -ForegroundColor Green
