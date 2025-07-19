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
            // --- NEW CODE ---
            // Disable the button to prevent multiple clicks
            nextBtn.disabled = true;
            nextBtn.textContent = 'Saving...';

            const formData = new FormData(form);

            // Use the Fetch API to send data to the PHP script
            fetch('save_persona.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // If saving was successful, redirect to the chat page
                    window.location.href = 'chat.html';
                } else {
                    // If there was an error, alert the user and re-enable the button
                    alert('Error: ' + data.message);
                    nextBtn.disabled = false;
                    nextBtn.textContent = 'Create Persona';
                }
            })
            .catch(error => {
                // Handle network errors
                console.error('Error:', error);
                alert('A network error occurred. Please try again.');
                nextBtn.disabled = false;
                nextBtn.textContent = 'Create Persona';
            });
            // --- END NEW CODE ---

        } else {
            // Move to the next step
            if (currentStep < updateTotalSteps - 1) {
                currentStep++;
                if (currentStep === updateTotalSteps - 1) {
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

        // Generate summary
    const generateSummary = () => {
        const summaryContent = document.getElementById('summary-content');
        const formData = new FormData(form);
        
        let summaryHTML = `<h4>${formData.get('personaName') || 'Unnamed Persona'}</h4>`;
        
        summaryHTML += `
            <p><strong>Core Drive:</strong> ${formData.get('goal-setting')}</p>
            <p><strong>Tone:</strong> ${formData.get('tone-analytical')}</p>
        `;
    
        summaryContent.innerHTML = summaryHTML;
    };


    // Initialize the form view
    updateFormSteps();
});
