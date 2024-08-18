<template>
  <div>
    <Toast position="bottom-right" />
    <NavBar />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: "Dynloadnuxt",
})
</script>

<style lang="scss">
.selectedMenuBarTab {
  &>div {
    background-color: var(--p-menubar-item-focus-background);
  }
}
</style>