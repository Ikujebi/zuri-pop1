let isRecording = false;
let mediaStream = null;
let recordRTC = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startRecording' && !isRecording) {
    requestRecordingPermissions(startRecording);
  } else if (message.action === 'stopRecording' && isRecording) {
    stopRecording();
  }
});

function requestRecordingPermissions(callback) {
  const permissions = {
    video: true,
    audio: true,
  };

  chrome.permissions.request({ permissions }, (granted) => {
    if (granted) {
      // Permissions granted, proceed with recording
      callback();
    } else {
      console.error('Permissions not granted. Recording cannot start.');
    }
  });
}

async function startRecording() {
  try {
    const constraints = {
      video: true,
      audio: true,
    };

    mediaStream = await navigator.mediaDevices.getDisplayMedia(constraints);

    // Create a RecordRTC instance
    recordRTC = RecordRTC(mediaStream, {
      type: 'video',
      mimeType: 'video/webm', // Adjust mimeType as needed
    });

    // Start recording
    recordRTC.startRecording();

    isRecording = true;
  } catch (error) {
    console.error('Error starting recording:', error);
  }
}

async function stopRecording() {
  try {
    if (recordRTC) {
      // Stop recording
      recordRTC.stopRecording(() => {
        // Get the recorded data (blob)
        const recordedBlob = recordRTC.getBlob();
        console.log('Recorded Blob:', recordedBlob);

        // Handle the recorded data as needed, e.g., save to a file or send to server
        // ...

        // Reset variables
        isRecording = false;
        mediaStream = null;
        recordRTC = null;
      });
    }
  } catch (error) {
    console.error('Error stopping recording:', error);
  }
}
