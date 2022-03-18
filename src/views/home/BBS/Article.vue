<template>
  <div id="wrap" class="clear-fix">
    <var-card id="left" class="card" elevation="0">
      <template #extra>
        <div id="title">{{article.title}}</div>
        <div id="show"></div>
        <div id="time">文章发表:{{this.$settings.filters.date(article.update_time)}}</div>
        <div id="content" class="limited-xy" v-html="article.content"/>
      </template>
    </var-card>

    <var-card id="right" class="card" elevation="0">
      <template #extra>
        {{article.author}}
      </template>
    </var-card>
  </div>

</template>

<script>
  export default {
    name: "Article",
    data() {
      return {
        article: {}
      }
    },
    beforeCreate() {
      this.$ajax.api.get(
        `bbs/article/${this.$route.params.id}`
      ).then(res => {
        if (res.data.code !== 111) {
          this.$tip({
            content: res.data.msg,
            type: "warning",
            duration: 1000,
          })
        } else {
          this.article = res.data.result
        }
      })
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    #wrap {
      margin-top: 50px;
    }

    #left {
      float: left;
      width: 68%;
      margin-right: 2%;
      padding: 30px 60px;
    }

    #right {
      float: left;
      width: 30%;
      padding: 20px;
    }

    #title {
      font-size: 20px;
      font-weight: bold;
    }

    #show {
      background-color: #f2f2f2;
      border-radius: 2px;
      width: 100%;
      height: 30px;
      margin: 20px 0 0;
    }

    #time {
      text-align: center;
      line-height: 30px;
      font-size: 10px;
      color: #999999;
      margin-bottom: 20px;
    }
  }
</style>