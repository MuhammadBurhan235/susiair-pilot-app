<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Bell, PlaneTakeoff, FileText } from "lucide-vue-next";

// Import Store
import { useFlightStore } from "~/store/useFlightStore";
import { useDocStore } from "~/store/useDocStore";

// Import Komponen
import LimitCards from "~/components/dashboard/LimitCards.vue";
import TrendChart from "~/components/dashboard/TrendChart.vue";

const flightStore = useFlightStore();
const docStore = useDocStore();

// --- Mock Data (Nanti akan dipindah dan di-fetch melalui Pinia) ---

const pilot = ref({
  avatar:
    "https://ui-avatars.com/api/?name=John+Doe&background=0E2138&color=fff",
});

const upcomingFlight = ref({
  date: "31 May 2026",
  time: "08:00 - 09:30",
  departure: { icao: "HLP", city: "Jakarta" },
  arrival: { icao: "CJN", city: "Pangandaran" },
});

const news = ref([
  { id: 1, title: "New SOP for Pangandaran Route", date: "30 May 2026" },
  { id: 2, title: "Fleet Maintenance Schedule Update", date: "28 May 2026" },
  { id: 3, title: "Company Townhall Q3", date: "25 May 2026" },
]);

// Panggil semua data saat komponen dimuat
onMounted(() => {
  flightStore.fetchFlightData();
  docStore.fetchDocuments();
});
</script>

<template>
  <main class="min-h-screen bg-background pb-8">
    <!-- 1. Header Section -->
    <header
      class="relative overflow-hidden rounded-b-[20px] bg-primary p-6 text-white shadow-[0_4px_12px_rgba(14,33,56,0.08)]"
    >
      <div
        class="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 pointer-events-none"
      ></div>

      <div class="flex justify-between items-center relative z-10">
        <div class="flex items-center gap-4">
          <img
            :src="pilot.avatar"
            alt="Avatar"
            class="w-14 h-14 rounded-full border-2 border-surface object-cover"
          />
          <div>
            <p class="text-sm text-gray-300 font-medium">Good morning,</p>
            <h1 class="text-xl font-bold">
              {{ flightStore.pilot?.name || "Loading..." }}
            </h1>
            <p
              class="text-xs mt-1 bg-white/10 inline-block px-2.5 py-1 rounded-md border border-white/20"
            >
              {{ flightStore.pilot?.totalFlightHours || 0 }} Total Hours
            </p>
          </div>
        </div>

        <button
          type="button"
          class="ops-icon-button ops-tap-feedback ops-focus-ring relative p-2.5 bg-white/10 hover:bg-white/20 active:bg-white/15 border border-white/10"
        >
          <Bell :size="22" />
          <span
            class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-brand rounded-full border-2 border-primary"
          ></span>
        </button>
      </div>
    </header>

    <div class="p-5 space-y-6 -mt-3">
      <!-- 2. Upcoming Flights Card -->
      <section>
        <h2 class="ops-section-title mb-3 ml-1">Upcoming Flight</h2>
        <div class="ops-surface-card p-5">
          <div
            class="flex justify-between items-center mb-5 pb-3 border-b border-gray-100"
          >
            <span
              class="text-[12px] font-semibold text-text-secondary uppercase tracking-wider"
              >{{ upcomingFlight.date }}</span
            >
            <span
              class="text-sm font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg"
              >{{ upcomingFlight.time }}</span
            >
          </div>

          <div class="flex justify-between items-center relative">
            <div class="text-center w-1/3">
              <h3 class="text-[22px] font-black text-primary leading-tight">
                {{ upcomingFlight.departure.icao }}
              </h3>
              <p class="text-xs font-medium text-text-secondary mt-1">
                {{ upcomingFlight.departure.city }}
              </p>
            </div>

            <div
              class="flex-1 flex items-center justify-center text-gray-300 relative px-2"
            >
              <div
                class="h-px bg-gray-300 w-full border-dashed border-t-2"
              ></div>
              <PlaneTakeoff
                :size="24"
                class="absolute text-brand bg-surface px-1"
              />
            </div>

            <div class="text-center w-1/3">
              <h3 class="text-[22px] font-black text-primary leading-tight">
                {{ upcomingFlight.arrival.icao }}
              </h3>
              <p class="text-xs font-medium text-text-secondary mt-1">
                {{ upcomingFlight.arrival.city }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Latest News (Horizontal Scroll) -->
      <section>
        <h2 class="ops-section-title mb-3 ml-1">Latest News</h2>
        <div class="flex overflow-x-auto gap-4 pb-2 snap-x hide-scrollbar">
          <article
            v-for="item in news"
            :key="item.id"
            class="ops-surface-card ops-transition-standard ops-card-hover min-w-[260px] p-4 snap-center"
          >
            <span
              class="text-xs text-text-secondary uppercase font-bold tracking-wider"
              >{{ item.date }}</span
            >
            <p
              class="text-sm font-medium mt-1.5 text-text-primary leading-snug"
            >
              {{ item.title }}
            </p>
          </article>
        </div>
      </section>

      <!-- 4. Hours to Limit Section -->
      <section class="space-y-4">
        <div class="flex justify-between items-end px-1">
          <h2 class="ops-section-title mb-3 ml-1">Hours to Limit</h2>
        </div>

        <!-- Grid 4 Kotak (Daily, Weekly, Monthly, Annual) -->
        <LimitCards />

        <!-- Grafik Garis Rolling Sum -->
        <TrendChart />
      </section>

      <!-- 5. My Documents -->
      <section>
        <h2 class="ops-section-title mb-3 ml-1">My Documents</h2>

        <div class="ops-surface-card overflow-hidden">
          <button
            v-for="doc in docStore.processedDocuments"
            :key="doc.id"
            type="button"
            class="ops-interactive-row ops-focus-ring ops-transition-standard ops-tap-feedback flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
          >
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-background rounded-lg text-primary">
                <FileText :size="20" stroke-width="1.5" />
              </div>
              <div>
                <p class="text-sm font-semibold text-text-primary">
                  {{ doc.label }}
                </p>
                <p class="text-xs font-medium text-text-secondary mt-0.5">
                  Exp: {{ doc.expiryDate }}
                </p>
              </div>
            </div>

            <div :class="['ops-status-chip', doc.status.class]">
              {{ doc.status.label }}
            </div>
          </button>

          <!-- Skeleton Loading My Documents -->
          <div v-if="!docStore.processedDocuments.length" class="w-full">
            <div
              v-for="i in 3"
              :key="'skel-' + i"
              class="flex items-center justify-between p-4 border-b border-gray-50"
            >
              <div class="flex items-center gap-3 w-full">
                <div
                  class="w-10 h-10 bg-gray-100 rounded-lg animate-pulse"
                ></div>
                <div class="flex-1 space-y-2">
                  <div
                    class="h-3 bg-gray-100 rounded w-1/2 animate-pulse"
                  ></div>
                  <div
                    class="h-2 bg-gray-100 rounded w-1/3 animate-pulse"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
