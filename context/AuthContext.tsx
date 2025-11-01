import React, { createContext, useContext, useMemo, useReducer } from "react";
import { Alert } from "react-native";

type AuthState = { isAuthenticated: boolean; username?: string };
type Action =
  | { type: "LOGIN"; payload: { username: string; password: string } }
  | { type: "LOGOUT" };

export default function _never(x: never) {
  return x;
}

const initialState: AuthState = { isAuthenticated: false, username: undefined };

function reducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "LOGIN": {
      const { username, password } = action.payload;
      if (username === "admin" && password === "admin") {
        return { isAuthenticated: true, username };
      } else {
        Alert.alert("Invalid credentials", "Use admin / admin");
        return state;
      }
    }
    case "LOGOUT":
      return { isAuthenticated: false, username: undefined };
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: AuthState;
  login: (username: string, password: string) => void;
  logout: () => void;
}>({ state: initialState, login: () => {}, logout: () => {} });

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(
    () => ({
      state,
      login: (username: string, password: string) =>
        dispatch({ type: "LOGIN", payload: { username, password } }),
      logout: () => dispatch({ type: "LOGOUT" }),
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}
