const APPLICATION_ID: string =
  "20e149e67b28302d54d4e79cb96e5f14bbd0cd075c40abf329b8d358be93906a";
const CALLBACK_PATH: string = "/auth/gitlab/callback";
const BASE_URL: string = window.location.origin;
const CALLBACK_URL: string = `${BASE_URL}${CALLBACK_PATH}`;
const SCOPE: string = "openid+read_user+profile+api";
const LOGIN_METADATA_KEY: string = "mr-explorer_login_metadata";
const TOKEN_KEY: string = "mr-explorer_access_token";
const EXPIRATION_DATE_KEY: string = "mr-explorer_expiration_date";

export interface LoginMetadata {
  state: string;
  originalUrl: string;
}

export interface LoginInformations {
  token: string | null;
  expirationDate: number | null;
  originalUrl: string | null;
}

class AuthUtils {
  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  static getExpirationDate(): number | null {
    const expirationDateString: string | null = localStorage.getItem(
      EXPIRATION_DATE_KEY
    );
    if (!expirationDateString) return null;
    return parseInt(expirationDateString);
  }

  static setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  static setExpirationDate(expirationDate: number): void {
    localStorage.setItem(EXPIRATION_DATE_KEY, expirationDate.toString());
  }

  static clearAuthData(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRATION_DATE_KEY);
    localStorage.removeItem(LOGIN_METADATA_KEY);
  }

  static isAuthenticated(): boolean {
    const accessToken: string | null = this.getToken();
    const expirationDate: number | null = this.getExpirationDate();
    if (accessToken === null || expirationDate === null) return false;
    const isAccessTokenValid: boolean = Date.now() < expirationDate;
    return isAccessTokenValid;
  }

  static redirectToLogin(originalUrl: string = ""): void {
    const state: string = Math.floor(Math.random() * 10000000).toString();
    const loginMetadata: LoginMetadata = { state, originalUrl };
    localStorage.setItem(LOGIN_METADATA_KEY, JSON.stringify(loginMetadata));
    window.location.replace(
      `https://gitlab.com/oauth/authorize?client_id=${APPLICATION_ID}&redirect_uri=${CALLBACK_URL}&response_type=token&state=${state}&scope=${SCOPE}`
    );
  }

  static deriveLoginInfoFromUrl(
    pathname: string,
    hash: string
  ): LoginInformations {
    const nullResult: LoginInformations = {
      token: null,
      expirationDate: null,
      originalUrl: null,
    };
    if (pathname !== CALLBACK_PATH) return nullResult;

    // Remove # in the string
    const paramsString: string = hash.substr(1);
    const paramsStringArray: string[] = paramsString.split("&");
    if (paramsStringArray.length !== 3) return nullResult;
    const [token, tokenType, state] = paramsStringArray.map(
      (paramString: string): string => paramString.split("=")[1]
    );
    if (tokenType !== "Bearer") return nullResult;
    const loginMetadaString: string | null = localStorage.getItem(
      LOGIN_METADATA_KEY
    );
    if (!loginMetadaString) return nullResult;
    let loginMetadata: LoginMetadata;
    try {
      loginMetadata = JSON.parse(loginMetadaString);
    } catch (err) {
      return nullResult;
    }
    if (state !== loginMetadata.state) return nullResult;
    localStorage.removeItem(LOGIN_METADATA_KEY);
    // Still need to check the token
    return {
      token,
      expirationDate: Date.now() + 1000 * 60 * 60 * 2,
      originalUrl: loginMetadata.originalUrl,
    };
  }
}

export default AuthUtils;
