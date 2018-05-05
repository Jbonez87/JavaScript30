/* Get our elements */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const full = player.querySelector('.player__fullscreen');

/* Build our functions */
const togglePlay = () => {
  const method = video.paused ? 'play' : 'pause';
  video[method]();
  // if(video.paused) {
  //   video.play();
  // } else {
  //   video.pause();
  // }
}

const updateButton = e => {
  const icon = e.target.paused ? '►' : '❚ ❚';
  // console.log(icon);
  toggle.textContent = icon;
}

const skip = e => {
  // console.log(e.target.dataset)
  video.currentTime += parseFloat(e.target.dataset.skip);
}

const handleRangeUpdate = e => {
  // console.log(e.target.value);
  video[e.target.name] = e.target.value;
}

const handleProgress = () => {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`
}

const scrub = e => {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  // console.log(e);
  video.currentTime = scrubTime;
}

const toggleFullScreen = () => {
  if(video.requestFullscreen) {
    video.requestFullscreen();
  } else if(video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen();
  } else if(video.mozRequestFullScreen) {
    video.mozRequestFullScreen();
  } else if(video.msRequestFullscreen) {
    video.msRequestFullscreen();
  } 
}

// function requestFullScreen() {
//   if (document.fullscreenEnabled) {
//     videoElement.requestFullScreen();
//   } else {
//     console.log('Your browser cannot use fullscreen right now');
//   }
// }

/* Hook up event listeners */
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
toggle.addEventListener('click', togglePlay);
full.addEventListener('click', toggleFullScreen);
for (const skipButton of skipButtons) {
  skipButton.addEventListener('click', skip);
}
for (const range of ranges) {
  range.addEventListener('change', handleRangeUpdate);
  range.addEventListener('mousemove', handleRangeUpdate);
}
let mouseDown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', e => mouseDown && scrub(e));
progress.addEventListener('mousedown', () => mouseDown = true);
progress.addEventListener('mouseup', () => mouseDown = false);