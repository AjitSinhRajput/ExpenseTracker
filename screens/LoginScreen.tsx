import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { theme } from "../theme/colors";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const { login } = useAuth();
  const nav = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    // Reset error
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    if (username.trim() === "admin" && password.trim() === "admin") {
      login(username.trim(), password.trim());
      // RootNavigator handles navigation automatically
    } else {
      setError("Incorrect username or password.");
    }
  }

  const inputStyle = [styles.input, error && { borderColor: theme.danger }];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>ExpenseTracker</Text>
        <Text style={styles.quote}>
          “Track your spending, shape your freedom.”
        </Text>
      </View>

      {/* Login Box */}
      <View style={styles.box}>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {/* Username */}
        <TextInput
          value={username}
          onChangeText={(v) => {
            setUsername(v);
            if (error) setError("");
          }}
          placeholder="Username"
          placeholderTextColor={theme.subtext}
          autoCapitalize="none"
          style={inputStyle}
        />

        {/* Password */}
        <TextInput
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            if (error) setError("");
          }}
          placeholder="Password"
          placeholderTextColor={theme.subtext}
          secureTextEntry
          style={inputStyle}
        />

        {/* Error Message */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Login Button */}
        <Pressable style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>Login</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 50,
    marginTop: -40, // slightly upward placement
  },
  title: {
    color: theme.primary,
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  quote: {
    color: theme.subtext,
    fontSize: 15,
    fontStyle: "italic",
    marginTop: 8,
    textAlign: "center",
    width: "80%",
  },
  box: {
    backgroundColor: theme.card,
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  subtitle: {
    color: theme.text,
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    backgroundColor: theme.surface,
    color: theme.text,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 10,
  },
  error: {
    color: theme.danger,
    fontSize: 13,
    marginBottom: 8,
    textAlign: "center",
    fontWeight: "600",
  },
  btn: {
    backgroundColor: theme.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
