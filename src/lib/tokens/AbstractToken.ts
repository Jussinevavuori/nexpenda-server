import * as jwt from "jsonwebtoken";
import { z } from "zod";
import { conf } from "../../conf";

export type IAbstractToken = {
  iat: number;
  exp: number;
  aud: string;
  iss: string;
  tkt: string;
};

export type TokenPayload<T> = IAbstractToken & T;

/**
 * JWT tokens can be created, read and worked with safely and with a concise API
 * by extending the AbstractToken class which wraps all JWT token properties,
 * verification, data etc.
 */
export class AbstractToken<T extends {}> implements IAbstractToken {
  /**
   * Raw JWT token string data for this token
   */
  readonly jwt: string;

  /**
   * Token metadata, issued at timestamp
   */
  readonly iat: number;

  /**
   * Token metadata, expires at timestamp
   */
  readonly exp: number;

  /**
   * Token metadata, audience
   */
  readonly aud: string;

  /**
   * Token metadata, issuer
   */
  readonly iss: string;

  /**
   * Token metadata, token type and purpose
   */
  readonly tkt: string;

  /**
   * For verification purposes we store the intended token type
   */
  readonly intendedTokenType: string;

  /**
   * Merged schema from jwt metadata schema and data schema
   */
  private mergedSchema: z.Schema<TokenPayload<T>>;

  /**
   * Secret to use while verifying jwt
   */
  private secret: string;

  /**
   * Token is considered valid if no error was thrown during the constructor
   * phase.
   */
  readonly valid: boolean;

  /**
   * Verification extender function for extra verification steps
   */
  private verificationExtender?(payload: TokenPayload<T>): Promise<boolean>;

  /**
   * Parsed payload according to the schema.
   */
  readonly payload: TokenPayload<T>;

  constructor(
    token: string | T,
    options: {
      schema:
        | z.Schema<TokenPayload<T>>
        | ((
            schema: typeof AbstractToken["metadataSchema"]
          ) => z.Schema<TokenPayload<T>>);
      secret: string;
      tkt: string;
      expiresIn: string;
      defaultUponError: T;
      verify?(payload: TokenPayload<T>): Promise<boolean>;
    }
  ) {
    /**
     * Merge metadata and specific data schemas
     */
    this.mergedSchema =
      typeof options.schema === "function"
        ? options.schema(AbstractToken.metadataSchema)
        : options.schema;

    /**
     * Store secret and intended token type
     */
    this.secret = options.secret;
    this.intendedTokenType = options.tkt;

    /**
     * Get verification extender function if any
     */
    this.verificationExtender = options.verify;

    /**
     * Use provided token or generate token from provided data
     */
    if (typeof token === "string") {
      this.jwt = token;
    } else {
      this.jwt = jwt.sign({ ...token, tkt: options.tkt }, options.secret, {
        issuer: conf.token.issuer,
        audience: conf.token.audience,
        expiresIn: options.expiresIn,
      });
    }

    /**
     * Parse and verify resulting token and store information
     */
    const decoded = jwt.decode(this.jwt);
    const parseResult = this.mergedSchema.safeParse(decoded);

    /**
     * Assign parse results
     */
    if (parseResult.success) {
      this.payload = parseResult.data;
      this.valid = true;
    } else {
      this.payload = {
        aud: "",
        iss: "",
        iat: -1,
        exp: -1,
        tkt: "invalid",
        ...options.defaultUponError,
      };
      this.valid = false;
    }

    /**
     * Assign basic properties
     */
    this.iat = this.payload.iat;
    this.exp = this.payload.exp;
    this.aud = this.payload.aud;
    this.iss = this.payload.iss;
    this.tkt = this.payload.tkt;
  }

  /**
   * Jwt value getter
   */
  get token() {
    return this.jwt;
  }

  /**
   * Getters for token values with explicit names
   */
  get issuedAt() {
    return this.iat;
  }

  get expiresAt() {
    return this.exp;
  }

  get issuer() {
    return this.iss;
  }

  get audience() {
    return this.aud;
  }

  get tokenType() {
    return this.tkt;
  }

  /**
   * Schema for JWT metadata
   */
  private static metadataSchema = z.object({
    iat: z.number().int(),
    exp: z.number().int(),
    aud: z.string(),
    iss: z.string(),
    tkt: z.string(),
  });

  /**
   * Generic verification function
   */
  async verify(): Promise<boolean> {
    try {
      /**
       * If token was invalid during construction, automatically return false
       */
      if (!this.valid) return false;

      /**
       * Verify token. If token verification fails, an error is thrown and the
       * function automatically returns false
       */
      const decoded = jwt.verify(this.jwt, this.secret, {
        audience: conf.token.audience,
        issuer: conf.token.issuer,
      });

      /**
       * Verify the payload of the verified token. If verification fails, an
       * error is thrown and the function automatically returns false
       */
      const valid = this.mergedSchema.parse(decoded);
      if (!valid) return false;

      /**
       * Run extra verification steps if specified
       */
      if (this.verificationExtender) {
        return this.verificationExtender(this.payload);
      }

      /**
       * If schema and signature verification passed, the token is valid
       */
      return true;
    } catch (error) {
      return false;
    }
  }
}
