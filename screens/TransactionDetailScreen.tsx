import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { theme } from "../theme/colors";
import { useTransactions } from "../context/TransactionsContext";

export default function TransactionDetailScreen() {
  const route = useRoute<any>();
  const nav = useNavigation();
  const { id } = route.params as { id: string };
  const { transactions, deleteTransaction } = useTransactions();

  const tx = useMemo(
    () => transactions.find((t) => t.id === id),
    [transactions, id]
  );

  if (!tx) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.text}>Transaction not found.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteTransaction(tx.id);
            // @ts-ignore
            if (nav.canGoBack()) {
              nav.goBack();
            } else {
              nav.navigate("Dashboard" as never);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.wrap}>
      <Row label="Description" value={tx.description} />
      <Row label="Date" value={tx.date} />
      <Row label="Amount" value={`$${tx.amount.toFixed(2)}`} />
      <Row label="Type" value={tx.type} />
      <Row label="Category" value={tx.category} />
      <Row label="Location" value={tx.location} />

      <View style={styles.btnRow}>
        <Pressable
          style={[styles.btn, { backgroundColor: theme.primary }]}
          onPress={() => nav.navigate("Add" as never, { editTx: tx } as never)}
        >
          <Text style={styles.btnText}>Edit</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, { backgroundColor: theme.danger }]}
          onPress={handleDelete}
        >
          <Text style={styles.btnText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: theme.background, padding: 16 },
  text: { color: theme.text, textAlign: "center" },

  row: {
    backgroundColor: theme.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  label: { color: theme.subtext, marginBottom: 4 },
  value: { color: theme.text, fontWeight: "700" },

  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  btn: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },
});
