export interface InvoiceDraftLine {
  id: string;
  description: string;
  quantity: string;
  unitPrice: string;
}

export interface InvoiceDraft {
  clientId: string;
  clientQuery: string;
  issueDate: string;
  dueDate: string;
  vatRate: string;
  paymentMethod: string;
  notes: string;
  lines: InvoiceDraftLine[];
  autoDueDate: boolean;
}

export function invoiceDraftKey(userEmail: string): string {
  return `medinafacture-invoice-draft-${userEmail}`;
}

export function loadInvoiceDraft(key: string): InvoiceDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as InvoiceDraft;
    if (!parsed || !Array.isArray(parsed.lines)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveInvoiceDraft(key: string, draft: InvoiceDraft): void {
  if (typeof window === "undefined") return;
  try {
    if (isInvoiceDraftEmpty(draft)) {
      window.localStorage.removeItem(key);
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(draft));
  } catch {
    return;
  }
}

export function clearInvoiceDraft(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    return;
  }
}

export function isInvoiceDraftEmpty(draft: InvoiceDraft): boolean {
  if (draft.clientQuery.trim()) return false;
  if (draft.notes.trim()) return false;
  if (draft.lines.some((l) => l.description.trim() || l.unitPrice.trim()))
    return false;
  return true;
}
