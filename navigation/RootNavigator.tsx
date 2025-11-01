import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import AddTransactionScreen from "../screens/AddTransactionScreen";
import TransactionDetailScreen from "../screens/TransactionDetailScreen";
import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: "Dashboard" }}
      />
      <Stack.Screen
        name="Add"
        component={AddTransactionScreen}
        options={{ title: "Transaction" }}
      />
      <Stack.Screen
        name="Detail"
        component={TransactionDetailScreen}
        options={{ title: "Details" }}
      />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { state } = useAuth();
  return state.isAuthenticated ? <AppStack /> : <AuthStack />;
}
