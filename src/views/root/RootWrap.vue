<template>
  <home-nav-bar/>
  <div id="content">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" v-if="this.$route.meta.keepAlive"/>
      </keep-alive>
      <component :is="Component" v-if="!this.$route.meta.keepAlive"/>
    </router-view>
  </div>
</template>

<script>
  import HomeNavBar from "components/bar/HomeNavBar";

  export default {
    name: "RootWrap",
    components: {
      HomeNavBar
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 1500px) {
    #content {
      width: 60%;
      min-width: 900px;
      margin: 0 auto;
      padding: 64px 0;
      min-height: 120vh;

    }
  }

  @media screen and (max-width: 1500px) and (min-width: 940px) {
    #content {
      width: 900px;
      margin: 0 auto;
      padding: 64px 0;
      min-height: 120vh;
    }
  }
  @media screen and (max-width: 940px) and (min-width: 840px) {
    #content {
      width: 800px;
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