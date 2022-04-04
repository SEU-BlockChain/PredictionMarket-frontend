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
    created() {
      this.$store.commit("get_web3", [this.$eth.web3, 3])
      this.$eth.getWeb3().then(res => {
        this.$store.commit("get_web3", res)
        if (res[1] === 1) {
          res[0].eth.getAccounts().then(accounts => {
            this.$store.commit("change_account", accounts[0])
          })
          window.ethereum.on("accountsChanged", res => this.$store.commit("change_account", res[0]))
          this.$tip({
            content: "已连接到钱包",
            type: "success",
            duration: 3000
          })
        } else {
          this.$tip({
            content: "未检测到钱包，正在以只读模式浏览",
            type: "warning",
            duration: 3000
          })
        }
      }).catch(reason => {
        console.log(reason);
        this.$tip({
          content: "正在以只读模式浏览",
          type: "warning",
          duration: 3000
        })
      })
    }
  }
</script>

<style>
  @import "assets/css/base.css";
</style>
