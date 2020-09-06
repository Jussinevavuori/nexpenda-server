import { Response } from "express";
import { conf } from "../conf";

type DefaultVariables = {
  hosts: {
    client: string;
    server: string;
  };
};

export class AbstractView<T extends object = {}> {
  name: string;
  variables: T & DefaultVariables;

  /**
   * Construct a base for the view
   *
   * @param name Name of template file
   * @param variables Variables to assign by default for view
   */
  constructor(name: string, variables: T) {
    this.name = name;

    /**
     * Assign also default values from config
     */
    this.variables = {
      ...variables,
      hosts: {
        client: conf.hosts.client,
        server: conf.hosts.server,
      },
    };
  }

  /**
   * Using the response.render() method, renders the current
   * view with the registered variables.
   */
  render(response: Response) {
    return response.render(this.name, { locals: this.variables });
  }
}
