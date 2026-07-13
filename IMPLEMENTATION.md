# Siren React Implementation Contract

- Status: proposed for approval
- Package: `@modwire/siren-react`
- Primary engine: `@modwire/siren-ui`
- Presentation material: Material UI v7

## 1. Purpose

`@modwire/siren-react` is the React presentation adapter for
`@modwire/siren-ui`. It turns immutable UI snapshots into accessible React
interfaces and turns user interactions into public UI commands.

The package is not a second semantic engine and not a collection of branded
wrappers around Material UI. Its distinctive responsibility is a reusable
interaction grammar: one semantic interaction tree, one behavior controller, and
several interchangeable presentations such as cascading menus, command bars,
rails, palettes, sheets, and speed dials.

The package provides three deliberate families of public components:

1. **Frames** compose complete application experiences.
2. **Interaction surfaces** present the same command hierarchy in different
   physical forms while preserving behavior.
3. **Semantic widgets** render Siren UI nodes and dispatch commands without
   owning engine state.

Generic layout primitives such as boxes, stacks, grids, papers, spacers, and
arbitrary theme-aware containers are explicitly outside the public API.

## 2. Product principles

- compact by default;
- prose-free where context permits, never meaning-free;
- icon-led controls with mandatory accessible names and discoverable tooltips;
- identical interaction semantics across visual forms;
- explicit responsive policy instead of surprising automatic transformation;
- deterministic rendering from immutable snapshots;
- local and auditable component and icon resolution;
- framework concerns remain outside the Siren UI engine;
- Material UI is replaceable presentation material, not domain architecture;
- public abstractions describe intent and behavior, not CSS mechanics.

## 3. Authority and dependency direction

Authority flows in one direction:

```mermaid
flowchart LR
  JSON[Siren JSON] --> Client[@modwire/siren-client]
  Client --> Engine[@modwire/siren-ui]
  Engine --> Snapshot[UiSnapshot]
  Snapshot --> Adapter[React session adapter]
  Adapter --> Projection[Interaction and widget projection]
  Projection --> Controller[Interaction controller]
  Controller --> Frames[Frames and surfaces]
  Frames --> MUI[Material UI adapters]
  MUI --> DOM[Accessible DOM]
  DOM --> Intent[User intent]
  Intent --> Command[Public UiCommand]
  Command --> Engine
```

The authorities are fixed:

- `@modwire/siren-client` owns untrusted JSON, Siren parsing, origin policy,
  request encoding, transport responses, and remote problems;
- `@modwire/siren-ui` owns profile interpretation, deterministic projection,
  component evidence, action and relation state, drafts, operations, result
  strategies, focus intentions, and announcements;
- `@modwire/siren-react` owns subscription, React composition, focus mechanics,
  keyboard and pointer interaction, responsive presentation, accessibility
  markup, local icon resolution, and Material UI adaptation;
- the host application owns transport implementation, routing integration, theme
  selection, renderer extensions, and placement policy configuration.

React code must never parse profile metadata, select Siren links, build request
URLs, encode actions, apply result strategies, or infer operation truth
independently.

## 4. Non-goals

The first stable package does not provide:

- a general-purpose design system;
- public `Box`, `Stack`, `Grid`, `Paper`, `Container`, or spacing abstractions;
- arbitrary Material UI prop forwarding;
- remote component loading or profile-selected React imports;
- a router, data cache, transport, or global application store;
- a form engine separate from `UiSession` drafts;
- markdown, HTML, or rich-text execution from untrusted values;
- an application builder or drag-and-drop layout editor;
- opinionated business branding;
- compatibility layers for multiple major Material UI versions;
- silent fallback from an invalid surface to a materially different interaction.

## 5. Architectural shape

```text
src/
  accessibility/     names, announcements, focus, keyboard contracts
  adapters/          UiSession, viewport, modality, router and platform adapters
  domain/            immutable interaction model and state
  frames/            complete high-level application compositions
  interactions/      controller, projection and activation behavior
  mui/               all Material UI-specific rendering implementations
  policy/            surface, placement, density and fallback strategies
  ports/              renderer, icon, navigation and platform interfaces
  public/             composition root and thin package entrances
  runtime/            external-store subscription and React session lifecycle
  theme/              constrained Modwire theme adapter
  widgets/            semantic node renderers and registries
```

Dependencies point inward:

```text
public → frames/widgets/mui → interactions/runtime/policy → domain/ports
                         adapters → @modwire/siren-ui public entrances
```

Only `adapters` may translate `@modwire/siren-ui` public values into React
package values. Other areas depend on local contracts. No file imports client or
UI engine internals.

All `@mui/*` imports are confined to `mui` and `theme`. Semantic domain,
controller, policy, and ports remain free of Material UI types.

## 6. Code contract

- one primary abstraction per file;
- filenames do not repeat their containing folder name;
- no `index.ts` barrel files;
- thin public entry files live under `src/public`;
- non-component logic uses classes and interfaces;
- React renderers are function components because hooks are a React boundary;
- function components contain composition only; behavior belongs to classes;
- immutable values cross every internal boundary;
- no nullable or optional domain/application state;
- absence uses explicit polymorphic values or empty immutable collections;
- optional React and DOM properties are allowed only at external adapter
  boundaries;
- no `any`, non-null assertions, or unchecked general casts;
- hostile-value assertions are confined to a named adaptation boundary;
- closed vocabulary is centralized in vocabulary classes, never repeated
  strings;
- public props expose semantic configuration, not raw MUI props or `sx` escape
  hatches;
- public collections are readonly and copied before storage;
- registration order and render timing never decide semantics;
- each subscription, observer, timer, and portal has explicit teardown
  ownership;
- the package is ESM-only and side-effect free;
- importing the package must not access `window`, `document`, or browser
  globals.

## 7. Core innovation: the interaction grammar

### 7.1 Interaction tree

`InteractionTree` is the single source of truth for hierarchical user intent. It
is an immutable composite, independent of React and Material UI.

The initial node vocabulary is deliberately small:

- `CommandInteraction` represents one activatable public UI command;
- `DestinationInteraction` represents navigation to a semantic relation;
- `ToggleInteraction` represents a binary field or presentation choice;
- `ChoiceInteraction` represents one value in an exclusive set;
- `InteractionGroup` owns an ordered collection of child interactions;
- `InteractionDivider` marks a semantic boundary between neighboring groups.

Every node has:

- a stable `InteractionIdentity` derived from semantic node identity and role;
- a required accessible name;
- an explicit local `IconReference` or `AbsentIcon`;
- an immutable `InteractionAvailability` state;
- an explicit `KeyboardShortcut` or `AbsentShortcut`;
- a placement role from closed vocabulary;
- complete child state where the node can contain children.

Labels are never optional. They may be visually hidden by a presenter, but
remain available to assistive technology and tooltips.

The tree contains no React nodes, event handlers, MUI props, URLs, transport
objects, or mutable open/focus state.

### 7.2 Interaction projection

`SnapshotAdapter` translates public `UiSnapshot` and UI model values into one
complete local `PresentationSnapshot`. `InteractionProjector` deterministically
derives trees from that local value. The adapter may copy node kind, identity,
labels, resolved component reference, immutable operation state, and placement
intentions already provided by the engine; it may not copy engine behavior.

It must not:

- reinterpret profile values;
- invent actions or relations;
- reorder equal semantic evidence using registration order;
- turn URLs into identities;
- hide diagnostics;
- infer success from promise timing;
- expose sensitive field values in labels, tooltips, diagnostics, or
  announcements.

### 7.3 Activation

An interaction carries an `InteractionIntent`, not an arbitrary callback. The
`CommandFactory` adapter converts the intent into a published command from
`@modwire/siren-ui/commands`, and `UiDispatcher` sends it to the current
session.

Activation has one path:

```text
DOM event → controller intent → interaction identity → command factory → session dispatch
```

Presenters may not dispatch directly or synthesize URLs.

### 7.4 Behavior controller

`InteractionController` owns presentation-independent interaction behavior and
emits immutable `InteractionSnapshot` values. It supports:

- open and dismiss;
- next, previous, first, and last movement;
- enter child group and return to parent;
- activation;
- typeahead with a bounded reset window;
- hover intent with bounded open and close delays;
- pointer, keyboard, and touch modality changes;
- focus restoration to the initiating control;
- controlled dismissal on outside interaction, route change, and session close;
- preservation of the active identity when the tree refreshes and the identity
  remains;
- deterministic fallback when an active identity disappears.

Controller state is explicit and polymorphic:

- `ClosedInteractionState`;
- `OpenInteractionState` with active path and origin identity;
- `SearchingInteractionState` with query and result identities;
- `ActivatingInteractionState` with the selected identity.

There is no `null` active item and no optional origin. A closed state simply
does not carry open-state data.

### 7.5 Events and state transitions

Interaction events are class-based values handled by a visitor:

- `OpenInteraction`;
- `DismissInteraction`;
- `MoveInteraction`;
- `EnterInteractionGroup`;
- `LeaveInteractionGroup`;
- `ActivateInteraction`;
- `SearchInteractions`;
- `ChangeInputModality`;
- `ReplaceInteractionTree`.

Unsupported transitions are ignored only where the contract declares them
harmless. Invalid activation of a disabled or missing identity produces a stable
public issue and never invokes the session.

## 8. Interaction surfaces

Every surface consumes the same tree and controller contract.

### 8.1 `CommandMenu`

- anchored to an icon or compact action control;
- supports unlimited semantic depth with cascading submenus on pointer-capable
  desktop;
- supports arrow navigation, typeahead, `Escape`, click-away, and focus
  restoration;
- positions submenus using viewport-aware collision policy;
- changes cascade direction in RTL;
- never clips behind frames or inspectors.

### 8.2 `CommandBar`

- horizontal application or contextual menu surface;
- uses roving focus between roots;
- opens vertical child menus;
- supports pointer travel between neighboring open roots;
- collapses only through an explicit surface policy.

### 8.3 `CommandRail`

- compact vertical access to primary destinations and command groups;
- icons are always named by tooltip and accessibility text;
- expansion reveals labels without changing identities;
- deep child groups open as menus or sheets rather than recursively widening the
  rail.

### 8.4 `CommandPalette`

- flattens leaf paths for search without flattening semantic identity;
- renders ancestry as a compact path;
- searches accessible labels, local aliases, and shortcuts only;
- never indexes sensitive values or arbitrary document prose;
- selection activates the original interaction identity.

### 8.5 `CommandSheet`

- touch-first drill-down presentation for nested trees;
- one hierarchy level is visible at a time;
- back navigation preserves the parent active identity;
- swipe or backdrop dismissal follows the same controller dismissal contract;
- scroll position is owned per visited group.

### 8.6 `CommandDial`

- reserved for three to six immediate leaf actions;
- rejects nested groups and destination trees;
- never silently truncates commands;
- an unsuitable tree must be assigned another surface by policy.

### 8.7 `ContextMenu`

- anchored to a semantic node or pointer position;
- keyboard invocation anchors to the focused node;
- contains only commands applicable to the target identity;
- target identity remains stable throughout activation.

## 9. Explicit surface policy

`SurfacePolicy` chooses a presentation from complete context:

- semantic placement role;
- viewport class;
- input modality;
- tree depth and leaf count;
- frame family;
- host preference.

The default policy is deterministic:

| Context                                | Default presentation          |
| -------------------------------------- | ----------------------------- |
| Desktop application roots              | `CommandBar` or `CommandRail` |
| Desktop contextual hierarchy           | `CommandMenu`                 |
| Keyboard search request                | `CommandPalette`              |
| Touch nested hierarchy                 | `CommandSheet`                |
| Three to six immediate primary actions | `CommandDial`                 |
| Node-specific secondary actions        | `ContextMenu`                 |

Policy selection is testable without rendering. A policy never mutates a tree
and never uses CSS breakpoints as implicit business logic.

`ViewportAdapter` converts media/container observations into a closed
`ViewportClass`. `ModalityAdapter` converts browser events into a closed
`InputModality`. Domain policy does not access browser APIs.

## 10. Frames

Frames are semantic application compositions, not generic layout primitives.
They consume a session binding, widget registry, icon registry, surface policy,
and theme configuration.

### 10.1 `WorkbenchFrame`

The desktop productivity default:

```text
┌ context/navigation ───────── search ───── commands ┐
├────────┬───────────────────────────────┬────────────┤
│ rail   │ semantic workspace            │ inspector  │
│        │                               │            │
├────────┴───────────────────────────────┴────────────┤
│ status, operations, progress, announcements         │
└─────────────────────────────────────────────────────┘
```

- dense contextual app bar;
- compact primary rail;
- central region/document viewport;
- optional inspector represented by an explicit `AbsentInspector` when unused;
- operation and diagnostic activity layer;
- temporary rail and inspector sheets on narrow viewports.

### 10.2 `FocusFrame`

For a single entity or reading/task context:

- compact context bar;
- semantic content viewport;
- immediate action dock;
- transient secondary actions;
- no persistent navigation rail;
- hides chrome on downward reading scroll only when policy explicitly enables
  it.

### 10.3 `FlowFrame`

For transactional forms and confirmations:

- context and cancellation controls;
- active semantic region;
- draft-aware field widgets;
- confirmation and acknowledgement surfaces;
- operation progress and failure recovery;
- action controls remain driven by UI session state;
- never invents steps not represented by the UI graph.

### 10.4 `PocketFrame`

For touch-first narrow interfaces:

- compact top context bar;
- primary content viewport;
- three to five top-level destinations in bottom navigation;
- nested navigation and commands in drill-down sheets;
- one contextual immediate-action trigger where justified;
- no hover-dependent interaction.

Frames may use internal CSS and Material UI layout primitives. Those mechanics
never become public component abstractions or public props.

## 11. Semantic widgets

Widgets render local immutable presentation models produced by `SnapshotAdapter`
and derive all operational truth from the current local presentation snapshot.

Initial widget vocabulary:

- `DocumentWidget` renders the root semantic document;
- `RegionWidget` renders a resolved semantic region;
- `PropertyWidget` renders immutable property values;
- `RelationWidget` renders navigation/loading intent;
- `ActionWidget` renders request, confirmation, acknowledgement, cancellation,
  and result state;
- `FieldWidget` renders and updates session-owned drafts;
- `ProgressWidget` renders bounded pending or monitoring state;
- `DiagnosticWidget` renders safe public diagnostics;
- `ConfirmationWidget` renders explicit confirmation state;
- `AcknowledgementWidget` renders required acknowledgement state;
- `UnsupportedWidget` renders a stable accessible fallback.

### 11.1 Widget selection

`WidgetRegistry` maps local `ComponentReference` values to `WidgetFactory`
values. Resolution is deterministic and independent of registration order.
Duplicate keys are rejected. Missing keys select `UnsupportedWidget` and
preserve diagnostics.

Profiles may choose only component references already resolved by
`@modwire/siren-ui`. They cannot provide module names, import paths, JavaScript,
JSX, HTML, or remote URLs.

### 11.2 Widget context

Every widget receives one complete immutable `WidgetContext` containing:

- the local presentation node;
- current local presentation intentions relevant to that node;
- semantic density;
- accessibility identity factory;
- command dispatcher;
- local icon resolver;
- widget registry.

Widgets do not receive the Siren client, transport, raw profile object, URL
builder, Material UI theme internals, or mutable session implementation details.

### 11.3 Fields and drafts

- the session draft is the single source of truth;
- field updates dispatch `SetFieldCommand` using semantic identities;
- no widget mirrors durable field values in local React state;
- local state is permitted only for transient browser mechanics such as IME
  composition;
- transient state reconciles to the session value on completion or cancellation;
- sensitive values are never copied into diagnostics, announcements, data
  attributes, test names, or persistent browser storage;
- required, invalid, disabled, and pending states are exposed accessibly.

### 11.4 Actions and relations

- actions dispatch only published action commands;
- relations dispatch only published relation commands;
- pending appearance follows snapshot operation state, not local promise state;
- stale completion handling remains entirely in `UiSession`;
- disabled controls remain discoverable but cannot activate;
- cancellation and retry are shown only when the engine exposes the
  corresponding state;
- focus and announcement intentions from snapshots take precedence over widget
  guesses.

## 12. React runtime integration

### 12.1 External store

`UiSessionStore` adapts the public `UiSession` subscription contract to React's
external store protocol. `useSyncExternalStore` is the only subscription
primitive used for session snapshots.

The store provides:

- stable `getSnapshot`;
- deterministic `getServerSnapshot`;
- idempotent subscribe/unsubscribe;
- explicit closed-session behavior;
- no global singleton and no module-level mutable state.

### 12.2 Provider

`SirenSessionProvider` binds exactly one explicit session store to a subtree.
Nested providers are allowed and isolated. Reading outside a provider throws a
stable public configuration error rather than returning `undefined`.

### 12.3 Selectors

`useSirenSnapshot` returns the complete immutable snapshot. `useSirenSelector`
accepts a public selector object and equality policy; it does not accept
arbitrary internal paths. Selector memoization must never change semantics.

### 12.4 Dispatch

`useSirenDispatch` returns a stable dispatcher facade. A renderer may await
completion for browser choreography, but rendered truth always comes from the
next snapshot. Component-local `isLoading` flags are forbidden for engine
operations.

### 12.5 Server rendering and hydration

- no browser global is read during module evaluation or server render;
- server snapshots are explicit and deterministic;
- semantic identities generate stable DOM identifiers;
- portal-dependent surfaces remain closed in server output;
- client hydration may attach behavior but may not replace semantic content;
- viewport and modality defaults are explicit server-side Null Objects;
- layout changes after hydration preserve focus and active interaction identity;
- the package supports React Strict Mode without duplicate subscriptions or
  dispatches.

## 13. Material UI boundary

Material UI v7 is used for accessible rendering mechanics and theming. It does
not define package semantics.

The boundary rules are strict:

- all `@mui/*` imports live under `src/mui` or `src/theme`;
- semantic contracts contain no MUI component or prop types;
- public components do not spread arbitrary props into MUI components;
- no public `sx`, `classes`, `slotProps`, or raw component replacement escape
  hatch;
- supported customization uses theme tokens, registries, and typed semantic
  policies;
- MUI default behavior is verified against official v7 documentation before
  reliance;
- deep MUI imports and undocumented internals are forbidden;
- deprecated APIs are forbidden;
- direct imports are chosen to preserve tree shaking;
- the version range supports one declared MUI major only.

The implementation uses official primary references:

- [Material UI v7 documentation index](https://v7.mui.com/material-ui/llms.txt)
- [Material UI MCP workflow](https://v7.mui.com/material-ui/getting-started/mcp/)

At implementation time, MUI-specific behavior is retrieved from the official MCP
or URLs advertised by the official index. Memory and third-party snippets are
not design authority.

## 14. Theme and density

`SirenTheme` defines semantic tokens without exposing generic layout components:

- compact control size;
- touch target size;
- rail and inspector dimensions;
- interaction nesting offset;
- focus-ring width and contrast;
- operation, success, warning, and failure colors;
- motion durations and easing;
- surface elevations;
- typography for labels, values, hints, and diagnostics.

The default density is compact. Compact means reduced visual footprint, not
reduced interaction safety:

- pointer controls may render at compact visual size;
- touch hit targets remain at least the configured accessible target size;
- focus indicators are never clipped;
- spacing may shrink without merging distinct activation targets;
- tooltips do not replace accessible names.

`DensityPolicy` selects `compact`, `standard`, or `touch` from explicit frame
and input context. Widgets consume semantic density and do not inspect viewport
width directly.

## 15. Accessibility contract

Accessibility is an architectural invariant, not presenter polish.

- every icon-only control has a stable accessible name;
- every unfamiliar icon has a tooltip available to pointer and keyboard users;
- tooltip content equals or extends, but never contradicts, the accessible name;
- menu triggers expose expanded state and controlled surface identity;
- menu, menubar, tab, list, tree, dialog, and progress roles follow their actual
  interaction semantics;
- keyboard order follows visual and semantic order;
- roving focus has exactly one active item per surface;
- `Escape` closes one interaction layer at a time;
- closing restores focus to the initiating control when it still exists;
- opening a child surface moves focus according to the surface contract;
- pointer hover is never the sole route to nested content;
- touch has no hover dependency;
- typeahead uses accessible labels and locale-aware comparison;
- disabled commands are exposed as disabled and never disappear solely because
  of state;
- loading state is announced once without repeated render chatter;
- focus and announcement intentions from `UiSnapshot` are honored
  deterministically;
- color is never the sole carrier of meaning;
- reduced-motion preferences disable nonessential movement;
- high-contrast and forced-color modes preserve boundaries and focus;
- RTL reverses directional navigation, submenu placement, and directional icons;
- locale controls formatting and comparison but never semantic identity;
- sensitive values never enter live regions.

## 16. Navigation integration

The package does not own a router. `NavigationPort` receives semantic navigation
intent after the session has applied its relation result strategy.

Host adapters may integrate React Router, Next.js, or another router. They must
not:

- bypass `UiSession` relation loading;
- navigate using a raw relation URL extracted by a renderer;
- treat browser history as operation truth;
- replace semantic node identities with route strings.

An `AbsentNavigationPort` provides deterministic no-router behavior.

## 17. Error and fallback behavior

Stable public React errors use centralized `SirenReactCode` vocabulary and
immutable `SirenReactIssue` values.

Expected categories include:

- missing provider;
- duplicate widget registration;
- duplicate icon registration;
- unknown widget;
- unknown icon;
- invalid interaction tree;
- invalid surface assignment;
- missing interaction identity;
- disabled activation;
- closed session;
- renderer failure.

Unknown widgets and icons produce accessible local fallbacks and diagnostics.
They do not crash the complete frame. A renderer exception is isolated by
`WidgetBoundary`, reported without sensitive values, and replaced with
`UnsupportedWidget`.

Engine errors remain engine errors. React must not copy or translate them unless
a DOM presentation requires a safe public message.

## 18. Security contract

- no `dangerouslySetInnerHTML`;
- no evaluation of profile strings, expressions, scripts, or remote modules;
- no URL activation outside engine commands;
- no profile-controlled MUI prop spreading;
- no dynamic icon import from document data;
- icon and widget registries are local allowlists;
- raw JSON and client types do not cross the React adapter boundary;
- sensitive values never appear in logs, DOM data attributes, errors,
  diagnostics, announcements, analytics, or test snapshots;
- external links rendered as content use explicit host policy;
- renderer failures cannot expose serialized snapshot contents;
- portals remain inside an explicitly selected host container when embedding
  requires it;
- Content Security Policy compatibility is maintained; inline script
  requirements are forbidden.

## 19. Performance contract

- session subscription uses one external-store binding per provider;
- immutable snapshot identity is used for change detection;
- widget keys use semantic identities, never array position;
- controller replacement preserves stable tree branches and active identity;
- registries are immutable after composition;
- expensive tree search indexes are constructed once per tree revision;
- typeahead and command-palette search are bounded and synchronous for the
  initial scale;
- portals and observers are created only for open surfaces;
- no frame-wide context value changes for local hover or focus movement;
- public entrypoints remain independently tree-shakeable;
- exact package artifacts are verified so tests, stories, and internal sources
  never ship.

Virtualization is introduced only after measured need and must preserve
keyboard, screen-reader, and active-identity contracts.

## 20. Public API

The package exposes deliberate entrances only.

### Root: `@modwire/siren-react`

- `SirenSessionProvider`
- `SirenApplication`
- `useSirenSnapshot`
- `useSirenSelector`
- `useSirenDispatch`
- public configuration and stable public errors

`SirenApplication` is the composition facade. It receives a public `UiSession`,
an immutable `SirenReactOptions`, and a selected frame family.

### `@modwire/siren-react/frames`

- `WorkbenchFrame`
- `FocusFrame`
- `FlowFrame`
- `PocketFrame`
- immutable frame configuration contracts

### `@modwire/siren-react/interactions`

- interaction model observation types;
- `CommandMenu`;
- `CommandBar`;
- `CommandRail`;
- `CommandPalette`;
- `CommandSheet`;
- `CommandDial`;
- `ContextMenu`.

Mutation of controller state is not public. Hosts compose surfaces through
configuration and intents.

### `@modwire/siren-react/widgets`

- semantic widget components;
- widget observation contracts;
- accessible unsupported fallback.

### `@modwire/siren-react/extensions`

- `WidgetFactory` and `WidgetRegistryBuilder`;
- `IconFactory` and `IconRegistryBuilder`;
- `SurfacePolicy`;
- `NavigationPort`;
- constrained theme extension contracts;
- public observer ports.

No internal path is exported. There is no catch-all barrel and no wildcard
export.

## 21. Composition root

`SirenReactOptions` is a complete immutable configuration assembled by the
composition root. It contains no optional application state. Defaults are
explicit objects:

- standard widget registry;
- standard local icon registry;
- default surface policy;
- compact density policy;
- absent navigation port;
- browser viewport adapter or server viewport Null Object;
- browser modality adapter or server modality Null Object;
- default safe renderer observer;
- standard accessibility policy.

`SirenApplication` wires these collaborators once. React renders consume the
resulting immutable composition. Components never create private registries or
policies during render.

## 22. Design patterns

| Pattern                   | Realization                                                    |
| ------------------------- | -------------------------------------------------------------- |
| Facade / Composition Root | `SirenApplication`, `SirenReactOptions`                        |
| Adapter                   | UI session store, viewport, modality, router, MUI renderers    |
| Composite                 | `InteractionTree` and interaction groups                       |
| Command                   | published `UiCommand` values emitted from intents              |
| State                     | interaction controller states and UI snapshot operation states |
| Strategy                  | surface, placement, density, fallback, navigation policies     |
| Bridge                    | semantic widgets separated from MUI implementations            |
| Abstract Factory          | widget and icon factories                                      |
| Registry                  | local widget and icon allowlists                               |
| Visitor                   | interaction events and semantic node rendering                 |
| Observer / External Store | UI session subscription into React                             |
| Null Object               | absent icon, shortcut, inspector, router, server viewport      |
| Error Boundary            | isolated renderer failure fallback                             |

## 23. Testing contract: storming the React castle

Tests attack only published package entrances and observable browser behavior.
They do not inspect internal controller state, React component instances,
private classes, MUI internals, or source modules.

### 23.1 Test construction

- build the package before lint, typecheck, and behavioral tests that import it
  by name;
- import only published `@modwire/siren-react` entrances;
- create Siren documents with the published `@modwire/siren-client` facade;
- create sessions with the published `@modwire/siren-ui` facade;
- use one recording public transport adapter confined to test support;
- use real React rendering and user-event interaction;
- query the DOM by role, accessible name, state, and public text;
- test browser contracts, never implementation structure.

Permitted platform doubles are isolated adapters for capabilities absent from
the test environment, such as `matchMedia`, `ResizeObserver`, pointer modality,
portal host, and time. They implement browser boundaries only and contain no
package behavior.

### 23.2 Forbidden test techniques

- imports from `src` or `dist` internal paths;
- module mocking of React package internals;
- fabricated `UiSnapshot`, UI nodes, Siren documents, actions, relations, or
  fields;
- fabricated interaction trees when testing public semantic projection;
- Enzyme-style component instance inspection;
- CSS class or MUI implementation selector assertions;
- broad snapshots used as behavioral evidence;
- arbitrary sleeps;
- assertions against private controller state;
- duplicating package algorithms in test helpers.

### 23.3 Auntie order

For each public behavior:

1. enumerate what can fail;
2. encode boundary, invariant, interruption, and adversarial cases;
3. test cleanup and recovery;
4. only then prove the happy path.

### 23.4 Required attack rooms

The initial suite covers at least:

- missing and nested providers;
- strict-mode subscription lifecycle;
- server snapshot and hydration consistency;
- session close during interaction;
- disabled and disappearing interactions;
- tree replacement while a submenu is active;
- keyboard traversal at every boundary;
- typeahead timeout, repeated characters, and no-match behavior;
- pointer-to-keyboard and keyboard-to-pointer modality changes;
- hover-intent cancellation and rapid sibling travel;
- outside dismissal and focus restoration;
- initiator removal before restoration;
- nested menu viewport collision and RTL placement;
- drill-down sheet back behavior and scroll restoration;
- command-palette search, ancestry, empty result, and activation;
- invalid speed-dial assignment;
- touch interaction without hover;
- reduced motion and forced colors;
- icon fallback and widget fallback;
- duplicate registry entries;
- renderer exceptions and sensitive-value non-disclosure;
- pending, confirmation, acknowledgement, cancellation, success, and failure
  rendering;
- stale operation completion as observed through the real UI session;
- field drafts, IME composition, validation, and sensitive fields;
- multiple sessions on one page;
- unmount with open portals, observers, timers, and pending dispatches;
- public API and forbidden deep-import contract;
- exact package artifact and declaration compatibility;
- representative happy journeys in all four frames.

Visual regression may supplement these tests, but never replace semantic and
interaction assertions.

## 24. Documentation contract

- `IMPLEMENTATION.md` is the architectural SSOT after approval;
- `README.md` explains consumer use without duplicating internal architecture;
- public examples import only published package entrances;
- accessibility behavior is documented beside each surface;
- extension examples show local registries, not dynamic imports;
- MUI-specific decisions cite official Material UI v7 sources;
- test counts and generated artifact hashes are never hard-coded in prose;
- release instructions describe the workflow, not transient CI details.

## 25. Package and release contract

- exact package versions are locked at scaffolding time;
- React, React DOM, Material UI, and its styling runtime are peer dependencies
  with exact supported major ranges and matching development dependencies;
- `@modwire/siren-ui` is the sole engine dependency;
- `@modwire/siren-client` may appear only in test adaptation and examples that
  begin from raw Siren JSON;
- lockfiles contain no `file:`, `link:`, `workspace:`, absolute, or sibling
  references;
- CI verifies the minimum and current supported Node lines;
- verification starts from a clean build boundary;
- formatting, lint, strict typecheck, lock provenance, tests, package lint,
  declaration analysis, and exact artifact verification are mandatory;
- the release tag must exactly match the package version;
- the release workflow builds one tarball and publishes that exact artifact;
- generated output, dependency directories, coverage, and tarballs never enter
  Git;
- neighboring repositories must remain clean after scaffolding, verification,
  and release.

## 26. Implementation sequence

Architecture is implemented from the inside out. Each stage must satisfy this
contract before the next begins.

### Stage checkpoints

Every stage ends at a hard approval checkpoint. The checkpoint report contains:

- the stage objective and achieved outcome;
- the exact files created, changed, or removed;
- the public contracts introduced or affected;
- verification commands and their results;
- SSOT, boundary, nullish-state, vocabulary, and repository-isolation findings;
- any decision that required implementation judgment;
- deviations from this document, which require explicit architectural approval;
- known limitations and risks carried into the next stage.

After delivering the checkpoint report, implementation stops. No file belonging
to the next stage may be created or changed until the owner explicitly approves
the current checkpoint. Requested rework remains part of the current stage and
produces a new checkpoint report after verification.

Approval advances exactly one stage. It does not approve later stages,
publication, or architectural deviations. Stage 8 retains the separate
code-first and test-approval discipline established for Modwire packages.

### Stage 1: package boundary and runtime adapter

- scaffold thin public entrances and exact artifact checks;
- establish dependency restrictions;
- implement `UiSessionStore`, provider, snapshot, selector, and dispatcher
  adapters;
- prove SSR-safe module loading and explicit teardown.

### Stage 2: immutable interaction domain

- implement identities, node composite, collections, availability, icons,
  shortcuts, intents, controller states, events, and issues;
- implement deterministic interaction projection from UI public values;
- keep React and MUI completely outside this stage.

### Stage 3: controller and policies

- implement traversal, typeahead, hover intent, modality, tree replacement,
  activation, focus restoration intentions, surface policy, and density policy;
- make all timers and platform effects ports.

### Stage 4: Material UI presenters

- implement menu, bar, rail, palette, sheet, dial, and context menu bridges;
- implement local icon registry and constrained theme;
- retrieve and verify official MUI behavior before relying on defaults.

### Stage 5: semantic widgets

- implement registry and fallback first;
- implement document, region, property, relation, action, field, progress,
  diagnostic, confirmation, and acknowledgement widgets;
- preserve UI engine state authority.

### Stage 6: frames

- implement `FocusFrame` first as the smallest complete composition;
- implement `WorkbenchFrame` and responsive policies;
- implement `FlowFrame` transactional composition;
- implement `PocketFrame` touch-first composition;
- share semantic behavior, never copy frame-specific controller logic.

### Stage 7: tightening

- perform SSOT, closed-vocabulary, nullish-state, deep-import, source-leakage,
  sensitive value, accessibility, teardown, and artifact audits;
- remove accidental public MUI mechanics;
- verify neighboring repository isolation.

### Stage 8: castle tests

- design the complete public behavior threat model;
- implement adversarial rooms before happy journeys;
- run the clean release verification matrix;
- publish only after explicit approval.

## 27. Definition of done

The first release is complete only when:

- all four frames render real UI sessions through published entrances;
- one interaction tree can be presented as menu, rail, palette, and sheet
  without changing identities or activation semantics;
- nested keyboard, pointer, and touch behavior is consistent and accessible;
- icon-only operation remains fully named and discoverable;
- field drafts and operation states have one engine-owned truth;
- profiles cannot select unregistered code or presentation mechanics;
- no React or MUI type leaks into the semantic domain;
- no MUI prop-forwarding wrapper API exists;
- no generic layout primitive is public;
- SSR, hydration, Strict Mode, RTL, reduced motion, high contrast, and cleanup
  contracts pass through public tests;
- package entrances, declarations, and exact artifacts are independently
  verified;
- the implementation matches this document without undocumented exceptions.

## 28. Binding prohibitions

The following shortcuts require an architectural revision and explicit approval:

- moving profile interpretation into React;
- dispatching directly from a MUI event handler without an interaction intent;
- reading raw action or relation URLs in a renderer;
- storing engine operation truth in component-local state;
- exporting generic layout wrappers;
- exporting MUI props as package configuration;
- allowing profile-controlled dynamic imports;
- using nullable core state because React accepts `null`;
- placing multiple unrelated abstractions in one file;
- adding a public barrel export;
- testing through source imports or fabricated engine objects;
- weakening accessibility to achieve visual compactness;
- silently changing interaction form without an explicit surface policy;
- changing `@modwire/siren-ui` architecture to simplify a React renderer.

This contract changes only through an intentional architecture decision accepted
before implementation.
