<script setup lang="ts">
import { Home, CalendarDays, BookOpen, MoreHorizontal } from "lucide-vue-next";
</script>

<template>
  <!-- Padding bawah (pb-16) agar konten tidak tertutup navigasi -->
  <div class="min-h-screen bg-background ops-nav-offset">
    <!-- Tempat di mana konten halaman (Home/Schedule) akan dirender -->
    <slot />

    <!-- Bottom Navigation -->
    <nav
      class="ops-nav-shell fixed bottom-0 w-full flex justify-around px-2 pt-3 z-50"
    >
      <NuxtLink
        to="/home"
        class="ops-nav-item ops-focus-ring"
        exact-active-class="!text-primary"
      >
        <Home :size="24" />
        <span class="ops-nav-label">Home</span>
      </NuxtLink>

      <NuxtLink
        to="/schedule"
        class="ops-nav-item ops-focus-ring"
        exact-active-class="!text-primary"
      >
        <CalendarDays :size="24" />
        <span class="ops-nav-label">Schedule</span>
      </NuxtLink>

      <!-- Placeholder (Tidak perlu dibuat halamannya menurut brief) -->
      <button
        type="button"
        class="ops-nav-item ops-nav-item-disabled"
        disabled
        aria-disabled="true"
      >
        <BookOpen :size="24" />
        <span class="ops-nav-label">Logbook</span>
      </button>

      <button
        type="button"
        class="ops-nav-item ops-nav-item-disabled"
        disabled
        aria-disabled="true"
      >
        <MoreHorizontal :size="24" />
        <span class="ops-nav-label">More</span>
      </button>
    </nav>
  </div>
</template>
