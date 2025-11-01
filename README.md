# 💰 ExpenseTracker

A modern and intuitive **React Native financial management app** that helps users record, manage, and analyze their daily expenses efficiently.

---

## 📱 Features

✅ **Secure Login**

- Only authorized credentials (`admin / admin`) can access the dashboard.
- Displays meaningful error messages for incorrect username or password.

✅ **Dashboard Overview**

- Displays total **credits**, **debits**, and **net balance**.
- Automatically calculates and color-codes positive/negative balance.
- Lets users **view all transactions** in a clean list.

✅ **Add, Edit, and Delete Transactions**

- Add new transactions with:
  - Date
  - Amount
  - Description
  - Location
  - Type (Credit, Debit, Refund)
  - Category (Shopping, Travel, Utility, etc.)
- Edit and update existing transactions.
- Delete transactions with a confirmation dialog.
- Each transaction records **created** and **last modified timestamps**.

✅ **Transaction Details**

- View complete transaction details including timestamps.
- Quick access to **Edit** or **Delete** actions.

✅ **Session Handling**

- Logout safely returns the user to the login screen.

---

## ⚙️ Tech Stack

| Layer                | Technology                             |
| -------------------- | -------------------------------------- |
| **Framework**        | React Native (Expo)                    |
| **Language**         | TypeScript                             |
| **Navigation**       | React Navigation                       |
| **State Management** | Context API + useReducer               |
| **UI Components**    | Custom React Native Components         |
| **Date Picker**      | @react-native-community/datetimepicker |

---

## 🧠 Architecture Highlights

- **AuthContext** → Manages login/logout state and authentication.
- **TransactionsContext** → Handles adding, updating, deleting, and timestamping transactions.
- **Navigation** → Enables smooth transitions between login, dashboard, detail, and add/edit screens.

---

## 🚀 How to Run

### Clone the repository

```bash
git clone https://github.com/AjitSinhRajput/ExpenseTracker.git
cd ExpenseTracker
```

### Installation & Setup

## 🧩 Install Dependencies

Run the following command to install all required dependencies:

```bash
npm install
# or
yarn install
```

### Run the App

## Start the development server using:

```bash
npm start
# or
expo start
```
