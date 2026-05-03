# Implementation plans

Each file in this directory is a focused implementation plan covering one major part of Thumbtax. Execute them in order — later plans depend on artifacts from earlier ones.

| # | Plan | Depends on |
|---|------|------------|
| 00 | [Project setup](00-setup.md) | — |
| 01 | [Common types](01-common-types.md) | 00 |
| 02 | [Form specifications](02-specifications.md) | 01 |
| 03 | [Workbook engine](03-engine.md) | 01, 02, 04 (Task 1 only) |
| 04 | [User state](04-state.md) | 01, 02, 03 |
| 05 | [Persistence](05-persistence.md) | 01, 02, 04 |
| 06 | [Connections graph](06-connections-graph.md) | 02, 04 |
| 07 | [Exporters](07-exporters.md) | 02, 03, 04 |
| 08 | [UI](08-ui.md) | 00–07 |
| 09 | [Deployment](09-deployment.md) | 00–08 |

## Cross-plan ordering note

The engine (`03`) imports `PrimaryState` from the state module (`04`). Run **Task 1 of `04-state.md`** (which adds the type files) before `03`, then return to `04` for the rest. This is called out at the top of `04-state.md`.

## Execution

Use [superpowers:subagent-driven-development](../../.claude/skills/) (one fresh subagent per task with review between tasks) or [superpowers:executing-plans](../../.claude/skills/) (inline batch execution with checkpoints).
