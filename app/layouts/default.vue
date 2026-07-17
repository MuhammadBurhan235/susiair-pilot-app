<script setup lang="ts">
import { Home, CalendarDays, BookOpen, MoreHorizontal } from "lucide-vue-next";
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col md:flex-row">
    <nav
      class="ops-nav-shell fixed bottom-0 w-full flex justify-around px-2 pt-3 z-50 md:sticky md:top-0 md:w-24 md:h-screen md:flex-col md:justify-start md:items-center md:pt-8 md:gap-8"
    >
      <NuxtLink
        to="/home"
        class="ops-nav-item ops-focus-ring"
        exact-active-class="!text-primary"
      >
        <div class="ops-nav-icon-wrapper">
          <Home :size="24" :stroke-width="2" />
        </div>
        <span class="ops-nav-label">Home</span>
      </NuxtLink>

      <NuxtLink
        to="/schedule"
        class="ops-nav-item ops-focus-ring"
        exact-active-class="!text-primary"
      >
        <div class="ops-nav-icon-wrapper">
          <CalendarDays :size="24" :stroke-width="2" />
        </div>
        <span class="ops-nav-label">Schedule</span>
      </NuxtLink>

      <button
        type="button"
        class="ops-nav-item ops-nav-item-disabled"
        disabled
        aria-disabled="true"
      >
        <div class="ops-nav-icon-wrapper">
          <BookOpen :size="24" :stroke-width="2" />
        </div>
        <span class="ops-nav-label">Logbook</span>
      </button>

      <button
        type="button"
        class="ops-nav-item ops-nav-item-disabled"
        disabled
        aria-disabled="true"
      >
        <div class="ops-nav-icon-wrapper">
          <MoreHorizontal :size="24" :stroke-width="2" />
        </div>
        <span class="ops-nav-label">More</span>
      </button>
    </nav>

    <!-- Slot konten utama -->
    <main class="flex-1 ops-nav-offset w-full md:w-auto md:min-w-0">
      <slot />
    </main>
  </div>
</template>
