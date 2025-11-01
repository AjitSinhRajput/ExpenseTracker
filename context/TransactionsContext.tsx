import React, { createContext, useContext, useReducer, useMemo } from "react";
import { Transaction } from "../types";

type State = Transaction[];

type Action =
  | { type: "ADD"; payload: Omit<Transaction, "id"> }
  | { type: "UPDATE"; id: string; payload: Omit<Transaction, "id"> }
  | { type: "DELETE"; id: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      return [...state, { ...action.payload, id: Date.now().toString() }];

    case "UPDATE":
      return state.map((tx) =>
        tx.id === action.id ? { ...tx, ...action.payload } : tx
      );

    case "DELETE":
      return state.filter((tx) => tx.id !== action.id);

    default:
      return state;
  }
}

const TransactionsContext = createContext<{
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, t: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
}>({
  transactions: [],
  addTransaction: () => {},
  updateTransaction: () => {},
  deleteTransaction: () => {},
});

export const TransactionsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [transactions, dispatch] = useReducer(reducer, []);

  const addTransaction = (payload: Omit<Transaction, "id">) =>
    dispatch({ type: "ADD", payload });

  const updateTransaction = (id: string, payload: Omit<Transaction, "id">) =>
    dispatch({ type: "UPDATE", id, payload });

  const deleteTransaction = (id: string) => dispatch({ type: "DELETE", id });

  const value = useMemo(
    () => ({
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
    }),
    [transactions]
  );

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
};

export function useTransactions() {
  return useContext(TransactionsContext);
}
