<template>
  <div v-if="this.$store.state.web3_init">{{this.$store.state.web3_type}}</div>
</template>

<script>

  export default {
    name: "HomePage",
  }
</script>

<style scoped>

</style>