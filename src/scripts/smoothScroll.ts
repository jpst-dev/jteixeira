import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Rolagem suave para âncoras da própria página (#sobre, /#sobre). Feita via GSAP porque o
// `scroll-behavior: smooth` do CSS é ignorado pelo navegador quando o sistema desliga animações.
export function initSmoothScroll(): void {
  gsap.registerPlugin(ScrollToPlugin);

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = (e.target as Element).closest<HTMLAnchorElement>('a[href*="#"]');
    if (!link) return;
    const url = new URL(link.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const alvo = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!alvo) return;

    e.preventDefault();
    history.pushState(null, '', url.hash);
    // Espera um frame: o menu mobile libera o scroll do body ao fechar.
    requestAnimationFrame(() => {
      const margem = parseFloat(getComputedStyle(alvo).scrollMarginTop) || 0;
      const destino = Math.max(0, alvo.getBoundingClientRect().top + scrollY - margem);
      const distancia = Math.abs(destino - scrollY);
      gsap.to(window, {
        scrollTo: { y: destino, autoKill: true },
        duration: gsap.utils.clamp(0.5, 1.2, distancia / 2000),
        ease: 'power3.inOut',
        onComplete: () => {
          // Leva o foco do teclado para a seção (sem pular a rolagem).
          if (!alvo.hasAttribute('tabindex')) alvo.setAttribute('tabindex', '-1');
          alvo.focus({ preventScroll: true });
        },
      });
    });
  });
}
