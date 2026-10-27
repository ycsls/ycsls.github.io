const screens=[...document.querySelectorAll('.screen')], root=document.querySelector('main'), links=[...document.querySelectorAll('.rail a')];
let active=0;
function renderMotion(){screens.forEach((screen,i)=>screen.querySelectorAll('video').forEach(video=>{video.muted=true;if(i===active)video.play().catch(()=>{});else video.pause()}))}
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){active=screens.indexOf(entry.target);links.forEach((a,i)=>{a.classList.toggle('active',i===active);if(i===active)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')});renderMotion()}}),{root,threshold:.65});screens.forEach(s=>observer.observe(s));
document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||e.target.closest('button,a'))return;if(['ArrowDown','PageDown','ArrowUp','PageUp','Home','End'].includes(e.key)){e.preventDefault();let n=e.key==='Home'?0:e.key==='End'?screens.length-1:Math.max(0,Math.min(screens.length-1,active+(['ArrowDown','PageDown'].includes(e.key)?1:-1)));screens[n].scrollIntoView({behavior:'smooth'})}});
const dialog=document.querySelector('#about');document.querySelector('#about-open').addEventListener('click',()=>dialog.showModal());document.querySelector('#about-close').addEventListener('click',()=>dialog.close());
// Keep the sharp window and its diffused background on the same frame.
setInterval(()=>{const pair=screens[active].querySelectorAll('video');if(pair.length===2&&Math.abs(pair[0].currentTime-pair[1].currentTime)>.3)pair[0].currentTime=pair[1].currentTime},1000);
renderMotion();

// Two steady sentence cards, switching only at the midpoint of the silent video loop.
const headerVideo=document.querySelector('.intro .backdrop');
const caption=document.querySelector('.spoken-caption');
const captionReader=document.querySelector('#caption-reader');
const spokenLines=[
  `Je m'appelle Yoann Casals, fort de 15 ans d’expérience entre rédactions, sociétés de post-production, studios de tournage et agences de communication,`,
  `j’aide les marques, les créateurs de contenu, les coachs et les agences à transformer leurs idées en quelque chose que leur audience voudra voir et entendre.`
];
let currentCaption=-1, captionSwap=0;
function updateCaption(){
  if(!headerVideo||!caption||!Number.isFinite(headerVideo.duration)||headerVideo.duration<=0)return;
  const next=Math.floor((headerVideo.currentTime%headerVideo.duration)/(headerVideo.duration/2));
  if(next===currentCaption)return;
  currentCaption=next;
  caption.classList.remove('is-visible');
  window.clearTimeout(captionSwap);
  captionSwap=window.setTimeout(()=>{
    caption.textContent=spokenLines[next];
    captionReader.textContent=spokenLines[next];
    requestAnimationFrame(()=>caption.classList.add('is-visible'));
  },180);
}
headerVideo?.addEventListener('timeupdate',updateCaption);
headerVideo?.addEventListener('seeked',updateCaption);
headerVideo?.addEventListener('loadedmetadata',updateCaption);

// Load the official player API only when a preview is requested.
let youtubeApiPromise;
function loadYouTubeApi(){
  if(window.YT?.Player)return Promise.resolve(window.YT);
  if(!youtubeApiPromise)youtubeApiPromise=new Promise((resolve,reject)=>{
    const previous=window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady=()=>{previous?.();resolve(window.YT)};
    const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';
    script.onerror=()=>{youtubeApiPromise=null;reject(new Error('Player unavailable'))};document.head.append(script);
  });
  return youtubeApiPromise;
}
// Native snap scrolling supports touch; each playlist carousel also has buttons and mouse dragging.
document.querySelectorAll('.essay-carousel').forEach(carousel=>{
  const track=carousel.querySelector('.essay-track');
  if(!track)return;
  const cards=[...track.querySelectorAll('.essay-card')];
  const canHover=window.matchMedia('(hover: hover) and (pointer: fine)');
  const previews=new Map();
  const stopPreview=card=>{
    const state=previews.get(card);if(!state)return;
    state.cancelled=true;clearTimeout(state.reveal);state.player?.destroy();state.wrapper?.remove();
    previews.delete(card);card.classList.remove('is-previewing');
  };
  const visibility=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)stopPreview(entry.target)}));
  cards.forEach(card=>{
    visibility.observe(card);
    card.addEventListener('pointerenter',async()=>{
      if(!canHover.matches||!card.hasAttribute('href')||previews.has(card))return;
      const image=card.querySelector('.essay-image');
      const videoId=new URL(card.href).searchParams.get('v');
      if(!image||!videoId)return;
      const state={cancelled:false};previews.set(card,state);
      try{
        const YT=await loadYouTubeApi();if(state.cancelled)return;
        const wrapper=document.createElement('span');wrapper.className='essay-preview';wrapper.setAttribute('aria-hidden','true');
        const mount=document.createElement('span');wrapper.append(mount);image.append(wrapper);state.wrapper=wrapper;
        state.player=new YT.Player(mount,{host:'https://www.youtube-nocookie.com',videoId,
          playerVars:{autoplay:1,mute:1,controls:0,fs:0,disablekb:1,loop:1,playlist:videoId,playsinline:1,rel:0,origin:location.origin},
          events:{onReady:event=>{if(state.cancelled)return;event.target.mute();event.target.getIframe().tabIndex=-1;event.target.playVideo()},
            onStateChange:event=>{if(state.cancelled)return;if(event.data===YT.PlayerState.PLAYING){clearTimeout(state.reveal);state.reveal=setTimeout(()=>{if(!state.cancelled){wrapper.classList.add('is-ready');card.classList.add('is-previewing')}},2000)}},
            onError:()=>stopPreview(card)}
        });
      }catch{stopPreview(card)}
    });
    card.addEventListener('pointerleave',()=>stopPreview(card));
    card.addEventListener('focusout',event=>{if(!card.contains(event.relatedTarget))stopPreview(card)});
  });
  const moveByCard=direction=>{const card=cards[0];if(card)track.scrollBy({left:direction*(card.getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap||0)),behavior:'smooth'})};
  carousel.querySelector('.essay-prev')?.addEventListener('click',()=>moveByCard(-1));
  carousel.querySelector('.essay-next')?.addEventListener('click',()=>moveByCard(1));
  let dragging=false,startX=0,startScroll=0,moved=false;
  track.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse'||event.button!==0)return;dragging=true;moved=false;startX=event.clientX;startScroll=track.scrollLeft;track.classList.add('is-dragging')});
  window.addEventListener('pointermove',event=>{if(!dragging)return;const delta=event.clientX-startX;if(Math.abs(delta)>5){moved=true;event.preventDefault()}if(moved)track.scrollLeft=startScroll-delta},{passive:false});
  window.addEventListener('pointerup',()=>{if(!dragging)return;dragging=false;track.classList.remove('is-dragging');if(moved){const cancel=event=>{event.preventDefault();event.stopPropagation();track.removeEventListener('click',cancel,true)};track.addEventListener('click',cancel,true);window.setTimeout(()=>track.removeEventListener('click',cancel,true),100)}});
  track.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();moveByCard(1)}if(event.key==='ArrowLeft'){event.preventDefault();moveByCard(-1)}});
});
