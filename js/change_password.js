// Change Password JavaScript for INWI Automated Testing Platform

document.addEventListener('DOMContentLoaded', function() {
    // Initialize password change page
    initPasswordChangePage();
    
    // Initialize password strength meter
    initPasswordStrengthMeter();
    
    // Initialize password match indicator
    initPasswordMatchIndicator();
});

/**
 * Initialize password change page functionality
 */
function initPasswordChangePage() {
    // Check if user is required to change password
    const passwordChangeRequired = localStorage.getItem('password_change_required');
    
    if (!passwordChangeRequired) {
        // If not required, redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
    // Display custom message if provided
    const passwordChangeMessage = localStorage.getItem('password_change_message');
    if (passwordChangeMessage) {
        const messageElement = document.getElementById('password-change-message');
        if (messageElement) {
            messageElement.textContent = passwordChangeMessage;
        }
    }
    
    const passwordChangeForm = document.getElementById('password-change-form');
    const passwordChangeError = document.getElementById('password-change-error');
    
    if (passwordChangeForm) {
        passwordChangeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const currentPassword = document.getElementById('current-password').value.trim();
            const newPassword = document.getElementById('new-password').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();
            
            // Validate form
            if (!validatePasswordChangeForm(currentPassword, newPassword, confirmPassword)) {
                return false;
            }
            
            // Attempt to change password
            attemptPasswordChange(passwordChangeRequired, currentPassword, newPassword);
        });
    }
}

/**
 * Initialize password strength meter
 */
function initPasswordStrengthMeter() {
    const newPasswordInput = document.getElementById('new-password');
    const strengthBar = document.getElementById('password-strength-bar');
    
    if (newPasswordInput && strengthBar) {
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            // Update strength bar
            strengthBar.style.width = strength + '%';
            
            // Update color based on strength
            if (strength < 30) {
                strengthBar.style.backgroundColor = '#F44336'; // Red
            } else if (strength < 60) {
                strengthBar.style.backgroundColor = '#FFC107'; // Yellow
            } else {
                strengthBar.style.backgroundColor = '#4CAF50'; // Green
            }
        });
    }
}

/**
 * Initialize password match indicator
 */
function initPasswordMatchIndicator() {
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const matchIndicator = document.getElementById('password-match-indicator');
    
    if (newPasswordInput && confirmPasswordInput && matchIndicator) {
        // Function to check if passwords match
        const checkPasswordMatch = function() {
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            if (confirmPassword.length === 0) {
                matchIndicator.textContent = '';
                matchIndicator.className = '';
            } else if (newPassword === confirmPassword) {
                matchIndicator.textContent = 'Passwords match';
                matchIndicator.className = 'match';
            } else {
                matchIndicator.textContent = 'Passwords do not match';
                matchIndicator.className = 'no-match';
            }
        };
        
        // Add event listeners
        newPasswordInput.addEventListener('input', checkPasswordMatch);
        confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    }
}

/**
 * Calculate password strength percentage
 * @param {string} password - Password to evaluate
 * @returns {number} - Strength percentage (0-100)
 */
function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Length contribution (up to 40%)
    strength += Math.min(password.length * 5, 40);
    
    // Complexity contribution (up to 60%)
    if (/[A-Z]/.test(password)) strength += 15; // Uppercase
    if (/[a-z]/.test(password)) strength += 15; // Lowercase
    if (/[0-9]/.test(password)) strength += 15; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 15; // Special characters
    
    return Math.min(strength, 100);
}

/**
 * Validate password change form
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @param {string} confirmPassword - Confirm new password
 * @returns {boolean} - Validation result
 */
function validatePasswordChangeForm(currentPassword, newPassword, confirmPassword) {
    let isValid = true;
    const currentPasswordError = document.getElementById('current-password-error');
    const newPasswordError = document.getElementById('new-password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    
    // Reset error messages
    currentPasswordError.style.display = 'none';
    newPasswordError.style.display = 'none';
    confirmPasswordError.style.display = 'none';
    
    // Validate current password
    if (!currentPassword) {
        currentPasswordError.textContent = 'Current password is required';
        currentPasswordError.style.display = 'block';
        isValid = false;
    }
    
    // Validate new password
    if (!newPassword) {
        newPasswordError.textContent = 'New password is required';
        newPasswordError.style.display = 'block';
        isValid = false;
    } else if (newPassword.length < 8) {
        newPasswordError.textContent = 'Password must be at least 8 characters';
        newPasswordError.style.display = 'block';
        isValid = false;
    } else if (!/[A-Z]/.test(newPassword)) {
        newPasswordError.textContent = 'Password must contain at least one uppercase letter';
        newPasswordError.style.display = 'block';
        isValid = false;
    } else if (!/[a-z]/.test(newPassword)) {
        newPasswordError.textContent = 'Password must contain at least one lowercase letter';
        newPasswordError.style.display = 'block';
        isValid = false;
    } else if (!/[0-9]/.test(newPassword)) {
        newPasswordError.textContent = 'Password must contain at least one number';
        newPasswordError.style.display = 'block';
        isValid = false;
    }
    
    // Validate confirm password
    if (!confirmPassword) {
        confirmPasswordError.textContent = 'Please confirm your new password';
        confirmPasswordError.style.display = 'block';
        isValid = false;
    } else if (newPassword !== confirmPassword) {
        confirmPasswordError.textContent = 'Passwords do not match';
        confirmPasswordError.style.display = 'block';
        isValid = false;
    }
    
    // Validate that new password is different from current password
    if (currentPassword === newPassword) {
        newPasswordError.textContent = 'New password must be different from current password';
        newPasswordError.style.display = 'block';
        isValid = false;
    }
    
    return isValid;
}

/**
 * Attempt to change user password
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 */
function attemptPasswordChange(userId, currentPassword, newPassword) {
    const passwordChangeError = document.getElementById('password-change-error');
    
    // Check for default users first (admin and user)
    if (userId === 'admin' || userId === 'user') {
        // For demo purposes, we'll handle default users differently
        // In a real application, this would be an API call to update the user in the database
        
        // Verify current password for default users
        const defaultPassword = userId === 'admin' ? 'admin123' : 'user123';
        
        if (currentPassword !== defaultPassword) {
            passwordChangeError.textContent = 'Current password is incorrect';
            passwordChangeError.style.display = 'block';
            return;
        }
        
        // For demo purposes, we'll create a new user in localStorage with the same ID
        // but with the new password, effectively overriding the default user
        const newUser = {
            id: userId,
            name: userId === 'admin' ? 'Admin User' : 'Regular User',
            email: userId === 'admin' ? 'admin@inwi.com' : 'user@inwi.com',
            password: newPassword,
            role: userId === 'admin' ? 'admin' : 'user',
            first_login: false,
            lastLogin: new Date().toISOString().split('T')[0]
        };
        
        // Get existing users or initialize empty array
        let users = [];
        const storedUsers = localStorage.getItem('app_users');
        if (storedUsers) {
            users = JSON.parse(storedUsers);
            // Remove any existing override for this default user
            users = users.filter(u => u.id !== userId);
        }
        
        // Add the new user override
        users.push(newUser);
        
        // Save updated users array
        localStorage.setItem('app_users', JSON.stringify(users));
    } else {
        // Handle regular users stored in localStorage
        let users = [];
        const storedUsers = localStorage.getItem('app_users');
        if (storedUsers) {
            users = JSON.parse(storedUsers);
        }
        
        // Find user by ID
        const userIndex = users.findIndex(u => u.id === userId);
        
        // Check if user exists and current password is correct
        if (userIndex === -1 || users[userIndex].password !== currentPassword) {
            passwordChangeError.textContent = 'Current password is incorrect';
            passwordChangeError.style.display = 'block';
            return;
        }
        
        // Update user password and remove first_login flag
        users[userIndex].password = newPassword;
        users[userIndex].first_login = false;
        
        // Save updated users array
        localStorage.setItem('app_users', JSON.stringify(users));
    }
    
    // Remove password change required flag
    localStorage.removeItem('password_change_required');
    
    // Show success message and redirect to dashboard
    showSuccessMessage();
}

/**
 * Show success message and redirect to dashboard
 */
function showSuccessMessage() {
    const passwordChangeForm = document.getElementById('password-change-form');
    const passwordChangeMessage = document.getElementById('password-change-message');
    
    // Hide form
    passwordChangeForm.style.display = 'none';
    
    // Show success message
    passwordChangeMessage.textContent = 'Password changed successfully! Redirecting to dashboard...';
    passwordChangeMessage.className = 'success-message';
    
    // Clean up localStorage items related to password change
    localStorage.removeItem('password_change_message');
    
    // Redirect to dashboard after delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}