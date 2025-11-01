import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { theme } from "../theme/colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTransactions } from "../context/TransactionsContext";
import { Category, TransactionType, Transaction } from "../types";
import { validateTransaction } from "../utils/validation";

export default function AddTransactionScreen() {
  const nav = useNavigation();
  const route = useRoute<any>();
  const editTx: Transaction | undefined = route.params?.editTx;

  const { addTransaction, updateTransaction } = useTransactions();

  const [date, setDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<TransactionType | "">("");
  const [category, setCategory] = useState<Category | "">("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const transactionTypes: TransactionType[] = ["Debit", "Credit", "Refund"];
  const categories: Category[] = [
    "Shopping",
    "Travel",
    "Utility",
    "Food",
    "Health",
    "Other",
  ];

  useEffect(() => {
    if (editTx) {
      setDate(editTx.date);
      setAmount(editTx.amount.toString());
      setDescription(editTx.description);
      setLocation(editTx.location);
      setType(editTx.type);
      setCategory(editTx.category);
    }
  }, [editTx]);

  const inputStyle = (field: string) => [
    styles.input,
    errors[field] && { borderColor: theme.danger },
  ];

  const pickerBoxStyle = (field: string) => [
    styles.dropdownBox,
    errors[field] && { borderColor: theme.danger },
  ];

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }
    if (selectedDate) {
      const iso = selectedDate.toISOString().split("T")[0];
      setDate(iso);
      if (errors.date) setErrors((e) => ({ ...e, date: "" }));
    }
    setShowDatePicker(false);
  };

  function onSubmit() {
    const payload: Omit<Transaction, "id"> = {
      date: date.trim(),
      amount: Number(amount),
      description: description.trim(),
      location: location.trim(),
      type: type as TransactionType,
      category: category as Category,
    };

    const { valid, errors: newErrors } = validateTransaction(payload);
    setErrors(newErrors);
    if (!valid) return;

    if (editTx) {
      updateTransaction(editTx.id, payload);
    } else {
      addTransaction(payload);
    }

    setErrors({});
    // @ts-ignore
    if (nav.canGoBack()) {
      nav.goBack();
    } else {
      nav.navigate("Dashboard" as never);
    }
  }

  return (
    <ScrollView
      style={styles.wrap}
      contentContainerStyle={{ paddingBottom: 32 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.headerText}>
        {editTx ? "Edit Transaction" : "Add Transaction"}
      </Text>

      {/* ===== Date ===== */}
      <Field label="Date (YYYY-MM-DD)">
        <Pressable
          onPress={() => setShowDatePicker(true)}
          style={pickerBoxStyle("date")}
        >
          <Text style={styles.dropdownText}>{date || "Select Date"}</Text>
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            value={date ? new Date(date) : new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "calendar"}
            onChange={handleDateChange}
            maximumDate={new Date()}
            themeVariant="dark"
          />
        )}
        {errors.date && <Text style={styles.error}>{errors.date}</Text>}
      </Field>

      {/* ===== Amount ===== */}
      <Field label="Amount">
        <TextInput
          value={amount}
          onChangeText={(v) => {
            setAmount(v);
            if (errors.amount) setErrors((e) => ({ ...e, amount: "" }));
          }}
          keyboardType="decimal-pad"
          placeholder="100.50"
          placeholderTextColor={theme.subtext}
          style={inputStyle("amount")}
        />
        {errors.amount && <Text style={styles.error}>{errors.amount}</Text>}
      </Field>

      {/* ===== Description ===== */}
      <Field label="Description">
        <TextInput
          value={description}
          onChangeText={(v) => {
            setDescription(v);
            if (errors.description)
              setErrors((e) => ({ ...e, description: "" }));
          }}
          placeholder="e.g., Bus pass"
          placeholderTextColor={theme.subtext}
          style={inputStyle("description")}
        />
        {errors.description && (
          <Text style={styles.error}>{errors.description}</Text>
        )}
      </Field>

      {/* ===== Location ===== */}
      <Field label="Location">
        <TextInput
          value={location}
          onChangeText={(v) => {
            setLocation(v);
            if (errors.location) setErrors((e) => ({ ...e, location: "" }));
          }}
          placeholder="London, ON"
          placeholderTextColor={theme.subtext}
          style={inputStyle("location")}
        />
        {errors.location && <Text style={styles.error}>{errors.location}</Text>}
      </Field>

      {/* ===== Transaction Type ===== */}
      <Field label="Transaction Type">
        <Pressable
          style={pickerBoxStyle("type")}
          onPress={() => setShowTypeModal(true)}
        >
          <Text style={styles.dropdownText}>
            {type ? type : "Select Transaction Type"}
          </Text>
        </Pressable>
        {errors.type && <Text style={styles.error}>{errors.type}</Text>}
      </Field>

      {/* ===== Category ===== */}
      <Field label="Category">
        <Pressable
          style={pickerBoxStyle("category")}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={styles.dropdownText}>
            {category ? category : "Select Category"}
          </Text>
        </Pressable>
        {errors.category && <Text style={styles.error}>{errors.category}</Text>}
      </Field>

      {/* Modals reused from your version */}
      {/* ===== Transaction Type Modal ===== */}
      <Modal visible={showTypeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Transaction Type</Text>
            <FlatList
              data={transactionTypes}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    setType(item);
                    setShowTypeModal(false);
                    if (errors.type) setErrors((e) => ({ ...e, type: "" }));
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <Pressable onPress={() => setShowTypeModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ===== Category Modal ===== */}
      <Modal visible={showCategoryModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    setCategory(item);
                    setShowCategoryModal(false);
                    if (errors.category)
                      setErrors((e) => ({ ...e, category: "" }));
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <Pressable onPress={() => setShowCategoryModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ===== Add or Save Button ===== */}
      <Pressable style={styles.btn} onPress={onSubmit}>
        <Text style={styles.btnText}>
          {editTx ? "Save Changes" : "Add Transaction"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function Field({
  label,
  children,
}: React.PropsWithChildren<{ label: string }>) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: theme.background, padding: 16 },
  headerText: {
    color: theme.text,
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 16,
  },
  label: { color: theme.subtext, marginBottom: 6 },
  input: {
    backgroundColor: theme.surface,
    color: theme.text,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  dropdownBox: {
    backgroundColor: theme.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 12,
    justifyContent: "center",
  },
  dropdownText: { color: theme.text, fontSize: 15 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: theme.surface,
    width: "80%",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    color: theme.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  optionText: {
    color: theme.text,
    fontSize: 16,
    textAlign: "center",
  },
  cancelText: {
    color: theme.primary,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "700",
  },
  error: {
    color: theme.danger,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  btn: {
    backgroundColor: theme.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  btnText: { color: "white", fontWeight: "800", fontSize: 16 },
});
