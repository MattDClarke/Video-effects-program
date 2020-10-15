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
  mainHeader,
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
let width;
let height;
// set shadow length max
const shadowWalk = 100;

export const options = {
  size: 1,
  faceWidth: 1,
  faceHeight: 1,
};

export function shadow(e) {
  const { offsetWidth: Current, offsetHeight: heightCurrent } = mainHeader;
  let { offsetX: x, offsetY: y } = e;
  // need to normalize co-ords.. if hover over h1 child... co-ords start at (0,0) again
  if (this !== e.target) {
    x += e.target.offsetLeft;
    y += e.target.offsetTop;
  }
  // how far should the text shadow go? - keep it within half the walk range (+ and -)
  const xWalk = Math.round((x / Current) * shadowWalk - shadowWalk / 2);
  const yWalk = Math.round((y / heightCurrent) * shadowWalk - shadowWalk / 2);
  mainHeader.style.textShadow = `
    ${xWalk}px ${yWalk}px 0 rgba(255, 42, 10, 0.7),
    ${xWalk * -8}px ${yWalk}px 0 rgba(10, 255, 30, 0.7),
    ${yWalk * -1}px ${xWalk}px 0 rgba(10, 10, 255, 0.7),
    ${yWalk}px ${xWalk * -1}px 0 rgba(142, 98, 255)
    `;
}

export function shadowRemove() {
  mainHeader.style.textShadow = 'none';
}

// take frame from the video and paint it to the canvas
export function paintToCanvas() {
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
    faceCensorInputsContainer.classList.add('open');
    fileUpload.classList.add('open');
    faceCensor = true;
    detect();
  } else {
    faceCensor = false;
    faceCensorInputsContainer.classList.remove('open');
    fileUpload.classList.remove('open');
  }
}

export function handleOpacity(e) {
  opacity = e.currentTarget.value;
}

export function handleVideoEffect(e) {
  videoEffect = e.target.value;
  if (videoEffect === 'greenScreen') {
    rgbContainer.classList.add('open');
  } else {
    rgbContainer.classList.remove('open');
  }
}

export function handleCensorOptions(event) {
  const { value, name } = event.currentTarget;
  options[name] = parseFloat(value);
}

export function handleResize() {
  width = parseInt(window.getComputedStyle(video).width, 10);
  height = parseInt(window.getComputedStyle(video).height, 10);
  canvas.width = width;
  canvas.height = height;
}

// *********************************************** photo strip drag and scroll *********************************************** //

let isDown = false;
// inital click down
let startX;
// initial scroll pos
let scrollLeft;

export function handleScrollStart(e) {
  isDown = true;
  strip.classList.add('active');
  // - margin if there is
  startX = e.pageX - strip.offsetLeft;
  // store in var cause u need initial state
  scrollLeft = strip.scrollLeft;
}

export function handleScroll(e) {
  if (!isDown) return; // stop the fn from running
  // prevents text highlighting
  e.preventDefault();
  // new x pos
  const x = e.pageX - strip.offsetLeft;
  // console.log({ x, startX });
  // mouse movement along x (relative to starting pos (when mouse clicked))
  const walk = (x - startX) * 3;
  // reference captured variable (scrollLeft) so that it is not recalc on each mouse move
  strip.scrollLeft = scrollLeft - walk;
}

export function handleScrollStop() {
  isDown = false;
  strip.classList.remove('active');
}
