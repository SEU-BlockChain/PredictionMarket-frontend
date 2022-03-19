<template>
  <div class="clear-fix">
    <div class="interact-wrap" :class="{active:comment.is_up===false}" @click="voteComment(0)">
      <img class="icon" src="~assets/img/down.svg" height="15" alt="">
      <span class="text">{{comment.down_num}}</span>
    </div>

    <div class="interact-wrap" :class="{active:comment.is_up===true}" @click="voteComment(1)">
      <img class="icon" src="~assets/img/up.svg" height="15" alt="">
      <span class="text">{{comment.up_num}}</span>
    </div>

    <div class="interact-wrap" v-if="comment_num">
      <img class="icon" src="~assets/img/comment.svg" height="15" alt="">
      <span class="text">{{comment.comment_num}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "InteractBar",
    props: {
      comment_num: null,
      comment: null
    },
    methods: {
      voteComment(is_up) {
        this.$ajax.api.post(
          `bbs/article/${this.$route.params.id}/comment/${this.comment.id}/vote/`,
          {
            is_up
          }
        ).then(res => {
          if (res.data.code === 125) {
            this.$settings.upAndDown(is_up, this.comment)

          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    .interact-wrap {
      float: right;
      margin: 0 10px;
    }

    .icon {
      overflow: hidden;
      position: relative;
      transform: translateX(500px);
      filter: drop-shadow(-500px 0 #999);
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
    }

    .text {
      line-height: 15px;
      min-width: 25px;
    }

    .interact-wrap {
      cursor: pointer;
    }

    .active img {
      filter: drop-shadow(-500px 0 #4ebaee);
    }

    .active {
      color: #4ebaee;
    }

    .interact-wrap:hover img {
      filter: drop-shadow(-500px 0 #4ebaee);
    }

    .interact-wrap:hover {
      color: #4ebaee;
    }
  }
</style>