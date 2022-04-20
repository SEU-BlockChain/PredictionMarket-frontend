<template>
  <div id="pc-nav-bar">
    <home-nav-bar/>
  </div>

  <div id="content">
    <router-view/>
  </div>
</template>

<script>
  import HomeNavBar from "components/bar/HomeNavBar";

  export default {
    name: "UserWrap",
    components: {
      HomeNavBar
    },
  }
</script>

<style scoped>
  @media screen and (min-width: 1500px) {
    #content {
      width: 60%;
      min-width: 900px;
      margin: 0 auto;
      padding: 64px 0;

    }
  }

  @media screen and (max-width: 1500px) and (min-width: 940px) {
    #content {
      width: 900px;
      margin: 0 auto;
      padding: 64px 0;
    }
  }

  @media screen and (max-width: 940px) and (min-width: 840px) {
    #content {
      width: 800px;
      margin: 0 auto;
      padding: 64px 0;
    }
  }

  @media screen and (max-width: 840px) {
    #pc-nav-bar {
      display: none;
    }
    #content {
      padding: 54px 0 0;
    }
  }
</style>