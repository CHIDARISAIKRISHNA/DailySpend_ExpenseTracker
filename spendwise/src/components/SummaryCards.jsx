
export default function SummaryCards({ expenses }) {
  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const foodCategories = [
    "Infosys Campus Food",
    "Outside Food",
    "Snacks"
  ];

  const food = expenses
    .filter((expense) => foodCategories.includes(expense.category))
    .reduce((sum, expense) => sum + Number(expense.amount), 0);

  const other = total - food;

  return (
    <div className="summary-grid">
      <div className="summary-card main-card">
        <span>Total Spending</span>
        <h2>₹{total.toLocaleString("en-IN")}</h2>
        <p>Total spending for the selected date</p>
      </div>

      <div className="summary-card">
        <span>Food Expenses</span>
        <h2>₹{food.toLocaleString("en-IN")}</h2>
        <p>Campus food, outside food & snacks</p>
      </div>

      <div className="summary-card">
        <span>Other Expenses</span>
        <h2>₹{other.toLocaleString("en-IN")}</h2>
        <p>Shopping, trips, laundry & others</p>
      </div>
    </div>
  );
}
