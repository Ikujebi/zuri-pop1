import React, { useState, useRef, useEffect } from 'react';
import RecordRTC from 'recordrtc';
import PopupNav from '../components/PopupNav';
import fullscreen from '../images/Frame 4592.png'
import currenttab from '../images/Frame 4593.png'
import videoCamera from '../images/video-camera.png'
import microphone from '../images/microphone.png'
import Switch from "react-switch";
import 'whatwg-fetch';
import axios from 'axios'


const ScreenRecorder = () => {
  const [isRecording, setRecording] = useState(false);
  const [videoCount, setVideoCount] = useState(0);
  const [isFullscreenActive, setFullscreenActive] = useState(false);
  const [isCurrenttabActive, setCurrenttabActive] = useState(false);

  const [videoConstraints, setVideoConstraints] = useState({ video: { mediaSource: 'screen' } });
  const [audioConstraints, setAudioConstraints] = useState({ audio: true });

  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const fullscreenRef = useRef();
  const fullscreenActiveRef = useRef();
  const currenttabActiveRef = useRef();
  const currenttabRef = useRef();

  const handleFullscreenClick = () => {
    setFullscreenActive((prevState) => !prevState);
    setCurrenttabActive((prevState) => !prevState);
    console.log('Switched fullscreen');
  };

  const handleCurrenttabClick = () => {
    setCurrenttabActive((prevState) => !prevState);
    setFullscreenActive((prevState) => !prevState);
    console.log('Switched currenttab');
  };

  const startRecording = async () => {
    try {
      const constraints = {
        video: videoConstraints,
        audio: audioConstraints,
      };
      setVideoCount((prevCount) => prevCount + 1);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
      }

      mediaRecorderRef.current = new RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/mp4',
      });

      mediaRecorderRef.current.startRecording();

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.tabs.executeScript(activeTab.id, { file: 'content.js' });
      });
      chrome.runtime.sendMessage({ action: 'startRecording' });
      setRecording(true);
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };


  const stopRecording = async () => {
    try {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stopRecording(async () => {
          // Get the recorded video as a blob array
          const recordedChunks = mediaRecorderRef.current.getBlob();
          recordedChunks.forEach(async (blob, index) => {
            console.log(`Blob data ${index}:`, blob);
  
            // Save the recorded video as a file
            saveFile(blob);
  
            // Create a FormData object to send the blob as a file
            const formData = new FormData();
            formData.append('video', blob, `recorded-video-${index}.mp4`);
            formData.append('uploadKey', `ayanfe${videoCount}-${index}`); // Replace with your actual upload key
  
            try {
              // Use Axios to send the recorded video to the endpoint
              const response = await axios.post('https://blue-alert-caiman.cyclic.cloud/api/video/startUpload', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
  
              if (response.status === 200) {
                console.log('Video successfully sent to the endpoint');
              } else {
                console.error('Error sending video to the endpoint:', response.statusText);
              }
  
              // Handle response or perform other actions
              // ...
  
            } catch (error) {
              console.error('Error sending video to the endpoint:', error);
            }
          });
  
          // Open the recorded video in a new tab (assuming there's only one blob)
          const url = URL.createObjectURL(recordedChunks[0]);
          window.open(url, '_blank');
  
          // Additional cleanup and messaging if needed
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            chrome.tabs.executeScript(activeTab.id, { code: 'document.body.removeChild(document.querySelector("#recordingMessageContainer"))' });
          });
  
          chrome.runtime.sendMessage({ action: 'stopRecording' });
          setRecording(false);
        });
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };
  



  useEffect(() => {
    // Your existing code for color transformation
    // ...

    applyColorTransformation(fullscreenRef, [146, 143, 171]);
    applyColorTransformation(fullscreenActiveRef, [18, 11, 72]);
  }, []);

  useEffect(() => {
    // Your existing code for color transformation
    // ...

    applyColorTransformation(currenttabActiveRef, [146, 143, 171]);
    applyColorTransformation(currenttabRef, [18, 11, 72]);
  }, []);

  const applyColorTransformation = (imageRef, color) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        data[i] = color[0]; // Red
        data[i + 1] = color[1]; // Green
        data[i + 2] = color[2]; // Blue
      }

      ctx.putImageData(imageData, 0, 0);

      imageRef.current.src = canvas.toDataURL();
    };

    image.src = imageRef.current.src;
  };

  const handleCameraChange = (isChecked) => {
    setVideoConstraints({ video: isChecked ? { mediaSource: 'screen' } : false });
  };

  const handleAudioChange = (isChecked) => {
    setAudioConstraints({ audio: isChecked });
  };


  return (
    <div>
      <PopupNav />
      <div className=' flex flex-col items-center text-[#413C6D]'>
        <h1>This extension helps you record</h1>
        <h1>and share help videos with ease.</h1>
      </div>
      <div className='flex items-center justify-center mt-6 gap-3'>
        <div className='flex items-center justify-center mt-6 gap-3'>
          <img
            ref={fullscreenActiveRef}
            alt="Current Tab"
            style={{ display: isFullscreenActive ? 'block' : 'none' }}
            onClick={handleFullscreenClick}
          />
          <img
            ref={fullscreenRef}
            alt="Fullscreen"
            style={{ display: isFullscreenActive ? 'none' : 'block' }}
            onClick={handleFullscreenClick}
          />
        </div>
        <div className='flex items-center justify-center mt-6 gap-3'>
          <img
            ref={currenttabActiveRef}
            alt="Current Tab"
            style={{ display: isCurrenttabActive ? 'block' : 'none' }}
            onClick={handleCurrenttabClick}
          />
          <img
            ref={currenttabRef}
            alt="Fullscreen"
            style={{ display: isCurrenttabActive ? 'none' : 'block' }}
            onClick={handleCurrenttabClick}
          />
        </div>
      </div>


      <div className='w-full'>
        <section className='flex  justify-between mt-6 px-7 h-[3rem] border-[1px] mx-[1.7rem] rounded-lg'>
          <div className='flex items-center justify-center  gap-1'>
            <img src={videoCamera} alt="videoCamera" />
            <h3 >Camera</h3>
          </div>
          <div className='mt-3'>
            <Switch uncheckedIcon={false}
              onColor="#120B48"
              offColor="#120B48"
              onChange={handleCameraChange}
              checkedIcon={false}
              checked={videoConstraints.video}
            />
          </div>

        </section>
        <section className='flex  justify-between h-[3rem] mt-6 px-5 gap-3 border-[1px] mx-[1.7rem] rounded-lg'>
          <div className='flex items-center justify-center  gap-1'>
            <img src={microphone} alt="videoCamera" />
            <h3>Audio</h3>
          </div>
          <div className='mt-3'>
            <Switch uncheckedIcon={false}
              onColor="#120B48"
              offColor="#120B48"
              onChange={handleAudioChange}
              checkedIcon={false}
              checked={audioConstraints.audio} />

          </div>

        </section>

      </div>


      <div className=' w-full flex items-center mt-[8rem] justify-center  rounded-lg   text-white'>
        <button className=' w-[93.53%] flex items-center justify-center  rounded-lg py-2 bg-[#120B48] text-white' onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
    </div>
  );
};

export default ScreenRecorder;
