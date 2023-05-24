<template>
  <div class="modal fade show">
    <div class="modal-dialog modal-lg" v-if="user">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" @click="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="d-flex justify-content-center mb-1">
            <img :src="user.image" alt="mosaic" class="img-modal" />
          </div>
        </div>
        <div class="modal-footer justify-content-between">
          <button type="button" class="btn btn-outline-default">
            <i class="fa-arrow-circle-left"></i>
          </button>
          <p>
            <strong>{{ user.nom }}</strong> : {{ user.message }}
          </p>
          <button type="button" class="btn btn-outline-default">
            <i class="fa-arrow-circle-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["user"]),
    getImage() {
      return `${process.env.VUE_APP_IMAGES}/L20/C${this.user.col}L${this.user.row}.png`;
    }
  },
  methods: {
    close() {
      this.$store.commit("setUser", {});
      this.$emit("closeModal", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.modal.show {
  display: block;
  background: rgba(0, 0, 0, 0.8);
  .img-modal {
    max-height: 300px;
  }
}
.modal-footer {
  .btn {
    font-size: 25px;
  }
}
</style>
