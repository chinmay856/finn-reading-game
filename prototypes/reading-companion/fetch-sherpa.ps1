$ErrorActionPreference = "Stop"

$Version = "v1.13.2"
$ArchiveName = "sherpa-onnx-wasm-simd-v1.13.2-en-asr-zipformer.tar.bz2"
$PrototypeRoot = $PSScriptRoot
$DownloadRoot = Join-Path $PrototypeRoot "vendor-download"
$ArchivePath = Join-Path $DownloadRoot $ArchiveName
$ExpandedName = "sherpa-onnx-wasm-simd-v1.13.2-en-asr-zipformer"
$ExpandedPath = Join-Path $PrototypeRoot $ExpandedName
$VendorPath = Join-Path $PrototypeRoot "vendor"
$GitBin = "C:\Program Files\Git\usr\bin"
$Tar = Join-Path $GitBin "tar.exe"

if (Test-Path $VendorPath) {
  Write-Host "Sherpa-ONNX vendor assets are already present at $VendorPath"
  exit 0
}

if (-not (Test-Path $Tar)) {
  throw "Git for Windows tar was not found at $Tar"
}

New-Item -ItemType Directory -Force $DownloadRoot | Out-Null
gh release download $Version `
  --repo k2-fsa/sherpa-onnx `
  --pattern $ArchiveName `
  --dir $DownloadRoot `
  --clobber

$env:PATH = "$GitBin;$env:PATH"
& $Tar -xjf $ArchivePath -C $PrototypeRoot
if ($LASTEXITCODE -ne 0) { throw "Could not unpack $ArchiveName" }

Move-Item -LiteralPath $ExpandedPath -Destination $VendorPath
Remove-Item -LiteralPath $DownloadRoot -Recurse -Force
Write-Host "Prepared Sherpa-ONNX $Version assets at $VendorPath"
