// Fundo de constelação (tsParticles). Carregado sob demanda para não pesar no carregamento inicial.
export async function initConstellation(container: HTMLElement): Promise<void> {
  const [{ tsParticles }, { loadSlim }] = await Promise.all([
    import('@tsparticles/engine'),
    import('@tsparticles/slim'),
  ]);
  await loadSlim(tsParticles);

  const mobile = matchMedia('(max-width: 767px)').matches;
  const ponteiroFino = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const instancia = await tsParticles.load({
    id: container.id,
    element: container,
    options: {
      fullScreen: { enable: false },
      background: { color: 'transparent' },
      fpsLimit: 40,
      detectRetina: true,
      pauseOnBlur: true,
      particles: {
        number: { value: mobile ? 25 : 60 },
        paint: { fill: { enable: true, color: { value: '#42d392' } } },
        opacity: { value: 0.35 },
        size: { value: { min: 1, max: 3 } },
        links: { enable: true, color: '#ffffff', opacity: 0.12, width: 1, distance: 150 },
        move: { enable: true, speed: 0.5, outModes: 'bounce' },
      },
      interactivity: {
        detectsOn: 'window',
        events: {
          onHover: { enable: ponteiroFino, mode: 'attract' },
          onClick: { enable: true, mode: 'repulse' },
        },
        modes: {
          attract: { distance: 180, speed: 1 },
          repulse: { distance: 160, duration: 0.4 },
        },
      },
    },
  });

  container.dataset.particulas = String(instancia?.particles.count ?? 0);
  container.classList.add('is-ready');
}
