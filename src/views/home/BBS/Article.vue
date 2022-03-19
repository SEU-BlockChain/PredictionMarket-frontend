<template>
  <div id="wrap" class="clear-fix" v-if="ready">
    <div id="left">
      <var-card id="content-card" class="card" elevation="0">
        <template #extra>
          <div id="title">{{article.title}}</div>
          <div id="show"></div>
          <div id="time">文章发表:{{this.$settings.filters.date(article.update_time)}}</div>
          <div id="content" class="limited-xy2" v-html="article.content"/>
        </template>
      </var-card>
    </div>

    <div id="right">
      <var-card id="user-card" class="card" elevation="0">
        <template #extra>
          <div class="clear-fix">
            <img id="avatar" :src="this.$settings.cos_url+article.author.icon"/>

            <div id="author">{{article.author.username}}</div>
            <div>
              <var-chip id="level" :round="false" type="warning" size="mini">
                Lv.{{this.$settings.rank(article.author.experience).level}}
              </var-chip>
            </div>
          </div>
        </template>
      </var-card>

      <var-card id="other-article-card" class="card" elevation="0">
        <template #extra>
          <div id="other-article-text">
            {{article.author.username}}的其它文章
          </div>
          <var-divider margin="0"/>
          <div style="height: 200px"></div>
        </template>
      </var-card>

      <var-sticky :offset-top="100">
        <var-card id="interact-card" class="card" elevation="0">
          <template #extra>
            <var-row>
              <var-col span="8">
                <div class="interact" style="border-right: 1px solid #eee">
                  <img class="interact-icon" src="~assets/img/comment.svg" height="30" alt="">
                  <div class="interact-text">{{article.comment_num}}</div>
                </div>
              </var-col>
              <var-col span="8">
                <div class="interact" style="border-right: 1px solid #eee">
                  <img class="interact-icon" src="~assets/img/up.svg" height="30" alt="">
                  <div class="interact-text">{{article.up_num}}</div>
                </div>
              </var-col>

              <var-col span="6">
                <div class="interact">
                  <img class="interact-icon" src="~assets/img/down.svg" height="30" alt="">
                  <div class="interact-text">{{article.down_num}}</div>
                </div>
              </var-col>
            </var-row>
          </template>
        </var-card>

        <br>
        <var-button type="primary" @click="this.$router.return('/bbs')">返回论坛首页</var-button>

      </var-sticky>
    </div>
  </div>

</template>

<script>
  export default {
    name: "Article",
    data() {
      return {
        article: {},
        ready: false
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
          this.ready = true
        }
      })
    },
    created() {
      scrollTo(0, 0)
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
    }

    #right {
      float: left;
      width: 30%;
    }


    #content-card {
      padding: 30px 60px;
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

    #user-card {
      padding: 20px;
      margin-bottom: 30px;
    }

    #avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      float: left;
      cursor: pointer;
      margin-right: 20px;
    }

    #author {
      font-size: 20px;
      font-weight: bold;
      color: #666;
      cursor: pointer;
    }

    #level {
      margin-top: 7px;
      float: left;
      cursor: pointer;
    }

    #interact-card {
      margin-bottom: 20px;
      padding: 10px 0;
      text-align: center;
    }

    #other-article-card {
      margin-bottom: 20px;
    }

    #other-article-text {
      font-size: 14px;
      line-height: 30px;
      text-indent: 10px;
      color: #666666;
    }

    .interact-icon {
      overflow: hidden;
      position: relative;
      transform: translateY(-80px);
      filter: drop-shadow(0 80px #999);
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
    }

    .interact {
      cursor: pointer;
    }

    .interact:hover img {
      filter: drop-shadow(0 80px #4ebaee);
    }

    .interact:hover {
      color: #4ebaee;
    }
  }
</style>