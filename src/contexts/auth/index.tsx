import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  useEffect
} from "react";
import { useLocation, useHistory } from "react-router-dom";
// Utils
import AuthUtils, { LoginInformations } from "utils/auth.utils";

interface IContext {
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
}

const AuthContext: React.Context<any> = createContext(undefined);

type AuthProviderProps = any;
export const AuthProvider = (props: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    AuthUtils.isAuthenticated()
  );

  const { pathname, hash } = useLocation();
  const history = useHistory();
  const [isAuthInitialized, setAuthInitialized] = useState<boolean>(false);

  useEffect((): void => {
    if (!isAuthenticated) {
      const {
        token,
        expirationDate,
        originalUrl
      }: LoginInformations = AuthUtils.deriveLoginInfoFromUrl(pathname, hash);
      // Authenticating
      if (token && expirationDate) {
        AuthUtils.setToken(token);
        AuthUtils.setExpirationDate(expirationDate);
        setIsAuthenticated(true);
        history.push(originalUrl || "/");
      } else {
        AuthUtils.clearAuthData();
        AuthUtils.redirectToLogin(pathname);
      }
    }
    setAuthInitialized(true);
  }, [pathname, hash, history, isAuthenticated]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isAuthInitialized
    }),
    [isAuthenticated, isAuthInitialized]
  );

  return <AuthContext.Provider value={value} {...props} />;
};

export interface IAuth {
  isAuthInitialized: boolean;
  isAuthenticated: boolean;
  getToken: () => string | null;
}

export const useAuth = (): IAuth => {
  const context: IContext = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be accessed in a child of the AuthContextProvider."
    );
  }

  return {
    isAuthInitialized: context.isAuthInitialized,
    isAuthenticated: context.isAuthenticated,
    getToken: AuthUtils.getToken
  };
};
