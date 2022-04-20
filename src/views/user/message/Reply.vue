<template>
  <var-card id="interact-card" class="card reply-wrap">
    <template #extra>
      <var-list
        :finished="finished"
        v-model:loading="loading"
        @load="load"
      >
        <reply-card v-for="reply in replies" :reply="reply"/>
      </var-list>
    </template>
  </var-card>
</template>

<script>
  import ReplyCard from "components/card/ReplyCard";

  export default {
    name: "Reply",
    components: {
      ReplyCard
    },
    data() {
      return {
        replies: [],
        finished: false,
        loading: false,
        next: null
      }
    },
    methods: {
      load() {
        this.$ajax.api.get(
          this.next || "/user/reply"
        ).then(res => {
          for (let i of res.data.result.results) {
            this.replies.push(i)
          }
          if (res.data.result.next) {
            this.next = res.data.result.next.match(/(\/user\/reply\/.*)/)[0]
          }
          this.finished = !Boolean(res.data.result.next)
          this.loading = false
        })
      }
    },
  }
</script>

<style scoped>
  .reply-wrap {
    margin-top: 20px;
    padding: 25px 15px;
  }
</style>