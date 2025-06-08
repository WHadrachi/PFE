// Main JavaScript for INWI Automated Testing Platform

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuthentication();
    
    // Add loading animation
    showPageLoadAnimation();
    
    // Navigation functionality
    initNavigation();
    
    // Test type dropdown functionality
    initTestTypeDropdown();
    
    // Button click handlers
    initButtonHandlers();
    
    // Initialize animations
    initAnimations();
    
    // Initialize role-based UI
    initRoleBasedUI();
    
    // Initialize Web Services page functionality
    initWebServicesPage();
    
    // Initialize Profile page functionality
    initProfilePage();
});

/**
 * Check if user is authenticated
 */
function checkAuthentication() {
    const userSession = localStorage.getItem('user_session');
    
    if (!userSession) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const sessionData = JSON.parse(userSession);
        // Check if session is still valid (not expired)
        if (!sessionData || sessionData.expiry < Date.now()) {
            // Clear expired session
            localStorage.removeItem('user_session');
            window.location.href = 'login.html';
            return;
        }
    } catch (e) {
        // Invalid session data
        localStorage.removeItem('user_session');
        window.location.href = 'login.html';
        return;
    }
}

/**
 * Initialize role-based UI elements
 */
function initRoleBasedUI() {
    const userSession = localStorage.getItem('user_session');
    
    if (userSession) {
        try {
            const sessionData = JSON.parse(userSession);
            const userRole = sessionData.role;
            
            // Add user info to header
            addUserInfoToHeader(sessionData.email, userRole);
            
            // Show/hide elements based on role
            if (userRole === 'admin') {
                // Show admin-specific elements
                showAdminElements();
            } else {
                // Hide admin-specific elements
                hideAdminElements();
            }
        } catch (e) {
            console.error('Error parsing user session:', e);
        }
    }
}

/**
 * Add user info to header
 * @param {string} email - User email
 * @param {string} role - User role
 */
function addUserInfoToHeader(email, role) {
    const header = document.querySelector('header');

    if (header) {
        // Create user info container
        const userInfoContainer = document.createElement('div');
        userInfoContainer.className = 'user-info';
        
        // Create user info content
        userInfoContainer.innerHTML = `
            <span class="user-email">${email}</span>
            <span class="user-role ${role}">${role}</span>
            <button id="logout-btn" class="logout-btn">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        `;
        
        // Insert before run test button
        const runTestBtn = header.querySelector('.run-test-btn');
        header.insertBefore(userInfoContainer, runTestBtn);
        
        // Add logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                logout();
            });
        }
    }
}

/**
 * Show admin-specific elements
 */
function showAdminElements() {
    // Add User Management nav item if it doesn't exist
    const sidebarNav = document.querySelector('.sidebar nav ul');
    
    if (sidebarNav && !document.querySelector('[data-page="user-management"]')) {
        // Create user management page first
        let userManagementPage = document.getElementById('user-management');
        if (!userManagementPage) {
            userManagementPage = createUserManagementPage();
            userManagementPage.style.display = 'none';
        }
        
        // Then add the nav item
        const userManagementItem = document.createElement('li');
        userManagementItem.className = 'nav-item';
        userManagementItem.setAttribute('data-page', 'user-management');
        userManagementItem.innerHTML = `
            <i class="fas fa-users-cog"></i>
            <span>Manage Users</span>
        `;
        
        sidebarNav.appendChild(userManagementItem);
        
        // Re-initialize navigation to include the new nav item
        initNavigation();
    }
}

/**
 * Create user management page
 * @returns {HTMLElement} - The created page element
 */
function createUserManagementPage() {
    const pageContent = document.querySelector('.page-content');
    
    // Create user management page
    const userManagementPage = document.createElement('div');
    userManagementPage.className = 'page';
    userManagementPage.id = 'user-management';
    
    // Add content to the page
    userManagementPage.innerHTML = `
        <h2>User Management</h2>
        
        <!-- User List Section -->
        <section class="user-list-section">
            <h3>User List</h3>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>A001</td>
                            <td>Admin User</td>
                            <td>admin@inwi.com</td>
                            <td><span class="role admin">Admin</span></td>
                            <td>2023-10-01</td>
                            <td>
                                <button class="view-btn" title="View Details"><i class="fas fa-eye"></i></button>
                                <button class="edit-btn" title="Edit User"><i class="fas fa-edit"></i></button>
                                <button class="delete-btn" title="Delete User"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr>
                            <td>U001</td>
                            <td>Regular User</td>
                            <td>user@inwi.com</td>
                            <td><span class="role user">User</span></td>
                            <td>2023-09-30</td>
                            <td>
                                <button class="view-btn" title="View Details"><i class="fas fa-eye"></i></button>
                                <button class="edit-btn" title="Edit User"><i class="fas fa-edit"></i></button>
                                <button class="delete-btn" title="Delete User"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
        
        <!-- User Modal for Edit and View -->
        <div class="modal" id="user-modal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div id="modal-content-container"></div>
            </div>
        </div>
        
        <!-- Add User Section -->
        <section class="add-user-section">
            <h3>Add New User</h3>
            <form id="add-user-form" class="user-form">
                <div class="form-group">
                    <label for="new-id">ID</label>
                    <input type="text" id="new-id" name="new-id" placeholder="Auto-generated" disabled>
                </div>
                <div class="form-group">
                    <label for="new-name">Name</label>
                    <input type="text" id="new-name" name="new-name" required>
                </div>
                <div class="form-group">
                    <label for="new-email">Email</label>
                    <input type="email" id="new-email" name="new-email" required>
                </div>
                <div class="form-group">
                    <label for="new-password">Password</label>
                    <input type="password" id="new-password" name="new-password" required>
                </div>
                <div class="form-group">
                    <label for="new-role">Role</label>
                    <select id="new-role" name="new-role" required>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" class="action-btn">Add User</button>
            </form>
        </section>
    `;
    
    // Add the page to the page content
    pageContent.appendChild(userManagementPage);
    
    // Add event listeners for the user management page
    initUserManagementEvents(userManagementPage);

    // Load existing users from localStorage
    refreshUserTable(userManagementPage);
    
    return userManagementPage;
}

/**
 * Initialize user management events
 * @param {HTMLElement} page - The user management page element
 */
function initUserManagementEvents(page) {
    // Add user form submission
    const addUserForm = page.querySelector('#add-user-form');
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values directly from the form to avoid ID conflicts
            const email = document.getElementById('new-email').value.trim();
            const password = addUserForm.querySelector('#new-password').value.trim();
            const role = document.getElementById('new-role').value;
            const name = document.getElementById('new-name').value.trim();
                        
            // ID will be auto-generated in saveNewUser function
            const id = null; // Let the saveNewUser function handle ID generation
            
            // Save the new user to localStorage and get the generated ID
            const generatedId = saveNewUser(id, name, email, password, role);
            
            if (generatedId) {
                // Show success message with the generated ID
                showAlert(`User ${name} (${email}) added successfully with ID: ${generatedId} and role: ${role}`);
                
                // Display the generated ID in the form
                document.getElementById('new-id').value = generatedId;
                
                // Reset only the other form fields
                document.getElementById('new-name').value = '';
                document.getElementById('new-email').value = '';
                document.getElementById('new-password').value = '';
                document.getElementById('new-role').value = 'user';
                
                // Refresh the user table
                refreshUserTable(page);
            } else {
                showAlert(`User with email ${email} already exists!`, 'error');
            }
        });
    }
    
    // Use event delegation for the table buttons
    const tableBody = page.querySelector('.data-table tbody');
    if (tableBody) {
        tableBody.addEventListener('click', function(e) {
            // Find the closest button to the click event
            const button = e.target.closest('button');
            if (!button) return; // Not a button click
            
            const row = button.closest('tr');
            if (!row) return; // Button not in a row
            
            const id = row.querySelector('td:first-child').textContent;
            const email = row.querySelector('td:nth-child(3)').textContent;
            
            // Handle view button
            if (button.classList.contains('view-btn')) {
                // Try to get user by ID first, then by email as fallback
                let userData = getUserById(id);
                if (!userData) {
                    userData = getUserByEmail(email);
                }
                
                if (userData) {
                    openViewUserModal(userData);
                } else {
                    showAlert(`User data not found for ID: ${id} or Email: ${email}`, 'error');
                }
            }
            
            // Handle edit button
            else if (button.classList.contains('edit-btn')) {
                // Try to get user by ID first, then by email as fallback
                let userData = getUserById(id);
                if (!userData) {
                    userData = getUserByEmail(email);
                }
                
                if (userData) {
                    openEditUserModal(userData);
                } else {
                    showAlert(`User data not found for ID: ${id} or Email: ${email}`, 'error');
                }
            }
            
            // Handle delete button
            else if (button.classList.contains('delete-btn')) {
                // Prevent deletion of default users
                if (email === 'admin@inwi.com' || email === 'user@inwi.com' || id === 'A001' || id === 'U001') {
                    showAlert(`Cannot delete default user: ${email}`, 'error');
                    return;
                }
                
                if (confirm(`Are you sure you want to delete user: ${email}?`)) {
                    // Remove from localStorage
                    removeUserFromStorage(email);
                    // Remove row from table
                    row.remove();
                    showAlert(`User ${email} deleted successfully`);
                }
            }
        });
    }
    
    // Modal close button
    const closeModalBtns = page.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    const modals = page.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
}

/**
 * Hide admin-specific elements
 */
function hideAdminElements() {
    // No admin-specific elements to hide in the initial state
    // This function would be used when new admin elements are added
}

/**
 * Logout user
 */
function logout() {
    // Clear user session
    localStorage.removeItem('user_session');
    localStorage.removeItem('csrf_token');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

/**
 * Show page load animation
 */
function showPageLoadAnimation() {
    const container = document.querySelector('.container');
    container.style.opacity = '0';
    
    setTimeout(() => {
        container.style.transition = 'opacity 0.8s ease-in-out';
        container.style.opacity = '1';
    }, 200);
}

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked nav item
            this.classList.add('active');
            
            // Hide all pages
            pages.forEach(page => page.style.display = 'none');
            
            // Show the selected page
            const pageId = this.getAttribute('data-page');
            document.getElementById(pageId).style.display = 'block';
            
            // Store the active page ID in localStorage
            localStorage.setItem('active_page', pageId);
        });
    });
    
    // Check if there's a stored active page
    const storedActivePage = localStorage.getItem('active_page');
    
    if (storedActivePage && document.getElementById(storedActivePage)) {
        // Show the stored active page
        pages.forEach(page => page.style.display = 'none');
        document.getElementById(storedActivePage).style.display = 'block';
        
        // Update the active nav item
        navItems.forEach(nav => nav.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[data-page="${storedActivePage}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }
    } else {
        // Set dashboard as default active page if no stored page
        const dashboardNav = document.querySelector('.nav-item[data-page="dashboard"]');
        if (dashboardNav) {
            dashboardNav.classList.add('active');
            document.getElementById('dashboard').style.display = 'block';
        }
    }
}

/**
 * Initialize test type dropdown functionality
 */
function initTestTypeDropdown() {
    const testTypeDropdown = document.getElementById('test-type');
    const dynamicFormsContainer = document.querySelector('.dynamic-forms-container');
    
    if (testTypeDropdown) {
        testTypeDropdown.addEventListener('change', function() {
            const selectedTestType = this.value;
            
            // Clear previous forms
            dynamicFormsContainer.innerHTML = '';
            
            // Create and display the appropriate form based on selection
            if (selectedTestType) {
                const form = createTestForm(selectedTestType);
                dynamicFormsContainer.appendChild(form);
            }
        });
    }
}

/**
 * Create a test form based on the selected test type
 * @param {string} testType - The selected test type
 * @returns {HTMLElement} - The created form element
 */
function createTestForm(testType) {
    const form = document.createElement('form');
    form.className = 'test-form active';
    form.id = `${testType.toLowerCase()}-form`;
    
    // Common form title
    const formTitle = document.createElement('h3');
    formTitle.textContent = `${testType} Test`;
    form.appendChild(formTitle);
    
    // Create form fields based on test type
    const formFields = getFormFieldsForTestType(testType);
    
    formFields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';
        
        const label = document.createElement('label');
        label.setAttribute('for', field.id);
        label.textContent = field.label;
        formGroup.appendChild(label);
        
        const input = document.createElement('input');
        input.type = field.type;
        input.id = field.id;
        input.name = field.id;
        input.placeholder = field.placeholder || '';
        input.required = field.required || false;
        formGroup.appendChild(input);
        
        form.appendChild(formGroup);
    });
    
    // Submit button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'submit-btn';
    submitBtn.textContent = 'Submit';
    form.appendChild(submitBtn);
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        showAlert(`${testType} test submitted successfully!`);
        this.reset();
    });
    
    return form;
}

/**
 * Get form fields configuration based on test type
 * @param {string} testType - The selected test type
 * @returns {Array} - Array of field configurations
 */
function getFormFieldsForTestType(testType) {
    // Define form fields for each test type
    const fieldConfigs = { 
        'SubDeactivation': [
            { id: 'MDN', label: 'MDN', type: 'text', required: true },
            { id: 'OpType', label: 'Operation Type', type: 'text', required: true }
        ],
        'CreateSubscriber': [
            { id: 'BEID', label: 'BEID', type: 'text', required: true },
            { id: 'OperatorID', label: 'Operator ID', type: 'text', required: true },
            { id: 'MDN', label: 'MDN', type: 'text', required: true },
            { id: 'PayMode', label: 'Pay Mode', type: 'text', required: true }
        ],
        'SubActivation': [
            { id: 'BEID', label: 'BEID', type: 'text', required: true },
            { id: 'OperatorID', label: 'Operator ID', type: 'text', required: true },
            { id: 'MDN', label: 'MDN', type: 'text', required: true },
        ],
        'ChangeSubInfo': [
            { id: 'MDN', label: 'MDN', type: 'text', required: true },
            { id: 'Code', label: 'Code', type: 'text', required: true },
            { id: 'Value', label: 'Value', type: 'text', required: true }
        ],
        'ChangeCL': [
            { id: 'BEID', label: 'BEID', type: 'text', required: true },
            { id: 'OperatorID', label: 'OperatorID', type: 'number', required: true },
            { id: 'MDN', label: 'MDN', type: 'number', required: true },
            { id: 'CustLevel', label: 'CustLevel', type: 'number', required: true }
        ],
        'ChangeSubValidity': [
            { id: 'MDN', label: 'Subscriber ID', type: 'text', required: true },
            { id: 'OpType', label: 'Operation Type', type: 'text', required: true },
            { id: 'ValidityIncrement', label: 'Validity Number', type: 'text', required: true }
        ],
        'ChangeMP': [
            { id: 'OperatorID', label: 'Operator ID', type: 'text', required: true },
            { id: 'MDN', label: 'MDN', type: 'text', required: true },
            { id: 'OfferingID', label: 'Offering ID', type: 'text', required: true }
        ],
        'Starcode': [
            { id: 'BEID', label: 'BEID', type: 'text', required: true },
            { id: 'OperatorID', label: 'Operato ID', type: 'text', required: true },
            { id: 'MDN', label: 'MDN', type: 'text', required: true },
            { id: 'Amount', label: 'Amount', type: 'number', required: true },
            { id: 'Starcode', label: 'Star code', type: 'number', required: true }
        ],
        'Recharge - CashRechargeSimple': [
            { id: 'OperatorID', label: 'Operator ID', type: 'text', required: true },
            { id: 'MDN', label: 'MDN', type: 'text', required: true },
            { id: 'Amount', label: 'Amount', type: 'number', required: true }
        ],
        'Adjustment': [
            { id: 'OperatorID', label: 'Operator ID', type: 'text', required: true },
            { id: 'MDN', label: 'MDN', type: 'text', required: true },
            { id: 'Balance', label: 'Balance', type: 'number', required: true },
            { id: 'Amount', label: 'Amount', type: 'number', required: true }
        ],
        'ChangeSubOffering': [
            { id: 'BEID', label: 'BEID', type: 'text', required: true },
            { id: 'OperatorID', label: 'Operator ID', type: 'text', required: true },
            { id: 'MDN', label: 'MDN', type: 'text', required: true },
            { id: 'OfferingID', label: 'Offering ID', type: 'number', required: true }
        ],
        'Recharge - CashRechargeStar': [
            { id: 'OperatorID', label: 'Operator ID', type: 'text', required: true },
            { id: 'MDN', label: 'MDN', type: 'text', required: true },
            { id: 'Amount', label: 'Amount', type: 'number', required: true }
        ]
    };
    
    return fieldConfigs[testType] || [];
}

/**
 * Initialize button click handlers
 */
function initButtonHandlers() {
    // Run Test button
    const runTestBtn = document.querySelector('.run-test-btn');
    if (runTestBtn) {
        runTestBtn.addEventListener('click', function() {
            // Add button press animation
            this.classList.add('button-pressed');
            setTimeout(() => this.classList.remove('button-pressed'), 300);
            
            // Show loading indicator
            const originalText = this.textContent;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
            
            // Simulate test execution
            setTimeout(() => {
                this.innerHTML = originalText;
                showAlert('Test execution started!');
            }, 1500);
        });
    }
    
    // Test Service button for Web Services page
    const testServiceBtn = document.getElementById('test-service-btn');
    if (testServiceBtn) {
        testServiceBtn.addEventListener('click', function() {
            // Add button press animation
            this.classList.add('button-pressed');
            setTimeout(() => this.classList.remove('button-pressed'), 300);
            
            // Get selected test types
            const selectedTests = getSelectedTestTypes();
            
            // Check if any test is selected
            if (selectedTests.length === 0) {
                showAlert('Please select at least one test type', 'error');
                return;
            }
            
            // Check if file is imported
            const fileInput = document.getElementById('test-data-file');
            if (fileInput && fileInput.files.length === 0) {
                showAlert('Please import a test data file', 'error');
                return;
            }
            
            // Show loading indicator
            const originalText = this.textContent;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running Tests...';
            
            // Simulate test execution
            setTimeout(() => {
                this.innerHTML = originalText;
                showAlert(`Running tests: ${selectedTests.join(', ')}`);
            }, 1500);
        });
    }
    
    // Quick action buttons
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Add button press animation
            this.classList.add('button-pressed');
            setTimeout(() => this.classList.remove('button-pressed'), 300);
            
            const action = this.textContent.trim();
            
            // Check if this is the Create New Test button
            if (action === 'Create New Test') {
                // Navigate to test cases page
                const navItems = document.querySelectorAll('.nav-item');
                const pages = document.querySelectorAll('.page');
                
                // Remove active class from all nav items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active class to test cases nav item
                const testCasesNav = document.querySelector('.nav-item[data-page="test-cases"]');
                if (testCasesNav) {
                    testCasesNav.classList.add('active');
                }
                
                // Hide all pages
                pages.forEach(page => page.style.display = 'none');
                
                // Show the test cases page
                const testCasesPage = document.getElementById('test-cases');
                if (testCasesPage) {
                    testCasesPage.style.display = 'block';
                    
                    // Focus on the test type dropdown
                    const testTypeDropdown = document.getElementById('test-type');
                    if (testTypeDropdown) {
                        setTimeout(() => testTypeDropdown.focus(), 100);
                    }
                }
                
                // Store the active page ID in localStorage
                localStorage.setItem('active_page', 'test-cases');
            } else {
                showAlert(`Action initiated: ${action}`);
            }
        });
    });
    
    // Download buttons
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Add button press animation
            this.classList.add('button-pressed');
            setTimeout(() => this.classList.remove('button-pressed'), 300);
            
            const reportId = this.closest('tr').querySelector('td:first-child').textContent;
            
            // Show loading indicator
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            // Simulate download
            setTimeout(() => {
                this.innerHTML = originalHTML;
                showAlert(`Downloading report: ${reportId}`);
            }, 1000);
        });
    });
}


/**
 * Initialize animations
 */
function initAnimations() {
    // Animate metric cards
    animateMetricCards();
    
    // Animate progress bars
    animateProgressBars();
    
    // Add hover effects to table rows
    addTableRowEffects();
}

/**
 * Animate metric cards with sequential fade-in
 */
function animateMetricCards() {
    const metricCards = document.querySelectorAll('.metric-card');
    
    metricCards.forEach((card, index) => {
        // Set custom property for staggered animation
        card.style.setProperty('--i', index);
        
        // Add animation class
        setTimeout(() => {
            card.classList.add('animated');
        }, 100 * index);
        
        // Animate metric value with counting effect
        const metricValue = card.querySelector('.metric-value');
        if (metricValue) {
            const finalValue = metricValue.textContent;
            
            // Only animate if it's a number
            if (!isNaN(parseInt(finalValue))) {
                animateCounter(metricValue, 0, parseInt(finalValue), 1500);
            }
        }
    });
}

/**
 * Animate counter from start to end value
 */
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        // Add percentage sign if the original value had it
        element.textContent = element.textContent.includes('%') ? `${value}%` : value;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

/**
 * Animate progress bars
 */
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-in-out';
            bar.style.width = width;
        }, 300);
    });
}

/**
 * Add hover effects to table rows
 */
function addTableRowEffects() {
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.classList.add('row-hover');
        });
        
        row.addEventListener('mouseleave', function() {
            this.classList.remove('row-hover');
        });
    });
}

/**
 * Show alert message
 * @param {string} message - Alert message
 * @param {string} type - Alert type (success, error, warning, info)
 */
function showAlert(message, type = 'success') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <span>${message}</span>
            <button class="close-alert">&times;</button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(alert);
    
    // Show alert with animation
    setTimeout(() => {
        alert.classList.add('show');
    }, 10);
    
    // Close button functionality
    const closeBtn = alert.querySelector('.close-alert');
    closeBtn.addEventListener('click', function() {
        closeAlert(alert);
    });
    
    // Auto close after 5 seconds
    setTimeout(() => {
        closeAlert(alert);
    }, 5000);
}

/**
 * Close alert
 * @param {HTMLElement} alert - Alert element
 */
function closeAlert(alert) {
    alert.classList.remove('show');
    alert.classList.add('hide');
    
    // Remove from DOM after animation
    setTimeout(() => {
        alert.remove();
    }, 300);
}

/**
 * Save new user to localStorage
 * @param {string} id - User ID
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role
 */
function saveNewUser(id, name, email, password, role) {
    // Get existing users from localStorage or initialize empty array
    const storedUsers = localStorage.getItem('app_users');
    let users = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Check if user already exists
    const userExists = users.some(user => user.email === email);
    
    if (!userExists) {
        // Generate incremental ID if not provided
        let userId = id;
        if (!userId) {
            // Get the highest existing ID for the role type
            const prefix = role === 'admin' ? 'A' : 'U';
            const existingIds = users
                .filter(user => user.role === role)
                .map(user => user.id)
                .filter(id => id.startsWith(prefix))
                .map(id => parseInt(id.substring(1), 10))
                .filter(num => !isNaN(num));
            
            // Also check default users
            if (prefix === 'A') existingIds.push(1); // A001
            if (prefix === 'U') existingIds.push(1); // U001
            
            // Find the highest ID and increment by 1
            const highestId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
            const newIdNumber = highestId + 1;
            
            // Format the ID with leading zeros
            userId = `${prefix}${String(newIdNumber).padStart(3, '0')}`;
        }
        
        // Generate name if not provided
        const userName = name || email.split('@')[0];
        
        // Add new user
        users.push({
            id: userId,
            name: userName,
            email: email,
            password: password,
            role: role,
            first_login: true, // Set first_login flag to true for new users
            lastLogin: new Date().toISOString().split('T')[0]
        });
        
        // Save updated users array
        localStorage.setItem('app_users', JSON.stringify(users));
        return userId; // Return the generated ID
    }
    return false;
}

/**
 * Refresh user table with updated user list
 * @param {HTMLElement} page - The user management page element
 */
function refreshUserTable(page) {
    const tableBody = page.querySelector('.data-table tbody');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add default admin user
    addUserToTable(tableBody, {
        id: 'A001',
        name: 'Admin User',
        email: 'admin@inwi.com',
        role: 'admin',
        lastLogin: '2023-10-01'
    });
    
    // Add default regular user
    addUserToTable(tableBody, {
        id: 'U001',
        name: 'Regular User',
        email: 'user@inwi.com',
        role: 'user',
        lastLogin: '2023-09-30'
    });
    
    // Get users from localStorage
    const storedUsers = localStorage.getItem('app_users');
    if (storedUsers) {
        const users = JSON.parse(storedUsers);
        
        // Add each user to the table
        users.forEach(user => {
            addUserToTable(tableBody, {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                lastLogin: '-'
            });
        });
    }
}

/**
 * Add a user to the table and attach event listeners
 * @param {HTMLElement} tableBody - The table body element
 * @param {Object} user - User data object
 */
function addUserToTable(tableBody, user) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${user.id || '-'}</td>
        <td>${user.name || '-'}</td>
        <td>${user.email}</td>
        <td><span class="role ${user.role}">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span></td>
        <td>${user.lastLogin}</td>
        <td>
            <button class="view-btn" title="View Details"><i class="fas fa-eye"></i></button>
            <button class="edit-btn" title="Edit User"><i class="fas fa-edit"></i></button>
            <button class="delete-btn" title="Delete User"><i class="fas fa-trash"></i></button>
        </td>
    `;
    tableBody.appendChild(row);
    
    // We don't need to add event listeners here anymore since we're using event delegation in initUserManagementEvents
}

/**
 * Remove user from localStorage
 * @param {string} identifier - User email or ID to remove
 */
function removeUserFromStorage(identifier) {
    const storedUsers = localStorage.getItem('app_users');
    if (storedUsers) {
        let users = JSON.parse(storedUsers);
        // Filter out the user with matching email or id
        users = users.filter(user => user.email !== identifier && user.id !== identifier);
        localStorage.setItem('app_users', JSON.stringify(users));
    }
}
/**
 * Get user data by ID from localStorage
 * @param {string} id - User ID to find
 * @returns {Object|null} - User data object or null if not found
 */
function getUserById(id) {
    // Check for default admin user
    if (id === 'A001') {
        return {
            id: 'A001',
            name: 'Admin User',
            email: 'admin@inwi.com',
            password: 'admin123', // Default password for demo
            role: 'admin',
            lastLogin: '2023-10-01'
        };
    }
    
    // Check for default regular user
    if (id === 'U001') {
        return {
            id: 'U001',
            name: 'Regular User',
            email: 'user@inwi.com',
            password: 'user123', // Default password for demo
            role: 'user',
            lastLogin: '2023-09-30'
        };
    }
    
    // Get users array from localStorage, default to empty array if not found
    // Find user with matching ID, return null if not found
    return JSON.parse(localStorage.getItem('app_users') || '[]').find(usr => usr.id === id) || null;
}

/**
 * Get user data by email from localStorage or default users
 * @param {string} email - User email to find
 * @returns {Object|null} - User data object or null if not found
 */
function getUserByEmail(email) {
    // Check for default admin user
    if (email === 'admin@inwi.com') {
        return {
            email: 'admin@inwi.com',
            password: 'admin123', // Default password for demo
            role: 'admin'
        };
    }
    
    // Check for default regular user
    if (email === 'user@inwi.com') {
        return {
            email: 'user@inwi.com',
            password: 'user123', // Default password for demo
            role: 'user'
        };
    }
    
    // Check localStorage for other users
    const storedUsers = localStorage.getItem('app_users');
    if (storedUsers) {
        const users = JSON.parse(storedUsers);
        return users.find(user => user.email === email) || null;
    }
    return null;
}

/**
 * Open modal to view user details
 * @param {Object} userData - User data object
 */
function openViewUserModal(userData) {
    const modal = document.getElementById('user-modal');
    const modalContent = document.getElementById('modal-content-container');
    
    if (modal && modalContent) {
        // Create masked password (show only first and last character)
        const password = userData.password;
        const maskedPassword = password.length > 2 ? 
            `${password.charAt(0)}${'*'.repeat(password.length - 2)}${password.charAt(password.length - 1)}` : 
            '****';
        
        // Generate random test statistics for demo purposes
        const totalTests = Math.floor(Math.random() * 50) + 1;
        const passedTests = Math.floor(Math.random() * totalTests);
        const passRate = Math.round((passedTests / totalTests) * 100);
        
        // Set modal content
        modalContent.innerHTML = `
            <h3>User Details</h3>
            <div class="user-details">
                <div class="detail-group">
                    <label>ID:</label>
                    <span>${userData.id || '-'}</span>
                </div>
                <div class="detail-group">
                    <label>Name:</label>
                    <span>${userData.name || '-'}</span>
                </div>
                <div class="detail-group">
                    <label>Email:</label>
                    <span>${userData.email}</span>
                </div>
                <div class="detail-group">
                    <label>Password:</label>
                    <span>${maskedPassword}</span>
                </div>
                <div class="detail-group">
                    <label>Role:</label>
                    <span class="role ${userData.role}">${userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}</span>
                </div>
                
                <h4>Test Statistics</h4>
                <div class="stats-container">
                    <div class="stat-item">
                        <label>Total Tests:</label>
                        <span>${totalTests}</span>
                    </div>
                    <div class="stat-item">
                        <label>Passed Tests:</label>
                        <span>${passedTests}</span>
                    </div>
                    <div class="stat-item">
                        <label>Pass Rate:</label>
                        <span>${passRate}%</span>
                    </div>
                    <div class="stat-item">
                        <label>Last Test Run:</label>
                        <span>${new Date().toISOString().split('T')[0]}</span>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="action-btn close-btn" id="view-close-btn">Close</button>
                </div>
            </div>
        `;
        
        // Add event listener for the close button
        setTimeout(() => {
            const closeBtn = document.getElementById('view-close-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    closeModal(modal);
                });
            }
        }, 0);
        
        // Show modal
        openModal(modal);
    }
}

/**
 * Open modal to edit user
 * @param {Object} userData - User data object
 */
function openEditUserModal(userData) {
    const modal = document.getElementById('user-modal');
    const modalContent = document.getElementById('modal-content-container');
    
    if (modal && modalContent) {
        // Set modal content with edit form
        modalContent.innerHTML = `
            <h3>Edit User</h3>
            <form id="edit-user-form" class="user-form">
                <div class="form-group">
                    <label for="edit-id">ID</label>
                    <input type="text" id="edit-id" name="edit-id" value="${userData.id || ''}" ${userData.email === 'admin@inwi.com' || userData.email === 'user@inwi.com' ? 'readonly' : ''} required>
                    ${userData.email === 'admin@inwi.com' || userData.email === 'user@inwi.com' ? '<small class="form-note">ID cannot be changed for default users</small>' : ''}
                </div>
                <div class="form-group">
                    <label for="edit-name">Name</label>
                    <input type="text" id="edit-name" name="edit-name" value="${userData.name || ''}" ${userData.email === 'admin@inwi.com' || userData.email === 'user@inwi.com' ? 'readonly' : ''} required>
                    ${userData.email === 'admin@inwi.com' || userData.email === 'user@inwi.com' ? '<small class="form-note">Name cannot be changed for default users</small>' : ''}
                </div>
                <div class="form-group">
                    <label for="edit-email">Email</label>
                    <input type="email" id="edit-email" name="edit-email" value="${userData.email}" ${userData.email === 'admin@inwi.com' || userData.email === 'user@inwi.com' ? 'readonly' : ''} required>
                    ${userData.email === 'admin@inwi.com' || userData.email === 'user@inwi.com' ? '<small class="form-note">Email cannot be changed for default users</small>' : ''}
                </div>
                <div class="form-group">
                    <label for="edit-password">Password</label>
                    <input type="password" id="edit-password" name="edit-password" value="${userData.password}" required>
                </div>
                <div class="form-group">
                    <label for="edit-role">Role</label>
                    <select id="edit-role" name="edit-role" required>
                        <option value="user" ${userData.role === 'user' ? 'selected' : ''}>User</option>
                        <option value="admin" ${userData.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="action-btn">Save Changes</button>
                    <button type="button" class="cancel-btn" id="edit-cancel-btn">Cancel</button>
                </div>
            </form>
        `;}
        
        // Add event listener for the cancel button
        setTimeout(() => {
            const cancelBtn = document.getElementById('edit-cancel-btn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function() {
                    closeModal(modal);
                });
            }
        }, 0);
        
        // Show modal
        openModal(modal);
        
        // Add form submission handler
        const editForm = document.getElementById('edit-user-form');
        if (editForm) {
            editForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const newId = document.getElementById('edit-id').value.trim();
                const newName = document.getElementById('edit-name').value.trim();
                const newEmail = document.getElementById('edit-email').value.trim();
                const newPassword = document.getElementById('edit-password').value.trim();
                const newRole = document.getElementById('edit-role').value;
                
                // Update user in localStorage
                updateUser(userData.email, newId, newName, newEmail, newPassword, newRole);
                
                // Close modal
                closeModal(modal);
                
                // Show success message
                showAlert(`User ${newName} (${newEmail}) updated successfully`);
                
                // Refresh the user table
                const userManagementPage = document.getElementById('user-management');
                if (userManagementPage) {
                    refreshUserTable(userManagementPage);
                }
            });
        }
    }


/**
 * Update user in localStorage
 * @param {string} oldEmail - Original email to identify user
 * @param {string} newId - New ID value
 * @param {string} newName - New name value
 * @param {string} newEmail - New email value
 * @param {string} newPassword - New password value
 * @param {string} newRole - New role value
 */
function updateUser(oldEmail, newId, newName, newEmail, newPassword, newRole) {
    // Handle default users specially
    if (oldEmail === 'admin@inwi.com' || oldEmail === 'user@inwi.com') {
        // For demo purposes, we'll show a message but not actually update the default users
        // In a real app, you would update these in a database
        if (oldEmail !== newEmail) {
            showAlert(`Cannot change email for default user: ${oldEmail}`, 'warning');
            return;
        }
        
        showAlert(`Default user ${oldEmail} settings would be updated in a real application`, 'info');
        return;
    }
    
    // Handle regular users from localStorage
    const storedUsers = localStorage.getItem('app_users');
    if (storedUsers) {
        let users = JSON.parse(storedUsers);
        
        // Find and update the user
        const updatedUsers = users.map(user => {
            if (user.email === oldEmail) {
                return {
                    id: newId,              // Update the user ID
                    name: newName,          // Update the user name
                    email: newEmail,
                    password: newPassword,
                    role: newRole,
                    lastLogin: user.lastLogin || '-' // Preserve last login date if it exists
                };
            }
            return user;
        });
        
        // Save updated users array
        localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    }
}

/**
 * Open modal
 * @param {HTMLElement} modal - Modal element to open
 */
function openModal(modal) {
    if (modal) {
        // Display the modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        
        // Add animation class after a small delay for the animation to work
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Ensure close button works
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modal));
        }
        
        // Close when clicking outside the modal content
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(modal);
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal(modal);
            }
        });
    }
}

/**
 * Close modal
 * @param {HTMLElement} modal - Modal element to close
 */
function closeModal(modal) {
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Hide the modal after animation completes
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

/**
 * Initialize Web Services page functionality
 */
function initWebServicesPage() {
    // File import functionality
    const fileInput = document.getElementById('test-data-file');
    const filePreview = document.getElementById('file-preview');
    
    if (fileInput && filePreview) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                // Show file name and size
                const fileSize = (file.size / 1024).toFixed(2) + ' KB';
                filePreview.innerHTML = `
                    <div class="file-info">
                        <p><strong>File:</strong> ${file.name}</p>
                        <p><strong>Size:</strong> ${fileSize}</p>
                    </div>
                    <div class="file-content-preview">
                        <p>Loading file content preview...</p>
                    </div>
                `;
                
                // Read file content for preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    const content = e.target.result;
                    const contentPreview = content.substring(0, 200) + (content.length > 200 ? '...' : '');
                    
                    const fileContentPreview = filePreview.querySelector('.file-content-preview');
                    if (fileContentPreview) {
                        fileContentPreview.innerHTML = `
                            <p><strong>Content Preview:</strong></p>
                            <pre>${contentPreview}</pre>
                        `;
                    }
                };
                reader.readAsText(file);
            } else {
                filePreview.innerHTML = '<p>No file selected</p>';
            }
        });
    }
}

/**
 * Get selected test types from checkboxes
 * @returns {Array} - Array of selected test types
 */
function getSelectedTestTypes() {
    const checkboxes = document.querySelectorAll('input[name="test-types"]:checked');
    const selectedTests = [];
    
    checkboxes.forEach(checkbox => {
        selectedTests.push(checkbox.value);
    });
    
    return selectedTests;
}

/**
 * Initialize Profile page functionality
 */
function initProfilePage() {
    // Get profile elements
    const profileInfoDisplay = document.getElementById('profile-info-display');
    const profileEditForm = document.getElementById('profile-edit-form');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const cancelProfileBtn = document.getElementById('cancel-profile-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const changePasswordToggle = document.getElementById('change-password-toggle');
    const changePasswordForm = document.getElementById('change-password-form');
    
    // Load user profile data
    loadUserProfile();
    
    // Edit profile button click handler
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            // Hide profile info display
            profileInfoDisplay.style.display = 'none';
            
            // Show profile edit form
            profileEditForm.style.display = 'block';
            
            // Populate form with current user data
            populateProfileForm();
        });
    }
    
    // Cancel profile edit button click handler
    if (cancelProfileBtn) {
        cancelProfileBtn.addEventListener('click', function() {
            // Hide profile edit form
            profileEditForm.style.display = 'none';
            
            // Show profile info display
            profileInfoDisplay.style.display = 'block';
            
            // Reset form
            document.getElementById('edit-profile-form').reset();
            
            // Hide change password form
            changePasswordForm.classList.remove('active');
        });
    }
    
    // Save profile button click handler
    if (saveProfileBtn) {
        const editProfileForm = document.getElementById('edit-profile-form');
        if (editProfileForm) {
            editProfileForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const name = document.getElementById('edit-profile-name').value.trim();
                const email = document.getElementById('edit-profile-email').value.trim();
                
                // Check if password change is requested
                const isPasswordChangeRequested = changePasswordForm.classList.contains('active');
                let passwordChangeValid = true;
                
                if (isPasswordChangeRequested) {
                    const currentPassword = document.getElementById('current-password').value.trim();
                    const newPassword = document.getElementById('new-password').value.trim();
                    const confirmPassword = document.getElementById('confirm-password').value.trim();
                    
                    // Validate password change
                    passwordChangeValid = validatePasswordChange(currentPassword, newPassword, confirmPassword);
                    
                    if (passwordChangeValid) {
                        // Update password
                        updateUserPassword(currentPassword, newPassword);
                    } else {
                        return false; // Stop form submission if password validation fails
                    }
                }
                
                // Update user profile
                if (updateUserProfile(name, email) && passwordChangeValid) {
                    // Hide profile edit form
                    profileEditForm.style.display = 'none';
                    
                    // Show profile info display
                    profileInfoDisplay.style.display = 'block';
                    
                    // Reset form
                    editProfileForm.reset();
                    
                    // Hide change password form
                    changePasswordForm.classList.remove('active');
                    
                    // Show success message
                    showAlert('Profile updated successfully');
                    
                    // Reload user profile data
                    loadUserProfile();
                }
            });
        }
    }
    
    // Change password toggle click handler
    if (changePasswordToggle) {
        changePasswordToggle.addEventListener('click', function() {
            changePasswordForm.classList.toggle('active');
        });
    }
}

/**
 * Load user profile data
 */
function loadUserProfile() {
    const userSession = localStorage.getItem('user_session');
    
    if (userSession) {
        try {
            const sessionData = JSON.parse(userSession);
            
            // Set profile data in display view
            document.getElementById('profile-name').textContent = sessionData.name || sessionData.id;
            document.getElementById('profile-id').textContent = sessionData.id;
            document.getElementById('profile-display-name').textContent = sessionData.name || '-';
            document.getElementById('profile-email').textContent = sessionData.email;
            document.getElementById('profile-role').textContent = sessionData.role;
            document.getElementById('profile-last-login').textContent = new Date(sessionData.expiry - (24 * 60 * 60 * 1000)).toLocaleDateString();
            
            // Set role badge
            const roleBadge = document.getElementById('profile-role-badge');
            if (roleBadge) {
                roleBadge.textContent = sessionData.role;
                roleBadge.className = `profile-role ${sessionData.role}`;
            }
            
            // Set profile avatar initial
            const profileAvatar = document.querySelector('.profile-avatar i');
            if (profileAvatar && sessionData.name) {
                // If name exists, use first letter of name
                const initial = sessionData.name.charAt(0).toUpperCase();
                profileAvatar.textContent = initial;
                profileAvatar.className = ''; // Remove icon class
            }
        } catch (e) {
            console.error('Error loading user profile:', e);
        }
    }
}

/**
 * Populate profile edit form with current user data
 */
function populateProfileForm() {
    const userSession = localStorage.getItem('user_session');
    
    if (userSession) {
        try {
            const sessionData = JSON.parse(userSession);
            
            // Set form field values
            document.getElementById('edit-profile-id').value = sessionData.id;
            document.getElementById('edit-profile-name').value = sessionData.name || '';
            document.getElementById('edit-profile-email').value = sessionData.email;
            document.getElementById('edit-profile-role').value = sessionData.role;
            
            // Clear password fields
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
        } catch (e) {
            console.error('Error populating profile form:', e);
        }
    }
}

/**
 * Validate password change
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @param {string} confirmPassword - Confirm new password
 * @returns {boolean} - Validation result
 */
function validatePasswordChange(currentPassword, newPassword, confirmPassword) {
    // Check if current password is provided
    if (!currentPassword) {
        showAlert('Current password is required', 'error');
        return false;
    }
    
    // Check if new password is provided
    if (!newPassword) {
        showAlert('New password is required', 'error');
        return false;
    }
    
    // Check if new password is at least 6 characters
    if (newPassword.length < 6) {
        showAlert('New password must be at least 6 characters', 'error');
        return false;
    }
    
    // Check if confirm password matches new password
    if (newPassword !== confirmPassword) {
        showAlert('New password and confirm password do not match', 'error');
        return false;
    }
    
    // Check if current password is correct
    const userSession = localStorage.getItem('user_session');
    if (userSession) {
        try {
            const sessionData = JSON.parse(userSession);
            const userId = sessionData.id;
            
            // Get user data
            const userData = getUserById(userId) || getUserByEmail(sessionData.email);
            
            if (userData && userData.password !== currentPassword) {
                showAlert('Current password is incorrect', 'error');
                return false;
            }
        } catch (e) {
            console.error('Error validating password:', e);
            return false;
        }
    }
    
    return true;
}

/**
 * Update user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {boolean} - Update result
 */
function updateUserPassword(currentPassword, newPassword) {
    const userSession = localStorage.getItem('user_session');
    
    if (userSession) {
        try {
            const sessionData = JSON.parse(userSession);
            const userId = sessionData.id;
            const userEmail = sessionData.email;
            
            // Handle default users
            if (userEmail === 'admin@inwi.com' || userEmail === 'user@inwi.com') {
                showAlert('Cannot change password for default users in this demo', 'warning');
                return true; // Return true to allow the form to continue
            }
            
            // Get user data
            const userData = getUserById(userId) || getUserByEmail(userEmail);
            
            if (userData) {
                // Update password in localStorage
                const storedUsers = localStorage.getItem('app_users');
                
                if (storedUsers) {
                    let users = JSON.parse(storedUsers);
                    
                    // Find and update the user
                    const updatedUsers = users.map(user => {
                        if (user.email === userEmail) {
                            return {
                                ...user,
                                password: newPassword
                            };
                        }
                        return user;
                    });
                    
                    // Save updated users array
                    localStorage.setItem('app_users', JSON.stringify(updatedUsers));
                    return true;
                }
            }
        } catch (e) {
            console.error('Error updating password:', e);
            showAlert('Error updating password', 'error');
            return false;
        }
    }
    
    return false;
}

/**
 * Update user profile
 * @param {string} name - User name
 * @param {string} email - User email
 * @returns {boolean} - Update result
 */
function updateUserProfile(name, email) {
    const userSession = localStorage.getItem('user_session');
    
    if (userSession) {
        try {
            const sessionData = JSON.parse(userSession);
            const userId = sessionData.id;
            const userEmail = sessionData.email;
            const userRole = sessionData.role;
            
            // Validate email format
            if (!isValidEmail(email)) {
                showAlert('Please enter a valid email address', 'error');
                return false;
            }
            
            // Check if email is already in use by another user
            if (email !== userEmail) {
                const existingUser = getUserByEmail(email);
                if (existingUser) {
                    showAlert('Email is already in use by another user', 'error');
                    return false;
                }
            }
            
            // Handle default users
            if (userEmail === 'admin@inwi.com' || userEmail === 'user@inwi.com') {
                // For demo purposes, we'll show a message but not actually update the default users
                if (email !== userEmail) {
                    showAlert('Cannot change email for default users in this demo', 'warning');
                    return false;
                }
                
                // Update session data with new name
                const updatedSessionData = {
                    ...sessionData,
                    name: name
                };
                
                // Save updated session data
                localStorage.setItem('user_session', JSON.stringify(updatedSessionData));
                
                showAlert('Profile updated successfully (Note: Default user data is not permanently saved in this demo)', 'info');
                return true;
            }
            
            // Update user in localStorage
            let users = [];
            const storedUsers = localStorage.getItem('app_users');
            
            if (storedUsers) {
                users = JSON.parse(storedUsers);
            }
            
            // Check if user exists in the array
            const userExists = users.some(user => user.email === userEmail);
            
            if (userExists) {
                // Find and update the user
                const updatedUsers = users.map(user => {
                    if (user.email === userEmail) {
                        return {
                            ...user,
                            name: name,
                            email: email
                        };
                    }
                    return user;
                });
                
                // Save updated users array
                localStorage.setItem('app_users', JSON.stringify(updatedUsers));
            } else {
                // User doesn't exist in localStorage yet, add them
                const newUser = {
                    id: userId,
                    name: name,
                    email: email,
                    password: sessionData.password || 'defaultpassword',
                    role: userRole,
                    lastLogin: new Date().toISOString().split('T')[0]
                };
                
                users.push(newUser);
                localStorage.setItem('app_users', JSON.stringify(users));
            }
            
            // Update session data
            const updatedSessionData = {
                ...sessionData,
                name: name,
                email: email
            };
            
            // Save updated session data
            localStorage.setItem('user_session', JSON.stringify(updatedSessionData));
            
            // Update header user info
            updateHeaderUserInfo(email, userRole);
            
            return true;
        } catch (e) {
            console.error('Error updating profile:', e);
            showAlert('Error updating profile', 'error');
            return false;
        }
    }
    
    return false;
}

/**
 * Update header user info
 * @param {string} email - User email
 * @param {string} role - User role
 */
function updateHeaderUserInfo(email, role) {
    const userInfoContainer = document.querySelector('.user-info');
    
    if (userInfoContainer) {
        const userEmailElement = userInfoContainer.querySelector('.user-email');
        if (userEmailElement) {
            userEmailElement.textContent = email;
        }
    }
}