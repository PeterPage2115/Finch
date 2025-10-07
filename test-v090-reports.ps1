# Test script for v0.9.0 Advanced Reports endpoints
# Run this after logging in to the application

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Testing v0.9.0 Advanced Reports API" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Configuration
$BASE_URL = "http://localhost:3001"
$TOKEN = "" # Will be filled after login

# Test credentials (change if needed)
$testEmail = "demo@tracker.com"
$testPassword = "Demo123!"

Write-Host "Step 1: Login..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body (@{
            email = $testEmail
            password = $testPassword
        } | ConvertTo-Json)
    
    $TOKEN = $loginResponse.accessToken
    Write-Host "✅ Login successful! Token obtained." -ForegroundColor Green
} catch {
    Write-Host "❌ Login failed. Please check credentials or create test user first." -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Get current month date range
$startDate = (Get-Date -Day 1).ToString("yyyy-MM-dd")
$endDate = (Get-Date).ToString("yyyy-MM-dd")

Write-Host "`nUsing date range: $startDate to $endDate`n" -ForegroundColor Cyan

# Test 1: Summary (existing - baseline)
Write-Host "Test 1: GET /reports/summary" -ForegroundColor Yellow
try {
    $summary = Invoke-RestMethod -Uri "$BASE_URL/reports/summary?startDate=$startDate&endDate=$endDate" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $TOKEN" }
    
    Write-Host "✅ Summary: Income: $($summary.totalIncome), Expenses: $($summary.totalExpenses)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

# Test 2: By Category (existing - baseline)
Write-Host "`nTest 2: GET /reports/by-category" -ForegroundColor Yellow
try {
    $byCategory = Invoke-RestMethod -Uri "$BASE_URL/reports/by-category?startDate=$startDate&endDate=$endDate&type=EXPENSE" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $TOKEN" }
    
    $categoryCount = $byCategory.categories.Count
    Write-Host "✅ By Category: Found $categoryCount expense categories" -ForegroundColor Green
    
    # Save first category ID for next test
    $firstCategoryId = $byCategory.categories[0].categoryId
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

# Test 3: Category Trend (NEW - v0.9.0-alpha)
Write-Host "`nTest 3: GET /reports/category-trend (v0.9.0-alpha)" -ForegroundColor Yellow
try {
    $categoryTrend = Invoke-RestMethod -Uri "$BASE_URL/reports/category-trend?startDate=$startDate&endDate=$endDate&granularity=daily" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $TOKEN" }
    
    $dataPoints = $categoryTrend.data.Count
    Write-Host "✅ Category Trend: $dataPoints data points with granularity: $($categoryTrend.granularity)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

# Test 4: Category Details (NEW - v0.9.0-alpha)
if ($firstCategoryId) {
    Write-Host "`nTest 4: GET /reports/category/:id/details (v0.9.0-alpha)" -ForegroundColor Yellow
    try {
        $categoryDetails = Invoke-RestMethod -Uri "$BASE_URL/reports/category/$firstCategoryId/details?startDate=$startDate&endDate=$endDate" `
            -Method GET `
            -Headers @{ Authorization = "Bearer $TOKEN" }
        
        $txCount = $categoryDetails.transactions.Count
        Write-Host "✅ Category Details: $($categoryDetails.category.name) has $txCount transactions" -ForegroundColor Green
        Write-Host "   Total: $($categoryDetails.summary.totalAmount), Average: $($categoryDetails.summary.averageAmount)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Failed: $_" -ForegroundColor Red
    }
}

# Test 5: Trends Comparison (NEW - v0.9.0-beta)
Write-Host "`nTest 5: GET /reports/trends-comparison (v0.9.0-beta)" -ForegroundColor Yellow
try {
    $trendsComparison = Invoke-RestMethod -Uri "$BASE_URL/reports/trends-comparison?startDate=$startDate&endDate=$endDate" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $TOKEN" }
    
    Write-Host "✅ Trends Comparison:" -ForegroundColor Green
    Write-Host "   Current: Income: $($trendsComparison.currentPeriod.income), Expenses: $($trendsComparison.currentPeriod.expenses)" -ForegroundColor Gray
    Write-Host "   Previous: Income: $($trendsComparison.previousPeriod.income), Expenses: $($trendsComparison.previousPeriod.expenses)" -ForegroundColor Gray
    Write-Host "   Change: Income: $($trendsComparison.changes.income.percentage)%, Expenses: $($trendsComparison.changes.expenses.percentage)%" -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

# Test 6: Monthly Trend (NEW - v0.9.0-beta)
Write-Host "`nTest 6: GET /reports/monthly-trend (v0.9.0-beta)" -ForegroundColor Yellow
try {
    $monthlyTrend = Invoke-RestMethod -Uri "$BASE_URL/reports/monthly-trend?months=6" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $TOKEN" }
    
    $monthCount = $monthlyTrend.data.Count
    Write-Host "✅ Monthly Trend: $monthCount months of data" -ForegroundColor Green
    
    # Show first and last month
    if ($monthCount -gt 0) {
        $firstMonth = $monthlyTrend.data[0]
        $lastMonth = $monthlyTrend.data[$monthCount - 1]
        Write-Host "   First: $($firstMonth.month) - Income: $($firstMonth.income), Expenses: $($firstMonth.expenses)" -ForegroundColor Gray
        Write-Host "   Last: $($lastMonth.month) - Income: $($lastMonth.income), Expenses: $($lastMonth.expenses)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

# Test 7: Export CSV (NEW - v0.9.0-rc)
Write-Host "`nTest 7: GET /reports/export/csv (v0.9.0-rc)" -ForegroundColor Yellow
try {
    $csvFile = "$PSScriptRoot\test-export.csv"
    Invoke-RestMethod -Uri "$BASE_URL/reports/export/csv?startDate=$startDate&endDate=$endDate" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $TOKEN" } `
        -OutFile $csvFile
    
    $csvContent = Get-Content $csvFile -First 5
    $lineCount = (Get-Content $csvFile).Count
    Write-Host "✅ CSV Export: $lineCount lines saved to test-export.csv" -ForegroundColor Green
    Write-Host "   First 5 lines:" -ForegroundColor Gray
    $csvContent | ForEach-Object { Write-Host "   $_" -ForegroundColor DarkGray }
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

# Test 8: Export PDF (NEW - v0.9.0-rc)
Write-Host "`nTest 8: GET /reports/export/pdf (v0.9.0-rc)" -ForegroundColor Yellow
try {
    $pdfFile = "$PSScriptRoot\test-export.pdf"
    Invoke-RestMethod -Uri "$BASE_URL/reports/export/pdf?startDate=$startDate&endDate=$endDate" `
        -Method GET `
        -Headers @{ Authorization = "Bearer $TOKEN" } `
        -OutFile $pdfFile
    
    $fileSize = [math]::Round((Get-Item $pdfFile).Length / 1KB, 2)
    Write-Host "✅ PDF Export: $fileSize KB saved to test-export.pdf" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Testing Complete!" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "- v0.9.0-alpha: Category trend & details endpoints" -ForegroundColor White
Write-Host "- v0.9.0-beta: Trends comparison & monthly trend endpoints" -ForegroundColor White
Write-Host "- v0.9.0-rc: CSV & PDF export endpoints" -ForegroundColor White
Write-Host "`nAll tests completed. Check the output above for results.`n" -ForegroundColor Green
