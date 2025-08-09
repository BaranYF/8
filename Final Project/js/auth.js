// Authentication functions for login/signup (demo only)
// TODO: need to use Firebase instead of this
// TODO: add better validation

// show signup form
function showSignup() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('signup-section').classList.remove('hidden');
}

// show login form
function showLogin() {
    document.getElementById('signup-section').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
}

// open and close modal functions
function openAuthModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
}

// simple demo login function
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) { 
        alert('Please fill in both fields'); 
        return; 
    }
    
    currentUser = { email: email, name: email.split('@')[0] };
    showUserSection();
}

// simple demo signup function
function signup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    if (!name || !email || !password) { 
        alert('Please fill in all fields'); 
        return; 
    }
    
    currentUser = { email: email, name: name };
    showUserSection();
    alert('Account created successfully!');
}

// logout function
function logout() {
    currentUser = null;
    document.getElementById('user-section').classList.add('hidden');
    const compact = document.getElementById('compact-auth');
    if (compact) compact.classList.remove('hidden');
    closeAuthModal();
    
    // clear form fields
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}

// show user chip in header
function showUserSection() {
  const compact = document.getElementById('compact-auth');
  if (compact) compact.classList.add('hidden');
  document.getElementById('user-section').classList.remove('hidden');
  document.getElementById('user-name').textContent = `hey ${currentUser.name}!`;
  closeAuthModal();
}

