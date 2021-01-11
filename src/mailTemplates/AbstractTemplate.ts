export abstract class AbstractTemplate<T extends {} = {}> {
  protected vars: T;

  public templateName: string;

  public mailgunTemplateAvailable: boolean;

  constructor(
    variables: T,
    options: {
      templateName: string;
      mailgunTemplateAvailable: boolean;
    }
  ) {
    this.vars = variables;
    this.templateName = options.templateName;
    this.mailgunTemplateAvailable = options.mailgunTemplateAvailable;
  }

  get variables() {
    return this.vars;
  }

  abstract get subject(): string;

  abstract get text(): string;

  abstract get html(): string;
}
