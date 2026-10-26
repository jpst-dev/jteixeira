interface Retangulo {
  left: number;
  top: number;
  width: number;
  height: number;
}

const limitar = (valor: number, max: number) => {
  const v = Math.round(Math.max(-max, Math.min(max, valor)) * 100) / 100;
  return v === 0 ? 0 : v;
};

export function deslocamentoMagnetico(
  px: number,
  py: number,
  rect: Retangulo,
  forca: number,
  max = 8,
): { x: number; y: number } {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return { x: limitar((px - cx) * forca, max), y: limitar((py - cy) * forca, max) };
}
