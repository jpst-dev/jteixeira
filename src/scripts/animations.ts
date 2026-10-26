import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

declare global {
  interface Window {
    __animReady?: boolean;
  }
}

const EASE = 'power3.out';

function animarHero() {
  const itens = gsap.utils.toArray<HTMLElement>('[data-hero-item]');
  if (!itens.length) return;

  const tl = gsap.timeline({ defaults: { ease: EASE } });
  tl.fromTo(itens, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 });

  const titulo = document.querySelector<HTMLElement>('[data-split]');
  if (titulo) {
    const split = SplitText.create(titulo, { type: 'words', mask: 'words' });
    // background-clip:text não atravessa os wrappers inline-block do SplitText:
    // cada palavra dentro de .text-gradient recebe o próprio gradiente.
    for (const palavra of split.words as HTMLElement[]) {
      if (palavra.parentElement?.closest('.text-gradient')) palavra.classList.add('text-gradient');
    }
    tl.from(split.words, { yPercent: 100, duration: 0.8, stagger: 0.06 }, 0.1);
  }
}

function revelar(alvos: HTMLElement[], trigger: HTMLElement) {
  gsap.fromTo(
    alvos,
    { opacity: 0, y: 24 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: EASE,
      stagger: 0.08,
      scrollTrigger: { trigger, start: 'top 85%', once: true },
    },
  );
}

function animarSecoes() {
  const grupos = gsap.utils.toArray<HTMLElement>('[data-reveal-group]');
  for (const grupo of grupos) {
    revelar(Array.from(grupo.querySelectorAll<HTMLElement>('[data-reveal]')), grupo);
  }
  for (const el of gsap.utils.toArray<HTMLElement>('[data-reveal]')) {
    if (el.closest('[data-reveal-group]')) continue;
    revelar([el], el);
  }
}

export function initAnimations(): void {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    animarHero();
    animarSecoes();
  }
  window.__animReady = true;
}
