<script setup lang="ts">
import { ref, computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem,
} from "chart.js";
import { useFlightStore } from "~/store/useFlightStore";
import { format, parseISO } from "date-fns";
import type { ChartToggleKey } from "~/types/domain";

// Mendaftarkan modul Chart.js yang dibutuhkan untuk Line Chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const flightStore = useFlightStore();

// Konfigurasi Toggle sesuai brief
const toggles: ChartToggleKey[] = ["1w", "1m", "3m", "6m", "1y"];
const activeToggle = ref<ChartToggleKey>("1w");

// 1. Mempersiapkan Data Chart
const chartData = computed(() => {
  const rawData = flightStore.generateChartData(activeToggle.value);
  const bounds = flightStore.chartBounds?.[activeToggle.value];

  // Jika data dari store belum masuk (masih loading)
  if (!rawData.length || !bounds) {
    return { labels: [], datasets: [] };
  }

  // Format label X (misal: "15 May")
  const labels = rawData.map((d) => format(parseISO(d.x), "dd MMM"));
  const dataPoints = rawData.map((d) => d.y);

  // Membuat dataset garis lurus horizontal untuk Red Limit Line
  const limitData = rawData.map(() => bounds.limit);

  return {
    labels,
    datasets: [
      {
        label: "Flight Hours (Rolling Sum)",
        data: dataPoints,
        borderColor: "#22C5E8", // Chart accent color
        backgroundColor: "#22C5E8",
        tension: 0.3, // Membuat garis sedikit melengkung (smooth)
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: "#0E2138", // Primary navy untuk titik
      },
      {
        label: "Regulatory Limit",
        data: limitData,
        borderColor: "#E63757", // Brand red / Danger color
        borderWidth: 2,
        borderDash: [5, 5], // Membuat garis putus-putus
        pointRadius: 0, // Menyembunyikan titik pada garis merah
        fill: false,
        pointHitRadius: 0, // Menonaktifkan interaksi kursor pada garis batas
      },
    ],
  };
});

// 2. Mempersiapkan Opsi Chart (Skala Y dinamis)
const chartOptions = computed(() => {
  const bounds = flightStore.chartBounds?.[activeToggle.value];
  const yMax = bounds ? bounds.max : 50;

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        max: yMax, // Y-max berubah dinamis berdasarkan toggle
        grid: { color: "#F3F4F6" },
        ticks: { color: "#6B7280", font: { family: "Inter" } },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: "#6B7280",
          font: { family: "Inter" },
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Mematikan legend bawaan agar kita bisa membuat desain legend kustom yang lebih bersih
      },
      tooltip: {
        backgroundColor: "#0E2138",
        titleFont: { family: "Inter", size: 13 },
        bodyFont: { family: "Inter", size: 12 },
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            if (context.datasetIndex === 1)
              return `Limit: ${context.parsed.y} hrs`;
            return `Flown: ${context.parsed.y} hrs`;
          },
        },
      },
    },
  };
});
</script>

<template>
  <section
    class="ops-surface-card ops-chart-shell flex flex-col p-5 select-none"
  >
    <!-- Header & Custom Legend -->
    <div class="mb-4 flex items-center justify-between gap-3">
      <h3 class="text-lg font-bold text-text-primary">Flight Hours Trend</h3>
      <div
        class="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-text-secondary"
      >
        <div class="flex items-center gap-1.5">
          <span class="ops-chart-legend-dot h-1 w-3 bg-chart-accent"></span>
          Hours
        </div>
        <div class="flex items-center gap-1.5">
          <span
            class="ops-chart-legend-dot ops-chart-limit-dot h-1 w-3 text-danger"
          ></span>
          Limit
        </div>
      </div>
    </div>

    <!-- Canvas Grafik -->
    <div class="relative h-64 w-full">
      <Line
        v-if="chartData.datasets.length"
        :data="chartData"
        :options="chartOptions"
      />

      <!-- Skeleton Loading State -->
      <div
        v-else
        class="ops-chart-skeleton absolute inset-0 flex items-center justify-center animate-pulse"
      >
        <span class="text-text-secondary text-sm font-medium"
          >Calculating rolling sums...</span
        >
      </div>
    </div>

    <!-- Filter Toggle Bar -->
    <div class="flex justify-center mt-6">
      <div class="ops-toggle-rail flex gap-1 p-1.5">
        <button
          v-for="toggle in toggles"
          :key="toggle"
          type="button"
          @click="activeToggle = toggle"
          :aria-pressed="activeToggle === toggle"
          :class="[
            'ops-toggle-chip ops-focus-ring px-5 py-1.5 text-[13px] font-bold',
            activeToggle === toggle
              ? 'bg-white text-primary shadow-sm'
              : 'text-text-secondary',
          ]"
        >
          {{ toggle }}
        </button>
      </div>
    </div>
  </section>
</template>
