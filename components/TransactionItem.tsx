import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Transaction } from "../types";
import { theme } from "../theme/colors";

interface Props {
  tx: Transaction;
  onPress: () => void;
}

export default function TransactionItem({ tx, onPress }: Props) {
  // Logic for icon, color, and prefix
  let sign = "";
  let color = theme.text;
  let icon = "circle-outline";

  if (tx.type === "Credit") {
    sign = "+";
    color = theme.success;
    icon = "arrow-up-circle";
  } else if (tx.type === "Debit") {
    sign = "-";
    color = theme.danger;
    icon = "arrow-down-circle";
  } else if (tx.type === "Refund") {
    sign = "+";
    color = theme.info;
    icon = "cash-refund"; // 👈 new refund icon
  }

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
        <MaterialCommunityIcons name={icon as any} size={22} color={color} />
      </View>

      <View style={{ flex: 1 }}>
        r
        <Text style={styles.title} numberOfLines={1}>
          {tx.description}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          [{tx.type}] {tx.category} • {tx.location} • {tx.date}
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
    borderLeftWidth: 4,
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
