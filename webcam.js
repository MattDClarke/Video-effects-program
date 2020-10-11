import {
  video,
  takePhotoBtn,
  fileSelect,
  fileElem,
  faceCensor,
  optionsInputsFaceCensor,
  inputVideoEffect,
  opacityEffect,
} from './lib/elements';

import {
  takePhoto,
  paintToCanvas,
  handleFiles,
  handleCensorCheckbox,
  handleOpacity,
  handleCensorOptions,
  handleVideoEffect,
} from './lib/handlers';

function getVideo() {
  // navigator is an object that is an interface, the mediaDevices obj can be used to get info about media devices
  navigator.mediaDevices
    // request access to media
    .getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(err => {
      console.error(
        'Oh no! Request to access webcam video stream failed.',
        err
      );
    });
}

getVideo();

takePhotoBtn.addEventListener('click', takePhoto);
video.addEventListener('canplay', paintToCanvas);
video.addEventListener('canplay', () => {
  faceCensor.disabled = false;
});

fileSelect.addEventListener(
  'click',
  function(e) {
    if (fileElem) {
      fileElem.click();
    }
    e.preventDefault(); // prevent navigation to "#"
  },
  false
);

fileElem.addEventListener('change', handleFiles, false);

faceCensor.addEventListener('click', handleCensorCheckbox);

optionsInputsFaceCensor.forEach(input =>
  input.addEventListener('input', handleCensorOptions)
);

inputVideoEffect.forEach(input =>
  input.addEventListener('input', handleVideoEffect)
);

opacityEffect.addEventListener('input', handleOpacity);
