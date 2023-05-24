<template>
  <div class="page">
    <div class="home">
      <img src="@/assets/images/150.png" width="img-fluid" />
      <transition
        :duration="{ enter: 900, leave: 200 }"
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut"
      >
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
export default {};
</script>
<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  min-height: 550px;
  padding: 5px;
  margin: 30px 0;
  background: transparent;
  width: 100%;
  overflow-x: hidden;
  div {
    width: 100%;
    z-index: 1;
  }
  img {
    width: 150px;
    margin: 15px auto 50px;
  }
  .home-content {
    text-align: center;
    h3 {
      text-transform: uppercase;
      font-size: 22px;
    }
  }
}
@media (min-width: 500px) {
  .home {
    min-height: 550px;
    padding: 15px 135px;
    width: 700px;
  }
}
</style>
