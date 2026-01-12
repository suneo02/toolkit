param(
  [string]$RepoRoot = "",
  [switch]$NoPull,
  [switch]$Prune
)
& "$PSScriptRoot\core\sync.ps1" -AgentName "codex" -RepoRoot $RepoRoot -NoPull:$NoPull -Prune:$Prune
