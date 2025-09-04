LLND Curriculum

This folder contains the canonical module list and small UI component stubs used to wire the curriculum into the app.

Files:
- `llnd-modules.json` — master list of subjects and module titles.

Components (under `components/curriculum`):
- `CurriculumBuilder.tsx` — minimal module builder UI.
- `ProgressDashboard.tsx` — sample educator dashboard component.
- `GoalTrackerWrapper.tsx` — thin wrapper around existing `GoalTracker.jsx`.

How to use
- Import `llnd-modules.json` to populate subject/topic selectors.
- Replace the stub components with fuller UI when integrating into pages.
