
import { useEffect, useState } from "react";
import { meals, categories } from "../data/categories";

export default function ExpenseForm({
  selectedDate,
  onDateChange,
  onAdd,
  editingExpense,
  onCancelEdit
}) {
  const [category, setCategory] = useState("Infosys Campus Food");
  const [meal, setMeal] = useState("Breakfast");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  // Fill the form when editing an existing expense
  useEffect(() => {
    if (editingExpense) {
      setCategory(editingExpense.category);
      setMeal(editingExpense.meal || "Breakfast");
      setName(editingExpense.name);
      setAmount(editingExpense.amount);
      setNote(editingExpense.note || "");
    }
  }, [editingExpense]);

  // Different placeholder based on category
  const getPlaceholder = () => {
    switch (category) {
      case "Infosys Campus Food":
        return "Eg. Dosa, Meals, Chapati";
      case "Outside Food":
        return "Eg. Restaurant name, Pizza, Burger";
      case "Laundry":
        return "Eg. Washing clothes, Ironing";
      case "Trips":
        return "Eg. Bus ticket, Weekend trip";
      case "Snacks":
        return "Eg. Tea, Coffee, Chips";
      case "Shopping":
        return "Eg. T-shirt, Shoes, Accessories";
      default:
        return "Enter expense details";
    }
  };

  const resetForm = () => {
    setCategory("Infosys Campus Food");
    setMeal("Breakfast");
    setName("");
    setAmount("");
    setNote("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !amount || Number(amount) <= 0) {
      return;
    }

    const expense = {
      id: editingExpense ? editingExpense.id : Date.now(),
      date: selectedDate,
      category,
      meal: category === "Infosys Campus Food" ? meal : "",
      name: name.trim(),
      amount: Number(amount),
      note: note.trim()
    };

    onAdd(expense);
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit();
  };

  return (
    <div className="panel expense-form">
      <h2>{editingExpense ? "Edit Expense" : "Add Expense"}</h2>

      <form onSubmit={handleSubmit}>
        {/* Expense Category */}
        <label>Expense Category</label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Date */}
        <label>Date</label>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          required
        />

        {/* Show meal options only for Infosys Campus Food */}
        {category === "Infosys Campus Food" && (
          <>
            <label>Meal</label>

            <div className="meal-options">
              {meals.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={meal === item ? "selected" : ""}
                  onClick={() => setMeal(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Expense Name */}
        <label>
          {category === "Laundry"
            ? "Laundry Details"
            : category === "Trips"
            ? "Trip Details"
            : category === "Shopping"
            ? "Item Name"
            : category === "Outside Food"
            ? "Food / Restaurant Name"
            : category === "Snacks"
            ? "Snack Name"
            : "Expense Name"}
        </label>

        <input
          type="text"
          placeholder={getPlaceholder()}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Amount */}
        <label>Amount (₹)</label>

        <input
          type="number"
          min="1"
          step="0.01"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        {/* Optional Note */}
        <label>Note (Optional)</label>

        <textarea
          rows="2"
          placeholder="Add extra details..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* Submit */}
        <button className="add-button" type="submit">
          {editingExpense ? "Update Expense" : "+ Save Expense"}
        </button>

        {editingExpense && (
          <button
            className="cancel-button"
            type="button"
            onClick={handleCancel}
          >
            Cancel Editing
          </button>
        )}
      </form>
    </div>
  );
}
