// login.js - Med Ease Authentication JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const termsModal = document.getElementById('termsModal');
    const privacyModal = document.getElementById('privacyModal');
    const successModal = document.getElementById('successModal');

    // Tab switching functionality
    loginTab.addEventListener('click', function() {
        showLoginForm();
    });

    registerTab.addEventListener('click', function() {
        showRegisterForm();
    });

    function showLoginForm() {
        loginTab.classList.add('bg-white', 'text-black');
        loginTab.classList.remove('text-white/80');
        registerTab.classList.remove('bg-white', 'text-black');
        registerTab.classList.add('text-white/80');
        
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    }

    function showRegisterForm() {
        registerTab.classList.add('bg-white', 'text-black');
        registerTab.classList.remove('text-white/80');
        loginTab.classList.remove('bg-white', 'text-black');
        loginTab.classList.add('text-white/80');
        
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }

    // Form submissions
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Login form submitted');
        
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Signing In...';
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            // Redirect to dashboard or checkup
            window.location.href = 'checkup.html'; // or your main dashboard
        }, 2000);
    });

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const termsCheckbox = document.getElementById('termsCheckbox');
        if (!termsCheckbox.checked) {
            showNotification('Please accept the Terms and Conditions to continue', 'error');
            return;
        }

        console.log('Register form submitted');
        
        // Show loading state
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Creating Account...';
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            showSuccessModal();
        }, 2000);
    });

    // Password visibility toggle
    window.togglePassword = function(inputId) {
        const input = document.getElementById(inputId);
        if (input.type === 'password') {
            input.type = 'text';
        } else {
            input.type = 'password';
        }
    };

    // Modal functions
    window.openTermsModal = function() {
        termsModal.classList.remove('opacity-0', 'invisible');
        termsModal.classList.add('opacity-100', 'visible');
        document.body.style.overflow = 'hidden';
    };

    window.closeTermsModal = function() {
        termsModal.classList.add('opacity-0', 'invisible');
        termsModal.classList.remove('opacity-100', 'visible');
        document.body.style.overflow = 'auto';
    };

    window.openPrivacyModal = function() {
        privacyModal.classList.remove('opacity-0', 'invisible');
        privacyModal.classList.add('opacity-100', 'visible');
        document.body.style.overflow = 'hidden';
    };

    window.closePrivacyModal = function() {
        privacyModal.classList.add('opacity-0', 'invisible');
        privacyModal.classList.remove('opacity-100', 'visible');
        document.body.style.overflow = 'auto';
    };

    window.acceptTerms = function() {
        const termsCheckbox = document.getElementById('termsCheckbox');
        if (termsCheckbox) {
            termsCheckbox.checked = true;
        }
        closeTermsModal();
        showNotification('Terms and Conditions accepted', 'success');
    };

    window.acceptPrivacy = function() {
        closePrivacyModal();
        showNotification('Privacy Policy accepted', 'success');
    };

    function showSuccessModal() {
        successModal.classList.remove('opacity-0', 'invisible');
        successModal.classList.add('opacity-100', 'visible');
        document.body.style.overflow = 'hidden';
    }

    window.startCheckup = function() {
        // Redirect to checkup page
        window.location.href = 'checkup.html'; // or your checkup page
    };

    // Close modals on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeTermsModal();
            closePrivacyModal();
        }
    });

    // Close modals on backdrop click
    termsModal.addEventListener('click', function(e) {
        if (e.target === termsModal) {
            closeTermsModal();
        }
    });

    privacyModal.addEventListener('click', function(e) {
        if (e.target === privacyModal) {
            closePrivacyModal();
        }
    });

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500';
        
        notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Password strength indicator
    const registerPassword = document.getElementById('registerPassword');
    if (registerPassword) {
        registerPassword.addEventListener('input', function() {
            const password = this.value;
            const indicators = document.querySelectorAll('#registerForm .w-2.h-2');
            
            // Reset all indicators
            indicators.forEach(indicator => {
                indicator.classList.remove('bg-green-400', 'bg-yellow-400', 'bg-red-400');
                indicator.classList.add('bg-neutral-600');
            });

            // Check conditions
            if (password.length >= 8 && indicators[0]) {
                indicators[0].classList.remove('bg-neutral-600');
                indicators[0].classList.add('bg-green-400');
            }
            
            if (/[a-z]/.test(password) && /[A-Z]/.test(password) && indicators[1]) {
                indicators[1].classList.remove('bg-neutral-600');
                indicators[1].classList.add('bg-green-400');
            }
            
            if (/\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password) && indicators[2]) {
                indicators[2].classList.remove('bg-neutral-600');
                indicators[2].classList.add('bg-green-400');
            }
        });
    }
});
