<template>
  <div id="content">
    <div class="clear-fix">
      <img id="avatar" :src="this.$settings.cos_url+article.author.icon"/>
      <div id="author">{{article.author.username}}</div>
    </div>
    <div>{{article}}</div>
  </div>
</template>

<script>
  export default {
    name: "ArticleCard",
    props: {
      article: Object
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    #content {
      margin: 20px;
    }

    #avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      float: left;
    }

    #author{
      line-height: 30px;
      margin: 0 5px;
      font-size: 14px;
      color: #666;
      float: left;
    }
  }
</style>