// In chat.js

document.addEventListener('DOMContentLoaded', () => {
    const councilList = document.getElementById('council-members-list');

    // Array of predefined colors for avatars
    const avatarColors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6'];

    // Function to fetch personas from the server and display them
    function loadPersonas() {
        fetch('get_personas.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Clear any existing placeholders
                    councilList.innerHTML = '';

                    // Loop through the personas and add them to the sidebar
                    data.data.forEach((persona, index) => {
                        const personaElement = document.createElement('div');
                        personaElement.className = 'persona-in-chat';

                        // Cycle through the avatar colors
                        const color = avatarColors[index % avatarColors.length];

                        personaElement.innerHTML = `
                            <div class="persona-avatar" style="background-color: ${color};"></div>
                            <span class="persona-name">${persona.name}</span>
                        `;
                        councilList.appendChild(personaElement);
                    });
                } else {
                    councilList.innerHTML = '<p>Could not load personas.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching personas:', error);
                councilList.innerHTML = '<p>Error loading personas.</p>';
            });
    }

    // Load the personas when the page is ready
    loadPersonas();

    // Add logic for sending chat messages here...
    // This part would involve another fetch call to a 'save_chat.php' script.
});
