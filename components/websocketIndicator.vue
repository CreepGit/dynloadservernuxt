<template>
  <div
    class="indicator"
    :class="{
      open: ws.status == 'open',
      unopened: ws.status == 'unopened',
      closed: ws.status == 'closed',
    }"
  ></div>
</template>

<script lang="ts" setup>
const ws = useWsStore();
</script>

<style scoped>
.indicator {
  background: black;
  border-radius: 100000px;
  width: 40px;
  height: 40px;
}
.open {
  background: green !important;
}
.unopened {
  background: grey !important;
}
.closed {
  background: red !important;
}
</style>