import {
  video,
  takePhotoBtn,
  fileSelect,
  fileElem,
  faceCensor,
  optionsInputsFaceCensor,
  inputVideoEffect,
  opacityEffect,
  strip,
  stripHeading,
  mainHeader,
} from './lib/elements';

import {
  takePhoto,
  paintToCanvas,
  handleFiles,
  handleCensorCheckbox,
  handleOpacity,
  handleCensorOptions,
  handleVideoEffect,
  handleResize,
  handleScrollStart,
  handleScroll,
  handleScrollStop,
  shadow,
  shadowRemove,
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

mainHeader.addEventListener('mousemove', shadow);
mainHeader.addEventListener('mouseleave', shadowRemove);
takePhotoBtn.addEventListener('click', takePhoto);
takePhotoBtn.addEventListener(
  'click',
  () => {
    stripHeading.classList.add('open');
  },
  { once: true }
);

video.addEventListener('canplay', paintToCanvas);
video.addEventListener('canplay', handleResize);
video.addEventListener('canplay', () => {
  faceCensor.disabled = false;
  takePhotoBtn.disabled = false;
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

strip.addEventListener('mousedown', handleScrollStart);
strip.addEventListener('mousemove', handleScroll);
strip.addEventListener('mouseup', handleScrollStop);
strip.addEventListener('mouseleave', handleScrollStop);

window.addEventListener('resize', handleResize);
