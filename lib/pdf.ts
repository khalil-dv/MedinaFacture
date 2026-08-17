import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { MockClient, MockInvoice } from "@/lib/data";
import type { CompanySettings } from "@/lib/store";
import { currencyLabel, formatDate, formatMoney } from "@/lib/format";

/** Nettoie les espaces insécables (U+202F / U+00A0) que les fonts PDF ne savent pas afficher. */
function clean(text: string): string {
  return text.replace(/\u202f|\u00a0/g, " ");
}

function money(amount: number, currency: string): string {
  return clean(formatMoney(amount, currency));
}

const DARK: [number, number, number] = [30, 41, 59];
const GREY: [number, number, number] = [100, 116, 139];
const GREEN: [number, number, number] = [4, 120, 87];
const LINE: [number, number, number] = [226, 232, 240];
const LIGHT: [number, number, number] = [248, 250, 252];

export function downloadInvoicePdf(
  invoice: MockInvoice,
  company: CompanySettings,
): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const rightX = pageWidth - margin;
  const contentWidth = pageWidth - margin * 2;
  const currency = company.currency || "XOF";

  let y = margin + 4;

  // ---- En-tête : entreprise à gauche, titre à droite ----
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...DARK);
  doc.text(clean(company.name), margin, y);
  doc.setFontSize(14);
  doc.setTextColor(...GREEN);
  doc.text("FACTURE", rightX, y, { align: "right" });

  // Coordonnées de l'entreprise (gauche)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GREY);
  const leftLines = [company.taxId, company.address]
    .filter(Boolean)
    .map(clean) as string[];
  if (company.email) leftLines.push(clean(company.email));
  if (company.phone) leftLines.push(clean(company.phone));
  let leftY = y + 5.5;
  for (const line of leftLines) {
    doc.text(line, margin, leftY);
    leftY += 4;
  }

  // Infos facture (droite)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...DARK);
  const meta = [
    `N° : ${invoice.number}`,
    `Émise le : ${formatDate(invoice.issueDate, company.dateFormat)}`,
    `Échéance : ${formatDate(invoice.dueDate, company.dateFormat)}`,
    `Délai : ${company.paymentDueDays} jours`,
  ];
  let metaY = y + 5.5;
  for (const line of meta) {
    doc.text(clean(line), rightX, metaY, { align: "right" });
    metaY += 4;
  }

  y = Math.max(leftY, metaY) + 4;

  // Séparateur
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.3);
  doc.line(margin, y, rightX, y);
  y += 6;

  // ---- Blocs Facturé à / Paiement ----
  const boxWidth = (contentWidth - 4) / 2;
  const boxHeight = 22;
  const drawBox = (x: number) => {
    doc.setFillColor(...LIGHT);
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, y, boxWidth, boxHeight, 2, 2, "FD");
  };

  // Facturé à
  drawBox(margin);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...GREY);
  doc.text("FACTURÉ À", margin + 4, y + 5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...DARK);
  doc.text(clean(invoice.client.name), margin + 4, y + 9);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...GREY);
  const clientLines = [
    invoice.client.address,
    [invoice.client.phone, invoice.client.email].filter(Boolean).join(" · "),
  ].filter(Boolean) as string[];
  let cy = y + 13;
  for (const line of clientLines) {
    doc.text(clean(line), margin + 4, cy);
    cy += 3.5;
  }

  // Paiement
  const payX = margin + boxWidth + 4;
  drawBox(payX);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...GREY);
  doc.text("PAIEMENT", payX + 4, y + 5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...DARK);
  doc.text(clean(invoice.paymentMethod || company.defaultPaymentMethod), payX + 4, y + 9);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...GREY);
  doc.text(
    `Sous ${company.paymentDueDays} jours`,
    payX + 4,
    y + 13,
  );

  y += boxHeight + 7;

  // ---- Tableau des lignes ----
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Description", "Quantité", "Prix unitaire", "Total"]],
    body: invoice.lines.map((line) => [
      clean(line.description),
      line.quantity.toString(),
      money(line.unitPrice, currency),
      money(line.quantity * line.unitPrice, currency),
    ]),
    styles: {
      fontSize: 9,
      cellPadding: 2.5,
      textColor: DARK,
      lineColor: LINE,
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: LIGHT,
      textColor: GREY,
      fontStyle: "bold",
      lineColor: LINE,
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { halign: "right", cellWidth: 24 },
      2: { halign: "right", cellWidth: 34 },
      3: { halign: "right", cellWidth: 34 },
    },
    theme: "grid",
    bodyStyles: { lineColor: LINE, lineWidth: 0.15 },
  });

  let ty = (doc as unknown as { lastAutoTable: { finalY: number } })
    .lastAutoTable.finalY;

  // ---- Totaux ----
  const totalX = rightX - 70;
  ty += 6;
  const totalRow = (
    label: string,
    value: string,
    opts: { bold?: boolean; green?: boolean; bg?: boolean },
  ) => {
    if (opts.bg) {
      doc.setFillColor(236, 253, 245);
      doc.setDrawColor(167, 243, 208);
      doc.roundedRect(totalX, ty - 4, 70, 7, 1.5, 1.5, "FD");
    }
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(opts.bold ? 11 : 9.5);
    doc.setTextColor(...(opts.green ? GREEN : DARK));
    doc.text(label, totalX + (opts.bg ? 4 : 0), ty);
    doc.text(value, rightX - (opts.bg ? 4 : 0), ty, { align: "right" });
    ty += opts.bold ? 8.5 : 6;
  };

  totalRow("Sous-total", money(invoice.subtotal, currency), {});
  totalRow(`TVA (${invoice.vatRate} %)`, money(invoice.vatAmount, currency), {});
  totalRow("Total TTC", money(invoice.total, currency), {
    bold: true,
    green: true,
    bg: true,
  });

  ty += 4;

  // ---- Coordonnées de paiement ----
  const paymentLines: string[] = [];
  if (company.bankAccountName) {
    paymentLines.push(`Virement bancaire : ${company.bankAccountName}`);
  }
  if (company.bankName) {
    paymentLines.push(`Banque : ${company.bankName}`);
  }
  if (company.bankAccountNumber) {
    paymentLines.push(`N° de compte : ${company.bankAccountNumber}`);
  }
  if (company.waveNumber) {
    paymentLines.push(`Wave : ${company.waveNumber}`);
  }
  if (company.orangeMoneyNumber) {
    paymentLines.push(`Orange Money : ${company.orangeMoneyNumber}`);
  }

  if (paymentLines.length > 0) {
    const coordsHeight = 12 + paymentLines.length * 3.8;
    doc.setFillColor(...LIGHT);
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, ty, contentWidth, coordsHeight, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...GREY);
    doc.text("COORDONNÉES DE PAIEMENT", margin + 4, ty + 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...DARK);
    let py = ty + 9.5;
    for (const line of paymentLines) {
      doc.text(clean(line), margin + 4, py);
      py += 3.8;
    }
    ty += coordsHeight + 7;
  }

  // ---- Notes / mentions ----
  if (invoice.notes && invoice.notes.trim()) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...GREY);
    doc.text("NOTES", margin, ty);
    ty += 4.5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...GREY);
    const noteLines = doc.splitTextToSize(
      clean(invoice.notes),
      contentWidth,
    ) as string[];
    for (const line of noteLines) {
      doc.text(line, margin, ty);
      ty += 3.8;
    }
  }

  // ---- Pied de page ----
  const footer = [
    `${clean(company.name)} — ${clean(company.taxId || "Sans N° contribuable")}`,
    `Devise : ${currency} (${currencyLabel(currency)}) — ${clean(company.address || "")}`,
  ].filter((l) => l.trim() !== "—");
  const footerY = 280;
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY, rightX, footerY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...GREY);
  doc.text(footer, margin, footerY + 5);

  doc.save(`${invoice.number}.pdf`);
}

/** Client générique utilisé pour prévisualiser/télécharger une facture non enregistrée. */
export function buildPreviewInvoice(
  number: string,
  issueDate: string,
  dueDate: string,
  vatRate: number,
  lines: { description: string; quantity: number; unitPrice: number }[],
  totals: { subtotal: number; vatAmount: number; total: number },
  notes: string,
  client: MockClient | undefined,
  paymentMethod: string,
): MockInvoice {
  return {
    id: "preview",
    number,
    client: client ?? {
      id: "preview-client",
      name: "Client",
      email: "",
      phone: "",
      address: "",
    },
    issueDate,
    dueDate,
    status: "draft",
    paymentMethod,
    subtotal: totals.subtotal,
    vatRate,
    vatAmount: totals.vatAmount,
    total: totals.total,
    amountPaid: 0,
    notes,
    lines: lines.map(({ description, quantity, unitPrice }) => ({
      description,
      quantity,
      unitPrice,
    })),
  };
}
