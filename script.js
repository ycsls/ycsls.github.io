'use strict';
const form = document.querySelector('#contact-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const subject = `Project enquiry from ${data.get('name')}`;
  const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`;
  window.location.href = `mailto:yoanncasals@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const playerShell = document.querySelector('.player-shell');
const player = document.querySelector('.reel-player');
const fullscreenButton = document.querySelector('#fullscreen-button');
fullscreenButton.addEventListener('click', async () => {
  if (document.fullscreenElement) await document.exitFullscreen();
  else if (playerShell.requestFullscreen) await playerShell.requestFullscreen();
  else if (player.webkitEnterFullscreen) player.webkitEnterFullscreen();
});
document.addEventListener('fullscreenchange', () => {
  const fullscreen = Boolean(document.fullscreenElement);
  fullscreenButton.setAttribute('aria-label', fullscreen ? 'Exit full screen' : 'Enter full screen');
  fullscreenButton.innerHTML = fullscreen ? 'EXIT FULL SCREEN <span aria-hidden="true">↙</span>' : 'FULL SCREEN <span aria-hidden="true">↗</span>';
});

// Autoplay only when motion is allowed and the reel is on screen.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
player.muted = true;
player.loop = !motionPreference.matches;
let reelVisible = false;
async function syncReelPlayback() {
  if (motionPreference.matches || !reelVisible) {
    player.pause();
    return;
  }
  try {
    await player.play();
  } catch {
    // Autoplay can still be blocked by browser or device settings; native controls remain available.
  }
}
const reelObserver = new IntersectionObserver(([entry]) => {
  reelVisible = entry.isIntersecting && entry.intersectionRatio >= 0.4;
  syncReelPlayback();
}, { threshold: [0, 0.4, 1] });
reelObserver.observe(player);
motionPreference.addEventListener('change', () => {
  player.loop = !motionPreference.matches;
  syncReelPlayback();
});
