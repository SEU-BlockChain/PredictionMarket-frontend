<template>
  <div id="head"/>

  <div id="body-left">
    <var-card id="left-card" class="card" elevation="0">
      <template #extra>
        <div id="top">123</div>
        <var-divider margin="0"/>
        <div id="articles">
          <var-list
            :finished="finished"
            v-model:loading="loading"
            @load="load"
            :offset="200"
          >
            <div :key="item" v-for="item in article_list">
              <article-card :article="item"/>
            </div>
          </var-list>
        </div>
      </template>
    </var-card>
  </div>

  <div id="body-right">
    <var-card id="right-card" class="card" elevation="0">>
      <template #extra>
        <div id="card-btn-wrap">
          <div class="card-btn" @click="this.$router.push('/bbs/post-article')">
            <var-icon class="icon" size="20" name="plus"/>
            <span>发布帖子</span>
            <var-icon class="icon" style="float: right" size="20" name="chevron-right"/>
          </div>
        </div>
      </template>
    </var-card>
  </div>

</template>

<script>

  import ArticleCard from "components/card/ArticleCard";

  export default {
    name: "BBS",
    components: {
      ArticleCard
    },
    data() {
      return {
        article_list: [],
        finished: false,
        loading: false,
        next: null,
      }
    },
    methods: {
      load() {
        this.$ajax.api.get(
          this.next || "bbs/article/",
        ).then(res => {
          if (res.data.code === 112) {
            for (let i of res.data.result.results) {
              this.article_list.push(i)
            }
            this.loading = false
            if (res.data.result.next)
              this.next = res.data.result.next.match(/(\/bbs\/article\/.*)/)[0]
            this.finished = !Boolean(res.data.result.next)
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 2000,
            })
          }
          this.$store.commit("initialize")
        }).catch(err => {
          this.$tip({
            content: err,
            type: "error",
            duration: 2000,
          })
        })
      }
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    #head {
      background-color: #ccc;
      margin: 20px 0;
      width: 100%;
      height: 150px;
    }

    #body-left {
      width: 68%;
      margin-right: 2%;
      float: left;
      margin-bottom: 200px;
    }

    #body-right {
      width: 30%;
      float: left;
    }

    #top {
      margin: 10px;
    }

    #card-btn-wrap {
      width: 70%;
      margin: 30px auto;

    }

    .card-btn {
      width: 100%;
      line-height: 40px;
      font-size: 15px;
      font-weight: bolder;
      border-radius: 5px;
      background-color: #ffe14c;
      cursor: pointer;
    }

    .icon {
      margin: 10px;
      cursor: pointer;
    }
  }
</style>