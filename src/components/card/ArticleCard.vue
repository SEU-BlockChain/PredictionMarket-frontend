<template>
  <div id="wrap">
    <div class="clear-fix">
      <img id="avatar" :src="this.$settings.cos_url+article.author.icon"/>
      <div id="author">{{article.author.username}}</div>
      <var-chip id="level" :round="false" type="warning" size="mini">
        Lv.{{this.$settings.rank(article.author.experience).level}}
      </var-chip>
      <div id="time">{{this.$settings.filters.date(article.create_time)}}</div>
    </div>

    <div id="title" @click="this.$router.push(`/bbs/article/${article.id}`)">
      {{article.title}}
    </div>

    <div id="content" class="limited-xy" v-html="article.description"
         @click="this.$router.push(`/bbs/article/${article.id}`)"></div>

    <div class="clear-fix">
      <var-chip size="small" id="category">{{article.category.category}}</var-chip>

      <div class="text">{{article.comment_num}}</div>
      <img class="icon" src="~assets/img/comment.svg" height="20" alt="">

      <div class="text" :class="{upActive1:article.is_up===true}">{{article.up_num}}</div>
      <img class="icon" :class="{upActive:article.is_up===true}" src="~assets/img/up.svg" height="20" alt="">

      <div class="text">{{article.view_num}}</div>
      <img class="icon" src="~assets/img/view.svg" height="20" alt="">
    </div>
  </div>
  <div style="height: 10px;width: 100%;background-color: #f0f1f5"></div>

</template>

<script>
  import Level from "../chip/Level";

  export default {
    name: "ArticleCard",
    components: {Level},
    props: {
      article: Object
    },

  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    #wrap {
      padding: 20px;
    }
  }

  @media screen and (max-width: 840px) {
    #wrap {
      margin: 10px;
    }
  }

  #avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    float: left;
    cursor: pointer;
  }

  #author {
    line-height: 30px;
    margin: 0 5px;
    font-size: 14px;
    color: #666;
    float: left;
    cursor: pointer;
  }

  #level {
    margin-top: 7px;
    float: left;
    cursor: pointer;
  }

  #title {
    font-size: 20px;
    line-height: 40px;
    font-weight: 600;
    color: #333;
    cursor: pointer;
  }

  #content {
    margin: 10px 0;
    min-height: 60px;
    cursor: pointer;
  }

  #time {
    float: left;
    line-height: 30px;
    font-size: 14px;
    margin-left: 10px;
    color: #999999;
  }

  #category {
    float: left;
    cursor: pointer;
    margin: 3px;
    background-color: #f5f5f5;
  }

  .upActive {
    filter: drop-shadow(-500px 0 #4ebaee) !important;
  }

  .upActive1 {
    color: #4ebaee !important;
  }

  .icon {
    float: right;
    margin: 5px 0;
    overflow: hidden;
    position: relative;
    transform: translateX(500px);
    filter: drop-shadow(-500px 0 #999);
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
  }

  .text {
    line-height: 30px;
    float: right;
    min-width: 30px;
    color: #999;
  }

  #title:hover, #category:hover {
    cursor: pointer;
    color: #4ebaee;
  }


</style>