import { deslocamentoMagnetico } from '../lib/magnetic';

const EASE = 'cubic-bezier(.2,.8,.2,1)';

// Botões magnéticos ([data-magnetic]) e holofote nos cards ([data-spotlight]): só com mouse.
export function initInteractions(): void {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  for (const el of document.querySelectorAll<HTMLElement>('[data-magnetic]')) {
    // Usa `translate` (não `transform`) para não brigar com as transições de cor das classes utilitárias.
    const atual = getComputedStyle(el).transition;
    el.style.transition = `${atual && atual !== 'all 0s ease 0s' ? `${atual}, ` : ''}translate .25s ${EASE}`;
    const forca = Number(el.dataset.magnetic) || 0.3;
    el.addEventListener('pointermove', (e) => {
      const { x, y } = deslocamentoMagnetico(e.clientX, e.clientY, el.getBoundingClientRect(), forca);
      el.style.translate = `${x}px ${y}px`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.translate = '';
    });
  }

  for (const el of document.querySelectorAll<HTMLElement>('[data-spotlight]')) {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--x', `${e.clientX - r.left}px`);
      el.style.setProperty('--y', `${e.clientY - r.top}px`);
    });
  }
}
