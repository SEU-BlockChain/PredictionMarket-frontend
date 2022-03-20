<template>
  <home-nav-bar/>
  <div id="content">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"  v-if="$route.meta.keepAlive"/>
      </keep-alive>
      <component :is="Component"  v-if="!$route.meta.keepAlive"/>
    </router-view>
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
      width: 60%;
      min-width: 750px;
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