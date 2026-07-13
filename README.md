# @modwire/siren-react

React presentation adapter for `@modwire/siren-ui`.

It renders immutable UI session snapshots as accessible React interfaces and
turns browser interaction back into published UI commands. The package provides
complete frames, interchangeable hierarchical command surfaces, semantic
widgets, and local extension registries without exposing raw Material UI
mechanics.

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for the binding implementation
contract.

## Public API

```tsx
import {
  FrameFamily,
  SirenApplication,
  StandardSirenReactOptions,
  type SessionInput,
} from "@modwire/siren-react";

const options = new StandardSirenReactOptions().create();

interface ApplicationProps {
  readonly session: SessionInput;
}

export function Application({ session }: ApplicationProps) {
  return (
    <SirenApplication
      frame={FrameFamily.workbench}
      options={options}
      session={session}
    />
  );
}
```

The root entrance exposes the application facade, explicit session provider,
external-store hooks, complete options, frame vocabulary, and stable errors.

`@modwire/siren-react/frames` exposes `WorkbenchFrame`, `FocusFrame`,
`FlowFrame`, `PocketFrame`, and their immutable configuration contracts.

The `@modwire/siren-react/interactions` entrance exposes immutable interaction
observation values: the tree and node composite, identities, accessible names,
availability, icon and shortcut values, placements, and semantic intents. It
does not expose controller mutation.

The interaction entrance provides `CommandMenu`, `CommandBar`, `CommandRail`,
`CommandPalette`, `CommandSheet`, `CommandDial`, and `ContextMenu`. Each
consumes the same immutable interaction tree and requires an explicit icon
registry and semantic theme.

`@modwire/siren-react/widgets` exposes semantic document, region, property,
relation, action, field, progress, diagnostic, confirmation, acknowledgement,
and unsupported renderers with their local observation contracts.

`@modwire/siren-react/extensions` exposes local widget and icon registries,
surface and density strategies, viewport and modality adapters, navigation and
observer ports, accessibility policy, and constrained theme values. It does not
expose raw Material UI props, generic layout primitives, or dynamic component
loading.

## Development

```sh
npm ci
npm run verify
```

## License

[MIT](./LICENSE)
