param(
  [string]$RepoRoot = "",
  [string]$TargetDir = "",
  [switch]$NoPull,
  [switch]$Prune
)
& "$PSScriptRoot\core\sync.ps1" -AgentName "gemini" -RepoRoot $RepoRoot -TargetDir $TargetDir -NoPull:$NoPull -Prune:$Prune