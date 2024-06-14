document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('chat-form');
    const chatBox = document.getElementById('chat-box');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const userInput = document.getElementById('user_input').value;
        handleUserInput(userInput);
    });

    function handleUserInput(userInput) {
        const userMessage = document.createElement('p');
        userMessage.innerHTML = `<strong>You:</strong> ${userInput}`;
        chatBox.appendChild(userMessage);

        const typingIndicator = document.createElement('p');
        typingIndicator.innerHTML = `<em>Bot is typing...</em>`;
        chatBox.appendChild(typingIndicator);

        chatBox.scrollTop = chatBox.scrollHeight;  // Auto-scroll to the bottom

        fetch('/get_response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_input: userInput })
        })
        .then(response => response.json())
        .then(data => {
            setTimeout(() => {
                chatBox.removeChild(typingIndicator);  // Remove typing indicator
                const botMessage = document.createElement('p');
                botMessage.innerHTML = `<strong>Bot:</strong> `;
                chatBox.appendChild(botMessage);

                typeResponse(botMessage, data.response, 30, () => {  // Adjust the delay to 30ms and add callback
                    if (data.suggestions && data.suggestions.length > 0) {
                        const suggestionsMessage = document.createElement('div');
                        suggestionsMessage.innerHTML = `<strong>Suggestions:</strong>`;
                        const suggestionsList = document.createElement('ul');
                        data.suggestions.forEach(suggestion => {
                            const suggestionItem = document.createElement('li');
                            suggestionItem.textContent = suggestion;
                            suggestionItem.classList.add('clickable-suggestion');
                            suggestionItem.addEventListener('click', () => {
                                handleUserInput(suggestion);  // Handle the suggestion click
                            });
                            suggestionsList.appendChild(suggestionItem);
                        });
                        suggestionsMessage.appendChild(suggestionsList);
                        chatBox.appendChild(suggestionsMessage);
                    }

                    chatBox.scrollTop = chatBox.scrollHeight;  // Ensure scroll to bottom after suggestions are shown
                });
            }, 500); // Adjust initial delay before typing starts
        });

        form.reset();
    }

    function typeResponse(element, text, delay, callback) {
        let i = 0;
        function typeLetter() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeLetter, delay);
            } else {
                chatBox.scrollTop = chatBox.scrollHeight;  // Ensure scroll to bottom after typing is complete
                if (callback) callback();  // Call the callback function after typing is complete
            }
        }
        typeLetter();
    }
});
