/**
 * Données fictives (phase 1 : UI statique).
 * Les montants sont en FCFA, stockés en entiers.
 */

export type InvoiceStatus = "paid" | "sent" | "draft" | "overdue";

export const PAYMENT_METHODS = [
  "Virement bancaire",
  "Wave",
  "Orange Money",
  "Espèces",
] as const;

export interface MockClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface MockInvoiceLine {
  description: string;
  quantity: number;
  unitPrice: number;
}

/** Statut effectif : une facture envoyée et arrivée à échéance devient « En retard ». */
export function effectiveStatus(
  status: InvoiceStatus,
  dueDate: string,
): InvoiceStatus {
  if (status === "sent" && dueDate < toISODateToday()) return "overdue";
  return status;
}

function toISODateToday(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;
}

export interface MockInvoice {
  id: string;
  number: string;
  client: MockClient;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  paymentMethod: string;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  amountPaid: number;
  notes?: string;
  lines: MockInvoiceLine[];
}

export interface MockPayment {
  id: string;
  clientName: string;
  invoiceNumber: string;
  method: string;
  amount: number;
  paidAt: string;
}

export const CURRENT_USER = {
  name: "Amadou Bâ",
  email: "amadou@batransport.sn",
  initials: "AB",
  company: "Bâ Transport & Fils",
  city: "Dakar, Sénégal",
};

export const CLIENTS: MockClient[] = [
  {
    id: "c1",
    name: "Cabinet Koné Avocats",
    email: "contact@kone-avocats.sn",
    phone: "+221 33 821 45 90",
    address: "Rue 10, Plateau, Dakar",
  },
  {
    id: "c2",
    name: "Safi Imprimerie",
    email: "commandes@safi-imprimerie.sn",
    phone: "+221 77 512 34 78",
    address: "Marché central, Thiès",
  },
  {
    id: "c3",
    name: "Hôtel Teranga",
    email: "direction@hotelteranga.sn",
    phone: "+221 33 823 10 45",
    address: "12 Boulevard du Centenaire, Plateau, Dakar",
  },
  {
    id: "c4",
    name: "Mamadou Diallo",
    email: "mamadou.diallo@gmail.com",
    phone: "+221 78 244 88 12",
    address: "Route de l'Aéroport, Saint-Louis",
  },
  {
    id: "c5",
    name: "Agence Yassine & Co",
    email: "contact@yassineco.sn",
    phone: "+221 33 864 22 30",
    address: "Zone A, Almadies, Dakar",
  },
  {
    id: "c6",
    name: "Pharmacie de la Corniche",
    email: "gerant@pharmaciecorniche.sn",
    phone: "+221 33 889 71 04",
    address: "Corniche Ouest, Fann, Dakar",
  },
];

export const INVOICES: MockInvoice[] = [
  {
    id: "i1",
    number: "INV-2026-0012",
    client: CLIENTS[0],
    issueDate: "2026-08-12",
    dueDate: "2026-09-11",
    status: "paid",
    paymentMethod: "Virement bancaire",
    subtotal: 640000,
    vatRate: 18,
    vatAmount: 115200,
    total: 755200,
    amountPaid: 755200,
    lines: [
      { description: "Prestation conseil juridique – forfait", quantity: 1, unitPrice: 400000 },
      { description: "Suivi de dossier contentieux", quantity: 2, unitPrice: 120000 },
    ],
  },
  {
    id: "i2",
    number: "INV-2026-0011",
    client: CLIENTS[1],
    issueDate: "2026-08-08",
    dueDate: "2026-08-30",
    status: "sent",
    paymentMethod: "Virement bancaire",
    subtotal: 385000,
    vatRate: 18,
    vatAmount: 69300,
    total: 454300,
    amountPaid: 0,
    lines: [
      { description: "Impression d'affiches format A3", quantity: 500, unitPrice: 500 },
      { description: "Impression de cartes de visite", quantity: 300, unitPrice: 450 },
    ],
  },
  {
    id: "i3",
    number: "INV-2026-0010",
    client: CLIENTS[2],
    issueDate: "2026-07-28",
    dueDate: "2026-08-27",
    status: "overdue",
    paymentMethod: "Wave",
    subtotal: 1200000,
    vatRate: 18,
    vatAmount: 216000,
    total: 1416000,
    amountPaid: 500000,
    lines: [
      { description: "Location de salle – séminaire 2 jours", quantity: 1, unitPrice: 800000 },
      { description: "Prestation traiteur", quantity: 2, unitPrice: 200000 },
    ],
  },
  {
    id: "i4",
    number: "INV-2026-0009",
    client: CLIENTS[3],
    issueDate: "2026-07-22",
    dueDate: "2026-08-21",
    status: "paid",
    paymentMethod: "Virement bancaire",
    subtotal: 240000,
    vatRate: 18,
    vatAmount: 43200,
    total: 283200,
    amountPaid: 283200,
    lines: [
      { description: "Maintenance du site web – mensuelle", quantity: 2, unitPrice: 120000 },
    ],
  },
  {
    id: "i5",
    number: "INV-2026-0008",
    client: CLIENTS[4],
    issueDate: "2026-07-15",
    dueDate: "2026-08-14",
    status: "overdue",
    paymentMethod: "Wave",
    subtotal: 950000,
    vatRate: 18,
    vatAmount: 171000,
    total: 1121000,
    amountPaid: 0,
    lines: [
      { description: "Campagne publicitaire radio – 30 jours", quantity: 1, unitPrice: 700000 },
      { description: "Création de visuels publicitaires", quantity: 1, unitPrice: 250000 },
    ],
  },
  {
    id: "i6",
    number: "INV-2026-0007",
    client: CLIENTS[5],
    issueDate: "2026-07-10",
    dueDate: "2026-08-09",
    status: "paid",
    paymentMethod: "Virement bancaire",
    subtotal: 156000,
    vatRate: 18,
    vatAmount: 28080,
    total: 184080,
    amountPaid: 184080,
    lines: [
      { description: "Livraison express – zone nord", quantity: 13, unitPrice: 12000 },
    ],
  },
  {
    id: "i7",
    number: "INV-2026-0006",
    client: CLIENTS[2],
    issueDate: "2026-07-02",
    dueDate: "2026-08-01",
    status: "draft",
    paymentMethod: "Orange Money",
    subtotal: 520000,
    vatRate: 18,
    vatAmount: 93600,
    total: 613600,
    amountPaid: 0,
    lines: [
      { description: "Réservation de salle – mariage", quantity: 1, unitPrice: 520000 },
    ],
  },
];

export const RECENT_PAYMENTS: MockPayment[] = [
  {
    id: "p1",
    clientName: "Cabinet Koné Avocats",
    invoiceNumber: "INV-2026-0012",
    method: "Virement bancaire",
    amount: 755200,
    paidAt: "2026-08-13",
  },
  {
    id: "p2",
    clientName: "Mamadou Diallo",
    invoiceNumber: "INV-2026-0009",
    method: "Wave",
    amount: 283200,
    paidAt: "2026-08-05",
  },
  {
    id: "p3",
    clientName: "Pharmacie de la Corniche",
    invoiceNumber: "INV-2026-0007",
    method: "Orange Money",
    amount: 184080,
    paidAt: "2026-07-28",
  },
  {
    id: "p4",
    clientName: "Hôtel Teranga",
    invoiceNumber: "INV-2026-0010",
    method: "Virement bancaire",
    amount: 500000,
    paidAt: "2026-07-31",
  },
];

export interface DashboardStats {
  billed: number;
  collected: number;
  pending: number;
  overdue: number;
  collectionRate: number;
}

export function computeStats(invoices: MockInvoice[]): DashboardStats {
  const billed = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const collected = invoices.reduce(
    (sum, inv) => sum + inv.amountPaid,
    0,
  );
  const pending = invoices
    .filter((inv) => inv.status === "sent" || inv.status === "overdue")
    .reduce((sum, inv) => sum + (inv.total - inv.amountPaid), 0);
  const overdue = invoices
    .filter((inv) => inv.status === "overdue")
    .reduce((sum, inv) => sum + (inv.total - inv.amountPaid), 0);

  return {
    billed,
    collected,
    pending,
    overdue,
    collectionRate: billed > 0 ? Math.round((collected / billed) * 100) : 0,
  };
}

/** Recettes des 6 derniers mois pour le graphique (montants facturés) */
export interface MonthlyRevenue {
  month: string;
  amount: number;
}

export const MONTHLY_REVENUE: MonthlyRevenue[] = [
  { month: "Mars", amount: 1840000 },
  { month: "Avril", amount: 2205000 },
  { month: "Mai", amount: 1742000 },
  { month: "Juin", amount: 2631000 },
  { month: "Juillet", amount: 3515000 },
  { month: "Août", amount: 2962000 },
];
