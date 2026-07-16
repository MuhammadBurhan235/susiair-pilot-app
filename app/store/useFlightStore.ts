import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { subDays, addDays, format, parseISO } from "date-fns";
import type {
  ChartBounds,
  ChartPoint,
  ChartToggleKey,
  FlightDataResponse,
  FlightHourEntry,
  FlightLimits,
  Pilot,
  SummaryCards,
} from "~/types/domain";

export const useFlightStore = defineStore("flight", () => {
  // --- 1. STATE ---
  const flightHours = ref<FlightHourEntry[]>([]);
  const limits = ref<FlightLimits | null>(null);
  const chartBounds = ref<ChartBounds | null>(null);
  const pilot = ref<Pilot | null>(null);
  const hoursByDate = computed<Record<string, number>>(() => {
    return flightHours.value.reduce<Record<string, number>>((index, entry) => {
      index[entry.date] = entry.hours;
      return index;
    }, {});
  });

  // Tanggal acuan mutlak dari dokumen spesifikasi
  const ANCHOR_DATE = "2026-05-31";

  // --- 2. ACTIONS ---
  // Fungsi untuk memanggil dan menginjeksi data JSON ke dalam State
  const fetchFlightData = async () => {
    try {
      const res = await fetch("/data/mock-flight-hours.json");
      const data: FlightDataResponse = await res.json();

      flightHours.value = data.flightHours;
      limits.value = data.limits;
      chartBounds.value = data.chartBounds;
      pilot.value = data.pilot;
    } catch (error) {
      console.error("Gagal menarik data penerbangan:", error);
    }
  };

  // --- 3. HELPER MATHEMATICS ---
  // Mengambil jam terbang tunggal pada tanggal tertentu
  const getHoursForDate = (targetDate: string): number => {
    return hoursByDate.value[targetDate] ?? 0;
  };

  // Algoritma Rolling Sum sesuai rumus: sum dari (D - windowDays + 1) sampai D
  const getRollingSum = (targetDateStr: string, windowDays: number): number => {
    let sum = 0;
    const end = parseISO(targetDateStr);

    // Looping mundur sebanyak jumlah windowDays
    for (let i = 0; i < windowDays; i++) {
      const currentDateStr = format(subDays(end, i), "yyyy-MM-dd");
      sum += getHoursForDate(currentDateStr);
    }

    // Pastikan angka desimal presisi 1 angka di belakang koma (misal: 45.3)
    return Number(sum.toFixed(1));
  };

  // --- 4. GETTERS ---
  // A. Getter untuk 4 Summary Cards di Dashboard
  const summaryCards = computed(() => {
    if (!flightHours.value.length || !limits.value) return null;

    const summary: SummaryCards = {
      daily: {
        current: getRollingSum(ANCHOR_DATE, 1), // Today only
        limit: limits.value.daily,
      },
      weekly: {
        current: getRollingSum(ANCHOR_DATE, 7), // Rolling 7 days
        limit: limits.value.weekly,
      },
      monthly: {
        current: getRollingSum(ANCHOR_DATE, 30), // Rolling 30 days
        limit: limits.value.monthly,
      },
      annual: {
        current: getRollingSum(ANCHOR_DATE, 365), // Rolling 365 days
        limit: limits.value.annual,
      },
    };

    return summary;
  });

  // B. Getter dinamis untuk Trend Chart berdasarkan toggle (1w, 1m, 3m, 6m, 1y)
  const generateChartData = (toggleKey: ChartToggleKey): ChartPoint[] => {
    if (!chartBounds.value) return [];

    const bound = chartBounds.value[toggleKey];
    const windowDays = bound.windowDays;
    const displayRangeDays = bound.displayRangeDays;
    const chartPoints: ChartPoint[] = [];

    const centerDate = parseISO(ANCHOR_DATE);

    for (let i = -displayRangeDays; i <= displayRangeDays; i++) {
      const currentPointDateStr = format(addDays(centerDate, i), "yyyy-MM-dd");

      // Hitung sumbu Y menggunakan rumus Rolling Sum
      const yValue = getRollingSum(currentPointDateStr, windowDays);

      chartPoints.push({
        x: currentPointDateStr,
        y: yValue,
      });
    }

    return chartPoints;
  };

  // Buka akses ke komponen
  return {
    flightHours,
    limits,
    chartBounds,
    pilot,
    ANCHOR_DATE,
    fetchFlightData,
    summaryCards,
    generateChartData,
  };
});
