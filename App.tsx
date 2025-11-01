import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./navigation/RootNavigator";
import { AuthProvider } from "./context/AuthContext";
import { TransactionsProvider } from "./context/TransactionsContext";
import { theme } from "./theme/colors";

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.background,
    primary: theme.primary,
    card: theme.card,
    text: theme.text,
    border: theme.border,
    notification: theme.accent,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TransactionsProvider>
          <NavigationContainer theme={navTheme}>
            <RootNavigator />
          </NavigationContainer>
        </TransactionsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
