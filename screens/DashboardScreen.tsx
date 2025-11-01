import React, { useLayoutEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../theme/colors";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useTransactions } from "../context/TransactionsContext";
import TransactionItem from "../components/TransactionItem";

export default function DashboardScreen() {
  const { logout } = useAuth();
  const nav = useNavigation();
  const { transactions } = useTransactions();
  const [menuVisible, setMenuVisible] = useState(false);

  useLayoutEffect(() => {
    // @ts-ignore
    nav.setOptions({
      title: "Dashboard",
      headerTitleAlign: "center", // ✅ centers title
      headerStyle: { backgroundColor: theme.background },
      headerTintColor: theme.text,
      headerRightContainerStyle: { paddingRight: 12 }, // ✅ pushes to edge
      headerLeftContainerStyle: { paddingLeft: 12 },
      headerRight: () => (
        <Pressable
          onPress={() => setMenuVisible(true)}
          style={{ paddingHorizontal: 8 }}
          hitSlop={10}
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color={theme.text}
          />
        </Pressable>
      ),
    });
  }, [nav]);

  const totals = useMemo(() => {
    const credit = transactions
      .filter((t) => t.type === "Credit")
      .reduce((s, t) => s + t.amount, 0);
    const debit = transactions
      .filter((t) => t.type === "Debit")
      .reduce((s, t) => s + t.amount, 0);
    const balance = credit - debit;
    return { credit, debit, balance };
  }, [transactions]);

  return (
    <View style={styles.wrap}>
      {/* ===== Balance Summary ===== */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Account Summary</Text>

        <View style={styles.summaryRow}>
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Text style={styles.cardLabel}>Credit</Text>
            <Text style={[styles.cardValue, { color: theme.success }]}>
              +${totals.credit.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <Text style={styles.cardLabel}>Debit</Text>
            <Text style={[styles.cardValue, { color: theme.danger }]}>
              -${totals.debit.toFixed(2)}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.balanceCard,
            {
              backgroundColor: theme.card,
              borderColor: totals.balance >= 0 ? theme.success : theme.danger,
            },
          ]}
        >
          <Text style={styles.cardLabel}>Balance Difference</Text>
          <Text
            style={[
              styles.balanceValue,
              { color: totals.balance >= 0 ? theme.success : theme.danger },
            ]}
          >
            {totals.balance >= 0 ? "+" : "-"}$
            {Math.abs(totals.balance).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* ===== Add Button ===== */}
      <Pressable
        style={styles.addBtn}
        onPress={() => nav.navigate("Add" as never)}
      >
        <Text style={styles.addTxt}>+ Add Transaction</Text>
      </Pressable>

      {/* ===== Transactions List ===== */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 8 }}
        renderItem={({ item }) => (
          <TransactionItem
            tx={item}
            onPress={() =>
              nav.navigate("Detail" as never, { id: item.id } as never)
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No transactions yet. Add one!</Text>
        }
      />

      {/* ===== Logout Menu Modal ===== */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuBox}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                logout();
              }}
            >
              <MaterialCommunityIcons
                name="logout"
                size={18}
                color={theme.danger}
                style={{ marginRight: 8 }}
              />
              <Text style={[styles.menuText, { color: theme.danger }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 16,
  },
  summaryContainer: { marginBottom: 16 },
  summaryTitle: {
    color: theme.text,
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  card: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.border,
    elevation: 2,
  },
  cardLabel: {
    color: theme.subtext,
    fontSize: 13,
    marginBottom: 4,
  },
  cardValue: { fontWeight: "800", fontSize: 18 },
  balanceCard: {
    marginTop: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 16,
    alignItems: "center",
  },
  balanceValue: {
    fontWeight: "900",
    fontSize: 22,
    marginTop: 6,
  },
  addBtn: {
    backgroundColor: theme.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  addTxt: { color: "white", fontWeight: "800", fontSize: 16 },
  empty: { color: theme.subtext, textAlign: "center", marginTop: 24 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  menuBox: {
    backgroundColor: theme.surface,
    marginTop: 48,
    marginRight: 12,
    borderRadius: 8,
    paddingVertical: 8,
    width: 130,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  menuText: { fontWeight: "700", fontSize: 14 },
});
