const animationFrames = {
    years: null,
    months: null,
    days: null
};

function calculateAge() {
    // Reset previous animations and values
    ['years', 'months', 'days'].forEach(id => {
        if (animationFrames[id]) {
            cancelAnimationFrame(animationFrames[id]);
            animationFrames[id] = null;
        }
        document.getElementById(id).textContent = '--';
    });

    const day = parseInt(document.getElementById('day').value);
    const month = parseInt(document.getElementById('month').value);
    const year = parseInt(document.getElementById('year').value);
    const errorElement = document.getElementById('error');

    errorElement.classList.add('hidden');

    if (!day || !month || !year) {
        showError('All fields are required');
        return;
    }

    const currentDate = new Date();
    const birthDate = new Date(year, month - 1, day);

    if (
        birthDate.getDate() !== day ||
        birthDate.getMonth() + 1 !== month ||
        birthDate.getFullYear() !== year
    ) {
        showError('Invalid date');
        return;
    }

    if (birthDate > currentDate) {
        showError('Birth date cannot be in the future');
        return;
    }

    let ageYears = currentDate.getFullYear() - birthDate.getFullYear();
    let ageMonths = currentDate.getMonth() - birthDate.getMonth();
    let ageDays = currentDate.getDate() - birthDate.getDate();

    if (ageDays < 0) {
        const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        ageDays += lastMonth.getDate();
        ageMonths--;
    }

    if (ageMonths < 0) {
        ageMonths += 12;
        ageYears--;
    }

    animateResult('years', ageYears);
    animateResult('months', ageMonths);
    animateResult('days', ageDays);
}

function showError(message) {
    const errorElement = document.getElementById('error');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}

function animateResult(elementId, value) {
    const element = document.getElementById(elementId);
    let current = parseInt(element.textContent) || 0;
    
    // Cancel existing animation
    if (animationFrames[elementId]) {
        cancelAnimationFrame(animationFrames[elementId]);
    }

    const increment = value > current ? 1 : -1;

    const update = () => {
        if (current === value) {
            animationFrames[elementId] = null;
            return;
        }

        current += increment;
        element.textContent = current;
        
        // Reverse increment if overshooting
        if ((increment === 1 && current > value) || 
            (increment === -1 && current < value)) {
            current = value;
            element.textContent = current;
            animationFrames[elementId] = null;
            return;
        }

        animationFrames[elementId] = requestAnimationFrame(update);
    };

    animationFrames[elementId] = requestAnimationFrame(update);
}