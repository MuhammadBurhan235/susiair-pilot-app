import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  ScheduleDataResponse,
  ScheduleItem,
  ScheduleLegendItem,
} from "~/types/domain";

export const useSchedStore = defineStore("schedule", () => {
  // --- 1. STATE ---
  const schedules = ref<ScheduleItem[]>([]);
  const legend = ref<ScheduleLegendItem[]>([]);

  // --- 2. ACTIONS ---
  const fetchSchedules = async () => {
    try {
      const res = await fetch("/data/mock-schedules.json");
      const data: ScheduleDataResponse = await res.json();

      // Ambil data schedules dan legend dari JSON
      schedules.value = data.schedules;
      legend.value = data.legend;
    } catch (error) {
      console.error("Gagal menarik data jadwal:", error);
    }
  };

  // --- 3. GETTERS ---
  // Mengonversi Array menjadi Object/Dictionary dengan Key berupa 'YYYY-MM-DD'
  const scheduleMap = computed(() => {
    const map: Record<string, ScheduleItem> = {};

    schedules.value.forEach((sched) => {
      // Gunakan duty_date sebagai kunci unik
      map[sched.duty_date] = sched;
    });

    return map;
  });

  return {
    schedules,
    legend,
    fetchSchedules,
    scheduleMap,
  };
});
