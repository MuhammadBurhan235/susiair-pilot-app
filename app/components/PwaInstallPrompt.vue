<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from "vue";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
const isInstalled = ref(false);
const dismissed = ref(false);
const isSecureInstallContext = ref(false);

const storageKey = "ops-pwa-install-dismissed";

const canShowPrompt = computed(
  () =>
    isSecureInstallContext.value &&
    !isInstalled.value &&
    !dismissed.value &&
    !!deferredPrompt.value,
);

const handleBeforeInstallPrompt = (event: Event) => {
  event.preventDefault();
  deferredPrompt.value = event as BeforeInstallPromptEvent;
};

const handleAppInstalled = () => {
  isInstalled.value = true;
  deferredPrompt.value = null;
};

const dismissPrompt = () => {
  dismissed.value = true;
  localStorage.setItem(storageKey, "true");
};

const installApp = async () => {
  if (!deferredPrompt.value) {
    return;
  }

  await deferredPrompt.value.prompt();
  const choice = await deferredPrompt.value.userChoice;

  if (choice.outcome === "accepted") {
    isInstalled.value = true;
  }

  deferredPrompt.value = null;
};

onMounted(() => {
  dismissed.value = localStorage.getItem(storageKey) === "true";
  isSecureInstallContext.value =
    window.isSecureContext || window.location.hostname === "localhost";

  const mediaQuery = window.matchMedia("(display-mode: standalone)");
  isInstalled.value =
    mediaQuery.matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true;

  if (!isSecureInstallContext.value) {
    return;
  }

  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.addEventListener("appinstalled", handleAppInstalled);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  window.removeEventListener("appinstalled", handleAppInstalled);
});
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="canShowPrompt"
      class="fixed inset-x-4 top-4 z-[70] mx-auto w-auto max-w-sm"
    >
      <div
        class="ops-surface-card border-primary/10 bg-white/95 p-4 backdrop-blur"
      >
        <div class="flex items-start gap-3">
          <div class="min-w-0 flex-1">
            <p
              class="text-xs font-bold uppercase tracking-[0.16em] text-text-secondary"
            >
              Install App
            </p>
            <p class="mt-1 text-sm font-semibold text-text-primary">
              Add Susi Air Ops to your home screen.
            </p>
            <p class="mt-1 text-xs leading-5 text-text-secondary">
              Faster relaunch, standalone mode, and offline shell via service
              worker.
            </p>
          </div>

          <button
            type="button"
            class="ops-icon-button ops-focus-ring h-8 w-8 shrink-0 border border-gray-200 text-text-secondary hover:bg-gray-50 hover:text-primary"
            aria-label="Dismiss install prompt"
            @click="dismissPrompt"
          >
            ×
          </button>
        </div>

        <div class="mt-4 flex items-center gap-2">
          <button
            type="button"
            class="ops-transition-standard ops-tap-feedback ops-focus-ring rounded-full bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand/95 active:bg-brand/90"
            @click="installApp"
          >
            Install now
          </button>

          <button
            type="button"
            class="ops-transition-standard ops-tap-feedback ops-focus-ring rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-text-secondary hover:border-gray-300 hover:text-primary active:bg-gray-50"
            @click="dismissPrompt"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
