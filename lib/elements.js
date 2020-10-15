export const mainHeader = document.querySelector('.main-header');
export const video = document.querySelector('.player');
export const canvas = document.querySelector('.photo');
export const ctx = canvas.getContext('2d');
export const strip = document.querySelector('.strip');
export const stripHeading = document.querySelector('.strip-heading');
export const snap = document.querySelector('.snap');
export const takePhotoBtn = document.querySelector('.take-photo');

export const faceCensorInputsContainer = document.querySelector(
  '.face-controls'
);
export const optionsInputsFaceCensor = document.querySelectorAll(
  '.face-controls input[type="range"]'
);
export const faceCensor = document.querySelector(
  '.controls input[name = "face-censor"]'
);

export const rgbContainer = document.querySelector('.rgb');
export const inputVideoEffect = document.querySelectorAll(
  '.video-effects input[type="radio"]'
);
export const opacityEffect = document.querySelector(
  '.video-effects input[type="range"]'
);

export const fileUpload = document.querySelector('.file-upload');
export const fileSelect = document.getElementById('fileSelect');
export const fileElem = document.getElementById('fileElem');
export const fileDisplay = document.getElementById('fileDisplay');
