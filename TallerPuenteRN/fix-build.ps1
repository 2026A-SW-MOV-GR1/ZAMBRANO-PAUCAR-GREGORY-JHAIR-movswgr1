# fix-build.ps1
# Parchea el archivo graphicsConversions.h en la caché de Gradle
# cuando el error de std::format vuelve a aparecer.

Write-Host "🔧 Buscando archivos graphicsConversions.h en la caché de Gradle..." -ForegroundColor Cyan

$files = Get-ChildItem -Path "$env:USERPROFILE\.gradle\caches" -Recurse -Filter "graphicsConversions.h" -ErrorAction SilentlyContinue

if ($files.Count -eq 0) {
    Write-Host "⚠️  No se encontraron archivos en la caché. Puede que aún no se haya descargado." -ForegroundColor Yellow
    exit 1
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw

    if ($content -match 'return std::format\("{}%", dimension\.value\);') {
        Write-Host "  📝 Parcheando: $($file.FullName)" -ForegroundColor Yellow
        $patched = $content -replace 'return std::format\("{}%", dimension\.value\);', 'return std::to_string(dimension.value) + "%";'
        Set-Content -Path $file.FullName -Value $patched -Encoding UTF8 -NoNewline
        Write-Host "  ✅ Parcheado correctamente." -ForegroundColor Green
    } elseif ($content -match 'return std::to_string') {
        Write-Host "  ✅ Ya está parcheado: $($file.FullName)" -ForegroundColor Green
    } else {
        Write-Host "  ❓ Estado desconocido: $($file.FullName)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "✅ Listo. Ahora puedes ejecutar: npm run android" -ForegroundColor Green
