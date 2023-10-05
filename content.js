// content.js

// Create a container for the recording message
const messageContainer = document.createElement('div');
messageContainer.style.position = 'fixed';
messageContainer.style.bottom = '0';
messageContainer.style.left = '0';
messageContainer.style.width = '100%';
messageContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
messageContainer.style.padding = '10px';
messageContainer.style.textAlign = 'center';

// Create a text element to display the recording message
const messageText = document.createElement('p');
messageText.innerText = 'Screen recording in progress...';

// Create a button to stop the recording
const stopButton = document.createElement('button');
stopButton.innerText = 'Stop Recording';
stopButton.addEventListener('click', () => {
  // Logic to stop the recording and perform any necessary cleanup
  chrome.runtime.sendMessage({ action: 'stopRecording' });
});

// Append elements to the container
messageContainer.appendChild(messageText);
messageContainer.appendChild(stopButton);

// Append the container to the body of the page
document.body.appendChild(messageContainer);
