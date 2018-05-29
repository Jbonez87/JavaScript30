const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const photoBtn = document.querySelector('.green');

function getVideo() {
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  })
  .then(localMediaStream => {
    console.log(localMediaStream);
    try {
      video.srcObject = localMediaStream;
    } catch (error) {
      video.src = window.URL.createObjectURL(localMediaStream);
    }
    video.play();
  })
  .catch(err => console.error(err))
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  console.log(width, height);
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    // console.log(pixels);
    // mess with them
    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.1;
    pixels = greenScreen(pixels);
    // put the pixels back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // makes the camera sound
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', `selfie-${Math.floor(Math.random() * 100)}`);
  // link.textContent = 'Download Image';
  link.innerHTML = `<img src="${data}" alt="selfie">`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(px) {
  for(let i = 0; i < px.data.length; i+=4) {
    px.data[i + 0] = px.data[i + 0] + 130; // r
    px.data[i + 1] = px.data[i + 1] - 65; // g
    px.data[i + 2] = px.data[i + 2] * 0.4; // b
  }
  return px;
}

function rgbSplit(px) {
  for (let i = 0; i < px.data.length; i += 4) {
    px.data[i - 150] = px.data[i + 0]; // r
    px.data[i + 500] = px.data[i + 1]; // g
    px.data[i - 550] = px.data[i + 2]; // b
  }
  return px;
}

function greenScreen(px) {
  const levels = {};

  for (const input of document.querySelectorAll('.rgb input')) {
    levels[input.name] = input.value;
  }

  for (let i = 0; i < px.data.length; i += 4) {
    red = px.data[i + 0];
    green = px.data[i + 1];
    blue = px.data[i + 2];
    alpha = px.data[i + 3];

    if (red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax) {
      // take it out!
      px.data[i + 3] = 0;
    }
  }
  return px;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
photoBtn.addEventListener('click', takePhoto);
