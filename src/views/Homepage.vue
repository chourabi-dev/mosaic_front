<template>
  <div class="homepage">
    <div>
      <h3>Mosaic SFR Business</h3>
    </div>
    <div class="mt-4">
      <p>Testez notre nouvelle animation !</p>
      <p>
        Envoyez vos photos et messages<br />
        et créons ensemble la mosaic SFR Business !
      </p>
    </div>
    <div class="home-btn d-flex justify-content-center mt-5 mb-3">
      <router-link
        :to="{ name: 'step1' }"
        class="bttn-pill bttn-md btn-particip"
        >Participer</router-link
      >
    </div>
    <router-link class="text-center text-link" :to="{ name: 'Case32' }">
      Accéder directement à la mosaïque
    </router-link>
  </div>
</template>
<style lang="scss" scoped>
.homepage {
  width: 100%;
  text-align: center;
  color: white;
  margin-top: 50px;
  .text-link {
    text-decoration: underline;
    color: white;
  }
}
.btn-particip {
  color: #adb5d2;
  border: 1px solid white;
  &:hover {
    transform: none;
    background: none;
    color: white;
    border: 1px solid white;
    box-shadow: none;
  }
}

.bttn-pill:after,
.bttn-pill:before {
  content: none;
}
</style>
