<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { ChevronLeft, ChevronRight, Check } from "lucide-vue-next";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  parseISO,
  isSameDay,
} from "date-fns";
import { useSchedStore } from "~/store/useSchedStore";

const schedStore = useSchedStore();
const TOAST_DURATION_MS = 2200;

// Sesuai aturan anchor date di brief Susi Air
const ANCHOR_DATE = parseISO("2026-05-31");

// State untuk bulan yang sedang dilihat di kalender
const currentMonth = ref(startOfMonth(ANCHOR_DATE));

// State untuk placeholder klik detail
const selectedDate = ref<string | null>(null);
const showToast = ref(false);
const toastCountdown = ref(2.2);
let toastTimeout: ReturnType<typeof setTimeout> | null = null;
let toastInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  schedStore.fetchSchedules();
});

onBeforeUnmount(() => {
  clearToastTimers();
});

// --- LOGIKA NAVIGASI KALENDER ---
const nextMonth = () => (currentMonth.value = addMonths(currentMonth.value, 1));
const prevMonth = () => (currentMonth.value = subMonths(currentMonth.value, 1));

// --- LOGIKA GRID KALENDER ---
// Menghasilkan array tanggal untuk ditampilkan di grid (termasuk tanggal sisa dari bulan sebelum/sesudahnya)
const calendarDays = computed(() => {
  const start = startOfWeek(startOfMonth(currentMonth.value), {
    weekStartsOn: 1,
  }); // Mulai Senin
  const end = endOfWeek(endOfMonth(currentMonth.value), { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
});

const toastProgress = computed(
  () => `${(toastCountdown.value / (TOAST_DURATION_MS / 1000)) * 100}%`,
);

const clearToastTimers = () => {
  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toastTimeout = null;
  }

  if (toastInterval) {
    clearInterval(toastInterval);
    toastInterval = null;
  }
};

const hideToast = () => {
  clearToastTimers();
  showToast.value = false;
};

// --- FUNGSI INTERAKSI TANGGAL ---
const handleDateClick = (dateStr: string) => {
  selectedDate.value = dateStr;

  clearToastTimers();

  toastCountdown.value = TOAST_DURATION_MS / 1000;
  showToast.value = true;

  toastInterval = setInterval(() => {
    toastCountdown.value = Math.max(
      0,
      Number((toastCountdown.value - 0.1).toFixed(1)),
    );
  }, 100);

  toastTimeout = setTimeout(() => {
    hideToast();
  }, TOAST_DURATION_MS);
};
</script>

<template>
  <main
    class="min-h-screen bg-background pb-8 pt-4 px-4 flex flex-col ops-safe-top"
  >
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="showToast"
        class="ops-toast-panel fixed left-1/2 top-5 z-[60] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 overflow-hidden border border-primary/15 bg-primary text-white"
      >
        <div class="absolute inset-x-0 top-0 h-1 bg-white/10">
          <div
            class="h-full bg-brand transition-[width] duration-100 ease-linear"
            :style="{ width: toastProgress }"
          ></div>
        </div>

        <div class="px-4 pb-4 pt-4">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span
                  class="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-2 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white/80"
                >
                  Schedule
                </span>
                <span class="text-xs font-medium text-white/60"
                  >{{ toastCountdown.toFixed(1) }}s</span
                >
              </div>

              <p class="mt-3 text-sm font-semibold leading-5">
                Detail page coming soon
              </p>

              <p class="mt-1 text-xs leading-5 text-white/75">
                Date detail belum tersedia pada build ini.
              </p>

              <p
                v-if="selectedDate"
                class="mt-3 inline-flex items-center rounded-full border border-white/12 bg-white/8 px-3 py-1 text-xs font-semibold tracking-wide text-white/85"
              >
                {{ format(parseISO(selectedDate), "dd MMM yyyy") }}
              </p>
            </div>

            <button
              type="button"
              @click="hideToast"
              class="ops-icon-button ops-focus-ring mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-white/15 bg-white/10 text-base leading-none text-white/80 hover:bg-white/15 hover:text-white"
              aria-label="Close toast"
            >
              ×
            </button>
          </div>

          <div
            class="mt-4 flex items-center justify-between border-t border-white/10 pt-3"
          >
            <span
              class="text-xs font-medium uppercase tracking-[0.16em] text-white/55"
            >
              Pilot Schedule Notice
            </span>
            <span class="text-xs font-semibold text-white/80">
              Coming soon
            </span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Header Kalender & Navigasi -->
    <div class="ops-surface-card flex justify-between items-center mb-6 p-4">
      <button
        type="button"
        @click="prevMonth"
        class="ops-icon-button ops-tap-feedback ops-focus-ring p-2 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-primary"
      >
        <ChevronLeft :size="20" />
      </button>
      <h1 class="text-lg font-bold text-primary">
        {{ format(currentMonth, "MMMM yyyy") }}
      </h1>
      <button
        type="button"
        @click="nextMonth"
        class="ops-icon-button ops-tap-feedback ops-focus-ring p-2 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-primary"
      >
        <ChevronRight :size="20" />
      </button>
    </div>

    <!-- Grid Kalender -->
    <div class="ops-surface-card p-4 mb-6">
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div
          v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
          :key="day"
          class="text-center text-xs font-bold text-text-secondary uppercase"
        >
          {{ day }}
        </div>
      </div>

      <!-- Kotak Tanggal -->
      <div class="grid grid-cols-7 gap-1.5">
        <button
          v-for="day in calendarDays"
          :key="day.toString()"
          type="button"
          @click="handleDateClick(format(day, 'yyyy-MM-dd'))"
          :class="[
            'ops-calendar-cell ops-focus-ring relative h-14 flex flex-col justify-start items-center p-1 cursor-pointer border',
            isSameMonth(day, currentMonth)
              ? 'bg-white border-gray-100 hover:border-primary/30'
              : 'bg-gray-50 border-transparent opacity-50',
          ]"
          :aria-label="`Open schedule for ${format(day, 'dd MMMM yyyy')}`"
        >
          <span
            :class="[
              'text-sm font-semibold z-10',
              isSameDay(day, ANCHOR_DATE)
                ? 'bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full'
                : 'text-text-primary mt-1',
            ]"
          >
            {{ format(day, "d") }}
          </span>

          <template v-if="schedStore.scheduleMap[format(day, 'yyyy-MM-dd')]">
            <div
              class="absolute inset-0 rounded-[inherit] opacity-20"
              :style="{
                backgroundColor:
                  schedStore.scheduleMap[format(day, 'yyyy-MM-dd')].base_color,
              }"
            ></div>

            <!-- Kode Duty -->
            <span
              class="text-xs font-bold mt-auto mb-1 relative z-10"
              :style="{
                color:
                  schedStore.scheduleMap[format(day, 'yyyy-MM-dd')].base_color,
              }"
            >
              {{ schedStore.scheduleMap[format(day, "yyyy-MM-dd")].base_name }}
            </span>

            <span
              v-if="
                schedStore.scheduleMap[format(day, 'yyyy-MM-dd')]
                  .count_schedules
              "
              class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-sm"
              :style="{
                backgroundColor:
                  schedStore.scheduleMap[format(day, 'yyyy-MM-dd')].base_color,
              }"
            >
              <Check
                v-if="
                  schedStore.scheduleMap[format(day, 'yyyy-MM-dd')]
                    .count_logbooks ===
                  schedStore.scheduleMap[format(day, 'yyyy-MM-dd')]
                    .count_schedules
                "
                :size="10"
                stroke-width="3"
              />

              <template v-else>
                {{
                  schedStore.scheduleMap[format(day, "yyyy-MM-dd")]
                    .count_schedules
                }}
              </template>
            </span>
          </template>
        </button>
      </div>
    </div>

    <!-- Legenda Duty Type -->
    <div class="ops-surface-card mt-6 p-4">
      <h3 class="text-xs font-bold text-text-secondary uppercase mb-3 px-1">
        Legend
      </h3>
      <div class="flex flex-wrap gap-2.5">
        <div
          v-for="item in schedStore.legend"
          :key="item.code"
          class="flex items-center gap-1.5 w-[calc(50%-10px)]"
        >
          <span
            class="w-3 h-3 rounded-full shadow-sm"
            :style="{ backgroundColor: item.color }"
          ></span>
          <span class="text-xs font-medium text-text-primary truncate"
            >{{ item.code }} - {{ item.label }}</span
          >
        </div>
      </div>
    </div>
  </main>
</template>
