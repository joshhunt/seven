import { v4 as uuidv4 } from "uuid";

export const AnalyticsUrl = "https://analytics.bungie.net/events";
export const TokenUrl = "https://auth.bungie.net/token";

const AnonymousClientId = "7F9OTCCENEL4IFM0TGZZ";
const TokenExpirationWindow = 60000; // ms

class Event {
  public s: string;
  public t: string;
  public n: string;
  public p: Record<string, EventParameterValue>;
  public uid: string;
  public aid: string;
}

class EventParameterValue {
  public s: string;
  public i: number;
  public f: number;
}

export default class BungieAnalytics {
  private readonly _anonymousId: string;
  private readonly _source: string;
  private _debug: boolean;
  private _token: string;
  private _tokenExpires: number; // milliseconds since Unix epoch UTC
  private _userId: string;

  constructor(source: string, anonymousId: string = null) {
    this._anonymousId = anonymousId ? anonymousId : uuidv4();
    this._source = source;
    this._tokenExpires = 0;
  }

  get anonymousId(): string {
    return this._anonymousId;
  }

  get debug(): boolean {
    return this._debug;
  }

  set debug(debug: boolean) {
    this._debug = debug;
  }

  get source(): string {
    return this._source;
  }

  get token(): string {
    return this._token;
  }

  get tokenExpires(): number {
    return this._tokenExpires;
  }

  get userId(): string {
    return this._userId;
  }

  set userId(userId: string) {
    this._userId = userId;
  }

  public async sendEvent(
    name: string,
    parameters: Record<string, boolean | number | string> = {}
  ): Promise<void> {
    const timestamp = new Date().toISOString();

    // No source; fail silently
    if (!this._source) {
      if (this._debug) {
        console.warn("Send event failed: Bungie Analytics source is not set");
      }

      return;
    }

    // Get token, if needed
    if (Date.now() >= this._tokenExpires - TokenExpirationWindow) {
      await this.getToken();
    }

    // Could not authenticate; fail silently
    if (!this._token) {
      return;
    }

    // Create event
    const e = new Event();
    e.aid = this._anonymousId;
    e.n = name;
    e.s = this._source;
    e.t = timestamp;
    if (Object.keys(parameters).length > 0) {
      e.p = {};
    }
    if (this._userId) {
      e.uid = this._userId;
    }

    // Add parameters
    for (const key in parameters) {
      const value = parameters[key];
      if (typeof value === "boolean") {
        e.p[key] = new EventParameterValue();
        e.p[key].s = value ? "TRUE" : "FALSE";
      }
      if (typeof value === "number") {
        if (Number.isInteger(value)) {
          e.p[key] = new EventParameterValue();
          e.p[key].i = value;
        } else {
          e.p[key] = new EventParameterValue();
          e.p[key].f = value;
        }
      }
      if (typeof value === "string") {
        e.p[key] = new EventParameterValue();
        e.p[key].s = value;
      }
    }

    // Send event
    return fetch(AnalyticsUrl, {
      method: "POST",
      body: JSON.stringify(e),
      cache: "no-cache",
      credentials: "omit",
      headers: {
        Authorization: "Bearer " + this._token,
        "Content-Type": "application/json",
      },
      mode: "cors",
      redirect: "follow",
      referrerPolicy: "no-referrer",
    })
      .then((response) => {
        if (!response.ok && this._debug) {
          console.warn("Send event failed: " + response.statusText);
        }
        // TODO: Retry
      })
      .catch((error) => {
        if (this._debug) {
          console.warn("Send event failed: " + (error.message as string));
        }
        // TODO: Retry
      });
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  private async getToken() {
    const authorization =
      "Basic " + btoa(`${AnonymousClientId}:${this._anonymousId}`);

    return fetch(TokenUrl, {
      method: "POST",
      body: "grant_type=client_credentials&scope=anonymous",
      cache: "no-cache",
      credentials: "omit",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      mode: "cors",
      redirect: "follow",
      referrerPolicy: "no-referrer",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        if (this._debug) {
          console.warn("Get token failed: " + response.statusText);
        }
        // TODO: Retry
      })
      .then((json) => {
        const tokenResponse: any = json;
        this._token = tokenResponse.access_token;
        this._tokenExpires = Date.now() + tokenResponse.expires_in * 1000;
      })
      .catch((error) => {
        this._token = null;
        this._tokenExpires = 1;
        if (this._debug) {
          console.warn("Get token failed: " + (error.message as string));
        }
        // TODO: Retry
      });
  }
}
