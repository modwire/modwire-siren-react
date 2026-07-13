import type { FixtureObject } from "./fixture";

export class DocumentCase {
  static readonly profile =
    "https://raw.githubusercontent.com/modwire/modwire-siren/main/docs/siren-ui-profile/README.md";
  static readonly profileRelation = `${DocumentCase.profile}#profile-entity`;

  root(overrides: FixtureObject = {}): FixtureObject {
    return {
      class: ["record"],
      properties: { id: "one", title: "One" },
      entities: [],
      actions: [],
      links: [
        {
          rel: ["self"],
          href: "https://api.example.test/records/one",
        },
      ],
      ...overrides,
    };
  }

  metadata(overrides: FixtureObject = {}): FixtureObject {
    return {
      profile: DocumentCase.profile,
      presentation: { role: "detail", label: "Record" },
      ...overrides,
    };
  }

  profiled(
    metadata: FixtureObject,
    overrides: FixtureObject = {},
  ): FixtureObject {
    return this.root({
      ...overrides,
      entities: [
        {
          class: ["modwire-ui-profile"],
          rel: [DocumentCase.profileRelation],
          properties: metadata,
        },
      ],
      links: [
        {
          rel: ["self"],
          href: "https://api.example.test/records/one",
        },
        { rel: ["profile"], href: DocumentCase.profile },
      ],
    });
  }

  action(overrides: FixtureObject = {}): FixtureObject {
    return {
      name: "save",
      method: "POST",
      href: "https://api.example.test/records/one",
      type: "application/json",
      fields: [{ name: "title", type: "text", value: "One", required: true }],
      ...overrides,
    };
  }

  actionable(overrides: FixtureObject = {}): FixtureObject {
    return this.actionableWithConfirmation({ required: false }, overrides);
  }

  confirmable(overrides: FixtureObject = {}): FixtureObject {
    return this.actionableWithConfirmation(
      { required: true, acknowledgement: "save" },
      overrides,
    );
  }

  passwordAction(): FixtureObject {
    const metadata = this.metadata({
      actions: {
        save: {
          confirmation: { required: false },
          fields: {
            title: { label: "Title", order: 10, widget: "automatic" },
          },
          intent: "primary",
          label: "Save record",
          placement: "entity",
          result: { mode: "replace", optimistic: false, relations: [] },
        },
      },
    });
    return this.profiled(metadata, {
      actions: [
        this.action({
          fields: [
            {
              name: "title",
              required: true,
              type: "password",
              value: "secret-value",
            },
          ],
        }),
      ],
    });
  }

  commands(names: readonly string[]): FixtureObject {
    const actions: Record<string, FixtureObject> = {};
    for (const name of names) {
      actions[name] = {
        intent: "secondary",
        placement: "entity",
        label: name,
        confirmation: { required: false },
        result: { mode: "none", relations: [], optimistic: false },
      };
    }
    return this.profiled(this.metadata({ actions }), {
      actions: names.map((name) => ({
        href: `https://api.example.test/commands/${name.toLowerCase()}`,
        method: "POST",
        name: name.toLowerCase(),
      })),
    });
  }

  nestedCommands(): FixtureObject {
    const source = this.commands(["Alpha", "Bravo"]);
    return this.profiled(
      this.metadata({
        actions: {
          alpha: { label: "Alpha", placement: "entity" },
          bravo: { label: "Bravo", placement: "entity" },
        },
        presentation: {
          label: "Record",
          role: "detail",
          layout: {
            kind: "flow",
            regions: [
              {
                content: {
                  actions: ["alpha", "bravo"],
                  properties: [],
                  relations: [],
                },
                id: "commands",
                label: "Command group",
                order: 10,
              },
            ],
          },
        },
      }),
      {
        actions: this.array(source.actions),
      },
    );
  }

  groupedCommands(): FixtureObject {
    const source = this.commands(["Alpha", "Bravo"]);
    return this.profiled(
      this.metadata({
        actions: {
          alpha: { label: "Alpha", placement: "entity" },
          bravo: { label: "Bravo", placement: "entity" },
        },
        presentation: {
          label: "Record",
          layout: {
            kind: "flow",
            regions: [
              {
                content: {
                  actions: ["alpha"],
                  properties: [],
                  relations: [],
                },
                id: "first",
                label: "First group",
                order: 10,
              },
              {
                content: {
                  actions: ["bravo"],
                  properties: [],
                  relations: [],
                },
                id: "second",
                label: "Second group",
                order: 20,
              },
            ],
          },
          role: "detail",
        },
      }),
      { actions: this.array(source.actions) },
    );
  }

  related(): FixtureObject {
    const document = this.profiled(
      this.metadata({
        relations: {
          next: {
            cardinality: "one",
            label: "Next record",
            loading: "manual",
            role: "navigation",
          },
        },
      }),
      {},
    );
    return {
      ...document,
      links: [
        {
          href: "https://api.example.test/records/one",
          rel: ["self"],
        },
        { href: DocumentCase.profile, rel: ["profile"] },
        {
          href: "https://api.example.test/records/two",
          rel: ["next"],
        },
      ],
    };
  }

  private actionableWithConfirmation(
    confirmation: FixtureObject,
    overrides: FixtureObject,
  ): FixtureObject {
    const metadata = this.metadata({
      actions: {
        save: {
          intent: "primary",
          placement: "entity",
          label: "Save record",
          confirmation,
          fields: {
            title: { widget: "text", label: "Title", order: 10 },
          },
          result: { mode: "replace", relations: [], optimistic: false },
        },
      },
    });
    return this.profiled(metadata, {
      actions: [this.action()],
      ...overrides,
    });
  }

  private array(value: unknown): readonly unknown[] {
    return Array.isArray(value) ? value : [];
  }
}
