'use strict';
const form = document.querySelector('#contact-form');

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

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const subject = `Project enquiry from ${data.get('name')}`;
  const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`;
  window.location.href = `mailto:yoanncasals@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

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
