<template>
  <VitePwaManifest />
  <NuxtLoadingIndicator color="#E63757" :height="3" />
  <ClientOnly>
    <PwaInstallPrompt />
  </ClientOnly>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
