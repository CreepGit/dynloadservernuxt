<template>
  <div class="container">
    <div
      class="indicator"
      :class="{
        open: ws.status == 'open',
        unopened: ws.status == 'unopened',
        closed: ws.status == 'closed',
      }"
    ></div>
    <div class="text">
      <span>{{ capitalize(ws.status) }}</span>
      <br>
      <span>🔄{{ ws.updateCounter }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const ws = useWsStore();

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
</script>

<style scoped lang="scss">
.container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  border: 1px solid black;
  padding-right: 45px;
  height: 40px;
  border-radius: 1000000px;
  transition: opacity 500ms;

  & * {
    pointer-events: none;
  }

  &:hover {
    opacity: 15%;
  }
}
.indicator {
  background: black;
  border-radius: 100000px;
  width: 36px;
  height: 36px;
  position: absolute;
  top: 2px;
  right: 2px;
}
.text {
  padding: 2px;
  padding-left: 8px;
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