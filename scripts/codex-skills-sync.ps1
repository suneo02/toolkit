param(
  [string]$RepoRoot = "",
  [switch]$NoPull,
  [switch]$Prune
)

$ErrorActionPreference = "Stop"

if (-not $RepoRoot) {
  $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
} else {
  $RepoRoot = (Resolve-Path $RepoRoot).Path
}

$RepoSkills = Join-Path $RepoRoot "skills"
$Target = Join-Path $env:USERPROFILE ".codex\skills"

if (-not (Test-Path -LiteralPath $RepoSkills)) {
  Write-Error "Repo skills dir not found: $RepoSkills"
  exit 1
}

New-Item -ItemType Directory -Path $Target -Force | Out-Null

if (-not $NoPull) {
  if (Get-Command git -ErrorAction SilentlyContinue) {
    Write-Host "git pull: $RepoRoot"
    git -C $RepoRoot pull
  } else {
    Write-Host "git not found; skip pull"
  }
}

$repoDirs = Get-ChildItem -Path $RepoSkills -Directory
foreach ($dir in $repoDirs) {
  $link = Join-Path $Target $dir.Name
  if (Test-Path -LiteralPath $link) {
    $item = Get-Item -LiteralPath $link -Force
    if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
      Write-Host "skip: $link (exists)"
    } else {
      Write-Host "skip: $link (real dir)"
    }
    continue
  }

  New-Item -ItemType Junction -Path $link -Target $dir.FullName | Out-Null
  Write-Host "linked: $link -> $($dir.FullName)"
}

if ($Prune) {
  $repoNames = $repoDirs.Name
  Get-ChildItem -Path $Target -Directory | ForEach-Object {
    if ($_.Name -eq ".system") {
      return
    }
    if ($repoNames -notcontains $_.Name) {
      $item = Get-Item -LiteralPath $_.FullName -Force
      if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
        Remove-Item -LiteralPath $_.FullName -Force
        Write-Host "removed: $($_.FullName) (not in repo)"
      } else {
        Write-Host "skip: $($_.FullName) (real dir)"
      }
    }
  }
}

Write-Host "done"
