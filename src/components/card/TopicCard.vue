<template>
  <div class="clear-fix topic-wrap" @click="this.$router.push(`/topic-detail/${topic.id}`)">
    <div class="left">
      <img class="topic-img" :src="this.$settings.cos_url+topic.data[2]" alt="">
    </div>
    <div class="left">
      <div class="title">#{{topic.data[1]}}#</div>
      <div class="time">创建时间:{{(new this.$settings.DateParser(topic.data[4]*1000)).year_month_day()}}</div>
      <div class="owner">创建者:{{topic.data[0].toUpperCase()}}</div>
      <div class="predictions">事件个数:{{topic.data[3].length}}</div>
    </div>
  </div>
  <var-divider margin="0"/>
</template>

<script>
  export default {
    name: "TopicCard",
    props: {
      topic: null
    },
  }
</script>

<style scoped>
  .topic-wrap {
    cursor: pointer;
  }

  .topic-wrap:hover {
    background-color: #f6f6f6;
  }

  .title {
    font-size: 16px;
    font-weight: bold;

  }

  .owner, .time, .predictions {
    font-size: 10px;
    color: #999;
  }

  .topic-img{
    vertical-align: bottom;
    margin-right: 10px;
    width: 100px;
    height: 100px;
  }


</style>