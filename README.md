# Suneo Agent Skills

A collection of AI agent skills for documenting, archiving, and structuring project experiences. These modular skills enable comprehensive technical documentation, content audit, and interview-ready materials generation.

## Skills Overview

### 1. **Doc Archive** (`doc-archive/`)

Generates and maintains conversation and project archives in Chinese, following structured formatting rules.

**Use cases:**

- Archive conversations and dialogue histories
- Generate archive entries from Git commit histories
- Compile historical spec documents into archive summaries
- Filter and organize archives by time range, author, and model tags

**Key features:**

- Supports sources: conversations, specs, Git logs
- Parameterized filtering (date range, author, path)
- Automated timestamp tracking
- Template-based formatting
- Script-based Git history query utility

---

### 2. **Project Experience Baseline** (`project-experience-baseline/`)

Validates and routes project experience content across different document formats, ensuring truthfulness and quality compliance.

**Use cases:**

- Audit project experience content for quality and accuracy
- Route requests to appropriate document types (whitepaper/resume/manuscript)
- Validate technical claims against evidence
- Enforce baseline language standards and remove filler words
- Apply STAR-Plus framework compliance checks

**Key features:**

- Decision flow for content routing
- Comprehensive audit workflow
- Evidence traceability enforcement
- Language filter (action verbs, banned filler words)
- STAR-Plus signal validation
- Leveling matrix alignment for different target levels

---

### 3. **Project Experience Resume** (`project-experience-resume/`)

Creates high-density, ATS-safe resume entries for project experience using STAR-L compression.

**Use cases:**

- Draft or rewrite project experience sections for resumes
- Convert whitepapers, code, and notes into 1-line summary + 3-4 bullets
- Optimize resume bullets for signal-to-noise ratio
- Compress technical achievements into recruitment-friendly format

**Key features:**

- STAR-L (Lite) compression format
- High-density bullet construction
- Scale metrics integration (PV/UV/orders/concurrency)
- Tech stack highlighting
- Quantified results emphasis
- ATS-safe punctuation and formatting
- Quality gates for completeness and accuracy

---

### 4. **Project Experience Manuscript** (`project-experience-manuscript/`)

Creates interview-ready project experience narratives with defensive Q&A and deep-dive explanations.

**Use cases:**

- Draft oral scripts for technical interviews
- Create 60-second hooks and deep-dive narratives
- Prepare defensive Q&A for technical challenges
- Generate interview prep materials from resume bullets or whitepapers
- Structure STAR-Plus narratives with trade-off analysis

**Key features:**

- 60-second hook structure
- STAR-Plus deep-dive expansion
- Defensive Q&A preparation (trade-offs, fundamentals, reflection)
- Mock interview simulation (3-round)
- Business impact tie-in for every technical detail
- Interview-friendly language refinement

---

### 5. **Project Whitepaper** (`project-whitepaper/`)

Generates comprehensive technical whitepapers documenting full project architecture, decisions, and implementations.

**Use cases:**

- Create full project-level technical documentation
- Document architecture decisions with ADR tables
- Build technical asset documentation
- Generate in-depth project experience reports
- Document case studies and post-mortems
- Compile knowledge base snippets

**Key features:**

- STAR-Plus framework integration
- Mermaid architecture diagrams
- ADR (Architecture Decision Record) tables
- Core feature implementation details
- Deep-dive case study sections
- Post-mortem and incident documentation
- Knowledge base snippets with code examples
- Baseline compliance validation

---

### 6. **Spec Doc Writer** (`spec-doc-writer/`)

Structures and maintains specification documents following repository conventions with implementation planning and status tracking.

**Use cases:**

- Create spec documentation for tasks (`docs/specs/<task>/`)
- Break down tasks into manageable specifications
- Maintain implementation plans with status tracking
- Generate spec indices and cross-references
- Validate spec completion and status

**Key features:**

- README.md generation with task indices
- `implementation-plan.json` with atomic task tracking
- Modular `spec-*.md` files (max 150 lines each)
- Bidirectional `@see` references (docs ↔ code)
- Status tracking (initial: failed → completion path)
- Template-based documentation
- Atomic commit validation

---

## Workflow Integration

These skills work together to create a complete project experience documentation pipeline:

```
Input (Code/Notes/Conversations)
    ↓
Project Experience Baseline (Routing & Validation)
    ↓
┌───────────────┬──────────────────┬──────────────────┐
│               │                  │                  │
↓               ↓                  ↓                  ↓
Whitepaper  Resume           Manuscript        Spec Doc
(Technical  (Compressed      (Interview       (Task
 Deep-dive) Bullets)         Narratives)      Documentation)
│               │                  │                  │
└───────────────┴──────────────────┴──────────────────┘
    ↓
Doc Archive (Historical Record)
```

## Directory Structure

```
skills/
├── doc-archive/              # Conversation/project archiving
│   ├── SKILL.md             # Skill definition
│   ├── references/          # Templates and utilities
│   │   └── archive-templates.md
│   └── scripts/             # Git history query utility
│       └── git_history_query.py
├── project-experience-baseline/
│   ├── SKILL.md
│   └── references/
│       └── project-experience-baseline.md
├── project-experience-manuscript/
│   ├── SKILL.md
│   └── references/
│       ├── project-experience-baseline.md
│       └── project-experience-manuscript.md
├── project-experience-resume/
│   ├── SKILL.md
│   └── references/
│       ├── project-experience-baseline.md
│       └── project-experience-resume.md
├── project-whitepaper/
│   ├── SKILL.md
│   └── references/
│       ├── baseline.md
│       └── whitepaper.md
└── spec-doc-writer/
    ├── SKILL.md
    └── references/
        ├── spec-doc-rule.md
        └── spec-templates.md
```

## Getting Started

1. **Choose a skill** based on your documentation need
2. **Read the skill's SKILL.md** for quick start and workflow
3. **Review the references/** folder for detailed rules and templates
4. **Follow the input checklists** to gather required information
5. **Use the workflow steps** to generate output
6. **Validate against quality gates** before finalizing

## Key Principles

- **Evidence-Based**: All technical claims must be traceable to sources
- **Comprehensive**: Supports full documentation lifecycle from raw notes to interview narratives
- **Modular**: Each skill solves a specific documentation problem
- **Reusable**: Skills build on shared baselines (project-experience-baseline)
- **Structured**: Templates and checklists ensure consistency
- **Bilingual**: English documentation with Chinese skill descriptions

## Language Notes

- Most skill definitions and instructions are in **Chinese**
- Reference documents vary by skill
- Output language is typically matched to the input or explicitly specified

---

For more information, explore the individual skill directories and their reference documentation.
