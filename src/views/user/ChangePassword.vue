<template>
  <var-app-bar id="pe-nav-bar" title-position="center" color="#2b2b2b" title="修改密码">
    <template #left>
      <var-button
        round
        text
        color="transparent"
        text-color="#ffffff"
        @click="this.$router.return('/home')"
      >
        <var-icon name="chevron-left" :size="24"/>
      </var-button>
    </template>
  </var-app-bar>

  <div id="wrap">
    <var-image id="logo" src="https://sc-1304907527.cos.ap-nanjing.myqcloud.com/static/logo256.png"/>
    <var-divider>
      <div id="title">修改密码</div>
    </var-divider>

    <var-card v-if="!success" class="card" id="card">
      <template #extra>
        <password placeholder="旧密码" v-model:password="old_password"/>
        <password placeholder="新密码" v-model:password="new_password"/>
        <password placeholder="确认密码" v-model:password="confirm_password" :confirm="new_password"/>

        <div id="login-btn">
          <var-button block type="success" size="small" @click="change_password">确认修改</var-button>
        </div>
      </template>
    </var-card>

    <div v-else>
      <var-icon id="success" size="100px" color="green" name="check-circle-outline"/>
      <div style="text-align: center">修改完成，{{t}}秒后跳转到登陆页</div>
    </div>
  </div>
</template>

<script>
  import Password from "components/input/Password";

  export default {
    name: "ChangePassword",
    components: {
      Password
    },
    data() {
      return {
        old_password: "",
        new_password: "",
        confirm_password: "",
        re_pattens: this.$settings.re_pattens,
        success: false,
        t: 5
      }
    },
    methods: {
      change_password() {
        if (!this.re_pattens.password.test(this.old_password)) return
        if (!this.re_pattens.password.test(this.new_password)) return
        if (!this.re_pattens.password.test(this.confirm_password)) return
        if (this.new_password !== this.confirm_password) return

        this.$ajax.api.post(
          "user/change_password/",
          {
            old_password: this.old_password,
            new_password: this.new_password,
            confirm_password: this.confirm_password,
          }
        ).then(res => {
          if (res.data.code === 104) {
            this.$cookies.remove("token")
            this.success = true
            let inter = setInterval(() => {
              if (this.t === 1) {
                this.$router.push({path: "/user/login", query: {next: this.$route.query.next}})
                clearInterval(inter)
              }
              this.t--
            }, 1000)
            this.$store.commit("logout")
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
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
    #pe-nav-bar {
      display: none;
    }

    #wrap {
      width: 350px;
      margin: 50px auto;
    }

    #logo {
      width: 100px;
      height: 100px;
      margin: 50px auto 30px;
    }

    #title {
      font-size: 30px;
      margin: 10px;
    }

    #card {
      padding: 20px;
    }

    #login-btn {
      margin: 20px 0;
    }

    #success {
      margin: 30px 125px;
    }


  }

  @media screen and (max-width: 840px) {
    #pe-nav-bar {
      position: fixed;
      left: 0;
      top: 0;
      width: 100vw;
    }

    #wrap {
      margin: 20px;
    }

    #card {
      padding: 20px;
    }

    #logo {
      width: 100px;
      margin: 20px auto;
    }

    #success {
      margin: 20px calc(50vw - 70px);
    }
  }
</style>