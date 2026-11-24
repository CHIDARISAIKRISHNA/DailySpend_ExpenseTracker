
import { useEffect, useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import SummaryCards from "./components/SummaryCards";

function getToday() {
  const today = new Date();
  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");
}

export default function App() {
  const [expenses, setExpenses] = useState(() => {
    return JSON.parse(localStorage.getItem("dailyspend-expenses") || "[]");
  });

  const [selectedDate, setSelectedDate] = useState(getToday());
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    localStorage.setItem("dailyspend-expenses", JSON.stringify(expenses));
  }, [expenses]);

  // Daily 10 PM reminder (while the browser app is open)
  useEffect(() => {
    const checkReminder = async () => {
      const now = new Date();
      const todayKey = getToday();

      if (
        now.getHours() === 22 &&
        now.getMinutes() === 0 &&
        localStorage.getItem("dailyspend-reminded") !== todayKey
      ) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("DailySpend Reminder 🌙", {
            body: "Update today's breakfast, lunch, snacks, dinner and other expenses!"
          });
        }

        localStorage.setItem("dailyspend-reminded", todayKey);
      }
    };

    const timer = setInterval(checkReminder, 60000);
    checkReminder();

    return () => clearInterval(timer);
  }, []);

  const dailyExpenses = expenses.filter(
    (expense) => expense.date === selectedDate
  );

  const saveExpense = (expense) => {
    if (editingExpense) {
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === editingExpense.id ? expense : item
        )
      );
      setEditingExpense(null);
    } else {
      setExpenses((prev) => [expense, ...prev]);
    }
  };

  const deleteExpense = (id) => {
    if (window.confirm("Delete this expense?")) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const startEdit = (expense) => {
    setEditingExpense(expense);
    setSelectedDate(expense.date);
  };

  const cancelEdit = () => setEditingExpense(null);

  const enableReminder = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        alert("Reminder permission enabled! Keep the app open at 10 PM.");
      } else {
        alert("Please allow notifications in your browser settings.");
      }
    } else {
      alert("Notifications are not supported in this browser.");
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <span className="brand-icon">₹</span>
          <div>
            <h1>DailySpend</h1>
            <p>Your daily expense tracker</p>
          </div>
        </div>

        <button className="reminder-button" onClick={enableReminder}>
          🔔 Enable Reminder
        </button>
      </header>

      <main className="container">
        <section className="welcome">
          <h2>Track your spending 💚</h2>
          <p>Small expenses matter. Keep track of where your money goes.</p>
        </section>

        <SummaryCards expenses={dailyExpenses} />

        <div className="main-grid">
          <ExpenseForm
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onAdd={saveExpense}
            editingExpense={editingExpense}
            onCancelEdit={cancelEdit}
          />

          <ExpenseList
  expenses={expenses}
  onDelete={deleteExpense}
  onEdit={startEdit}
/>
        </div>
      </main>
    </div>
  );
}
