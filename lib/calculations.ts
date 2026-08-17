/**
 * Cœur des calculs financiers.
 * FCFA : pas de centimes -> tous les résultats sont arrondis à l'entier.
 * Ce module est le seul endroit où les totaux sont calculés.
 * (C'est le module qui sera testé unitairement et réutilisé côté serveur en phase 3.)
 */

export function roundToInt(n: number): number {
  return Math.round(n);
}

export interface InvoiceLineCalc {
  quantity: number;
  unitPrice: number;
}

export interface InvoiceTotals {
  subtotal: number;
  vatAmount: number;
  total: number;
}

/** Total d'une ligne : quantité × prix unitaire, arrondi à l'entier. */
export function computeLineTotal(
  quantity: number,
  unitPrice: number,
): number {
  return roundToInt(quantity * unitPrice);
}

/**
 * Sous-total, TVA et total TTC à partir des lignes et du taux de TVA (%).
 * TVA = sous-total × taux / 100, arrondie à l'entier.
 */
export function computeTotals(
  lines: InvoiceLineCalc[],
  vatRate: number,
): InvoiceTotals {
  const subtotal = lines.reduce(
    (sum, line) => sum + computeLineTotal(line.quantity, line.unitPrice),
    0,
  );
  const vatAmount = roundToInt(subtotal * (vatRate / 100));
  return { subtotal, vatAmount, total: subtotal + vatAmount };
}

/** Reste dû sur une facture. */
export function remainingAmount(total: number, amountPaid: number): number {
  return Math.max(total - amountPaid, 0);
}

/**
 * Génère le prochain numéro de facture séquentiel par année.
 * Ex. INV-2026-0001, INV-2026-0002…
 * S'appuie sur les numéros existants de la même année et du même préfixe
 * pour éviter les doublons.
 */
export function nextInvoiceNumber(
  prefix: string,
  existingNumbers: string[],
): string {
  const year = new Date().getFullYear();
  const normalizedPrefix = prefix.replace(/\s+/g, "").toUpperCase() || "INV";
  const escapedPrefix = normalizedPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const fullPrefix = `${normalizedPrefix}-${year}-`;
  const pattern = new RegExp(`^${escapedPrefix}-${year}-(\\d+)$`);

  const max = existingNumbers.reduce((currentMax, number) => {
    const match = number.match(pattern);
    const value = match ? parseInt(match[1], 10) : 0;
    return Math.max(currentMax, value);
  }, 0);

  return `${fullPrefix}${String(max + 1).padStart(4, "0")}`;
}
