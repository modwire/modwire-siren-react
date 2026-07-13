# @modwire/siren-react

React presentation adapter for `@modwire/siren-ui`.

The package is being implemented in approved checkpoints. Stage 1 establishes
the published package boundary and adapts an explicit `UiSession` to React's
external-store protocol. Interaction surfaces, widgets, Material UI presenters,
and frames are not yet part of the implementation.

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for the binding implementation
contract.

## Stage 1 public API

- `SirenSessionProvider`
- `useSirenSnapshot`
- `useSirenSelector`
- `useSirenDispatch`
- `UiDispatcher`
- selector and equality contracts
- stable configuration errors

## Development

```sh
npm ci
npm run verify
```

## License

[MIT](./LICENSE)
