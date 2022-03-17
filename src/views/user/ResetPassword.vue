<template>
  <var-app-bar id="pe-nav-bar" title-position="center" color="#2b2b2b" title="忘记密码">
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

    <div id="step-wrap">
      <var-steps :active="active">
        <var-step>确认账号</var-step>
        <var-step>重置密码</var-step>
        <var-step>重置成功</var-step>
      </var-steps>
    </div>

    <div id="input-wrap">
      <div v-if="active===0">
        <phone v-model:phone="phone"/>
        <msg-code v-model:code="code" method="reset_password" :phone="phone"/>
      </div>

      <div v-if="active===1">
        <var-input placeholder="电话号码" :line="false" disabled v-model="phone"/>
        <br>
        <password placeholder="新密码" v-model:password="password"/>
        <password placeholder="确认密码" v-model:password="confirm_password" :confirm="password"/>
      </div>

      <div v-if="active===2">
        <var-icon id="success" size="100px" color="green" name="check-circle-outline"/>
        <div style="text-align: center">修改完成，{{t}}秒后跳转到登陆页</div>
      </div>

      <br>
      <var-button v-if="active<2" type="primary" block @click="next">下一步</var-button>
    </div>
  </div>
</template>

<script>
  import Phone from "components/input/Phone";
  import MsgCode from "components/input/MsgCode";
  import Password from "components/input/Password";

  export default {
    name: "ResetPassword",
    components: {
      Password,
      Phone,
      MsgCode
    },
    data() {
      return {
        phone: "",
        code: "",
        active: 0,
        password: "",
        confirm_password: "",
        re_pattens: this.$settings.re_pattens,
        t: 5
      }
    },
    methods: {
      next() {
        switch (this.active) {
          case 0:
            if (!this.re_pattens.phone.test(this.phone)) return
            if (!this.re_pattens.code.test(this.code)) return
            this.validate_code()
            break
          case 1:
            if (!this.re_pattens.password.test(this.password)) return
            if (!this.re_pattens.password.test(this.confirm_password)) return
            if (this.password !== this.confirm_password) return
            this.reset_password()
            let inter = setInterval(() => {
              if (this.t === 1) {
                this.$router.push({path: "/user/login", query: {next: this.$route.query.next}})
                clearInterval(inter)
              }
              this.t--
            }, 1000)
            break
        }
      },
      validate_code() {
        this.$ajax.api.get(
          "common/code/",
          {
            params: {
              phone: this.phone,
              method: "reset_password",
              code: this.code
            }
          },
        ).then(res => {
          if (res.data.code !== 110) {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          } else {
            this.active++
          }
        }).catch(err => {
          this.$tip({
            content: err,
            type: "error",
            duration: 2000,
          })
        })
      },
      reset_password() {
        this.$ajax.api.post(
          "user/reset_password/",
          {
            phone: this.phone,
            code: this.code,
            password: this.password,
            confirm_password: this.confirm_password
          }
        ).then(res => {
          if (res.data.code === 104) {
            this.$cookies.remove("token")
            this.$store.commit("logout")
            this.active++
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
      width: 400px;
      margin: 0 auto;
    }


    #logo {
      width: 100px;
      height: 100px;
      margin: 50px auto 30px;
    }

    #step-wrap {
      padding: 20px 0;
    }

    #input-wrap {
      padding: 30px;
    }

    #success {
      margin: 30px 120px 50px;
    }
  }

  @media screen and (max-width: 840px) {
    #pe-nav-bar {
      position: fixed;
      left: 0;
      top: 0;
      width: 100vw;
    }

    #input-wrap {
      margin: 20px 30px;
    }

    #logo {
      width: 100px;
      margin: 20px auto;
    }

    #success {
      margin: 20px calc(50% - 50px);
    }
  }
</style>