<template>
  <div id="title">
    用户信息
    <var-divider margin="0"/>
  </div>
  <div id="wrap">
    <var-image
      id="avatar"
      width="120"
      height="120"
      fit="cover"
      style="display: inline-block"
      :src="this.$settings.cos_url + (this.$store.state.user.icon || 'icon/login.jpg')"
    />
    <div id="edit-icon">修改头像</div>
    <var-divider/>

    <div class="text">用户ID</div>
    <div class="context">{{user.id}}</div>

    <div class="text">用户昵称</div>
    <div class="context editable" @click="edit_username">{{user.username}}</div>

    <div class="text">绑定手机</div>
    <div class="context editable" @click="edit_phone">{{user.phone}}</div>

    <div class="text">注册时间</div>
    <div class="context">{{user.date_joined.substring(0,10)}}</div>

    <div class="text">个性签名</div>
    <div class="context description editable" @click="edit_description">{{user.description}}&nbsp;</div>
  </div>

  <var-popup style="border-radius: 20px" v-model:show="is_pou_up">
    <div id="pop-up">
      <div id="pop-title">
        {{["修改用户名","绑定手机","解除绑定","修改个性签名"][type]}}
      </div>


      <div id="pop-content">
        <div v-if="type===0">
          <username :placeholder="'新用户名'" v-model:username="user.username"/>
        </div>

        <div v-if="type===1 ||type===2">
          <div v-if="is_phone">
            <phone v-model:phone="user.phone" :disabled="true"/>
            <msg-code v-model:code="code" :method="is_phone?'unbind_phone':'bind_phone'" :phone="user.phone"/>
          </div>
          <div v-else>
            <phone v-model:phone="phone"/>
            <msg-code v-model:code="code" :method="is_phone?'unbind_phone':'bind_phone'" :phone="phone"/>
          </div>
        </div>
      </div>

      <div v-if="type===3">
        <var-input placeholder="请输入文本" textarea v-model="user.description"/>
      </div>

      <div id="confirm">
        <var-button block type="success" size="small" @click="confirm">确定</var-button>
      </div>
    </div>
  </var-popup>
</template>

<script>
  import Username from "components/input/Username";
  import Phone from "components/input/Phone";
  import MsgCode from "components/input/MsgCode";

  export default {
    name: "Profile",
    components: {
      Username,
      Phone,
      MsgCode
    },
    data() {
      return {
        user: this.$store.state.user,
        value: "",
        is_pou_up: false,
        type: null,
        phone: "",
        code: "",
        re_pattens: this.$settings.re_pattens
      }
    },
    computed: {
      is_phone() {
        return this.user.phone !== "未绑定"
      }
    },
    methods: {
      edit_username() {
        this.is_pou_up = true
        this.type = 0
      },
      edit_phone() {
        this.is_pou_up = true
        if (this.user.phone === "未绑定") {
          this.type = 1
        } else {
          this.type = 2
        }
      },
      edit_description() {
        this.is_pou_up = true
        this.type = 3
      },
      confirm() {
        let url, data
        switch (this.type) {
          case 0:
            if (!this.re_pattens.username.test(this.username)) return

            url = "/user/user_info/"
            data = {
              username: this.user.username
            }
            break
          case 1:
            if (!this.re_pattens.phone.test(this.phone)) return
            if (!this.re_pattens.code.test(this.code)) return

            url = "/user/bind_phone/"
            data = {
              phone: this.phone,
              code: this.code
            }
            break
          case 2:
            if (!this.re_pattens.code.test(this.code)) return

            url = "/user/unbind_phone/"
            data = {
              phone: this.user.phone,
              code: this.code
            }
            break

          case 3:
            if (!this.user.description) return
            url = "/user/user_info/"
            data = {
              description: this.user.description,
            }
            break
        }

        let request = this.$ajax.api.post(
          url,
          data
        )

        switch (this.type) {
          case 0:
          case 3:
            request.then(res => {
              if (res.data.code === 108) {
                this.$tip({
                  content: "用户信息修改成功",
                  type: "success",
                  duration: 1000,
                })
                this.is_pou_up = false
                this.$cookies.set("token", res.data.result.token)
                this.$store.commit("login", res.data.result["user"])
              } else {
                this.$tip({
                  content: res.data.msg,
                  type: "warning",
                  duration: 1000,
                })
              }
            })
            break
          case 1:
            request.then(res => {
              if (res.data.code === 105) {
                this.$tip({
                  content: "绑定成功",
                  type: "success",
                  duration: 1000,
                })
                this.is_pou_up = false
                this.user.phone = this.phone
              } else {
                this.$tip({
                  content: res.data.msg,
                  type: "warning",
                  duration: 1000,
                })
              }
            })
            break
          case 2:
            request.then(res => {
              if (res.data.code === 106) {
                this.$tip({
                  content: "解除绑定成功",
                  type: "success",
                  duration: 1000,
                })
                this.is_pou_up = false
                this.user.phone = "未绑定"
              } else {
                this.$tip({
                  content: res.data.msg,
                  type: "warning",
                  duration: 1000,
                })
              }
            })
        }

        request.catch(err => {
          this.$tip({
            content: err,
            type: "warning",
            duration: 1000,
          })
        })
      }
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    #wrap {
      margin: 30px;
    }

    #title {
      line-height: 50px;
      font-size: 20px;
      font-weight: bold;
      text-indent: 30px;
    }

    #avatar {
      margin: 0 calc(50% - 60px);
      cursor: pointer;
    }

    #edit-icon {
      text-align: center;
      cursor: pointer;
      font-size: 10px;
    }

    #edit-icon:hover {
      color: #4ebaee;
    }

    .text {
      display: inline-block;
      width: 20%;
      margin-right: 3%;
      line-height: 40px;
      text-align: right;
      color: #999;
    }

    .context {
      display: inline-block;
      line-height: 40px;
      width: 70%;
    }

    .editable {
      margin: 4px 0;
      padding: 0 5px;
      border: 1px solid #ebebeb;
      border-radius: 5px;
      cursor: pointer;
    }

    .editable:hover {
      color: #4ebaee;
      border: 1px solid #4ebaee;
    }

    .description {
      word-wrap: break-word;
    }

    #pop-up {
      width: 400px;
      border-radius: 40px;
      padding: 20px;
    }

    #pop-title {
      text-align: center;
      font-size: 20px;
      line-height: 40px;
      font-weight: bold;
    }

    #pop-content {
      padding: 10px;
    }

    #confirm {
      margin-top: 10px;
    }

  }

  @media screen and (max-width: 840px) {
    #title{
      display: none;
    }

    #wrap {
      padding: 10px;
    }

    #avatar {
      margin: 20px calc(50% - 60px) 0;
    }

    #edit-icon {
      text-align: center;
      font-size: 10px;
    }

    .text {
      display: inline-block;
      width: 20%;
      margin-right: 3%;
      line-height: 40px;
      text-align: right;
      color: #999;
    }

    .context {
      display: inline-block;
      line-height: 40px;
      width: 70%;
    }

    .editable {
      margin: 4px 0;
      padding: 0 5px;
      border: 1px solid #ebebeb;
      border-radius: 5px;
    }

    .editable:hover {
      color: #4ebaee;
      border: 1px solid #4ebaee;
    }

    .description {
      word-wrap: break-word;
    }

    #pop-up {
      width: 350px;
      border-radius: 40px;
      padding: 20px;
    }

    #pop-title {
      text-align: center;
      font-size: 20px;
      line-height: 40px;
      font-weight: bold;
    }

    #pop-content {
      padding: 10px;
    }

    #confirm {
      margin-top: 10px;
    }
  }
</style>