
import { useState } from "react";

export default function ExpenseList({ expenses, onDelete, onEdit }) {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  );

  const monthlyExpenses = expenses
    .filter((expense) => expense.date?.startsWith(selectedMonth))
    .sort((a, b) => a.date.localeCompare(b.date));

  const monthlyTotal = monthlyExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  return (
    <div className="panel monthly-expenses">
      <div className="monthly-header">
        <div>
          <h2>Monthly Expenses</h2>
          <p>View all your expenses month by month</p>
        </div>

        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <div className="monthly-total">
        <span>Total Expenses</span>
        <h2>₹{monthlyTotal.toLocaleString("en-IN")}</h2>
        <p>{monthlyExpenses.length} transactions</p>
      </div>

      {monthlyExpenses.length === 0 ? (
        <div className="empty-state">
          <h3>No expenses for this month</h3>
          <p>Start adding expenses to see them here.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Expense Name</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {monthlyExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>
                    {new Date(expense.date + "T00:00:00").toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      }
                    )}
                  </td>

                  <td>
                    <span className="category-badge">
                      {expense.category}
                    </span>
                  </td>

                  <td className="amount-cell">
                    ₹{Number(expense.amount).toLocaleString("en-IN")}
                  </td>

                  <td>
                    <div className="expense-name-cell">
                      <strong>{expense.name}</strong>
                      {expense.meal && (
                        <small>{expense.meal}</small>
                      )}
                    </div>
                  </td>

                  <td>
                    <div className="table-actions">
                      <button onClick={() => onEdit(expense)}>
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => onDelete(expense.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
