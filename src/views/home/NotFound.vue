<template>
  <div id="wrap">
    <var-image width="200px" style="margin: 0 auto"
               src=" https://sc-1304907527.cos.ap-nanjing.myqcloud.com/static/404.png"/>
    <div id="text">页面不见了...</div>
    <div id="link">
      <router-link replace="true" to="/home">返回首页</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "NotFound"
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    #wrap {
      padding: 200px 0;
    }

    #text {
      line-height: 50px;
      font-size: 20px;
      margin: 40px;
      font-weight: bold;
      text-align: center;
    }

    #link {
      text-align: center;
    }
  }
</style>