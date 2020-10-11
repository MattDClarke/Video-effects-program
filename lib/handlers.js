import {
  video,
  canvas,
  ctx,
  strip,
  snap,
  fileDisplay,
  rgbContainer,
  faceCensorInputsContainer,
  fileUpload,
} from './elements';

import {
  redEffect,
  greenEffect,
  blueEffect,
  rgbSplit,
  greenScreen,
  drawFace,
} from './lib';

const faceDetector = new window.FaceDetector(); // API - Chrome/ Safari..

// defaults
let faceCensor = false;
let videoEffect = 'none';
let opacity = 1;

export const options = {
  size: 1,
  faceWidth: 1,
  faceHeight: 1,
};

// take frame from the video and paint it to the canvas
export function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  // width increased to 100% using css
  let pixels;

  // return because -> can stop painting -> have access
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // huge array of rbga pixel values
    // take the pixels out of the canvas
    pixels = ctx.getImageData(0, 0, width, height);

    if (videoEffect === 'redEffect') {
      pixels = redEffect(pixels);
    }
    if (videoEffect === 'greenEffect') {
      pixels = greenEffect(pixels);
    }
    if (videoEffect === 'blueEffect') {
      pixels = blueEffect(pixels);
    }
    if (videoEffect === 'rgbSplit') {
      pixels = rgbSplit(pixels);
    }
    if (videoEffect === 'greenScreen') {
      pixels = greenScreen(pixels);
    }

    // shows previous images when opacity < 1 (images stacked)
    ctx.globalAlpha = opacity;

    // put them back into canvas
    ctx.putImageData(pixels, 0, 0);
  }, 150);
}

export async function detect() {
  // await a face detection
  const faces = await faceDetector.detect(video);
  // console.log(faces.length); // how many faces detected
  // ask the browser when the next animation frame is and tell it to run detect for us
  faces.forEach(face => drawFace(face, faceCensor));
  requestAnimationFrame(detect);
}

export function takePhoto() {
  // play sound
  // reset time to 0 each time
  snap.currentTime = 0;
  snap.play();

  // take the data out of the canvas
  // stored as text (base64)
  const data = canvas.toDataURL('image/jpeg');
  // create a download link
  const link = document.createElement('a');
  // browser can interpret base64 image text in url as an image -> it will display it
  link.href = data;
  link.setAttribute('download', 'My Photo');
  // show the image in the img strip
  link.innerHTML = `<img src="${data}" alt="My Photo">`;
  strip.insertAdjacentElement('beforeend', link);
}

export function handleFiles() {
  if (!this.files.length) {
    fileDisplay.innerHTML = '<p>No files selected!</p>';
  } else {
    fileDisplay.innerHTML = '';
    const img = document.createElement('img');
    img.src = URL.createObjectURL(this.files[0]);
    img.height = 60;
    img.onload = function() {
      URL.revokeObjectURL(this.src);
    };
    fileDisplay.appendChild(img);
  }
}

export function handleCensorCheckbox() {
  if (this.checked === true) {
    faceCensorInputsContainer.style.display = 'block';
    fileUpload.style.display = 'block';
    faceCensor = true;
    detect();
  } else {
    faceCensor = false;
    faceCensorInputsContainer.style.display = 'none';
    fileUpload.style.display = 'none';
  }
}

export function handleOpacity(e) {
  opacity = e.currentTarget.value;
}

export function handleVideoEffect(e) {
  videoEffect = e.target.value;
  if (videoEffect === 'greenScreen') {
    rgbContainer.style.display = 'block';
  } else {
    rgbContainer.style.display = 'none';
  }
}

export function handleCensorOptions(event) {
  const { value, name } = event.currentTarget;
  options[name] = parseFloat(value);
}
