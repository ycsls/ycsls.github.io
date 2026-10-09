'use strict';
const heroBackground = document.querySelector('.hero-background');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if (heroBackground) {
  const syncHeroPlayback = () => {
    if (motionPreference.matches) {
      heroBackground.pause();
      return;
    }
    heroBackground.play().catch(() => {});
  };
  syncHeroPlayback();
  motionPreference.addEventListener('change', syncHeroPlayback);
}

const player = document.querySelector('.reel-player');
// The showreel starts only while visible and motion is allowed.

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
    // Autoplay can still be blocked by browser or device settings.
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


// Preview a local placeholder image for each specialty on hover, focus, or tap.
const clientsBackground = document.querySelector('.clients-background');
const specialtyButtons = [...document.querySelectorAll('.specialty-button')];
if (clientsBackground && specialtyButtons.length) {
  const selectSpecialty = (button) => {
    clientsBackground.style.backgroundPosition = button.dataset.position;
    for (const item of specialtyButtons) {
      item.setAttribute('aria-pressed', String(item === button));
    }
  };
  for (const button of specialtyButtons) {
    button.addEventListener('pointerenter', () => selectSpecialty(button));
    button.addEventListener('focus', () => selectSpecialty(button));
    button.addEventListener('click', () => selectSpecialty(button));
  }
}
