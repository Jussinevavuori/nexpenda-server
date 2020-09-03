export abstract class AbstractTemplate<T extends {} = {}> {
  protected variables: T;

  constructor(variables: T) {
    this.variables = variables;
  }

  abstract get subject(): string;

  abstract get text(): string;

  abstract get html(): string;
}
