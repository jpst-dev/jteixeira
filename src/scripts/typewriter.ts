import { proximoPasso, type EstadoDigitacao } from '../lib/typewriter';

// Liga cada [data-typewriter] (frases em data-frases) ao loop de digitação.
export function initTypewriter(): void {
  for (const el of document.querySelectorAll<HTMLElement>('[data-typewriter]')) {
    const alvo = el.querySelector<HTMLElement>('[data-typewriter-texto]');
    const frases: string[] = JSON.parse(el.dataset.frases ?? '[]');
    if (!alvo || frases.length < 2) continue;

    let estado: EstadoDigitacao = { indice: 0, texto: frases[0], fase: 'pausa' };
    const tick = () => {
      if (document.hidden) {
        document.addEventListener('visibilitychange', tick, { once: true });
        return;
      }
      const passo = proximoPasso(frases, estado);
      estado = passo.estado;
      alvo.textContent = estado.texto;
      setTimeout(tick, passo.espera);
    };
    setTimeout(tick, 2200);
  }
}
