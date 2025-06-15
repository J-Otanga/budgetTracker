
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const appSection = document.getElementById('app-section');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutBtn = document.getElementById('logout-btn');
const transactionForm = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const balanceDisplay = document.getElementById('balance');
const incomeDisplay = document.getElementById('income-amount');
const expenseDisplay = document.getElementById('expense-amount');
const userName = document.getElementById('user-name');
const categorySelect = document.getElementById('category');
const filterCategorySelect = document.getElementById('filter-category');
const addCategoryBtn = document.getElementById('add-category-btn');



let currentUser = null;
const categories = ["Food", "Transport", "Housing", "Utilities", "Health", "Entertainment", "Savings", "Other"];
// Populate the category dropdowns with default categories
function populateCategoryDropdown() {
    const defaultCategories = ["Food", "Transport", "Housing", "Utilities", "Health", "Entertainment", "Savings", "Other"];

    defaultCategories.forEach(cat => {
        // Check if already in transaction form select
        if (![...categorySelect.options].some(opt => opt.value.toLowerCase() === cat.toLowerCase())) {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        }

        // Check if already in filter select
        if (![...filterCategorySelect.options].some(opt => opt.value.toLowerCase() === cat.toLowerCase())) {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            filterCategorySelect.appendChild(option);
        }
    });
}
// Initialize an empty array to hold transactions
let transactions = [];


function showRegister() {
    loginSection.classList.add('hidden');
    registerSection.classList.remove('hidden');
}

function showLogin() {
    registerSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    
    const password = document.getElementById('login-password').value;


   
    currentUser = { name: email.split('@')[0], email };
    initializeApp();
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

 
    currentUser = { name, email };
    initializeApp();
}
function handleTransactionSubmit(e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const type = document.getElementById('type').value;
    const recurrence = document.getElementById('recurrence').value;

    const transaction = {
        id: Date.now(),
        description,
        category,
        amount,
        date,
        type,
        recurrence
    };

    transactions.push(transaction);
    displayTransaction(transaction);
    updateSummary();

    transactionForm.reset(); // clear the form
}
function displayTransaction(transaction) {
    const li = document.createElement('li');
    li.classList.add(transaction.type); // "income" or "expense"
    li.setAttribute('data-id', transaction.id);

    li.innerHTML = `
        <span>${transaction.description} (${transaction.category}) - ${transaction.date}</span>
        <span>
            KSh${transaction.amount.toFixed(2)}
            <button class="delete-btn">Delete</button>
        </span>
    `;

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => deleteTransaction(transaction.id));

    transactionList.appendChild(li);
}
function deleteTransaction(id) {
    transactions = transactions.filter(txn => txn.id !== id);

    renderTransactionList();  // Rebuild the entire list
    updateSummary();         // Recalculate totals
}
function renderTransactionList() {
    transactionList.innerHTML = '';
    transactions.forEach(displayTransaction);
}
// Function to update the summary display
function updateSummary() {
    let income = 0;
    let expense = 0;

    for (const txn of transactions) {
        if (txn.type === 'income') {
            income += txn.amount;
        } else {
            expense += txn.amount;
        }
    }

    const balance = income - expense;

    incomeDisplay.textContent = `KSh${income.toFixed(2)}`;
    expenseDisplay.textContent = `KSh${expense.toFixed(2)}`;
    balanceDisplay.textContent = `KSh${balance.toFixed(2)}`;
}
transactionForm.addEventListener('submit', handleTransactionSubmit);
addCategoryBtn.addEventListener('click', () => {
    const newCategory = prompt("Enter a new category name:");

    if (!newCategory) return;

    const trimmed = newCategory.trim();

    if (trimmed === '') {
        alert("Category name cannot be empty.");
        return;
    }

    // Check both selects for duplicates
    const exists = [...categorySelect.options].some(
        opt => opt.value.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) {
        alert("This category already exists.");
        return;
    }

    // Add to transaction form dropdown
    const option1 = document.createElement('option');
    option1.value = trimmed;
    option1.textContent = trimmed;
    categorySelect.appendChild(option1);

    // Add to filter dropdown
    const option2 = document.createElement('option');
    option2.value = trimmed;
    option2.textContent = trimmed;
    filterCategorySelect.appendChild(option2);

    // Auto-select the new category
    categorySelect.value = trimmed;
});




function handleLogout() {
    currentUser = null;
    appSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
}


function initializeApp() {
    loginSection.classList.add('hidden');
    registerSection.classList.add('hidden');
    appSection.classList.remove('hidden');

    userName.textContent = currentUser.name;
    populateCategoryDropdown();
    renderTransactionList();
    updateSummary();
    transactionForm.reset(); // Clear the form for new entries
    transactionList.innerHTML = ''; // Clear the list for fresh start

}


showRegisterLink.addEventListener('click', showRegister);
showLoginLink.addEventListener('click', showLogin);
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
logoutBtn.addEventListener('click', handleLogout);

