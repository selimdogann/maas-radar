export function hesaplaPercentile(degerler: number[], yuzde: number): number {
  if (degerler.length === 0) return 0;
  const sirali = [...degerler].sort((a, b) => a - b);
  const index = (yuzde / 100) * (sirali.length - 1);
  const alt = Math.floor(index);
  const ust = Math.ceil(index);
  if (alt === ust) return sirali[alt];
  return Math.round(sirali[alt] + (sirali[ust] - sirali[alt]) * (index - alt));
}

export function hesaplaPercentileGrubu(degerler: number[]) {
  return {
    p25: hesaplaPercentile(degerler, 25),
    p50: hesaplaPercentile(degerler, 50),
    p75: hesaplaPercentile(degerler, 75),
    p90: hesaplaPercentile(degerler, 90),
    ortalama: degerler.length > 0
      ? Math.round(degerler.reduce((a, b) => a + b, 0) / degerler.length)
      : 0,
    adet: degerler.length,
  };
}

export function formatMaas(maas: number) {
  return new Intl.NumberFormat("tr-TR").format(maas) + " ₺";
}
