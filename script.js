// === DOM Elements ===
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const appSection = document.getElementById('app-section');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutBtn = document.getElementById('logout-btn');
const userName = document.getElementById('user-name');
const incomeDisplay = document.getElementById('income-amount');
const expenseDisplay = document.getElementById('expense-amount');
const balanceDisplay = document.getElementById('balance');
const transactionForm = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const addCategoryBtn = document.getElementById('add-category-btn');
const addGoalBtn = document.getElementById('add-goal-btn');
const savingsGoalsContainer = document.getElementById('savings-goals');
const categorySelect = document.getElementById('category');
const filterCategorySelect = document.getElementById('filter-category');

// === Global Variables ===
let currentUser = null;
let transactions = [];
let budgetChart = null;

// === Chart Functions ===
function initializeChart() {
    const ctx = document.getElementById('budgetChart').getContext('2d');
    budgetChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#27ae60', '#e74c3c'],
                borderColor: ['#1e8449', '#c0392b'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: 'Income vs Expenses' }
            }
        }
    });
}

function updateChart(income, expenses) {
    if (budgetChart) {
        budgetChart.data.datasets[0].data = [income, expenses];
        budgetChart.update();
    }
}

// === App Initialization ===
function initializeApp(userNameFromDB) {
    loginSection.classList.add('hidden');
    registerSection.classList.add('hidden');
    appSection.classList.remove('hidden');

    userName.textContent = userNameFromDB;
    populateCategoryDropdown();
    renderTransactionList();
    updateSummary();
    displaySavingsGoals();

    if (!budgetChart) initializeChart();
}

// === Summary Display ===
function updateSummary() {
    let income = 0;
    let expense = 0;

    for (const txn of transactions) {
        if (txn.type === 'income') income += txn.amount;
        else expense += txn.amount;
    }

    const balance = income - expense;

    incomeDisplay.textContent = `KSh${income.toFixed(2)}`;
    expenseDisplay.textContent = `KSh${expense.toFixed(2)}`;
    balanceDisplay.textContent = `KSh${balance.toFixed(2)}`;

    updateChart(income, expense);
}

// === Transaction Logic ===
function displayTransaction(transaction) {
    const li = document.createElement('li');
    li.classList.add(transaction.type);
    li.setAttribute('data-id', transaction.id);

    li.innerHTML = `
        <span>${transaction.description} (${transaction.category}) - ${transaction.date}</span>
        <span>
            KSh${transaction.amount.toFixed(2)}
            <button class="delete-btn">Delete</button>
        </span>
    `;

    li.querySelector('.delete-btn').addEventListener('click', () => deleteTransaction(transaction.id));
    transactionList.appendChild(li);
}

function deleteTransaction(id) {
    transactions = transactions.filter(txn => txn.id !== id);
    renderTransactionList();
    updateSummary();
}

function renderTransactionList() {
    transactionList.innerHTML = '';
    transactions.forEach(displayTransaction);
}

// === Category Handling ===
function populateCategoryDropdown() {
    const defaultCategories = ["Food", "Transport", "Housing", "Utilities", "Health", "Entertainment", "Savings", "Other"];

    defaultCategories.forEach(cat => {
        if (![...categorySelect.options].some(opt => opt.value.toLowerCase() === cat.toLowerCase())) {
            categorySelect.appendChild(new Option(cat, cat));
        }
        if (![...filterCategorySelect.options].some(opt => opt.value.toLowerCase() === cat.toLowerCase())) {
            filterCategorySelect.appendChild(new Option(cat, cat));
        }
    });
}

addCategoryBtn.addEventListener('click', () => {
    const newCategory = prompt("Enter a new category name:");
    if (!newCategory) return;

    const trimmed = newCategory.trim();
    if (trimmed === '') {
        alert("Category name cannot be empty.");
        return;
    }

    const exists = [...categorySelect.options].some(opt => opt.value.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
        alert(`Category "${trimmed}" already exists.`);
        return;
    }

    categorySelect.appendChild(new Option(trimmed, trimmed));
    filterCategorySelect.appendChild(new Option(trimmed, trimmed));
    categorySelect.value = trimmed;
});

// === Savings Goals ===
function displaySavingsGoals() {
    savingsGoalsContainer.innerHTML = "";
    if (!currentUser?.savingsGoals) return;

    currentUser.savingsGoals.forEach((goal, index) => {
        const div = document.createElement('div');
        div.className = 'savings-goal';
        div.innerHTML = `
            <h4>${goal.name}</h4>
            <p>Target: KSh${goal.target.toFixed(2)}</p>
            <p>Saved: KSh${goal.saved.toFixed(2)}</p>
            <button onclick="addToSavings(${index})">Add to Savings</button>
        `;
        savingsGoalsContainer.appendChild(div);
    });
}

function addToSavings(index) {
    const amount = parseFloat(prompt(`Enter amount to add to "${currentUser.savingsGoals[index].name}":`));
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid positive amount.");
        return;
    }

    currentUser.savingsGoals[index].saved += amount;

    if (currentUser.savingsGoals[index].saved >= currentUser.savingsGoals[index].target) {
        alert(`🎉 Goal "${currentUser.savingsGoals[index].name}" reached!`);
    }

    displaySavingsGoals();
}

addGoalBtn.addEventListener('click', () => {
    const goalName = prompt("Enter savings goal name:");
    const targetAmount = parseFloat(prompt("Enter target amount (Ksh):"));

    if (!goalName || isNaN(targetAmount) || targetAmount <= 0) {
        alert("Invalid input. Please enter a valid name and positive amount.");
        return;
    }

    const newGoal = { name: goalName.trim(), target: targetAmount, saved: 0 };
    if (!currentUser.savingsGoals) currentUser.savingsGoals = [];
    currentUser.savingsGoals.push(newGoal);
    displaySavingsGoals();
    alert(`Savings goal "${newGoal.name}" added successfully!`);
});

// === Auth and Navigation ===
showRegisterLink.addEventListener('click', () => {
    loginSection.classList.add('hidden');
    registerSection.classList.remove('hidden');
});

showLoginLink.addEventListener('click', () => {
    registerSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

registerForm.addEventListener('submit', function (e) {
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
        .then(res => res.text())
        .then(data => {
            if (data === 'success') {
                alert('Registration successful!');
                showLoginLink.click();
                registerForm.reset();
            } else {
                alert(data);
            }
        })
        .catch(error => {
            console.error('Registration error:', error);
            alert('An error occurred during registration.');
        });
});

loginForm.addEventListener('submit', function (e) {
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
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                currentUser = { name: data.name, email: email, savingsGoals: [] };
                initializeApp(data.name);
                loginForm.reset();
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            alert('An error occurred during login.');
        });
});

logoutBtn.addEventListener('click', () => {
    fetch('logout.php')
        .then(res => res.text())
        .then(() => {
            currentUser = null;
            transactions = [];
            transactionList.innerHTML = '';
            updateSummary();
            loginSection.classList.remove('hidden');
            appSection.classList.add('hidden');
        })
        .catch(error => {
            console.error('Logout error:', error);
            alert('Logout failed.');
        });
});

// === Transactions Submission ===
transactionForm.addEventListener('submit', e => {
    e.preventDefault();
    const transaction = {
        id: Date.now(),
        description: document.getElementById('description').value.trim(),
        category: categorySelect.value,
        amount: parseFloat(document.getElementById('amount').value),
        date: document.getElementById('date').value,
        type: document.getElementById('type').value,
        recurrence: document.getElementById('recurrence').value
    };

    transactions.push(transaction);
    displayTransaction(transaction);
    updateSummary();
    transactionForm.reset();
});

// === On Load: Check Session ===
document.addEventListener('DOMContentLoaded', () => {
    fetch('check_login.php')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                currentUser = { name: data.name, email: data.email, savingsGoals: [] };
                initializeApp(data.name);
            } else {
                loginSection.classList.remove('hidden');
                appSection.classList.add('hidden');
            }
        })
        .catch(error => {
            console.error('Login check error:', error);
            loginSection.classList.remove('hidden');
            appSection.classList.add('hidden');
        });
});
