/**
 * Abstract template which all mail templates must extends.
 */
export abstract class AbstractTemplate<T extends {} = {}> {
  /**
   * All template variables passed are stored here.
   */
  protected vars: T;

  /**
   * Name of template.
   */
  public templateName: string;

  /**
   * Boolean flag for whether a mailgun template exists for this
   * template.
   */
  public mailgunTemplateAvailable: boolean;

  /**
   * Constructor.
   */
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

  /**
   * Getter for accessing all template variables.
   */
  get variables() {
    return this.vars;
  }

  /**
   * Abstract implementable for getting the subject of this template.
   */
  abstract get subject(): string;

  /**
   * Abstract implementable for getting the text version of this template.
   */
  abstract get text(): string;

  /**
   * Abstract implementable for getting the HTML version of this template.
   */
  abstract get html(): string;
}
