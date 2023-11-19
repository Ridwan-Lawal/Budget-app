import { useState } from "react";

export default function App() {
  return (
    <div className="h-fit  bg-gray-100">
      <Container />
    </div>
  );
}

function Container() {
  const [totalBudget, setTotalBudget] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [itemBought, setItemBought] = useState("");
  const [itemCost, setItemCost] = useState("");
  const [isResetClicked, setIsResetClicked] = useState(false);

  const getExpensesAmount = expenses.reduce(
    (acc, cur) => acc + cur.itemCost,
    0
  );
  const getBalance = totalBudget - getExpensesAmount;

  function handleDeleteExpense(id) {
    setExpenses((curExpenses) =>
      curExpenses.filter((expense) => expense.id !== id)
    );
  }

  function handleEditExpense(id, itemAlreadyBought, itemAlreadyCost) {
    setItemBought(itemAlreadyBought);
    setItemCost(itemAlreadyCost);

    setExpenses((curExpenses) =>
      curExpenses.filter((expense) => expense.id !== id)
    );
  }

  function handleResetClick() {
    setIsResetClicked((show) => !show);
  }

  function handleReset() {
    setTotalBudget(0);
    setExpenses([]);
    setItemBought("");
    setItemCost("");

    setIsResetClicked(false);
  }

  return (
    <div className="py-12 max-w-4xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-10">
      <Forms
        setTotalBudget={setTotalBudget}
        setExpenses={setExpenses}
        totalBudget={totalBudget}
        itemBought={itemBought}
        setItemBought={setItemBought}
        itemCost={itemCost}
        setItemCost={setItemCost}
      />
      <DashboardBalance
        totalBudget={totalBudget}
        totalBalanceLeft={getBalance}
        totalExpenses={getExpensesAmount}
      />
      <ExpenseList
        expenses={expenses}
        onDeleteExpense={handleDeleteExpense}
        onEditExpense={handleEditExpense}
        onResetClick={handleResetClick}
      />
      <ResetWarning
        isResetClicked={isResetClicked}
        onResetClick={handleResetClick}
        onReset={handleReset}
      />
    </div>
  );
}

function Forms({
  setTotalBudget,
  setExpenses,
  totalBudget,
  itemBought,
  itemCost,
  setItemBought,
  setItemCost,
}) {
  const [budget, setBudget] = useState("");

  function handleCheckAmountSubmit(e) {
    e.preventDefault();
    if (!itemBought || !itemCost) return;

    const newExpense = { itemBought, itemCost, id: crypto.randomUUID() };
    setExpenses((curExpenses) => [newExpense, ...curExpenses]);

    setItemBought("");
    setItemCost("");
  }

  function handleBudgetChange(e) {
    if (!Number.isFinite(+e.target.value)) return;
    setBudget(+e.target.value);
  }

  function handleItemCostChange(e) {
    if (!Number.isFinite(+e.target.value)) return;
    setItemCost(+e.target.value);
  }

  function handleBudgetSubmit(e) {
    e.preventDefault();
    if (!budget) return;

    setTotalBudget(budget);
    setBudget("");
  }

  return (
    <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12">
      <Form
        heading="Budget"
        onSubmit={handleBudgetSubmit}
        buttonName="Set Budget"
      >
        <input
          type="text"
          value={budget}
          onChange={handleBudgetChange}
          placeholder="Enter Total Amount"
          className=""
        />
      </Form>
      <Form
        heading="Expenses"
        onSubmit={handleCheckAmountSubmit}
        totalBudget={totalBudget}
        buttonName="Check Amount"
      >
        <input
          type="text"
          value={itemBought}
          onChange={(e) => setItemBought(e.target.value)}
          placeholder="Item bought"
          className=""
          disabled={totalBudget ? false : true}
        />

        <input
          type="text"
          value={itemCost}
          onChange={handleItemCostChange}
          placeholder="Cost of Item"
          className="mt-5"
          disabled={totalBudget ? false : true}
        />
      </Form>
    </div>
  );
}

function Form({ heading, children, buttonName, onSubmit, totalBudget }) {
  return (
    <div className="shadow-xl bg-white h-[280px] py-3 px-5  rounded-xl">
      <h1 className="text-blue-900 text-3xl font-bold">{heading}</h1>
      <form className="mt-4" onSubmit={onSubmit}>
        {children}
        <button className="bg-gradient-to-r from-blue-500 to-sky-500 hover:scale-105 transition-transform mt-9 py-2.5 px-10 rounded-md font-medium text-white">
          {buttonName}
        </button>
      </form>
    </div>
  );
}

function DashboardBalance({ totalBudget, totalBalanceLeft, totalExpenses }) {
  const totalBudgetInNaira = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  })
    .format(totalBudget)
    .split(".")[0];

  const totalExpensesInNaira = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  })
    .format(totalExpenses)
    .split(".")[0];

  const totalBalanceInNaira = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  })
    .format(totalBalanceLeft)
    .split(".")[0];
  return (
    <div className="flex flex-col gap-8 md:flex-row shadow-md px-8 col-span-2 bg-gradient-to-r  from-blue-500 to-sky-500 justify-between  py-6 rounded-xl">
      <Balance name="Total Budget" balance={totalBudgetInNaira} />
      <Balance name="Expenses" balance={totalExpensesInNaira} />
      <Balance name="Balance" balance={totalBalanceInNaira} />
    </div>
  );
}

function Balance({ name, balance }) {
  return (
    <section className="space-y-2 text-center">
      <h3 className="text-[26px] font-medium text-white">{name}</h3>
      <p className="text-[25px] text-white font-normal">{balance}</p>
    </section>
  );
}

function ExpenseList({
  expenses,
  onSubmit,
  onDeleteExpense,
  onEditExpense,
  onReset,
  onResetClick,
}) {
  return (
    <div className="shadow-xl bg-white col-span-2 rounded-xl pt-8 pb-12 px-8">
      <h2 className="text-blue-950 font-semibold text-[25px]">Expense List</h2>
      <div className=" mt-4 space-y-5 ">
        {expenses.map((expense) => (
          <Expense
            itemBought={expense.itemBought}
            itemCost={expense.itemCost}
            key={expense.id}
            id={expense.id}
            onDeleteExpense={onDeleteExpense}
            onEditExpense={onEditExpense}
          />
        ))}
      </div>

      <button
        onClick={onResetClick}
        className="bg-gradient-to-r from-red-600 to-pink-700 hover:scale-105 transition-transform mt-14 py-2.5 px-10 rounded-md font-medium text-white"
      >
        Reset
      </button>
    </div>
  );
}

function Expense({ itemBought, onEditExpense, id, itemCost, onDeleteExpense }) {
  return (
    <div className="border-l-4 border-blue-600 transition-all duration-400 py-2.5 pl-8  items-center flex justify-between">
      <p className="text-xl text-blue-950 font-medium w-[30%] ">{itemBought}</p>
      <p className="text-xl text-blue-950 font-medium  w-[20%] text-center">
        {itemCost}
      </p>

      <aside className="flex item-center gap-2 w-[18%] justify-between">
        <p className="text-blue-500">
          {" "}
          <img
            src="/edit-11-32.png"
            alt="delete"
            className="w-[24px] cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onEditExpense(id, itemBought, itemCost)}
          />
        </p>
        <p>
          <img
            src="/delete-32.png"
            alt="delete"
            className="w-[24px] cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onDeleteExpense(id)}
          />
        </p>
      </aside>
    </div>
  );
}

function ResetWarning({ isResetClicked, onReset, onResetClick }) {
  return (
    <div
      className={`fixed  ${
        isResetClicked ? "w-screen px-5" : "w-0 px-0"
      } transition-all duration-300 h-screen top-0 left-0 border border-black flex justify-center items-center bg-black bg-opacity-60  overflow-hidden`}
    >
      <div className="border max-w-sm max-auto shadow-2xl text-center py-8 px-8 rounded-xl bg-gray-50">
        <p className="font-medium text-lg text-red-700 italic">
          Are you sure you want to reset? This action cannot be undone!
        </p>

        <div className="space-x-5 mt-9">
          <button
            onClick={onResetClick}
            className="bg-gradient-to-r from-blue-600 to-sky-700 hover:scale-105 transition-transform py-2.5 px-5 rounded-md font-medium text-white"
          >
            Cancel
          </button>
          <button
            onClick={onReset}
            className="bg-gradient-to-r from-red-600 to-pink-700 hover:scale-105 transition-transform py-2.5 px-5 rounded-md font-medium text-white"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

/* 

  - disable the ITEMBOUGHT AND THE ITEMCOST FORM
    until a BUDGET has been submitted form the BUDGET form
  
  - add the DELETE functionality and the EDIT functionality
  - and create a RESET BUTTON funcitonality that resets the entire app
*/
