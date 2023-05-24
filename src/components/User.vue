<template>
  <div class="show-overlay" v-if="user">
    <div id="ctclose">
      <a href="#" @click.prevent="closeOverlay"
        ><i class="fa-close fa-sm "></i
      ></a>
    </div>
    <div id="ctnom">{{ user.nom }}</div>
    <div id="ctmsg">{{ user.message }}</div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    closeOverlay() {
      this.$emit("closeOverlay", false);
      this.$store.commit("setUser", {});
    }
  }
};
</script>
