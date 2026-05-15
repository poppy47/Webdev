// ========== FORM VALIDATION & INTERACTIVITY ==========

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.ifsc-form');
    const ifscInput = document.querySelector('input[name="ifsc"]');

    // Convert input to uppercase automatically
    if (ifscInput) {
        ifscInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
        });

        // Validate IFSC format on blur
        ifscInput.addEventListener('blur', () => {
            validateIFSCFormat(ifscInput.value);
        });
    }

    // Form submission handler
    if (form) {
        form.addEventListener('submit', (e) => {
            if (!ifscInput.value.trim()) {
                e.preventDefault();
                showError('Please enter an IFSC code');
            } else if (!isValidIFSCFormat(ifscInput.value)) {
                e.preventDefault();
                showError('Invalid IFSC format. Should be 11 characters.');
            }
        });
    }
});

// ========== VALIDATION FUNCTIONS ==========

function isValidIFSCFormat(ifsc) {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc);
}

function validateIFSCFormat(ifsc) {
    if (ifsc && !isValidIFSCFormat(ifsc)) {
        console.warn('Invalid IFSC format detected');
    }
}

// ========== UI FEEDBACK FUNCTIONS ==========

function showError(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.innerHTML = `
        <i class="fas fa-exclamation-circle me-2"></i>
        <strong>Error:</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const form = document.querySelector('.ifsc-form');
    form.parentElement.insertBefore(alertDiv, form);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// ========== PAGE LOAD ANIMATIONS ==========

window.addEventListener('load', () => {
    document.querySelectorAll('.info-card').forEach((card, index) => {
        card.style.animation = `slideUp 0.5s ease-out ${index * 0.1}s both`;
    });
});

// ========== SMOOTH SCROLL TO RESULTS ==========

const observer = new MutationObserver(() => {
    const resultsSection = document.querySelector('.results-section');
    if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        observer.disconnect();
    }
});

observer.observe(document.body, { subtree: true, childList: true });

// ========== KEYBOARD SHORTCUTS ==========

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.querySelector('input[name="ifsc"]');
        if (input) input.focus();
    }
});
