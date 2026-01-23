#!/usr/bin/env python3
import argparse
import re
import sys
from pathlib import Path

DIR_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
FILE_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+$")
LINK_RE = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")


def strip_code(text: str) -> str:
    text = re.sub(r"```[\s\S]*?```", "", text)
    text = re.sub(r"`[^`]*`", "", text)
    return text


def iter_targets(root: Path, paths: list[Path]) -> list[Path]:
    targets = []
    if paths:
        for p in paths:
            target = (root / p).resolve()
            if not target.exists():
                print(f"Missing path: {p}", file=sys.stderr)
                sys.exit(2)
            targets.append(target)
    else:
        targets.append(root.resolve())
    return targets


def collect_paths(targets: list[Path]) -> tuple[list[Path], list[Path]]:
    dirs = []
    files = []
    seen = set()
    for base in targets:
        for path in [base, *base.rglob("*")]:
            if path in seen:
                continue
            seen.add(path)
            if path.is_dir():
                dirs.append(path)
            elif path.is_file():
                files.append(path)
    return dirs, files


def rel(path: Path) -> str:
    try:
        return path.relative_to(Path.cwd()).as_posix()
    except ValueError:
        return path.as_posix()


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit interview question library structure.")
    parser.add_argument("--root", default="library", help="Library root path (default: library)")
    parser.add_argument("paths", nargs="*", help="Optional subpaths under root to audit")
    parser.add_argument("--max-lines", type=int, default=1000, help="Line limit for split suggestion")
    args = parser.parse_args()

    root = Path(args.root)
    if not root.exists():
        print(f"Root not found: {root}", file=sys.stderr)
        return 2

    targets = iter_targets(root, [Path(p) for p in args.paths])
    dirs, files = collect_paths(targets)

    bad_dirs = []
    bad_files = []
    missing_indexes = []
    bad_h1 = []
    long_docs = []
    bad_links = []

    for d in dirs:
        if d.name == "assets":
            continue
        if d.name.startswith("."):
            bad_dirs.append(rel(d))
            continue
        if d.name != root.name and not DIR_RE.match(d.name):
            bad_dirs.append(rel(d))
        if not (d / "README.md").exists() and not (d / "index.md").exists():
            missing_indexes.append(rel(d))

    for f in files:
        if f.name.startswith("."):
            bad_files.append(rel(f))
            continue
        if f.name not in {"README.md", "index.md"} and not FILE_RE.match(f.name):
            bad_files.append(rel(f))
        if f.suffix.lower() != ".md":
            continue
        text = f.read_text(encoding="utf-8", errors="ignore")
        cleaned = strip_code(text)
        h1_count = sum(1 for line in cleaned.splitlines() if line.startswith("# "))
        if h1_count != 1:
            bad_h1.append(f"{rel(f)} (count={h1_count})")
        line_count = text.count("\n") + 1
        if line_count > args.max_lines:
            long_docs.append(f"{rel(f)} (lines={line_count})")

        for m in LINK_RE.finditer(cleaned):
            raw = m.group(1).strip()
            if not raw or raw.startswith("#"):
                continue
            if re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", raw):
                continue
            path_part = raw.split("#", 1)[0]
            if not path_part:
                continue
            target = (f.parent / path_part).resolve()
            if target.is_dir():
                if not (target / "README.md").exists() and not (target / "index.md").exists():
                    bad_links.append(f"{rel(f)} -> {raw} (dir missing index)")
                continue
            if not target.exists():
                bad_links.append(f"{rel(f)} -> {raw} (missing)")

    def print_section(title: str, items: list[str]) -> None:
        if not items:
            return
        print(f"{title} ({len(items)}):")
        for item in items:
            print(f"  - {item}")

    print_section("Bad directory names", sorted(bad_dirs))
    print_section("Bad file names", sorted(bad_files))
    print_section("Missing index files", sorted(missing_indexes))
    print_section("H1 count != 1", sorted(bad_h1))
    print_section("Docs over line limit", sorted(long_docs))
    print_section("Broken relative links", sorted(bad_links))

    if any([bad_dirs, bad_files, missing_indexes, bad_h1, long_docs, bad_links]):
        return 1

    print("No issues found.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
