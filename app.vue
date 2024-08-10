<template>
  <div>
    <nav>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/login">Login</NuxtLink>
    </nav>
    <NuxtPage />
    <WebsocketIndicator />
  </div>
</template>

<style lang="scss">
nav {
  display: flex;
  gap: 0.333rem;
}
</style>