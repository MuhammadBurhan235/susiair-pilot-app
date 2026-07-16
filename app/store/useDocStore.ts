import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { differenceInCalendarDays, parseISO } from "date-fns";
import type {
  DocumentDataResponse,
  DocumentItem,
  DocumentStatus,
  DocumentThresholds,
  ProcessedDocument,
} from "~/types/domain";

export const useDocStore = defineStore("document", () => {
  // --- 1. STATE ---
  const documents = ref<DocumentItem[]>([]);
  const thresholds = ref<DocumentThresholds>({ warningDays: 30 }); // Fallback default 30 hari

  // Tanggal acuan mutlak dari dokumen spesifikasi
  const ANCHOR_DATE = "2026-05-31";

  // --- 2. ACTIONS ---
  // Fungsi untuk menarik data mock JSON
  const fetchDocuments = async () => {
    try {
      const res = await fetch("/data/mock-documents.json");
      const data: DocumentDataResponse = await res.json();

      documents.value = data.documents;
      thresholds.value = data.thresholds;
    } catch (error) {
      console.error("Gagal menarik data dokumen:", error);
    }
  };

  // --- 3. GETTERS ---
  // Memproses data mentah menjadi data matang yang sudah dilengkapi kelas warna Tailwind
  const processedDocuments = computed(() => {
    if (!documents.value.length) return [];

    const warningLimit = thresholds.value.warningDays;
    const anchor = parseISO(ANCHOR_DATE);

    return documents.value.map((doc): ProcessedDocument => {
      const expDate = parseISO(doc.expiryDate);

      // Kalkulasi sisa hari antara tanggal kedaluwarsa dengan tanggal acuan
      const daysRemaining = differenceInCalendarDays(expDate, anchor);

      // Logika threshold sesuai instruksi JSON Susi Air
      let status: DocumentStatus = {
        label: "Valid",
        class: "bg-success text-white",
      };

      if (daysRemaining <= 0) {
        status = { label: "Expired", class: "bg-danger text-white" };
      } else if (daysRemaining <= warningLimit) {
        status = { label: "Expiring Soon", class: "bg-warning text-white" };
      }

      // Kembalikan objek dokumen yang sudah disuntikkan properti status
      return {
        ...doc,
        status,
      };
    });
  });

  return {
    documents,
    thresholds,
    fetchDocuments,
    processedDocuments,
  };
});
