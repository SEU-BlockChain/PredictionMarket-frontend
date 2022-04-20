<template>
  <div v-if="reply">
    <div v-if="reply.reply_type===0" class="clear-fix">
      <div class="left0">
        <img class="avatar0" :src="this.$settings.cos_url+reply.comment.author.icon"/>
      </div>
      <div class="right0">
        <div>
          <span class="name0">{{reply.comment.author.username}}</span>
          <span class="type0">回复了你的文章</span>
        </div>
        <div class="content0">{{reply.comment.content}}</div>
        <div class="article0">{{reply.comment.article.title}}</div>
        <div class="time0">{{this.$settings.filters.date(reply.reply_time)}}</div>
      </div>
    </div>
    <div v-if="reply.reply_type===1" class="clear-fix">
      <div class="left1">
        <img class="avatar1" :src="this.$settings.cos_url+reply.comment.author.icon"/>
      </div>
      <div class="right1">
        <div>
          <span class="name1">{{reply.comment.author.username}}</span>
          <span class="type1">回复了你的评论</span>
        </div>
        <div class="content1">{{reply.comment.content}}</div>
        <div class="target1">
          <span class="target-name1">{{reply.comment.target.author.username}}</span>
          <span>:{{reply.comment.target.content}}</span>
        </div>
        <div class="time1">{{this.$settings.filters.date(reply.reply_time)}}</div>
      </div>
    </div>
    <var-divider inset="30"/>
  </div>
</template>

<script>
  export default {
    name: "ReplyCard",
    props: {
      reply: null
    }
  }
</script>

<style scoped>
  .left0, .left1 {
    float: left;
    width: 60px;
  }

  .avatar0, .avatar1 {
    width: 50px;
    border-radius: 50%;
  }

  .right0, .right1 {
    float: left;
    width: calc(100% - 60px);
  }

  .name0, .name1 {
    font-weight: bold;
    line-height: 20px;
  }

  .type0, .type1 {
    line-height: 20px;
    font-size: 15px;
    margin-left: 10px;
  }

  .content0, .content1 {
    margin: 10px 0;
  }

  .time0, .time1 {
    font-size: 13px;
    color: #888888;
  }

  .article0 {
    color: #333;
    background-color: #f4f4f4;
    padding: 15px;
    width: 100%;
    border-radius: 10px;
    margin: 10px 0;
  }

  .target1{
    border-left: 2px solid #4ebaee;
    padding-left: 10px;
    margin: 10px 0;
  }

  .target-name1{
    color: #4ebaee;
  }
</style>