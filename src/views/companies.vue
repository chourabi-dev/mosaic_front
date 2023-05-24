<template>
  <div class="not-found">
    <div class="card">
      <div class="card-header">
        <h1>Page introuvable *</h1>
      </div>
      <div class="card-body">
        <div class="alert alert-danger">oups</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home"
};
</script>
<style lang="scss" scoped>
.not-found {
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  .card {
    max-width: 500px;
    margin: auto;
    h1 {
      color: #000;
      font-size: 1rem;
    }
  }
}
</style>
