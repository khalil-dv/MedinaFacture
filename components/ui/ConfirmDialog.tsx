"use client";

import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  tone?: "danger" | "primary";
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  tone = "danger",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const resolvedLabel = confirmLabel ?? t("common.confirm");
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex items-start gap-3">
        <div
          className={`grid size-10 shrink-0 place-items-center rounded-xl ${
            tone === "danger"
              ? "bg-red-500/10 text-red-600 dark:text-red-400"
              : "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
          }`}
        >
          <AlertTriangle className="size-5" aria-hidden="true" />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button variant={tone} onClick={onConfirm}>
          {resolvedLabel}
        </Button>
      </div>
    </Modal>
  );
}
