<script setup lang="ts">
import { computed } from "vue";
import { useFlightStore } from "~/store/useFlightStore";

const flightStore = useFlightStore();

// Mengubah struktur objek dari Pinia menjadi array agar mudah dirender dengan v-for
const cards = computed(() => {
  const summary = flightStore.summaryCards;
  if (!summary) return [];

  return [
    {
      title: "Daily",
      current: summary.daily.current,
      limit: summary.daily.limit,
    },
    {
      title: "Weekly",
      current: summary.weekly.current,
      limit: summary.weekly.limit,
    },
    {
      title: "Monthly",
      current: summary.monthly.current,
      limit: summary.monthly.limit,
    },
    {
      title: "Annual",
      current: summary.annual.current,
      limit: summary.annual.limit,
    },
  ];
});

// Logika visual indicator untuk progress bar
const getProgress = (current: number, limit: number) => {
  const percentage = (current / limit) * 100;
  let colorClass = "bg-success"; // Status aman (Hijau)

  if (percentage >= 100) {
    colorClass = "bg-danger"; // Melewati batas (Merah)
  } else if (percentage >= 80) {
    colorClass = "bg-warning"; // Mendekati batas (Kuning)
  }

  return {
    width: `${Math.min(percentage, 100)}%`, // Mencegah bar melebihi lebar 100%
    colorClass,
  };
};
</script>

<template>
  <div
    class="grid grid-cols-2 gap-3 sm:flex sm:overflow-x-auto sm:snap-x sm:pb-2 hide-scrollbar"
  >
    <template v-if="cards.length">
      <article
        v-for="card in cards"
        :key="card.title"
        class="ops-surface-card ops-limit-card h-28 p-4 flex flex-col justify-between select-none sm:min-w-[160px] sm:snap-center"
        :aria-label="`${card.title} limit ${card.current} of ${card.limit} hours used`"
      >
        <span
          class="text-xs font-bold text-text-secondary uppercase tracking-wider"
          >{{ card.title }} Limit</span
        >

        <div class="mt-auto">
          <!-- Nilai Metrik -->
          <div class="flex items-baseline gap-1.5">
            <span class="text-2xl font-black text-primary leading-none">{{
              card.current
            }}</span>
            <span class="text-xs font-semibold text-text-secondary"
              >/ {{ card.limit }}h</span
            >
          </div>

          <!-- Progress Bar Visual Indicator -->
          <div class="ops-limit-track mt-3 h-1.5 w-full">
            <div
              :class="[
                'ops-limit-bar h-full',
                getProgress(card.current, card.limit).colorClass,
              ]"
              :style="{ width: getProgress(card.current, card.limit).width }"
            ></div>
          </div>
        </div>
      </article>
    </template>

    <!-- Loading Skeleton -->
    <template v-else>
      <div
        v-for="i in 4"
        :key="i"
        class="ops-surface-card ops-limit-skeleton h-28 p-4 animate-pulse flex flex-col justify-between sm:min-w-[160px]"
      >
        <div class="h-3 w-16 bg-gray-200 rounded"></div>
        <div class="h-6 w-20 bg-gray-200 rounded mt-auto"></div>
        <div class="h-1.5 w-full bg-gray-200 rounded-full mt-3"></div>
      </div>
    </template>
  </div>
</template>
