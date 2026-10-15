'use strict';

// Manual carousel: keeps the message still while it is being read.
let bannerIndex = 0;
const bannerSlides = [
  { title: 'Book your next<br><span>doctor visit.</span>', label: 'CARE THAT FITS YOUR DAY', description: 'The right specialist.<br>A little more peace of mind.', cta: 'Find your doctor', screen: 'doctors', theme: 'appointments' },
  { title: 'Care for the<br><span>whole family.</span>', label: 'FOR THE PEOPLE YOU LOVE', description: 'Separate health profiles.<br>One thoughtful place.', cta: 'Manage your family', screen: 'family', theme: 'family' },
  { title: 'Your health story,<br><span>together.</span>', label: 'YOUR RECORDS, WITH YOU', description: 'Reports and prescriptions.<br>Ready when you need them.', cta: 'View your records', screen: 'records', theme: 'records' }
];

function bannerVisual(index) {
  if (index === 0) return '<img class="banner-photo" src="assets/care-banner.jpg" alt="Fictional doctor in a bright clinic" width="1536" height="1024" fetchpriority="high" decoding="async">';
  if (index === 1) return `<div class="family-banner-art" aria-hidden="true"><span class="banner-orbit orbit-one"></span><span class="banner-orbit orbit-two"></span><span class="family-heart">${icon('heart')}</span><span class="family-profile profile-one">A<small>SELF</small></span><span class="family-profile profile-two">M<small>MOTHER</small></span><span class="family-profile profile-three">R<small>BROTHER</small></span><span class="family-art-caption">A little care. For everyone.</span></div>`;
  return `<div class="records-banner-art" aria-hidden="true"><div class="art-document back-document"></div><div class="art-document front-document"><span class="document-cross">${icon('record')}</span><span class="document-line"></span><span class="document-line short"></span><span class="document-line"></span><span class="document-line short"></span><span class="document-check">${icon('check')}</span></div><span class="floating-record-icon">${icon('prescription')}</span></div>`;
}

function bannerContent(index) {
  const slide = bannerSlides[index];
  return `${bannerVisual(index)}<div class="banner-copy"><span class="banner-label"><i></i>${slide.label}</span><h1>${slide.title}</h1><p>${slide.description}</p>${btn(slide.cta+' '+icon('arrow'),'navigate',`data-screen="${slide.screen}"`)}<span class="banner-trust">${icon('check')} A little care goes a long way.</span></div>`;
}

function careBanner() {
  return `<section class="care-banner theme-${bannerSlides[bannerIndex].theme}" role="region" aria-roledescription="carousel" aria-label="Explore your care" tabindex="0"><div class="banner-viewport">${bannerContent(bannerIndex)}</div><div class="banner-controls"><button class="plain banner-arrow" data-action="banner-prev" aria-label="Previous banner">${icon('back')}</button><div class="banner-dots" aria-label="Choose a banner">${bannerSlides.map((slide,index)=>`<button data-action="banner-slide" data-index="${index}" aria-label="${slide.cta}" aria-pressed="${index===bannerIndex}"><span></span></button>`).join('')}</div><span class="banner-count" aria-hidden="true">0${bannerIndex+1} / 03</span><button class="plain banner-arrow" data-action="banner-next" aria-label="Next banner">${icon('arrow')}</button></div><span class="visually-hidden banner-announcement" aria-live="polite"></span></section>`;
}

function showBanner(index) {
  bannerIndex = (index+bannerSlides.length)%bannerSlides.length;
  const banner = document.querySelector('.care-banner');
  if (!banner) return;
  const restoreCtaFocus = banner.querySelector('.banner-viewport').contains(document.activeElement);
  banner.className = 'care-banner theme-'+bannerSlides[bannerIndex].theme;
  banner.querySelector('.banner-viewport').innerHTML = bannerContent(bannerIndex);
  banner.querySelectorAll('.banner-dots button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===bannerIndex)));
  banner.querySelector('.banner-count').textContent = `0${bannerIndex+1} / 03`;
  banner.querySelector('.banner-announcement').textContent = `${bannerIndex+1} of 3. ${bannerSlides[bannerIndex].cta}.`;
  if (restoreCtaFocus) banner.querySelector('.banner-copy .btn').focus({preventScroll:true});
}

document.addEventListener('click',event=>{
  const button=event.target.closest('[data-action]');
  if(!button)return;
  if(button.dataset.action==='banner-next')showBanner(bannerIndex+1);
  if(button.dataset.action==='banner-prev')showBanner(bannerIndex-1);
  if(button.dataset.action==='banner-slide')showBanner(Number(button.dataset.index));
});
document.addEventListener('keydown',event=>{
  if(!event.target.closest('.care-banner')||!['ArrowLeft','ArrowRight'].includes(event.key))return;
  event.preventDefault();showBanner(bannerIndex+(event.key==='ArrowRight'?1:-1));
});
let bannerTouch=null,bannerSuppressClick=false;
document.addEventListener('click',event=>{
  if(bannerSuppressClick&&event.target.closest('.care-banner')){event.preventDefault();event.stopImmediatePropagation();bannerSuppressClick=false;}
},true);
document.addEventListener('pointerdown',event=>{
  bannerTouch=event.pointerType==='touch'&&event.target.closest('.care-banner')?{x:event.clientX,y:event.clientY}:null;
},{passive:true});
document.addEventListener('pointerup',event=>{
  if(!bannerTouch)return;
  const dx=event.clientX-bannerTouch.x,dy=event.clientY-bannerTouch.y;
  if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5){showBanner(bannerIndex+(dx<0?1:-1));bannerSuppressClick=true;setTimeout(()=>bannerSuppressClick=false,400);}
  bannerTouch=null;
},{passive:true});
document.addEventListener('pointercancel',()=>bannerTouch=null,{passive:true});

// Unavailable uploads fall back to initials, without leaving a broken image.
document.addEventListener('error',event=>{
  const image=event.target;
  if(image instanceof HTMLImageElement&&image.closest('.doctor-avatar')){
    const avatar=image.closest('.doctor-avatar');
    const card=image.closest('.doctor,.doctor-admin-card');
    const name=card?.querySelector('h3')?.textContent||'Doctor';
    avatar.textContent=name.replace(/^Dr\.?\s*/i,'').split(/\s+/).slice(0,2).map(p=>p[0]).join('');
  }
},true);
