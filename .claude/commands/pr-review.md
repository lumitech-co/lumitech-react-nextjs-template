---
allowed-tools: Agent, Read, Grep, Glob, Bash, WebFetch, ToolSearch, AskUserQuestion
argument-hint: [PR number | PR URL | empty for current branch] [--dry-run] [--arch-only] [--func-only] [--approve]
description: Orchestrated PR review — reads the PR and its ticket, runs an architecture reviewer and a functional reviewer in parallel, merges their findings and posts one review
---

# PR Review — orchestrator

Review: **$ARGUMENTS**

You are the orchestrator. You do not review the code yourself — two specialist subagents do
that, in parallel. Your job is to give them a complete, identical picture of the change, then
merge what they return into a single review and publish it once.

Two subagents, both read-only:
- **`pr-architecture-reviewer`** — checks the change against the project's own rules, which it
  reads from `CLAUDE.md` at runtime.
- **`pr-functional-reviewer`** — checks the change against its ticket, and hunts for logic bugs
  on the real code path.

Flags in `$ARGUMENTS`: `--dry-run` (report here, never touch GitHub), `--arch-only` /
`--func-only` (run one reviewer), `--approve` (allow approving a clean PR instead of a neutral
comment).

---

## Step 1 — resolve what is being reviewed

- **A PR number or URL** (`123`, `#123`, `https://github.com/org/repo/pull/123`) → review that PR.
- **Empty** → find the open PR for the current branch. If there is none, fall back to reviewing
  the local diff against the base branch and force `--dry-run` (there is nowhere to post).
- **A module or path** (`src/modules/message`) → review the current branch's diff, but tell both
  agents to scope their reading to that area.

Never assume the base branch is `main` without checking. Use the PR's **actual** base. For a
local diff, try `main`, then `master`, and say which one you used.

## Step 2 — gather the facts (you, not the agents)

Use the **GitHub MCP server first** — it is authenticated and authoritative. Fall back to the
`gh` CLI only if the MCP is unavailable or lacks the tool, and say which one you used.

Collect:
1. PR metadata — title, description, author, state, base ← head, branch name.
2. The full diff and the per-file patches. **Keep the patches** — you need them in Step 5 to know
   which lines can legally carry an inline comment.
3. The list of changed files with their status (added / modified / deleted / renamed).
4. Commit messages.
5. CI status, if the PR has checks — a review that ignores a red build wastes everyone's time.
   Mention failing checks in the final report; do not try to fix them.

## Step 3 — find and read the ticket

Scan the PR title, branch name, description and commit messages for a task reference. Be
tracker-agnostic — take whatever this project actually uses:

- a bare key like `ABC-123` → Jira (build the browse URL from the org's Jira host if you know it)
- a URL to `*.atlassian.net/browse/…`, `linear.app/…`, `app.asana.com/…`, `trello.com/c/…`,
  `app.clickup.com/t/…`, `notion.so/…`
- `#123`, `Closes #123`, `Fixes #123` → a GitHub issue in this repository
- a plain link in the description that looks like a task tracker

Fetch each reference **you** find, so both agents (and the final report) work from the same
text. Prefer a connected MCP for that tracker (find one with ToolSearch — e.g. an Atlassian/Jira
MCP; the GitHub MCP for issues), and fall back to WebFetch on the URL.

Extract: summary, description, acceptance criteria, and anything that changes what "correct"
means (out-of-scope notes, follow-ups). If a ticket is unreachable, record that plainly — the
functional review then falls back to the PR description, and the final report must say the
review was done **without** the ticket, so nobody mistakes it for a verified match.

If there is no ticket reference at all, note it and continue. A PR with no stated intent is
itself worth flagging in the summary.

## Step 4 — run both reviewers in parallel, and **block on them**

Launch both subagents **in a single message** (two `Agent` calls in one block) so they run
concurrently, and launch each one **synchronously — `run_in_background: false`** so the calls
stay in flight until both have returned their JSON.

> ⚠️ **Never run the reviewers in the background.** This command must also work headless (a CI
> job, a GitHub Action), where there is no interactive event loop to wake you back up. If you
> start the subagents in the background and end your turn ("I'll wait for them to finish"), the
> headless run **terminates before the reviewers return** and no review is ever posted. Keep
> both `Agent` calls in the same turn and only move to Step 5 once **both** have answered.
> You lose nothing by blocking: parallel start + blocking means wall-clock is
> `max(architecture, functional)`, not their sum.

Give each of them the same context package:

- PR number, title, description, author
- base and head refs, and the exact diff command that reproduces the diff
  (`git diff <base>...<head>`)
- the list of changed files
- the ticket(s): key, URL, and the **full fetched text** — never just the link, or the agent will
  refetch it (or fail to) and you will get two different ideas of what the PR was supposed to do
- any scoping instruction from Step 1

Both agents are read-only and both return **JSON only**. Do not ask them to post anything —
publishing is yours alone.

If a subagent returns something that is not valid JSON, or dies, do not silently drop it: retry
it once, and if it fails again, say so in the final report rather than publishing a review that
looks complete but is missing half its coverage.

## Step 5 — merge

1. **Union** the findings from both agents.
2. **Deduplicate**: same `path` + same (or adjacent) `line` + same underlying problem → keep one,
   preferring the higher severity and the body with the concrete fix. Both agents legitimately
   find the same thing from different angles; the author should see it once.
3. **Sort**: `blocker` → `suggestion` → `nit`, and within a severity, by file.
4. **Validate every anchor**: an inline comment can only land on a line that appears on the RIGHT
   side of the diff for that file. Check each finding against the patches you kept in Step 2.
   A finding whose line is not in the diff is **not** dropped — move it into the review body as a
   general note with a `path:line` reference.
5. **Cap the noise**: post at most ~20 inline comments. If there are more, post the blockers and
   the strongest suggestions inline, and roll the rest into the body grouped by file. A review
   with 60 inline comments does not get read.

## Step 6 — confirm before publishing (interactive runs only)

Publishing is outward-facing and visible to the whole team, so in an **interactive** run show
the merged report here first and ask before posting (`AskUserQuestion`: post / dry-run only /
post without inline comments).

**Decide interactive vs headless from the environment, not from a hunch.** Before you even
consider asking, check it:

```bash
echo "CI=${CI:-} GITHUB_ACTIONS=${GITHUB_ACTIONS:-}"
```

Skip the question and publish straight away when:
- `CI` or `GITHUB_ACTIONS` is set — you are headless. There is nobody to answer, and a review
  that stops to ask is a review that never gets posted; or
- `--post` was passed.

If `--dry-run` was passed, never touch GitHub at all.

## Step 7 — publish one review, with the findings **inline**

Every finding that can be anchored goes out as an **inline review comment on its file and
line** — not as a wall of text in the body, not as a plain issue comment, not as chat output.
Only inline review comments create resolvable conversation threads, which is what lets the
author work through them one by one and lets the next reviewer see what is still open.

Publish everything in **one** pull request review:

- GitHub MCP `create_pull_request_review` with a `comments` array, each entry carrying `path`,
  `line` (plus `start_line` for a range), `side: "RIGHT"`, and `body`; or
- `gh api repos/{owner}/{repo}/pulls/{number}/reviews` with the same payload.

**Do not** post findings with `add_issue_comment` / `gh pr comment` — those are non-resolvable
issue comments and defeat the whole point.

The `event`:

- **Any blocker** → `REQUEST_CHANGES`.
- **No blockers, some suggestions** → `COMMENT`.
- **No findings at all** → `COMMENT` with the pass summary. Only use `APPROVE` if `--approve`
  was explicitly passed — approving someone's PR is a decision that belongs to a human by
  default.

**Then verify the comments actually landed** (`get_pull_request_comments`). The usual failure is
a `line` that is not on the RIGHT side of the diff, and GitHub rejects the whole review or drops
the comment. If that happens, fix the anchors and retry — do **not** quietly fall back to
dumping everything into the body.

**The review `body` is mandatory on every single run**, pass or fail, and it is never empty. When
there are no findings at all, you still submit a review with the body alone and no inline
comments. Never finish a run without a summary on the PR.

Review body:

```markdown
## PR Review

**Ticket:** ABC-123 — <title> (<matched | mismatched | unavailable | none>)
**Scope:** <n> files changed, base `<base>` ← `<head>`
**CI:** <passing | failing: which checks | none>

Review complete: 🔴 <n> Blockers, 🟡 <n> Suggestions, ⚪ <n> Nits — see the inline comments.

**Architecture** (rules from CLAUDE.md): <the agent's summary>
**Functional** (behavior vs ticket): <the agent's summary>

### Notes
<only what the inline comments cannot carry: findings whose line is not in the diff (with a
`path:line` reference), failing checks, a reviewer that errored, a ticket that could not be
fetched — anything that limits how much this review actually covers>
```

The findings themselves live **inline**, not in the body — the body is the tally, the two
summaries, and the honest caveats. On a **clean pass** the body is the header plus both
summaries, and it must say **what was checked and confirmed OK**, never a bare
"no violations found":

```markdown
## PR Review

✅ Review complete — no issues found.

**Ticket:** ABC-123 — matches the acceptance criteria.
**Architecture** (rules from CLAUDE.md): <what passed — no process.env outside env.ts, pages
stay Server Components with 'use client' only on the needed leaf, entity/feature scaffolded by
the generators with no extra segments, no layer-wide barrels, layer boundaries respected, QueryKeys
enum used, Zod validation on forms, Tailwind-only styling, kebab-case naming>.
**Functional:** <what was verified — the expected behaviors traced end-to-end, edge cases,
query-key consistency between reads and mutations, loading/error states, server/client data
ownership>.
```

That summary is the entire reason both agents return a `summary` field even when they find
nothing: without it the author cannot tell whether the bot verified the PR or simply fell over.
When the ticket could not be fetched, say so explicitly —
`Reviewed without the ticket — ABC-123 unavailable.` — so a passing review is never mistaken
for a verified match against requirements.

Inline comments carry the severity marker, the full finding body, and the suggested-change
block when the agent provided one — one comment per finding:

```markdown
🔴 [Blocker] `process.env.NEXT_PUBLIC_API_URL` is read directly here instead of importing `env`.
process.env may only be read in src/env.ts (CLAUDE.md, Architecture Rules #1).
Import `{ env }` from 'env' and use `env.NEXT_PUBLIC_API_URL` instead.
```

Where a finding carries a `suggestion`, use GitHub's **suggested changes** so the author can
apply the fix in one click:

````markdown
🟡 [Suggestion] Fetched data is mirrored into useState instead of read from the query cache
(CLAUDE.md, Architecture Rules #5):

```suggestion
const { data: todos } = useGetTodos(params);
```
````

## Step 8 — report back here

Finish with a short plain-language summary for the person who ran the command: what the PR does,
what the reviewers found, what was posted and where. Lead with the verdict (blocked / needs
changes / clean), not with the process.

---

## Rules for you, the orchestrator

- **Everything published to GitHub is in English** — inline comments, the review body, the
  suggested changes. Your closing summary in the chat can be in whatever language the user is
  speaking.
- **Never edit code and never push.** This command reviews; it does not fix. If the author asks
  for fixes afterwards, that is a separate, explicit request.
- **Do not review the diff yourself.** If you find something the agents missed, you may add it —
  but say it is yours, and hold it to the same bar you hold them to: a line, a rule or a failure
  scenario, and a fix.
- **Do not soften a blocker into a suggestion** because the PR is large or the author is senior.
- **Do not publish more than once per run.** If you must correct a published review, edit it or
  add a single follow-up comment — do not re-review.
- **Be honest about coverage.** A review that silently skipped the ticket, or lost a reviewer to
  an error, must say so. A confident-looking review with a hole in it is worse than an obviously
  partial one.
