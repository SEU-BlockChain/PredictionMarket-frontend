<template>
  <div id="head"/>

  <div id="body-left">
    <var-card id="left-card" class="card" elevation="0">
      <template #extra>
        <var-sticky
          :offset-top="offset_top"
          z-index="1001">
          <var-tabs v-model:active="category">
            <var-tab v-for="c in bbs_category" @click="change_category(c.id)">{{c.category}}</var-tab>
            <div id="space"></div>
            <var-menu id="order" :offset-y="36" v-model:show="show_order">
              <div @click="show_order=true">帖子排序:{{bbs_order[order].text}}</div>
              <template #menu>
                <div class="cell-list">
                  <var-cell class="order-option" v-for="(o,k) in bbs_order" @click="change_order(o,k)">{{o.text}}
                  </var-cell>
                </div>
              </template>
            </var-menu>

          </var-tabs>
          <var-divider margin="0"/>
        </var-sticky>
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
          <div class="clear-fix">
            <div id="input-wrap">
              <var-input
                :hint="false"
                :line="false"
                placeholder="搜索文章"
                v-model="search"
                id="search-input"
              />
            </div>
            <div id="search-btn">
              <var-icon style="margin: 10px 0" name="magnify-plus-outline"/>
              搜索
            </div>
          </div>

          <div style="height: 20px;"/>

          <div class="card-btn" @click="this.$router.push('/bbs/post-article')">
            <var-icon class="icon" size="20" name="plus"/>
            <span>发布帖子</span>
            <var-icon class="icon" style="float: right" size="20" name="chevron-right"/>
          </div>
        </div>
      </template>
    </var-card>
  </div>

  <var-button id="post-article" type="success" round @click="this.$router.push('/bbs/post-article')">
    <var-icon size="28" name="plus"/>
  </var-button>
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

        query: {},
        category: 0,
        bbs_category: this.$settings.bbs_category,

        order: 0,
        show_order: false,
        bbs_order: [
          {
            text: "最新",
            field: "-update_time"
          },
          {
            text: "最早",
            field: "update_time"
          },
          {
            text: "最多评论",
            field: "-comment_num"
          },
          {
            text: "最多点赞",
            field: "-up_num"
          },
          {
            text: "最多浏览",
            field: "-view_num"
          },
        ],
        search: ""
      }
    },
    methods: {
      load() {
        let query = Object.keys(this.query).map(x => x + "=" + this.query[x]).join("&")
        this.$ajax.api.get(
          this.next || `bbs/article/?${query}`,
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
      },
      clear() {
        this.article_list = []
        this.next = null
        this.loading = true
      },
      change_category(category_id) {
        if (category_id) {
          this.query.category = category_id
        } else {
          delete this.query.category
        }
        this.clear()
        this.load()
      },
      change_order(o, k) {
        this.query.order = o.field
        this.order = k
        this.show_order = false
        this.clear()
        this.load()
      }
    },
    computed: {
      offset_top() {
        return document.body.scrollWidth > 840 ? 64 : 54
      }
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    #post-article {
      display: none;
    }

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


    #card-btn-wrap {
      width: 80%;
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

    #input-wrap {
      width: 70%;
      float: left;
      height: 40px;
      border: 1px solid #ffe14c;
      border-radius: 5px 0 0 5px;
    }

    #search-input {
      padding: 4px;
    }

    #search-btn {
      width: 30%;
      float: left;
      background-color: #ffe14c;
      line-height: 40px;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      border-radius: 0 5px 5px 0;
    }
  }

  @media screen and (max-width: 840px) {
    #body-right {
      display: none;
    }

    #post-article {
      position: fixed;
      right: 40px;
      bottom: 120px;
    }

    #head {
      background-color: #ccc;
      margin: 5px;
      width: calc(100% - 10px);
      height: 150px;
      border-radius: 5px;
    }

    #body-left {
      width: 100%;
      padding: 5px;
    }
  }

  #space {
    width: calc(60% - 100px);
  }

  #order {
    line-height: 44px;
    width: 100px;
    font-size: 12px;
    cursor: pointer;
  }

  #order:hover {
    color: #4ebaee;
  }

  .order-option {
    background-color: whitesmoke;
    cursor: pointer;
  }

  .order-option:hover {
    background-color: white;
    color: #4ebaee;
  }
</style>