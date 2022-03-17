<template>
  <router-view v-if="this.$store.state.is_init"/>
  <div class="background"/>
  <var-back-top bottom="60px" :duration="300"/>
</template>

<script>
  export default {
    name: "app",
    beforeCreate() {
      let token = this.$cookies.get("token")
      if (!token) {
        this.$store.commit("initialize")
      } else {
        this.$ajax.api.get(
          "user/user_info/",
        ).then(res => {
          if (res.data.code === 107) {
            this.$store.commit("login", res.data.result.user)
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 2000,
            })
          }
          this.$store.commit("initialize")
        }).catch(err => {
          this.$store.commit("initialize")
          this.$tip({
            content: err,
            type: "error",
            duration: 2000,
          })
        })
      }
    },
  }
</script>

<style>
  @import "assets/css/base.css";
</style>
