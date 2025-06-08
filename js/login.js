// Login JavaScript for INWI Automated Testing Platform

document.addEventListener('DOMContentLoaded', function() {
    // Initialize login page
    initLoginPage();
    
    // Initialize password reset modal
    initPasswordResetModal();
    
    // Form validation
    initFormValidation();
});

/**
 * Initialize login page functionality
 */
function initLoginPage() {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    
    // Check if user is already logged in
    checkLoggedInStatus();
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const userId = document.getElementById('user_id').value.trim();
            const password = document.getElementById('password').value.trim();
            const rememberMe = document.getElementById('remember').checked;
            
            // Validate form
            if (!validateLoginForm(userId, password)) {
                return false;
            }
            
            // Attempt login
            attemptLogin(userId, password, rememberMe);
        });
    }
}

/**
 * Check if user is already logged in
 */
function checkLoggedInStatus() {
    const userSession = localStorage.getItem('user_session');
    
    if (userSession) {
        try {
            const sessionData = JSON.parse(userSession);
            // Check if session is still valid (not expired)
            if (sessionData && sessionData.expiry > Date.now()) {
                // Redirect to dashboard
                redirectToDashboard(sessionData.role);
            } else {
                // Clear expired session
                localStorage.removeItem('user_session');
            }
        } catch (e) {
            // Invalid session data
            localStorage.removeItem('user_session');
        }
    }
}

/**
 * Validate login form
 * @param {string} userId - User ID
 * @param {string} password - User password
 * @returns {boolean} - Validation result
 */
function validateLoginForm(userId, password) {
    let isValid = true;
    const userIdError = document.getElementById('user_id-error');
    const passwordError = document.getElementById('password-error');
    
    // Reset error messages
    userIdError.style.display = 'none';
    passwordError.style.display = 'none';
    
    // Validate user ID
    if (!userId) {
        userIdError.textContent = 'User ID is required';
        userIdError.style.display = 'block';
        isValid = false;
    } else if (userId.length < 3) {
        userIdError.textContent = 'User ID must be at least 3 characters';
        userIdError.style.display = 'block';
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        passwordError.textContent = 'Password is required';
        passwordError.style.display = 'block';
        isValid = false;
    } else if (password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters';
        passwordError.style.display = 'block';
        isValid = false;
    }
    
    return isValid;
}

/**
 * Check if email is valid
 * @param {string} email - Email to validate
 * @returns {boolean} - Validation result
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Attempt to login user
 * @param {string} userId - User ID
 * @param {string} password - User password
 * @param {boolean} rememberMe - Remember me option
 */
function attemptLogin(userId, password, rememberMe) {
    const loginError = document.getElementById('login-error');
    
    // For demo purposes, we'll use hardcoded credentials
    // In a real application, this would be an API call to a backend service
    const users = [
        { id: 'admin', email: 'admin@inwi.com', password: 'admin123', role: 'admin',first_login: false },
        { id: 'user', email: 'user@inwi.com', password: 'user123', role: 'user',first_login: false }
    ];
    
    // Get users from localStorage
    const storedUsers = localStorage.getItem('app_users');
    if (storedUsers) {
        // Parse stored users and add them to the users array
        const parsedUsers = JSON.parse(storedUsers);
        users.push(...parsedUsers);
    }
    
    // Find user
    const user = users.find(u => u.id === userId && u.password === password);
    
    if (user) {
        // Create session
        createUserSession(user, rememberMe);
        
        // Redirect to dashboard
        redirectToDashboard(user.role);
    } else {
        // Show error message
        loginError.textContent = 'Invalid user ID or password';
        loginError.style.display = 'block';
        
        // Simulate login attempt count for rate limiting
        incrementLoginAttempt(userId);
    }
}

/**
 * Create user session
 * @param {object} user - User object
 * @param {boolean} rememberMe - Remember me option
 */
function createUserSession(user, rememberMe) {
    // Create session object
    const session = {
        id: user.id,
        email: user.email,
        role: user.role,
        first_login: user.first_login || false, // Include first_login flag in session
        expiry: rememberMe ? Date.now() + (7 * 24 * 60 * 60 * 1000) : Date.now() + (24 * 60 * 60 * 1000) // 7 days or 1 day
    };
    
    // Store session in localStorage
    localStorage.setItem('user_session', JSON.stringify(session));
    
    // Store CSRF token for security
    localStorage.setItem('csrf_token', generateCSRFToken());
}

/**
 * Generate CSRF token
 * @returns {string} - CSRF token
 */
function generateCSRFToken() {
    // In a real application, this would be generated by the server
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Redirect to dashboard based on user role
 * @param {string} role - User role
 */
function redirectToDashboard(role) {
    // Check if user needs to change password on first login
    const userSession = localStorage.getItem('user_session');
    if (userSession) {
        try {
            const sessionData = JSON.parse(userSession);
            const userId = sessionData.id;
            
            // Check if this is a first login for the user
            const storedUsers = localStorage.getItem('app_users');
            if (storedUsers) {
                const users = JSON.parse(storedUsers);
                const currentUser = users.find(u => u.id === userId);
                
                if (currentUser && currentUser.first_login === true) {
                    // Set password change required flag
                    localStorage.setItem('password_change_required', userId);
                    localStorage.setItem('password_change_message', 'You must change your password on first login.');
                    
                    // Redirect to password change page
                    window.location.href = 'change_password.html';
                    return;
                }
            }
        } catch (e) {
            console.error('Error checking first login status:', e);
        }
    }
    
    // Redirect to dashboard if no password change required
    window.location.href = 'index.html';
}

/**
 * Increment login attempt count for rate limiting
 * @param {string} email - User email
 */
function incrementLoginAttempt(email) {
    // Get current attempts
    let attempts = JSON.parse(sessionStorage.getItem('login_attempts') || '{}');
    
    // Increment attempts for this email
    attempts[email] = (attempts[email] || 0) + 1;
    
    // Store updated attempts
    sessionStorage.setItem('login_attempts', JSON.stringify(attempts));
    
    // Check if rate limit exceeded
    if (attempts[email] >= 5) {
        // Lock account for 15 minutes
        const loginForm = document.getElementById('login-form');
        const loginError = document.getElementById('login-error');
        
        loginForm.querySelectorAll('input, button').forEach(el => el.disabled = true);
        loginError.textContent = 'Too many failed attempts. Please try again later.';
        loginError.style.display = 'block';
        
        // Set a timeout to unlock after 15 minutes
        setTimeout(() => {
            loginForm.querySelectorAll('input, button').forEach(el => el.disabled = false);
            loginError.style.display = 'none';
            
            // Reset attempts
            attempts[email] = 0;
            sessionStorage.setItem('login_attempts', JSON.stringify(attempts));
        }, 15 * 60 * 1000); // 15 minutes
    }
}

/**
 * Initialize password reset modal
 */
function initPasswordResetModal() {
    const forgotPasswordLink = document.getElementById('forgot-password');
    const resetModal = document.getElementById('reset-modal');
    const closeModal = document.querySelector('.close-modal');
    const resetForm = document.getElementById('reset-form');
    
    if (forgotPasswordLink && resetModal) {
        // Open modal
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            resetModal.style.display = 'flex';
        });
        
        // Close modal
        closeModal.addEventListener('click', function() {
            resetModal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === resetModal) {
                resetModal.style.display = 'none';
            }
        });
        
        // Handle reset form submission
        resetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('reset-email').value.trim();
            
            if (isValidEmail(email)) {
                // In a real application, this would send a reset link to the user's email
                alert(`Password reset link sent to ${email}`);
                resetModal.style.display = 'none';
                resetForm.reset();
            } else {
                alert('Please enter a valid email address');
            }
        });
    }
}

/**
 * Initialize form validation
 */
function initFormValidation() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            const emailError = document.getElementById('email-error');
            
            if (email && !isValidEmail(email)) {
                emailError.textContent = 'Please enter a valid email address';
                emailError.style.display = 'block';
            } else {
                emailError.style.display = 'none';
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            const password = this.value.trim();
            const passwordError = document.getElementById('password-error');
            
            if (password && password.length < 6) {
                passwordError.textContent = 'Password must be at least 6 characters';
                passwordError.style.display = 'block';
            } else {
                passwordError.style.display = 'none';
            }
        });
    }
}