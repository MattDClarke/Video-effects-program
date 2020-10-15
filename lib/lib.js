import { ctx, fileDisplay } from './elements';

import { options } from './handlers';

// can play around with these values for different effects
export function redEffect(pixels) {
  // loop over every pixel that you have (rgba (4 array elements))
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // red array element
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
  }
  return pixels;
}

export function greenEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] - 50; // red
    pixels.data[i + 1] = pixels.data[i + 1] + 100; // green
    pixels.data[i + 2] = pixels.data[i + 2] - 50; // blue
  }
  return pixels;
}

export function blueEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] - 50; // red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    pixels.data[i + 2] = pixels.data[i + 2] + 100; // blue
  }
  return pixels;
}

export function greenScreen(pixels) {
  // inputs from range input sliders
  // will hold min and max green... and for red and blue...
  // for green screen -> find range of colors and take them out
  const levels = {};

  document.querySelectorAll('.rgb input').forEach(input => {
    levels[input.name] = input.value;
  });

  // first figure out which array elements in the canvas are red, green, blue
  for (let i = 0; i < pixels.data.length; i += 4) {
    const red = pixels.data[i + 0];
    const green = pixels.data[i + 1];
    const blue = pixels.data[i + 2];

    // if the r,g,b values are btn the min and max values...
    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      // the 4th pixel is the transparency pixel ... set to zero
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}

// can play around with these values for different effects
// shifting pos of r,g,b pixels
export function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 1500] = pixels.data[i + 0]; // red array elements
    pixels.data[i + 500] = pixels.data[i + 1]; // green
    pixels.data[i - 650] = pixels.data[i + 2]; // blue
  }
  return pixels;
}

// *********************************************** face detection *********************************************** //

export async function drawFace(face, faceCensor) {
  if (faceCensor === false) {
    return;
  }
  const { width, height, top, left } = face.boundingBox;
  // ctx.strokeRect(left, top, width, height);
  // ctx.strokeStyle = '#5af542';
  const overlayImg = fileDisplay.querySelector('img');
  if (overlayImg) {
    const newWidth = width * options.size * options.faceWidth;
    const newHeight = height * options.size * options.faceHeight;
    const newLeft = left - width * options.faceWidth + width * options.size;
    const newTop = top - height * options.faceHeight + height * options.size;
    ctx.drawImage(overlayImg, newLeft, newTop, newWidth, newHeight);
  }
}
