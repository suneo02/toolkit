param(
  [string]$RepoRoot = "",
  [switch]$NoPull,
  [switch]$Prune
)
& "$PSScriptRoot\core\sync.ps1" -AgentName "gemini" -RepoRoot $RepoRoot -NoPull:$NoPull -Prune:$Prune