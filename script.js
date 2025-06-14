const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const appSection = document.getElementById('app-section');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutBtn = document.getElementById('logout-btn');
const userName = document.getElementById('user-name');


let currentUser = null;

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
}


showRegisterLink.addEventListener('click', showRegister);
showLoginLink.addEventListener('click', showLogin);
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);
logoutBtn.addEventListener('click', handleLogout);
