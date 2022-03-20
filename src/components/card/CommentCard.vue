<template>
  <div class="comment-wrap clear-fix" :class="{'new':comment.new}">
    <div class="comment-left">
      <img class="avatar" :src="this.$settings.cos_url+comment.author.icon"/>

    </div>
    <div class="comment-right">
      <div class="clear-fix">
        <div class="author">{{comment.author.username}}</div>
        <var-chip class="level" :round="false" type="warning" size="mini">
          Lv.{{this.$settings.rank(comment.author.experience).level}}
        </var-chip>
      </div>
      <div class="time">{{this.$settings.filters.date(comment.comment_time)}}</div>

      <div class="root-comment limited-xy2" v-html="comment.content" @click="show_editor(comment,null)"/>

      <interact-bar class="interact" :comment="comment" :comment_num="true"/>

      <div id="children-comments" v-if="!sketch">
        <div class="children-comment" v-for="children_comment in comment.children_comment"
             :class="{'new':children_comment.new}">
          <div class="clear-fix">
            <img class="children-comment-avatar" :src="this.$settings.cos_url+children_comment.author.icon"/>
            <div class="children-comment-author">{{children_comment.author.username}}</div>
            <div class="children-comment-time">{{this.$settings.filters.date(children_comment.comment_time)}}</div>
          </div>
          <div class="children-comment-content limited-xy2" v-html="children_comment.content"
               @click="show_editor(comment,children_comment)">
          </div>
          <interact-bar :comment="children_comment"/>
        </div>
        <div class="foot" v-if="comment.comment_num>2">
          <div class="all" @click="show_children_comments">查看全部{{comment.comment_num}}条评论></div>
        </div>
      </div>
    </div>
  </div>
  <var-divider inset="45" style="border-top: 1px solid #f1f1f1" />
</template>

<script>
  import InteractBar from "../bar/InteractBar";

  export default {
    name: "CommentCard",
    components: {
      InteractBar
    },
    props: {
      comment: null,
      sketch: false,
    },
    emits: [
      "show_editor",
      "show_children_comments",
    ],
    methods: {
      show_editor(parent, target) {
        this.$emit("show_editor", parent, target)
      },
      show_children_comments() {
        this.$emit("show_children_comments", this.comment)
      }
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    .comment-left {
      float: left;
      width: 10%;
    }

    .comment-right {
      float: left;
      width: 90%;
    }
    .comment-wrap {
      padding: 30px 6%;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      float: left;
      cursor: pointer;
    }

    .children-comment {
      padding: 10px 20px;
    }

  }

  @media screen and (max-width: 840px) {
    .comment-left {
      float: left;
      width: 45px;
    }

    .comment-right {
      float: left;
      width: calc(100% - 50px);
    }
    .comment-wrap {
      padding: 5px;
    }

    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      float: left;
      cursor: pointer;
    }

    .children-comment {
      padding: 10px;
    }
  }

  .new {
    background-color: #f5f5dc;
  }



  .author {
    float: left;
    line-height: 20px;
    font-size: 14px;
    color: #666;
    cursor: pointer;
  }

  .level {
    float: left;
    margin: 2px;
    cursor: pointer;
  }

  .time {
    line-height: 20px;
    font-size: 14px;
    color: #999999;
  }

  .root-comment {
    margin-top: 20px;
    cursor: pointer;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    float: left;
    cursor: pointer;
  }


  #children-comments {
    background-color: #f7f8fc;
    border-radius: 5px;
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

  .all {
    line-height: 40px;
    text-align: center;
    font-size: 12px;
    color: #999;
    cursor: pointer;
  }

  .all:hover {
    color: #4ebaee;
  }

  .interact {
    margin: 20px;
  }
</style>