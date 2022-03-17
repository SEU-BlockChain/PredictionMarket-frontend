<template>
  <home-nav-bar/>
  <div id="content">
    <router-view/>
  </div>
</template>

<script>
  import HomeNavBar from "components/bar/HomeNavBar";

  export default {
    name: "HomeWrap",
    components: {
      HomeNavBar
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    #content {
      width: 56%;
      margin: 0 auto;
      padding: 64px 0;
      min-height: 120vh;

    }
  }

  @media screen and (max-width: 840px) {
    #content {
      padding: 98px 0 0;
      min-height: 120vh;
    }
  }
</style>