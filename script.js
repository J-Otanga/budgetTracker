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

let currentUser = null; // Will store user data if logged in
let transactions = []; // Initialize an empty array to hold transactions

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
    renderTransactionList(); // Rebuild the entire list
    updateSummary();      // Recalculate totals
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

// --- Main Application Flow Functions ---

function initializeApp(userNameFromDB) {
    loginSection.classList.add('hidden');
    registerSection.classList.add('hidden');
    appSection.classList.remove('hidden');

    userName.textContent = userNameFromDB; // Use the name passed from PHP
    populateCategoryDropdown();
    renderTransactionList();
    updateSummary();
    transactionForm.reset(); // Clear the form for new entries
    transactionList.innerHTML = ''; // Clear the list for fresh start (assuming transactions will be loaded from DB later)
    // Here you would typically fetch user-specific transactions and budget data from the backend
    // fetchTransactions();
    // fetchBudget();
    // fetchSavingsGoals();
}

function handleLogout() {
    fetch('logout.php')
        .then(res => res.text()) // Use .text() because logout.php just echoes "Logged out"
        .then(() => {
            currentUser = null;
            appSection.classList.add('hidden');
            loginSection.classList.remove('hidden');
            // Optionally clear all app-specific data when logging out
            transactions = [];
            updateSummary();
            transactionList.innerHTML = '';
        })
        .catch(error => {
            console.error('Error during logout:', error);
            alert('An error occurred during logout.');
        });
}


// --- Event Listeners ---

// Navigation links
showRegisterLink.addEventListener('click', () => {
    loginSection.classList.add('hidden');
    registerSection.classList.remove('hidden');
});

showLoginLink.addEventListener('click', () => {
    registerSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

// Register Form Submission
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);

    fetch('register.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.text()) // register.php returns plain text "success" or an error string
    .then(data => {
        if (data === 'success') {
            alert('Registration successful!');
            showLoginLink.click(); // Programmatically click the login link to show login form
            registerForm.reset(); // Clear register form
        } else {
            alert(data); // Display the error message from PHP
        }
    })
    .catch(error => {
        console.error('Error during registration:', error);
        alert('An error occurred during registration. Please try again.');
    });
});

// Login Form Submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    fetch('login.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json()) // login.php returns JSON
    .then(data => {
        if (data.status === 'success') {
            currentUser = { name: data.name, email: email }; // Store user info
            initializeApp(data.name); // Initialize app with the name from the server
            loginForm.reset(); // Clear login form
        } else {
            alert(data.message); // Display the error message from PHP (e.g., "Wrong password", "No user found")
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again.');
    });
});

// Transaction Form Submission (kept your original logic here)
transactionForm.addEventListener('submit', e => {
    e.preventDefault();
    const transaction = {
        id: Date.now(),
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        amount: parseFloat(document.getElementById('amount').value),
        date: document.getElementById('date').value,
        type: document.getElementById('type').value,
        recurrence: document.getElementById('recurrence').value
    };
    transactions.push(transaction); // This is currently client-side only
    displayTransaction(transaction);
    updateSummary();
    transactionForm.reset();
});

// Add Category Button
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

// Logout Button
logoutBtn.addEventListener('click', handleLogout);


// --- Initial check for logged-in user when page loads ---
document.addEventListener('DOMContentLoaded', () => {
    fetch('check_login.php')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                currentUser = { name: data.name, email: data.email };
                initializeApp(data.name);
            } else {
                // If not logged in, ensure login section is visible and app section is hidden
                loginSection.classList.remove('hidden');
                registerSection.classList.add('hidden');
                appSection.classList.add('hidden');
            }
        })
        .catch(error => {
            console.error('Error checking login status:', error);
            // Fallback to showing login section if check fails
            loginSection.classList.remove('hidden');
            registerSection.classList.add('hidden');
            appSection.classList.add('hidden');
        });
});