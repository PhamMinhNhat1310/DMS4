document.addEventListener('DOMContentLoaded', () => {
    const formSteps = Array.from(document.querySelectorAll('.form-step'));
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const progressBar = document.querySelector('.progress-bar-fill');
    const form = document.getElementById('persona-form');

    let currentStep = 0;

    const updateTotalSteps = formSteps.length;

    // Function to update the form display based on the current step
    const updateFormSteps = () => {
        // Hide all steps
        formSteps.forEach(step => {
            step.classList.remove('active');
        });

        // Show the current step
        formSteps[currentStep].classList.add('active');

        // Update progress bar
        const progressPercent = ((currentStep + 1) / updateTotalSteps) * 100;
        progressBar.style.width = `${progressPercent}%`;

        // Update button visibility and text
        if (currentStep === 0) {
            backBtn.style.display = 'none';
        } else {
            backBtn.style.display = 'inline-block';
        }

        if (currentStep === updateTotalSteps - 1) {
            nextBtn.textContent = 'Create Persona';
        } else {
            nextBtn.textContent = 'Next';
        }
    };

    // "Next" button click handler
    nextBtn.addEventListener('click', () => {
        // Basic validation
        const currentStepInputs = formSteps[currentStep].querySelectorAll('input[required]');
        let isValid = true;
        currentStepInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = 'var(--light-gray)';
            }
        });
        
        if (!isValid) return;

        // Logic for final step (submission)
        if (currentStep === updateTotalSteps - 1) {
            // This is the final "Create Persona" click
            const formData = new FormData(form);
            console.log('Form Submitted!');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
            // You can now send this data to a server or store it
               // --- NEW CODE ---
                // Redirect to the new chat page
                window.location.href = 'chat.html';
                // --- END NEW CODE ---

        } else {
            // Move to the next step
            if (currentStep < updateTotalSteps - 1) {
                currentStep++;
                // If the next step is the summary, generate it
                if (currentStep === updateTotalSteps - 1) { // Adjusted the index for summary generation
                    generateSummary();
                }
                updateFormSteps();
            }
        }
    });

    // "Back" button click handler
    backBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateFormSteps();
        }
    });

    // Function to generate the summary
    const generateSummary = () => {
        const summaryContent = document.getElementById('summary-content');
        const formData = new FormData(form);
        
        let summaryHTML = `<h4>${formData.get('personaName') || 'Unnamed Persona'}</h4>`;
        
        summaryHTML += `
            <p><strong>Core Drive (Goals):</strong> ${formData.get('goal-setting')}</p>
            <p><strong>Core Drive (Problem Solving):</strong> ${formData.get('problem-solving')}</p>
            <p><strong>Tone (Analytical):</strong> ${formData.get('tone-analytical')}</p>
            <p><strong>Tone (Supportive):</strong> ${formData.get('tone-supportive')}</p>
        `;

        summaryContent.innerHTML = summaryHTML;
    };


    // Initialize the form view
    updateFormSteps();
});
