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
        123
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
          "bbs/article/" || this.next,
        ).then(res => {
          if (res.data.code === 112) {
            for (let i of res.data.result.results) {
              this.article_list.push(i)
            }
            this.loading = false
            this.next = res.data.result.next
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
    }

    #body-right {
      width: 30%;
      float: left;
    }

    #top {
      margin: 10px;
    }

  }
</style>