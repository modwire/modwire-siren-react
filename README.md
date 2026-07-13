# @modwire/siren-react

React presentation adapter for `@modwire/siren-ui`.

The package is being implemented in approved checkpoints. Stage 1 establishes
the published package boundary and adapts an explicit `UiSession` to React's
external-store protocol. Stage 2 adds the immutable interaction grammar and a
deterministic projection from public UI snapshots. Controllers, interaction
surfaces, widgets, Material UI presenters, and frames are not yet implemented.

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for the binding implementation
contract.

## Public API

- `SirenSessionProvider`
- `useSirenSnapshot`
- `useSirenSelector`
- `useSirenDispatch`
- `UiDispatcher`
- selector and equality contracts
- stable configuration errors

The `@modwire/siren-react/interactions` entrance exposes immutable interaction
observation values: the tree and node composite, identities, accessible names,
availability, icon and shortcut values, placements, and semantic intents. It
does not expose controller mutation.

## Development

```sh
npm ci
npm run verify
```

## License

[MIT](./LICENSE)
