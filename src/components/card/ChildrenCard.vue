<template>
  <div class="children-comment-wrap" :class="{'new':children_comment.new}">
    <div class="clear-fix">
      <img class="children-comment-avatar" :src="this.$settings.cos_url+children_comment.author.icon"/>
      <div class="children-comment-author">
        <var-chip v-if="author_id===children_comment.author.id" type="info" size="mini">楼主</var-chip>
        {{children_comment.author.username}}
      </div>
      <div class="children-comment-time">{{this.$settings.filters.date(children_comment.comment_time)}}</div>
    </div>
    <div class="children-comment-content limited-xy2" v-html="children_comment.content"
         @click="show_editor(children_comment)">
    </div>
    <interact-bar :comment="children_comment"/>
  </div>
</template>

<script>
  import InteractBar from "../bar/InteractBar";

  export default {
    name: "ChildrenCard",
    components: {InteractBar},
    component: {
      InteractBar
    },
    props: {
      author_id: null,
      root_comment: null,
      children_comment: null,
    },
    emits: [
      "show_editor",
    ],
    methods: {
      show_editor(target) {
        this.$emit("show_editor", this.root_comment, target)
      },
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    .children-comment-wrap {
      padding: 40px;
    }
  }

  @media screen and (max-width: 840px) {
    .children-comment-wrap {
      padding: 25px 20px;
    }
  }

  .children-comment-avatar {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-right: 10px;
    float: left;
    cursor: pointer;
  }

  .children-comment-author {
    float: left;
    line-height: 25px;
    font-size: 15px;
    color: #4ebaee;
  }

  .children-comment-time {
    float: right;
    line-height: 25px;
    font-size: 15px;
    color: #666;
  }

  .children-comment-content {
    padding-left: 35px;
    margin: 5px 0;
    cursor: pointer;
  }


  .new {
    background-color: #f5f5dc;
  }
</style>