# Data Dictionary Orchestration App: Beginner Architecture Guide

This guide explains how the React app is structured, where features live, how pieces are wired together, and how to add new functionality safely.

## 1) Big-Picture Mental Model

Think of the app as 3 layers:

1. **App layer (feature orchestration)**
   - Decides routes, app state, and how UI actions call backend APIs.
   - Main file: `apps/orchestration/src/app/app.tsx`

2. **UI layer (shared components and layout)**
   - Header, branch selector, Generate menu, modals, sign-in dialog, reusable controls.
   - Main file: `libs/ui/src/lib/ui.tsx`
   - Styles: `libs/ui/src/lib/ui.module.scss`

3. **API layer (HTTP client)**
   - Typed wrappers around backend endpoints.
   - Main file: `libs/api-client/src/lib/api-client.ts`

At runtime the flow is usually:

- User clicks in UI (`AppLayout`) -> callback prop to `App` -> API call via `OrchestrationApiClient` -> state updates -> UI re-renders.

---

## 2) Where Everything Lives

### Entry point and routing

- `apps/orchestration/src/main.tsx`
  - Boots React and router.
- `apps/orchestration/src/app/app.tsx`
  - Main app component.
  - Creates API client.
  - Defines route table with `react-router-dom`.
  - Wires `AppLayout` props to handler functions.

### Page components

- `apps/orchestration/src/app/features.tsx`
  - Contains page components such as:
    - `HomePage`
    - `PreviewDefaultPage`
    - `PreviewHomePage`
    - `PreviewIndexPage`
    - `PreviewDetailPage`
    - `ErrorStatePage`
  - Also contains some local rendering helpers.

### Shared page helpers

- `apps/orchestration/src/app/pages/shared/helpers.ts`
  - Route/index mapping helpers.
  - Preview constants like tile metadata.
  - Utility functions for ids, labels, anchor scrolling, index normalization.

### Auth helpers

- `apps/orchestration/src/app/auth.ts`
  - Persists/clears session in `localStorage`.
- `apps/orchestration/src/app/openid-connect-callback.tsx`
  - Completes OpenID Connect callback flow.

### Shared constants

- `apps/orchestration/src/app/constants.ts`
  - Route constants (`ROUTES`)
  - Storage keys (`STORAGE_KEYS`)
  - API/config constants (`API_CONFIG`)
  - Shared error/notification messages

### Shared UI library

- `libs/ui/src/lib/ui.tsx`
  - `AppLayout` (header, branch selector, Generate menu)
  - Modal rendering (Statistics, Integrity, Change Paper preview, About)
  - `BranchPicker`, `PreviewBreadcrumb`, `PreviewToc`

### API client library

- `libs/api-client/src/lib/api-client.ts`
  - Typed request methods like:
    - `getBranches`
    - `getBranchStatistics`
    - `getIntegrityChecks`
    - `getPreviewIndex`, `getPreviewDetail`, `getPreviewReferences`
    - `getChangePaperPreview`
    - `generateChangePaper`, `generateCodeSystems`, `generateValueSets`, `generateWebsite`
    - `signIn`, `signOut`, `getOpenIdConnectProviders`

---

## 3) How It Is Wired Together

## A) App startup

1. `App` creates `OrchestrationApiClient` with base URL from env.
2. On mount, `App` loads:
   - OpenID providers
   - Branch list
3. `App` tracks selected branch in state and `localStorage`.

## B) Layout wiring

`App` renders `AppLayout` and passes callback props like:

- `onBranchChange`
- `onLoadStatistics`
- `onLoadIntegrityChecks`
- `onRunChangePaperPreview`
- `onGeneratePublish`
- `onLoadAbout`
- auth callbacks (`onSignIn`, `onSignOut`, `onOpenIdConnect`)

`AppLayout` invokes these callbacks from menu actions and dialogs.

## C) Route rendering

Inside `app.tsx`, `<Routes>` maps paths to page components in `features.tsx`.
Example:

- `/preview/:branch` -> `PreviewHomePage`
- `/preview/:branch/:index` -> `PreviewIndexPage`
- `/preview/:branch/:index/:id` -> `PreviewDetailPage`

## D) API call chain example (Generate -> Preview Change Paper)

1. User clicks Generate > Preview > Change Paper in `AppLayout`.
2. `AppLayout` calls `onRunChangePaperPreview(branchId, includeDataSets)`.
3. `App` handler calls `apiClient.getChangePaperPreview(...)`.
4. Result is returned to `AppLayout`.
5. `AppLayout` shows it in a large modal.

---

## 4) Where To Find Specific Functionality

### Sign-in / Sign-out

- Main handlers: `apps/orchestration/src/app/app.tsx`
  - `handleSignIn`, `handleSignOut`, `handleOpenIdConnect`
- Session persistence: `apps/orchestration/src/app/auth.ts`
- UI dialog: `libs/ui/src/lib/sign-in-dialog.tsx`

### Branch picker and selected branch behavior

- Selected branch state + URL sync: `apps/orchestration/src/app/app.tsx`
- Branch picker UI: `libs/ui/src/lib/ui.tsx` and `BranchPicker`

### Generate menu items

- Menu structure and modal UI: `libs/ui/src/lib/ui.tsx`
- API work for actions: `apps/orchestration/src/app/app.tsx`

### Preview pages

- Page components and rendering: `apps/orchestration/src/app/features.tsx`
- Preview mapping helpers/constants: `apps/orchestration/src/app/pages/shared/helpers.ts`
- Backend calls: `libs/api-client/src/lib/api-client.ts`

### Error pages

- Error variants and display: `apps/orchestration/src/app/features.tsx` (`ErrorStatePage`)

---

## 5) How To Add New Functionality (Practical Recipes)

## Recipe 1: Add a new backend endpoint usage

1. Add typed method in `libs/api-client/src/lib/api-client.ts`.
2. Add/adjust return types near existing type declarations.
3. In `apps/orchestration/src/app/app.tsx`, add handler using the new API method.
4. Pass handler into `AppLayout` (if action comes from top menu) or directly to a page component.
5. Render result in a page/modal.

## Recipe 2: Add a new Generate menu action

1. In `libs/ui/src/lib/ui.tsx`:
   - Add menu item under the relevant section.
   - If needed, add modal state and content.
2. In `apps/orchestration/src/app/app.tsx`:
   - Add a handler that calls API client.
   - Wire it into `AppLayout` props.
3. If downloading a file, use existing `saveAs(...)` pattern.
4. Reuse notification helpers/constants for consistency.

## Recipe 3: Add a new page route

1. Create page component (currently in `features.tsx`; ideally in a dedicated file if splitting later).
2. Add route in `apps/orchestration/src/app/app.tsx` using `ROUTES` constants where possible.
3. Add helper constants in `constants.ts` if route is reused.

---

## 6) Suggested Conventions for Future Changes

- Prefer adding constants to `apps/orchestration/src/app/constants.ts` rather than hardcoding strings.
- Keep API request logic in `libs/api-client`, not spread across pages.
- Keep UI-only rendering in `libs/ui` when reusable.
- When adding preview/index mapping logic, extend `pages/shared/helpers.ts`.
- If `features.tsx` grows further, split pages into separate files under `apps/orchestration/src/app/pages/`.

---

## 7) Fast Navigation Cheat Sheet

- App wiring and handlers: `apps/orchestration/src/app/app.tsx`
- Shared constants: `apps/orchestration/src/app/constants.ts`
- Session/auth helpers: `apps/orchestration/src/app/auth.ts`
- OIDC callback page: `apps/orchestration/src/app/openid-connect-callback.tsx`
- Main page components: `apps/orchestration/src/app/features.tsx`
- Preview helper maps/utilities: `apps/orchestration/src/app/pages/shared/helpers.ts`
- Shared layout/menu/modals: `libs/ui/src/lib/ui.tsx`
- API endpoints/types: `libs/api-client/src/lib/api-client.ts`

---

## 8) “Trace a Bug” Workflow (for React beginners)

When something breaks, use this order:

1. **Where is it rendered?** Check page component (`features.tsx`) or modal (`ui.tsx`).
2. **Who provides the data?** Check callback props from `AppLayout` in `app.tsx`.
3. **Which API call?** Find matching method in `api-client.ts`.
4. **Any constants mismatch?** Check `constants.ts` for route/key/name mismatches.
5. **URL/state sync issues?** Check branch/route sync in `app.tsx` (`selectedBranchId` logic).

That path usually finds issues quickly in this codebase.

