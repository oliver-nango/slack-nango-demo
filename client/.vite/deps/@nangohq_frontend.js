import "./chunk-BUSYA2B4.js";

// node_modules/@nangohq/frontend/dist/authModal.js
var debugLogPrefix = "[nango]";
function computeLayout({ expectedWidth, expectedHeight }) {
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const left = screenWidth / 2 - expectedWidth / 2;
  const top = screenHeight / 2 - expectedHeight / 2;
  const computedWidth = Math.min(expectedWidth, screenWidth);
  const computedHeight = Math.min(expectedHeight, screenHeight);
  return { left: Math.max(left, 0), top: Math.max(top, 0), width: computedWidth, height: computedHeight };
}
function windowFeaturesToString(layout) {
  const features = {
    ...layout,
    scrollbars: "yes",
    resizable: "yes",
    status: "no",
    toolbar: "no",
    location: "no",
    copyhistory: "no",
    menubar: "no",
    directories: "no"
  };
  const featuresAsString = [];
  for (const key in features) {
    featuresAsString.push(`${key}=${features[key]}`);
  }
  return featuresAsString.join(",");
}
var AuthorizationModal = class {
  baseURL;
  debug;
  swClient;
  errorHandler;
  modal;
  isProcessingMessage = false;
  constructor({ baseUrl, debug, webSocketUrl, successHandler, errorHandler }) {
    this.baseURL = baseUrl;
    this.debug = debug;
    this.swClient = new WebSocket(webSocketUrl);
    this.errorHandler = errorHandler;
    this.swClient.onmessage = (message) => {
      this.isProcessingMessage = true;
      this.handleMessage(message, successHandler);
      this.isProcessingMessage = false;
    };
  }
  setModal(modal) {
    this.modal = modal;
  }
  /**
   * Handles the messages received from the Nango server via WebSocket
   * @param message - The message event containing data from the server
   * @param successHandler - The success handler function to be called when a success message is received
   */
  handleMessage(message, successHandler) {
    const data = JSON.parse(message.data);
    switch (data.message_type) {
      case "connection_ack": {
        if (this.debug) {
          console.log(debugLogPrefix, "Connection ack received. Opening modal...");
        }
        this.baseURL.searchParams.set("ws_client_id", data.ws_client_id);
        this.open();
        break;
      }
      case "error":
        if (this.debug) {
          console.log(debugLogPrefix, "Error received. Rejecting authorization...");
        }
        this.errorHandler(data.error_type, data.error_desc);
        this.swClient.close();
        break;
      case "success":
        if (this.debug) {
          console.log(debugLogPrefix, "Success received. Resolving authorization...");
        }
        successHandler({
          providerConfigKey: data.provider_config_key,
          connectionId: data.connection_id,
          isPending: data.is_pending
        });
        this.swClient.close();
        break;
      default:
        if (this.debug) {
          console.log(debugLogPrefix, "Unknown message type received from Nango server. Ignoring...");
        }
        return;
    }
  }
  /**
   * Opens a modal window with the specified WebSocket client ID
   */
  open() {
    if (!this.modal) {
      return;
    }
    if (this.debug) {
      console.log(debugLogPrefix, "opening", this.baseURL.href);
    }
    this.modal.location = this.baseURL.href;
    if (!this.modal || this.modal.closed || typeof this.modal.closed == "undefined") {
      this.errorHandler("blocked_by_browser", "Modal blocked by browser");
      return;
    }
  }
  /**
   * Close modal, if opened
   */
  close() {
    if (this.modal && !this.modal.closed) {
      this.modal.close();
      delete this.modal;
    }
    this.swClient.close();
    delete this.swClient;
  }
};

// node_modules/@nangohq/frontend/dist/connectUI.js
var ConnectUI = class {
  iframe = null;
  isReady = false;
  listener = null;
  sessionToken;
  baseURL;
  apiURL;
  onEvent;
  detectClosedAuthWindow;
  lang;
  themeOverride;
  constructor({ sessionToken, baseURL = "https://connect.nango.dev", apiURL = "https://api.nango.dev", detectClosedAuthWindow, onEvent, lang, themeOverride }) {
    this.sessionToken = sessionToken;
    this.baseURL = baseURL;
    this.apiURL = apiURL;
    this.onEvent = onEvent;
    this.detectClosedAuthWindow = detectClosedAuthWindow;
    this.lang = lang;
    this.themeOverride = themeOverride;
  }
  /**
   * Open UI in an iframe and listen to events
   */
  open() {
    this.iframe = this.createIframe();
    document.body.append(this.iframe);
    document.body.style.overflow = "hidden";
    this.setupEventListeners();
  }
  createIframe() {
    const baseURL = new URL(this.baseURL);
    if (this.apiURL) {
      baseURL.searchParams.append("apiURL", this.apiURL);
    }
    if (this.detectClosedAuthWindow) {
      baseURL.searchParams.append("detectClosedAuthWindow", String(this.detectClosedAuthWindow));
    }
    if (this.lang) {
      baseURL.searchParams.append("lang", this.lang);
    }
    if (this.themeOverride) {
      baseURL.searchParams.append("theme", this.themeOverride);
    }
    const iframe = document.createElement("iframe");
    iframe.src = baseURL.href;
    iframe.id = "connect-ui";
    iframe.style.position = "fixed";
    iframe.style.zIndex = "9999";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "100vw";
    iframe.style.height = "100vh";
    iframe.style.backgroundColor = "transparent";
    return iframe;
  }
  setupEventListeners() {
    this.listener = (event) => {
      if (event.origin !== new URL(this.baseURL).origin) {
        return;
      }
      if (typeof event.data !== "object" || !event.data || !event.data.type) {
        return;
      }
      const evt = event.data;
      switch (evt.type) {
        case "ready": {
          this.isReady = true;
          this.sendSessionToken();
          break;
        }
        case "close": {
          this.close();
          break;
        }
        default: {
          break;
        }
      }
      if (this.onEvent) {
        void this.onEvent(evt);
      }
    };
    window.addEventListener("message", this.listener, false);
  }
  /**
   * Set the session token and send it to the Connect UI iframe
   */
  setSessionToken(sessionToken) {
    this.sessionToken = sessionToken;
    if (this.isReady) {
      this.sendSessionToken();
    }
  }
  /**
   * Close UI and clear state
   */
  close() {
    if (this.listener) {
      window.removeEventListener("message", this.listener);
    }
    if (this.iframe) {
      document.body.removeChild(this.iframe);
      this.iframe = null;
      document.body.style.overflow = "";
    }
  }
  sendSessionToken() {
    if (!this.sessionToken) {
      return;
    }
    const data = { type: "session_token", sessionToken: this.sessionToken };
    this.iframe?.contentWindow?.postMessage(data, "*");
  }
};

// node_modules/@nangohq/frontend/dist/index.js
var prodHost = "https://api.nango.dev";
var debugLogPrefix2 = "NANGO DEBUG LOG: ";
var AuthError = class extends Error {
  type;
  constructor(message, type) {
    super(message);
    this.type = type;
  }
};
var Nango = class {
  hostBaseUrl;
  websocketsBaseUrl;
  publicKey;
  connectSessionToken;
  debug = false;
  width = 500;
  height = 600;
  tm = null;
  // Do not rename, part of the public api
  win = null;
  constructor(config = {}) {
    config.host = config.host || prodHost;
    config.websocketsPath = config.websocketsPath || "/";
    this.debug = config.debug || false;
    if (this.debug) {
      console.log(debugLogPrefix2, `Debug mode is enabled.`);
      console.log(debugLogPrefix2, `Using host: ${config.host}.`);
    }
    if (config.width) {
      this.width = config.width;
    }
    if (config.height) {
      this.height = config.height;
    }
    this.hostBaseUrl = config.host.replace(/\/+$/, "");
    this.publicKey = config.publicKey;
    this.connectSessionToken = config.connectSessionToken;
    try {
      const baseUrl = new URL(this.hostBaseUrl);
      const websocketUrl = new URL(config.websocketsPath, baseUrl);
      this.websocketsBaseUrl = websocketUrl.toString().replace("https://", "wss://").replace("http://", "ws://");
    } catch {
      throw new AuthError("Invalid URL provided for the Nango host.", "invalid_host_url");
    }
  }
  async create(providerConfigKey, connectionIdOrConnectionConfig, moreConnectionConfig) {
    this.ensureCredentials();
    let connectionId = null;
    let connectionConfig = moreConnectionConfig;
    if (typeof connectionIdOrConnectionConfig === "string") {
      connectionId = connectionIdOrConnectionConfig;
    } else {
      connectionConfig = connectionIdOrConnectionConfig;
    }
    const url = this.hostBaseUrl + `/auth/unauthenticated/${providerConfigKey}${this.toQueryString(connectionId, connectionConfig)}`;
    const res = await this.triggerAuth({
      authUrl: url
    });
    return res;
  }
  auth(providerConfigKey, connectionIdOrOptions, moreOptions) {
    this.ensureCredentials();
    let connectionId = null;
    let options = moreOptions;
    if (typeof connectionIdOrOptions === "string") {
      connectionId = connectionIdOrOptions;
    } else {
      options = {
        ...options,
        ...connectionIdOrOptions
      };
    }
    if (options && ("installation" in options && options.installation === "outbound" || "credentials" in options && ("token_id" in options.credentials && "token_secret" in options.credentials || !("oauth_client_id_override" in options.credentials) || !("oauth_client_secret_override" in options.credentials)) && Object.keys(options.credentials).length > 0)) {
      const credentials = options.credentials;
      if (!credentials) {
        throw new AuthError("Credentials are required for custom auth", "missing_credentials");
      }
      const { credentials: _, ...connectionConfig } = options;
      return this.customAuth(providerConfigKey, connectionId, this.convertCredentialsToConfig(credentials), connectionConfig, options.installation);
    }
    const modal = window.open("", "_blank", windowFeaturesToString(computeLayout({ expectedWidth: this.width, expectedHeight: this.height })));
    return new Promise((resolve, reject) => {
      const successHandler = (authSuccess) => {
        resolve(authSuccess);
      };
      const errorHandler = (errorType, errorDesc) => {
        reject(new AuthError(errorDesc, errorType));
        return;
      };
      if (this.win) {
        this.clear();
      }
      if (!modal || modal.closed || typeof modal.closed == "undefined") {
        errorHandler("blocked_by_browser", "Modal blocked by browser");
        return;
      }
      let url;
      try {
        url = new URL(`${this.hostBaseUrl}/oauth/connect/${providerConfigKey}${this.toQueryString(connectionId, options)}`);
      } catch {
        errorHandler("invalid_host_url", "Invalid URL provided for the Nango host.");
        return;
      }
      this.win = new AuthorizationModal({ baseUrl: url, debug: this.debug, webSocketUrl: this.websocketsBaseUrl, successHandler, errorHandler });
      this.win.setModal(modal);
      this.tm = setInterval(() => {
        if (!this.win || !this.win.modal) {
          return;
        }
        if (!this.win.modal.closed) {
          return;
        }
        if (this.win.isProcessingMessage) {
          return;
        }
        if (options?.detectClosedAuthWindow) {
          clearInterval(this.tm);
          this.win.close();
          this.win = null;
          reject(new AuthError("The authorization window was closed before the authorization flow was completed", "window_closed"));
        }
      }, 500);
    }).finally(() => {
      this.clear();
    });
  }
  reconnect(providerConfigKey, options) {
    if (!this.connectSessionToken) {
      throw new AuthError("Reconnect requires a session token", "missing_connect_session_token");
    }
    return this.auth(providerConfigKey, options);
  }
  /**
   * Clear state of the frontend SDK
   */
  clear() {
    if (this.tm) {
      clearInterval(this.tm);
    }
    if (this.win) {
      try {
        this.win.close();
      } catch (err) {
        console.log("err", err);
      }
      this.win = null;
    }
  }
  /**
   * Open managed Connect UI
   */
  openConnectUI(params) {
    const connect = new ConnectUI({ sessionToken: this.connectSessionToken, ...params });
    connect.open();
    return connect;
  }
  /**
   * Converts the provided credentials to a Connection configuration object
   * @param credentials - The credentials to convert
   * @returns The connection configuration object
   */
  convertCredentialsToConfig(credentials) {
    const params = {};
    if ("type" in credentials && "username" in credentials && "password" in credentials && credentials.type === "SIGNATURE") {
      const signatureCredentials = {
        type: credentials.type,
        username: credentials.username,
        password: credentials.password
      };
      return { params: signatureCredentials };
    }
    if ("username" in credentials) {
      params["username"] = credentials.username || "";
    }
    if ("password" in credentials) {
      params["password"] = credentials.password || "";
    }
    if ("apiKey" in credentials) {
      params["apiKey"] = credentials.apiKey || "";
    }
    if (
      // for backwards compatibility with the old JWT credentials (ghost-admin)
      "privateKey" in credentials || "type" in credentials && credentials.type === "JWT"
    ) {
      const { privateKey, ...rest } = credentials;
      const params2 = { ...rest };
      if (privateKey && typeof privateKey === "object" && "id" in privateKey && "secret" in privateKey) {
        params2["privateKey"] = privateKey;
      }
      return { params: credentials };
    }
    if ("privateKeyId" in credentials && "issuerId" in credentials && "privateKey" in credentials) {
      const appStoreCredentials = {
        params: {
          privateKeyId: credentials["privateKeyId"],
          issuerId: credentials["issuerId"],
          privateKey: credentials["privateKey"]
        }
      };
      if ("scope" in credentials && (typeof credentials["scope"] === "string" || Array.isArray(credentials["scope"]))) {
        appStoreCredentials.params["scope"] = credentials["scope"];
      }
      return appStoreCredentials;
    }
    if ("client_id" in credentials && "client_secret" in credentials) {
      const oauth2CCCredentials = {
        client_id: credentials.client_id,
        client_secret: credentials.client_secret,
        client_certificate: credentials.client_certificate,
        client_private_key: credentials.client_private_key
      };
      return { params: oauth2CCCredentials };
    }
    if ("token_id" in credentials && "token_secret" in credentials) {
      const tbaCredentials = {
        token_id: credentials.token_id,
        token_secret: credentials.token_secret
      };
      if ("oauth_client_id_override" in credentials) {
        tbaCredentials["oauth_client_id_override"] = credentials.oauth_client_id_override;
      }
      if ("oauth_client_secret_override" in credentials) {
        tbaCredentials["oauth_client_secret_override"] = credentials.oauth_client_secret_override;
      }
      return { params: tbaCredentials };
    }
    if ("username" in credentials && "password" in credentials && "organization_id" in credentials && "dev_key" in credentials) {
      const BillCredentials = {
        username: credentials.username,
        password: credentials.password,
        organization_id: credentials.organization_id,
        dev_key: credentials.dev_key
      };
      return { params: BillCredentials };
    }
    if ("type" in credentials && credentials.type === "TWO_STEP") {
      const twoStepCredentials = { ...credentials };
      return { params: twoStepCredentials };
    }
    return { params };
  }
  async triggerAuth({ authUrl, credentials }) {
    const res = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      ...credentials ? { body: JSON.stringify(credentials) } : {}
    });
    if (!res.ok) {
      const errorResponse = await res.json();
      throw new AuthError(errorResponse.error.message, errorResponse.error.code);
    }
    return res.json();
  }
  /**
   * Performs authorization based on the provided credentials i.e api, basic, appstore and oauth2
   * @param providerConfigKey - The key identifying the provider configuration on Nango
   * @param connectionId - The ID of the connection for which to create the custom Authorization
   * @param connectionConfigWithCredentials - The connection configuration containing the credentials
   * @param connectionConfig - Optional. Additional connection configuration
   * @returns A promise that resolves with the authorization result
   */
  async customAuth(providerConfigKey, connectionId, connectionConfigWithCredentials, connectionConfig, installation) {
    const { params: credentials } = connectionConfigWithCredentials;
    if (!credentials) {
      throw new AuthError("You must specify credentials.", "missing_credentials");
    }
    if ("type" in credentials && credentials["type"] === "TWO_STEP") {
      return await this.triggerAuth({
        authUrl: this.hostBaseUrl + `/auth/two-step/${providerConfigKey}${this.toQueryString(connectionId, connectionConfig)}`,
        credentials
      });
    }
    if ("type" in credentials && credentials["type"] === "SIGNATURE" && "username" in credentials && "password" in credentials) {
      return await this.triggerAuth({
        authUrl: this.hostBaseUrl + `/auth/signature/${providerConfigKey}${this.toQueryString(connectionId, connectionConfig)}`,
        credentials
      });
    }
    if ("username" in credentials && "password" in credentials && "organization_id" in credentials && "dev_key" in credentials) {
      return await this.triggerAuth({
        authUrl: this.hostBaseUrl + `/auth/bill/${providerConfigKey}${this.toQueryString(connectionId, connectionConfig)}`,
        credentials
      });
    }
    if ("apiKey" in credentials) {
      return await this.triggerAuth({
        authUrl: this.hostBaseUrl + `/api-auth/api-key/${providerConfigKey}${this.toQueryString(connectionId, connectionConfig)}`,
        credentials
      });
    }
    if ("username" in credentials || "password" in credentials) {
      return await this.triggerAuth({
        authUrl: this.hostBaseUrl + `/api-auth/basic/${providerConfigKey}${this.toQueryString(connectionId, connectionConfig)}`,
        credentials
      });
    }
    if ("privateKey" in credentials || "type" in credentials && credentials["type"] === "JWT") {
      return await this.triggerAuth({
        authUrl: this.hostBaseUrl + `/auth/jwt/${providerConfigKey}${this.toQueryString(connectionId, connectionConfig)}`,
        credentials
      });
    }
    if ("privateKeyId" in credentials && "issuerId" in credentials && "privateKey" in credentials) {
      return await this.triggerAuth({
        authUrl: this.hostBaseUrl + `/app-store-auth/${providerConfigKey}${this.toQueryString(connectionId, connectionConfig)}`,
        credentials
      });
    }
    if ("token_id" in credentials && "token_secret" in credentials) {
      return await this.triggerAuth({
        authUrl: this.hostBaseUrl + `/auth/tba/${providerConfigKey}${this.toQueryString(connectionId, connectionConfig)}`,
        credentials
      });
    }
    if ("client_id" in credentials && "client_secret" in credentials) {
      return await this.triggerAuth({
        authUrl: this.hostBaseUrl + `/oauth2/auth/${providerConfigKey}${this.toQueryString(connectionId, connectionConfig)}`,
        credentials
      });
    }
    if (installation === "outbound") {
      return await this.triggerAuth({
        authUrl: this.hostBaseUrl + `/auth/oauth-outbound/${providerConfigKey}${this.toQueryString(connectionId, connectionConfig)}`
      });
    }
    return Promise.reject(new Error("Something went wrong with the authorization"));
  }
  /**
   * Converts the connection ID and configuration parameters into a query string
   * @param connectionId - The ID of the connection for which to generate a query string
   * @param connectionConfig - Optional. Additional configuration for the connection
   * @returns The generated query string
   */
  toQueryString(connectionId, connectionConfig) {
    const query = [];
    if (connectionId) {
      query.push(`connection_id=${connectionId}`);
    }
    if (this.publicKey) {
      query.push(`public_key=${this.publicKey}`);
    }
    if (this.connectSessionToken) {
      query.push(`connect_session_token=${this.connectSessionToken}`);
    }
    if (connectionConfig) {
      for (const param in connectionConfig.params) {
        const val = connectionConfig.params[param];
        if (typeof val === "string") {
          query.push(`params[${encodeURIComponent(param)}]=${encodeURIComponent(val)}`);
        }
      }
      if (connectionConfig.hmac) {
        query.push(`hmac=${connectionConfig.hmac}`);
      }
      if (connectionConfig.user_scope) {
        query.push(`user_scope=${connectionConfig.user_scope.join(",")}`);
      }
      if (connectionConfig.credentials) {
        const credentials = connectionConfig.credentials;
        if ("oauth_client_id_override" in credentials) {
          query.push(`credentials[oauth_client_id_override]=${encodeURIComponent(credentials.oauth_client_id_override)}`);
        }
        if ("oauth_client_secret_override" in credentials) {
          query.push(`credentials[oauth_client_secret_override]=${encodeURIComponent(credentials.oauth_client_secret_override)}`);
        }
        if ("token_id" in credentials) {
          query.push(`token_id=${encodeURIComponent(credentials.token_id)}`);
        }
        if ("token_secret" in credentials) {
          query.push(`token_secret=${encodeURIComponent(credentials.token_secret)}`);
        }
      }
      for (const param in connectionConfig.authorization_params) {
        const val = connectionConfig.authorization_params[param];
        if (typeof val === "string") {
          query.push(`authorization_params[${param}]=${val}`);
        } else if (val === void 0) {
          query.push(`authorization_params[${param}]=undefined`);
        }
      }
    }
    return query.length === 0 ? "" : "?" + query.join("&");
  }
  /**
   * Check that we have one valid credential
   * It's not done in the constructor because if you only use Nango Connect it's not relevant to throw an error
   */
  ensureCredentials() {
    if (!this.publicKey && !this.connectSessionToken) {
      throw new AuthError("You must specify a public key OR a connect session token (cf. documentation).", "missing_auth_token");
    }
  }
};
export {
  AuthError,
  ConnectUI,
  Nango as default
};
//# sourceMappingURL=@nangohq_frontend.js.map
