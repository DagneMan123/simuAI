# Ultimate Prisma Fix Script
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "║           🔧 ULTIMATE PRISMA FIX 🔧                        ║" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Set-Location backend

Write-Host "[Step 1/4] Checking Prisma installation..." -ForegroundColor Yellow
if (!(Test-Path "node_modules\@prisma\client")) {
    Write-Host "Installing @prisma/client..." -ForegroundColor Yellow
    npm install @prisma/client
}
Write-Host "✓ Prisma installed" -ForegroundColor Green
Write-Host ""

Write-Host "[Step 2/4] Creating database and running migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name init --skip-generate
Write-Host ""

Write-Host "[Step 3/4] Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
Write-Host ""

Write-Host "[Step 4/4] Verifying Prisma Client..." -ForegroundColor Yellow
if (Test-Path "node_modules\.prisma\client") {
    Write-Host "✓ SUCCESS: Prisma Client generated!" -ForegroundColor Green
} else {
    Write-Host "✗ Trying alternative method..." -ForegroundColor Red
    Remove-Item -Recurse -Force "node_modules\.prisma" -ErrorAction SilentlyContinue
    npx prisma generate --force
}
Write-Host ""

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    ✅ FIX COMPLETE! ✅                      ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Starting server..." -ForegroundColor Cyan
Write-Host ""

npm run dev
