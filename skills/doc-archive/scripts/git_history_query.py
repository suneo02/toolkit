#!/usr/bin/env python3
"""
Query git history by time range/author/path and output JSON or Markdown.
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

FIELD_SEP = "\x1f"


def run_git(repo: Path, args: list[str]) -> str:
    cmd = ["git", "-C", str(repo)] + args
    result = subprocess.run(cmd, check=False, text=True, capture_output=True)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "git command failed")
    return result.stdout


def ensure_repo(repo: Path) -> None:
    try:
        out = run_git(repo, ["rev-parse", "--is-inside-work-tree"]).strip()
    except RuntimeError as exc:
        raise RuntimeError(f"Not a git repository: {repo}") from exc
    if out != "true":
        raise RuntimeError(f"Not a git repository: {repo}")


def parse_git_log(output: str) -> list[dict[str, object]]:
    commits: list[dict[str, object]] = []
    current: dict[str, object] | None = None

    for line in output.splitlines():
        if FIELD_SEP in line:
            if current:
                commits.append(current)
            parts = line.split(FIELD_SEP)
            if len(parts) < 6:
                continue
            current = {
                "hash": parts[0],
                "author_name": parts[1],
                "author_email": parts[2],
                "date": parts[3],
                "subject": parts[4],
                "body": parts[5],
                "files": [],
            }
            continue
        if not current:
            continue
        if not line.strip():
            continue
        current["files"].append(line.strip())

    if current:
        commits.append(current)
    return commits


def render_markdown(query: dict[str, object], commits: list[dict[str, object]]) -> str:
    lines = [
        "# Git History Report",
        "",
        "## Query",
        f"- repo: {query.get('repo')}",
        f"- since: {query.get('since') or ''}",
        f"- until: {query.get('until') or ''}",
        f"- author: {query.get('author') or ''}",
        f"- paths: {', '.join(query.get('paths') or [])}",
        "",
        "## Commits",
    ]

    if not commits:
        lines.append("- (no commits)")
        return "\n".join(lines)

    for item in commits:
        lines.extend(
            [
                "",
                f"### {item['date']} {item['subject']} ({item['hash'][:7]})",
                f"- author: {item['author_name']} <{item['author_email']}>",
            ]
        )
        files = item.get("files") or []
        if files:
            lines.append("- files:")
            for path in files:
                lines.append(f"  - {path}")
        body = (item.get("body") or "").strip()
        if body:
            lines.append("- body:")
            for line in body.splitlines():
                lines.append(f"  - {line}")

    return "\n".join(lines)


def write_output(path: str | None, content: str) -> None:
    if not path:
        print(content)
        return
    Path(path).write_text(content, encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Query git history by time range/author/path and output JSON or Markdown."
    )
    parser.add_argument(
        "--repo",
        default=str(Path.cwd()),
        help="Path to the git repository (default: cwd)",
    )
    parser.add_argument("--since", help="Since time (e.g. '2025-01-01')")
    parser.add_argument("--until", help="Until time (e.g. '2025-01-31')")
    parser.add_argument("--author", help="Author filter (name or email)")
    parser.add_argument(
        "--path",
        dest="paths",
        action="append",
        default=[],
        help="Path filter (can repeat)",
    )
    parser.add_argument("--max-count", type=int, help="Maximum commit count")
    parser.add_argument(
        "--format",
        choices=["json", "md"],
        default="json",
        help="Output format",
    )
    parser.add_argument(
        "--output",
        help="Write output to file instead of stdout",
    )
    parser.add_argument(
        "--no-merges",
        action="store_true",
        help="Exclude merge commits",
    )

    args = parser.parse_args()
    repo = Path(args.repo).resolve()

    try:
        ensure_repo(repo)
    except RuntimeError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    format_str = FIELD_SEP.join(["%H", "%an", "%ae", "%ad", "%s", "%b"])
    git_args = [
        "log",
        "--date=iso-strict",
        f"--pretty=format:{format_str}",
        "--name-only",
    ]
    if args.no_merges:
        git_args.append("--no-merges")
    if args.since:
        git_args.append(f"--since={args.since}")
    if args.until:
        git_args.append(f"--until={args.until}")
    if args.author:
        git_args.append(f"--author={args.author}")
    if args.max_count:
        git_args.append(f"-n{args.max_count}")
    if args.paths:
        git_args.append("--")
        git_args.extend(args.paths)

    try:
        output = run_git(repo, git_args)
    except RuntimeError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    commits = parse_git_log(output)
    query = {
        "repo": str(repo),
        "since": args.since,
        "until": args.until,
        "author": args.author,
        "paths": args.paths,
        "max_count": args.max_count,
        "no_merges": args.no_merges,
    }

    if args.format == "json":
        content = json.dumps({"query": query, "commits": commits}, ensure_ascii=False, indent=2)
    else:
        content = render_markdown(query, commits)

    write_output(args.output, content)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
