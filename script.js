// Select DOM elements
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('money-plus');
const expenseEl = document.getElementById('money-minus');
const listEl = document.getElementById('list');
const formEl = document.getElementById('form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');

// Get saved transactions from localStorage
const storedTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = storedTransactions !== null ? storedTransactions : [];

// Utility: Format number as INR (₹1,23,456.00)
function formatINR(num) {
  return num.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR'
  });
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (textInput.value.trim() === '' || amountInput.value.trim() === '') {
    alert('⚠️ Please add a description and amount');
    return;
  }

  const transaction = {
    id: generateID(),
    text: textInput.value,
    amount: +amountInput.value
  };

  transactions.push(transaction);

  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();

  textInput.value = '';
  amountInput.value = '';
}

// Add transaction to DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  // Add class based on type
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} 
    <span>${sign}${formatINR(Math.abs(transaction.amount))}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  listEl.appendChild(item);
}

// Update balance, income, expense
function updateValues() {
  const amounts = transactions.map(t => t.amount);

  const total = amounts.reduce((acc, val) => acc + val, 0);
  const income = amounts.filter(val => val > 0).reduce((acc, val) => acc + val, 0);
  const expense = amounts.filter(val => val < 0).reduce((acc, val) => acc + val, 0) * -1;

  balanceEl.innerText = formatINR(total);
  incomeEl.innerText = `+${formatINR(income)}`;
  expenseEl.innerText = `-${formatINR(expense)}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);

  updateLocalStorage();
  init();
}

// Save transactions to localStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize app
function init() {
  listEl.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();
formEl.addEventListener('submit', addTransaction);
