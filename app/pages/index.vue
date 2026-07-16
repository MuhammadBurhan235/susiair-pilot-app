<script setup lang="ts">
import { useRouter } from "vue-router";

// Matikan default layout agar Bottom Navigation tidak muncul di halaman Login
definePageMeta({
  layout: false,
});

const router = useRouter();

const handleLogin = () => {
  // Langsung navigasi ke halaman Home
  router.push("/home");
};
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-8 ops-safe-top"
  >
    <div class="ops-auth-panel w-full max-w-sm px-5 py-8 sm:px-6">
      <!-- Implementasi Logo Susi Air -->
      <div class="mb-8 flex w-full justify-center">
        <img
          src="/susiair-pilot-ops-index.png"
          alt="Susi Air Logo"
          class="ops-auth-logo h-auto w-full max-w-[240px] object-contain"
        />
      </div>

      <div class="mb-6 text-center">
        <p class="text-sm text-text-secondary">
          Access schedules, limits, and operational documents.
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="w-full flex flex-col gap-4">
        <label class="space-y-2">
          <span
            class="text-xs font-bold uppercase tracking-[0.16em] text-text-secondary"
          >
            Username
          </span>
          <div class="ops-field-shell ops-transition-standard">
            <input
              type="text"
              placeholder="Enter your username"
              required
              class="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary outline-none placeholder:text-gray-400 enabled:cursor-text"
            />
          </div>
        </label>

        <label class="space-y-2">
          <span
            class="text-xs font-bold uppercase tracking-[0.16em] text-text-secondary"
          >
            Password
          </span>
          <div class="ops-field-shell ops-transition-standard">
            <input
              type="password"
              placeholder="Enter your password"
              required
              class="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-primary outline-none placeholder:text-gray-400 enabled:cursor-text"
            />
          </div>
        </label>

        <!-- Tombol Pill Shape (rounded-full) -->
        <button
          type="submit"
          class="ops-transition-standard ops-tap-feedback mt-2 w-full rounded-full bg-brand py-3.5 text-sm font-bold tracking-wide text-white shadow-md enabled:hover:bg-brand/95 enabled:hover:shadow-lg enabled:active:scale-95 enabled:active:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Sign In
        </button>
      </form>

      <!-- Helper Link -->
      <div class="mt-8 flex justify-center">
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
          class="ops-link-inline text-[13px] font-medium"
        >
          Need help? Contact CRD
        </a>
      </div>
    </div>
  </div>
</template>
