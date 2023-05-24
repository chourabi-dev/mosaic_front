<template>
  <div id="app">
    <Background />
    <transition
      :duration="{ enter: 900, leave: 200 }"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <router-view />
    </transition>
  </div>
</template>
<script>
import Background from "@/components/Background.vue";
export default {
  components: {
    Background
  }
};
</script>
<style lang="scss">
@import "@/assets/scss/template.scss";
#app {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>
