import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s);

// Background sweep: the hand turns with the page; the range input takes over once touched.
const sweep = $('.sweep');
const range = $<HTMLInputElement>('.sweep-range');
let sweepByHand = false;
const setSweep = (a: number) => { sweep?.style.setProperty('--a', a.toFixed(1)); if (range && !sweepByHand) range.value = String(Math.round(a)); };
range?.addEventListener('input', () => { sweepByHand = true; sweep?.style.setProperty('--a', range.value); });

// OCR: the recognised line types itself into the clipboard card.
const typed = $('.clip-text .typed');
const clip = $('.clip');
const text = $('.clip-text')?.dataset.text ?? '';
const setTyped = (p: number) => {
  if (typed) typed.textContent = text.slice(0, Math.round(Math.min(1, p / .85) * text.length));
  clip?.classList.toggle('is-done', p >= .9);
};

// Film: a big play button over the poster; native controls take over once it plays.
const video = $<HTMLVideoElement>('.film-frame video');
const play = $<HTMLButtonElement>('.film-play');
if (video && play) {
  play.hidden = false;
  play.addEventListener('click', () => { void video.play(); });
  video.addEventListener('play', () => { play.hidden = true; });
}

const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
  ScrollTrigger.create({ trigger: '.sweep', start: 'top 75%', end: 'bottom 30%', scrub: .6,
    onUpdate: s => { if (!sweepByHand) setSweep(s.progress * 360); } });

  gsap.timeline({ scrollTrigger: { trigger: '.phone-stage', start: 'top 75%', end: 'bottom 35%', scrub: .8 } })
    .fromTo('.share-card', { rotation: -9, y: 30 }, { rotation: -3, y: -10, ease: 'none' }, 0)
    .fromTo('.handset', { rotation: 12, y: 70 }, { rotation: 4, y: 0, ease: 'none' }, 0)
    .fromTo('.flying-file', { opacity: 0 }, { opacity: 1, duration: .08 }, .12)
    .fromTo('.flying-file', { rotation: -12, scale: 1 }, { motionPath: { path: '#flight', align: '#flight', alignOrigin: [.5, .5] }, rotation: 10, scale: .6, ease: 'power1.inOut', duration: .7 }, .12)
    .to('.flying-file', { opacity: 0, duration: .08 }, .76)
    .fromTo('.handset-slot img', { scale: .5, opacity: 0 }, { scale: 1.25, opacity: 1, duration: .14 }, .76);

  gsap.timeline({ scrollTrigger: { trigger: '.ocr-stage', start: 'top 70%', end: 'bottom 40%', scrub: .5, onUpdate: s => setTyped(s.progress) } })
    .fromTo('.scan-beam', { top: '6%' }, { top: '94%', ease: 'none' });

  gsap.fromTo('.vector-figure', { '--p': 0 }, { '--p': 1, ease: 'none', scrollTrigger: { trigger: '.vector-figure', start: 'top 70%', end: 'bottom 45%', scrub: .6 } });

  gsap.fromTo('.finale-wheel svg', { rotation: -60 }, { rotation: 30, ease: 'none', scrollTrigger: { trigger: '.finale', start: 'top bottom', end: 'bottom top', scrub: 1 } });

  gsap.utils.toArray<HTMLElement>('.scene h2').forEach(h => gsap.from(h, { y: 40, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 88%' } }));
});

mm.add('(prefers-reduced-motion: reduce)', () => { setSweep(200); setTyped(1); });
