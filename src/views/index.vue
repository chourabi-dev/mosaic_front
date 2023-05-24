<template>
  <div class="view">
    <Loading v-if="loading" />
    <router-view />
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    Loading
  },
  computed: {
    ...mapGetters(["loading"])
  }
};
</script>
<style lang="scss" scoped>
.view {
  width: 100%;
  z-index: 1;
}
</style>
