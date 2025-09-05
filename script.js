const form = document.getElementById('transaction-form');
const descInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const list = document.getElementById('transaction-list');

const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expenses');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Update totals
function updateTotals() {
  const amounts = transactions.map(t => t.amount);
  const income = amounts.filter(a => a > 0).reduce((acc, val) => acc + val, 0);
  const expense = amounts.filter(a => a < 0).reduce((acc, val) => acc + val, 0);
  const balance = income + expense;

  balanceEl.textContent = `$${balance.toFixed(2)}`;
  incomeEl.textContent = `+ $${income.toFixed(2)}`;
  expenseEl.textContent = `- $${Math.abs(expense).toFixed(2)}`;
}

// Add transaction to DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount > 0 ? '+' : '-';
  const type = transaction.amount > 0 ? 'income' : 'expense';

  const item = document.createElement('li');
  item.classList.add(type);
  item.innerHTML = `
    ${transaction.description}
    <span>${sign} $${Math.abs(transaction.amount).toFixed(2)}</span>
    <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">❌</button>
  `;

  list.appendChild(item);
}

// Delete a transaction by ID
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  init();
}

// Re-initialize UI
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateTotals();
}

// Add new transaction
function addTransaction(e) {
  e.preventDefault();

  const desc = descInput.value.trim();
  const amount = +amountInput.value.trim();

  if (!desc || isNaN(amount)) {
    alert('Please enter valid description and amount.');
    return;
  }

  const newTransaction = {
    id: Date.now(),
    description: desc,
    amount: amount,
  };

  transactions.push(newTransaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  init();

  form.reset();
}

form.addEventListener('submit', addTransaction);
init();
