/**
 * Function to configure the environment
 */
export function configureEnvironment(
  options: {
    skipInProduction?: boolean;
  } = {}
) {
  const env = process.env.NODE_ENV;

  // Handle skipping in production
  if (options.skipInProduction && env === "production") {
    return;
  }

  // Try configuring
  try {
    const dotenv = require("dotenv");
    const path = !env || env === "production" ? `.env` : `.env.${env}`;
    dotenv.config({ path });
  } catch (e) {
    console.warn("An error occured while configuring environment", e);
  }
}

/**
 * Object which contains all configuration values.
 */
export const ENV = {
  /**
   * All google API and OAuth variables.
   */
  google: {
    get clientId() {
      return ENV_STR("GOOGLE_CLIENTID");
    },
    get clientSecret() {
      return ENV_STR("GOOGLE_CLIENTSECRET");
    },
    get applicationCredentials() {
      return ENV_STR("GOOGLE_APPLICATION_CREDENTIALS");
    },
    get projectId() {
      return ENV_STR("GOOGLE_PROJECTID");
    },
    /**
     * Google storage API variables.
     */
    storage: {
      get bucketName() {
        return ENV_STR("GOOGLE_STORAGE_BUCKETNAME");
      },
    },
  },

  /**
   * JWT Token variables.
   */
  token: {
    get issuer() {
      return ENV_STR("TOKEN_ISSUER");
    },
    get audience() {
      return ENV_STR("TOKEN_AUDIENCE");
    },

    /**
     * Access token variables
     */
    accessToken: {
      get secret() {
        return ENV_STR("TOKEN_ACCESSTOKEN_SECRET");
      },
      get expiresIn() {
        return ENV_STR("TOKEN_ACCESSTOKEN_EXPIRESIN");
      },
      get expiresInSeconds() {
        return ENV_NUM("TOKEN_ACCESSTOKEN_EXPIRESINSECONDS");
      },
    },

    /**
     * Refresh token variables
     */
    refreshToken: {
      get name() {
        return ENV_STR("TOKEN_REFRESHTOKEN_NAME");
      },
      get secret() {
        return ENV_STR("TOKEN_REFRESHTOKEN_SECRET");
      },
      get expiresIn() {
        return ENV_STR("TOKEN_REFRESHTOKEN_EXPIRESIN");
      },
      get expiresInSeconds() {
        return ENV_NUM("TOKEN_REFRESHTOKEN_EXPIRESINSECONDS");
      },
    },

    /**
     * Reset password token variables
     */
    resetPasswordToken: {
      get secret() {
        return ENV_STR("TOKEN_RESETPASSWORDTOKEN_SECRET");
      },
      get expiresIn() {
        return ENV_STR("TOKEN_RESETPASSWORDTOKEN_EXPIRESIN");
      },
      get expiresInSeconds() {
        return ENV_NUM("TOKEN_RESETPASSWORDTOKEN_EXPIRESINSECONDS");
      },
    },

    /**
     * Confirm email token variables
     */
    confirmEmailToken: {
      get secret() {
        return ENV_STR("TOKEN_CONFIRMEMAILTOKEN_SECRET");
      },
      get expiresIn() {
        return ENV_STR("TOKEN_CONFIRMEMAILTOKEN_EXPIRESIN");
      },
      get expiresInSeconds() {
        return ENV_NUM("TOKEN_CONFIRMEMAILTOKEN_EXPIRESINSECONDS");
      },
    },
  },

  /**
   * Email and mailgun variables
   */
  email: {
    get defaultSender() {
      return ENV_STR("EMAIL_DEFAULT_SENDER");
    },
    get developerEmails() {
      return ENV_ARRAY("EMAIL_DEVELOPER_EMAILS");
    },
    /**
     * Mailgun API variables
     */
    mailgun: {
      get apikey() {
        return ENV_STR("EMAIL_MAILGUN_APIKEY");
      },
      get baseurl() {
        return ENV_STR("EMAIL_MAILGUN_BASEURL");
      },
      get domain() {
        return ENV_STR("EMAIL_MAILGUN_DOMAIN");
      },
      get host() {
        return ENV_STR("EMAIL_MAILGUN_HOST");
      },
    },
  },

  /**
   * Stripe variables
   */
  stripe: {
    get publishableKey() {
      return ENV_STR("STRIPE_PUBLISHABLE_KEY");
    },
    get secretKey() {
      return ENV_STR("STRIPE_SECRET_KEY");
    },
    get webhookSecret() {
      return ENV_STR("STRIPE_WEBHOOK_SECRET");
    },
    get premiumProductId() {
      return ENV_STR("STRIPE_PREMIUM_PRODUCT_ID");
    },
  },

  /**
   * Host names
   */
  hosts: {
    get client() {
      return ENV_STR("HOSTS_CLIENT");
    },
    get server() {
      return ENV_STR("HOSTS_SERVER");
    },
  },

  /**
   * Application port
   */
  get port() {
    return ENV_NUM("PORT") || 8080;
  },

  /**
   * Application environment
   */
  get env() {
    return ENV_STR("NODE_ENV");
  },

  /**
   * Database URL
   */
  get databaseUrl() {
    return ENV_STR("DATABASE_URL");
  },
};

/**
 * Helper function for fetching environment variables from process.env and
 * parsing it as a number.
 */
function ENV_NUM(variable: string) {
  return Number(process.env[variable] || "");
}

/**
 * Helper function for fetching environment variables from process.env and
 * leaving it as is as a string.
 */
function ENV_STR(variable: string) {
  return process.env[variable] || "";
}

/**
 * Helper function for fetching environment variables from process.env and
 * parsing it as an array of strings, separated by the specified delimiter.
 * The default delimiter is ";"
 */
function ENV_ARRAY(variable: string, delimiter: string = ";") {
  return (process.env[variable] || "").split(delimiter);
}
