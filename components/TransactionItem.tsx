import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Transaction } from "../types";
import { theme } from "../theme/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  tx: Transaction;
  onPress: () => void;
}

export default function TransactionItem({ tx, onPress }: Props) {
  const isCredit = tx.type === "Credit" || tx.type === "Refund";
  const sign = isCredit ? "+" : "-";
  const color = isCredit ? theme.success : theme.danger;
  const icon = isCredit ? "arrow-up-circle" : "arrow-down-circle";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && { opacity: 0.7 },
        { borderLeftColor: color },
      ]}
      android_ripple={{ color: theme.muted }}
    >
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name={icon} size={22} color={color} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>
          {tx.description}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {tx.category} • {tx.location} • {tx.date}
        </Text>
      </View>

      <Text style={[styles.amount, { color }]}>
        {sign}${Math.abs(tx.amount).toFixed(2)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderLeftWidth: 4, // subtle colored accent
  },
  iconBox: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "600",
  },
  sub: {
    color: theme.subtext,
    marginTop: 2,
    fontSize: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    minWidth: 80,
    textAlign: "right",
  },
});
