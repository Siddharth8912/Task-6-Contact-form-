document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selection ---
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const successMessage = document.getElementById('success-message');
    const resetFormBtn = document.getElementById('reset-form-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // --- NEW: Function to handle staggered animations ---
    const staggerAnimation = (selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            // Set a timeout to apply animation classes with a delay
            setTimeout(() => {
                // --- CORRECTED: Directly add the animation class ---
                el.classList.add('animate-fade-in-slide-up');
                el.style.opacity = 1; // Ensure it's visible
            }, 100 * (index + 1)); // Adjusted timing for a quicker start
        });
    };

    // --- Helper Functions for Validation ---

    const showError = (input, message) => {
        const parent = input.parentElement;
        const errorMessage = parent.querySelector('.error-message');
        errorMessage.textContent = message;
        // Add Tailwind error classes
        input.classList.remove('border-[#dfe6e9]', 'dark:border-[#526d7a]');
        input.classList.add('border-red-500');
        // --- NEW: Add shake animation to the error message ---
        errorMessage.classList.add('animate-shake');
        // Remove animation after it finishes to allow re-triggering
        errorMessage.addEventListener('animationend', () => {
            errorMessage.classList.remove('animate-shake');
        }, { once: true });
    };

    const showSuccess = (input) => {
        const parent = input.parentElement;
        const errorMessage = parent.querySelector('.error-message');
        errorMessage.textContent = '';
        // Add Tailwind success classes
        input.classList.remove('border-red-500');
        input.classList.add('border-green-500');
    };

    const clearValidation = (input) => {
        const parent = input.parentElement;
        const errorMessage = parent.querySelector('.error-message');
        errorMessage.textContent = '';
        // Remove validation classes and restore default
        input.classList.remove('border-red-500', 'border-green-500');
        input.classList.add('border-[#dfe6e9]', 'dark:border-[#526d7a]');
    };

    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    // --- Validation Logic ---

    const validateName = () => {
        const nameValue = nameInput.value.trim();
        if (nameValue === '') {
            showError(nameInput, 'Name is required.');
            return false;
        }
        showSuccess(nameInput);
        return true;
    };

    const validateEmail = () => {
        const emailValue = emailInput.value.trim();
        if (emailValue === '') {
            showError(emailInput, 'Email is required.');
            return false;
        } else if (!isValidEmail(emailValue)) {
            showError(emailInput, 'Please enter a valid email address.');
            return false;
        }
        showSuccess(emailInput);
        return true;
    };

    const validateMessage = () => {
        const messageValue = messageInput.value.trim();
        if (messageValue === '') {
            showError(messageInput, 'Message is required.');
            return false;
        }
        showSuccess(messageInput);
        return true;
    };

    const validateForm = () => {
        return validateName() && validateEmail() && validateMessage();
    };

    // --- Event Listeners ---

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            contactForm.classList.add('hidden');
            successMessage.classList.remove('hidden');
            successMessage.classList.add('flex'); // Ensure it's a flex container
            // --- NEW: Trigger animation for success message elements ---
            staggerAnimation('#success-message [data-anim]');
        }
    });

    resetFormBtn.addEventListener('click', () => {
        successMessage.classList.add('hidden');
        successMessage.classList.remove('flex');
        contactForm.classList.remove('hidden');
        contactForm.reset();
        // Clear all validation styles
        [nameInput, emailInput, messageInput].forEach(clearValidation);
        // --- NEW: Reset success message elements for next time ---
        document.querySelectorAll('#success-message [data-anim]').forEach(el => {
            el.classList.remove('animate-fade-in-slide-up');
            el.style.opacity = 0;
        });
    });

    // Real-time validation
    nameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    messageInput.addEventListener('input', validateMessage);

    // --- Dark Mode Functionality ---

    const applyTheme = (isDark) => {
        if (isDark) {
            htmlElement.classList.add('dark');
            themeToggle.checked = true;
        } else {
            htmlElement.classList.remove('dark');
            themeToggle.checked = false;
        }
    };

    themeToggle.addEventListener('change', () => {
        const isDark = themeToggle.checked;
        localStorage.setItem('darkMode', isDark);
        applyTheme(isDark);
    });

    // Check localStorage for saved theme preference on page load
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    applyTheme(savedTheme);
    
    // --- CORRECTED: Trigger initial form animation on page load ---
    staggerAnimation('#contactForm [data-anim]');
});
