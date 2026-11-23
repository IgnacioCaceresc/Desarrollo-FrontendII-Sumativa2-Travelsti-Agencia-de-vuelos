// Tipo de cambio referencial: 1 USD = 950 CLP
export const USD_TO_CLP_RATE = 950;

/**
 * Formatea un monto base en USD a la moneda seleccionada ('CLP' por defecto o 'USD').
 * - En CLP: multiplica por la tasa de cambio y formatea con separador de miles chileno ($1.092.500 CLP)
 * - En USD: formatea con separador de miles en dólares ($1,150 USD)
 */
export function formatCurrency(amountInUsd, currency = 'CLP') {
  const numericAmount = Number(amountInUsd) || 0;

  if (currency === 'CLP') {
    const clpAmount = Math.round(numericAmount * USD_TO_CLP_RATE);
    return `$${clpAmount.toLocaleString('es-CL')} CLP`;
  }

  return `$${numericAmount.toLocaleString('es-CL')} USD`;
}
