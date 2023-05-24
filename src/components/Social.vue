<template>
  <div class="social">
    <p class="text-center">
      Cliquez sur la mosaïque pour agrandir les photos et découvrir les messages
      des participants
    </p>
    <ul class="list-unstyled d-flex justify-content-center align-items-center">
      <li><i class="fa-facebook"></i></li>
      <li><i class="fa-twitter"></i></li>
      <li><i class="fa-instagram"></i></li>
      <li>
        <a href="mailto:test.com" target="blank"
          ><i class="fa-paper-plane"></i
        ></a>
      </li>
    </ul>
    <div class="text-center pb-2">
      <p>
        Pour connaître notre politique de confidentialité,
        <a href="#">cliquez-ici</a>
      </p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.social {
  color: #ffffff;
  ul li {
    margin: 0 15px;
    a,
    i {
      font-size: 30px;
      color: #ffffff;
      text-decoration: none;
    }
  }
  a {
    color: #ffffff;
    text-decoration: underline;
  }
}
</style>
