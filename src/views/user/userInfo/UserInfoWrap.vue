<template>
  <div id="pe-nav-bar">
    <var-app-bar
      title="用户信息"
      title-position="center"
      color="linear-gradient(to top, rgba(150,150,150,1),#2b2b2b)"
      :elevation="false"
    >
      <template #left>
        <var-button
          round
          text
          color="transparent"
          text-color="#ffffff"
          @click="this.$router.return('/root')"
        >
          <var-icon name="chevron-left" :size="24"/>
        </var-button>
      </template>
      <template #right>
        <var-menu :offset-y="36" offset-x="-100" v-model:show="show">
          <var-button
            round
            text
            color="transparent"
            text-color="#ffffff"
            @click="show = true"
          >
            <var-icon name="menu" :size="24"/>
          </var-button>

          <template #menu>
            <div id="menu" class="var-elevation--5">
              <var-cell class="menu-cell" v-ripple>
                <div @click="this.$router.push('/user/change-password')">
                  <var-icon size="20" name="cog-outline"/>
                  修改密码
                </div>
              </var-cell>
              <var-cell class="menu-cell" v-ripple>
                <div @click="logout">
                  <var-icon size="20" name="alert-circle-outline"/>
                  退出登陆
                </div>
              </var-cell>
            </div>
          </template>
        </var-menu>
      </template>
    </var-app-bar>
  </div>

  <div id="up-wrap">
    <var-card class="card" id="up-card">
      <template #extra>

        <div id="info-wrap" class="clear-fix">
          <div id="avatar">
            <var-image
              width="100"
              height="100"
              fit="cover"
              radius="50%"
              :src="this.$settings.cos_url + (this.$store.state.user.icon || 'icon/login.jpg')"
            />
          </div>

          <div id="info">
            <div id="username">
              {{user.username}}
              <Level style="margin-bottom: 4px" :level="rank.level"></Level>
            </div>
            <div id="experience">
              <var-progress label :value="100*rank.experience/rank.total">{{rank.experience}}/{{rank.total}}
              </var-progress>
            </div>
          </div>

          <div id="account">
            <div class="item">
              <div>0</div>
              <div>粉丝</div>
            </div>
            <div class="item">
              <div>0</div>
              <div>关注</div>
            </div>
            <div class="item">
              <div>0</div>
              <div>获赞</div>
            </div>
          </div>

        </div>

        <div id="pe-account">
          <var-divider/>
          <var-row>
            <var-col span="8">
              <div>0</div>
              <div>粉丝</div>
            </var-col>
            <var-col span="8">
              <div>0</div>
              <div>关注</div>
            </var-col>
            <var-col span="8">
              <div>0</div>
              <div>获赞</div>
            </var-col>
          </var-row>
        </div>

      </template>

    </var-card>
  </div>

  <div id="left-wrap">
    <var-card id="left-card" class="card">
      <template #extra>
        <div id="head">
          <div id="left-title">个人中心</div>
          <var-divider margin="0"/>
        </div>

        <div class="option" @click="this.$router.replace('/user/user-info/profile')">
          <var-icon class="left-icon" size="20" name="account-circle-outline"/>
          用户信息
        </div>

        <div class="option" @click="this.$router.replace('/user/user-info/article')">
          <var-icon class="left-icon" size="20" name="file-document-outline"/>
          我的贴子
        </div>

        <div class="option" @click="this.$router.replace('/user/user-info/comment')">
          <var-icon class="left-icon" size="20" name="message-text-outline"/>
          我的评论
        </div>

        <div class="option" @click="this.$router.replace('/user/user-info/favorite')">
          <var-icon class="left-icon" size="20" name="heart-outline"/>
          我的收藏
        </div>

        <var-divider margin="0"/>
        <div class="option" @click="this.$router.push('/user/change-password')">
          <var-icon class="left-icon" size="20" name="cog-outline"/>
          修改密码
        </div>
        <div class="option" @click="logout">
          <var-icon class="left-icon" size="20" name="alert-circle-outline"/>
          退出登录
        </div>
      </template>
    </var-card>
  </div>

  <div id="right-wrap">
    <var-card id="right-card" class="card">
      <template #extra>
        <router-view/>
      </template>
    </var-card>
  </div>

  <div id="bottom-wrap">
    <var-tabs
      sticky
      color="#eee"
      active-color="#333"
      inactive-color="#888"
      :offset-top="54"
      v-model:active="active"
    >
      <var-tab @click="this.$router.replace('/user/user-info/profile')">我的</var-tab>
      <var-tab @click="this.$router.replace('/user/user-info/article')">帖子</var-tab>
      <var-tab @click="this.$router.replace('/user/user-info/comment')">评论</var-tab>
      <var-tab @click="this.$router.replace('/user/user-info/favorite')">收藏</var-tab>
    </var-tabs>
    <div id="bottom-content">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import Level from "components/chip/Level";

  export default {
    name: "UserInfoWrap",
    components: {
      Level
    },
    data() {
      return {
        show: false,
      }
    },
    computed: {
      user() {
        return this.$store.state.user
      },
      rank() {
        return this.$settings.rank(this.user.experience)
      },
      active: {
        get: function () {
          return [
            "/user/user-info/profile",
            "/user/user-info/article",
            "/user/user-info/comment",
            "/user/user-info/favorite",
          ].indexOf(this.$route.path)
        },
        set: function (newValue) {
          return newValue
        }
      }
    },
    methods: {
      logout() {
        this.$dialog({
          message: "确认退出登陆？",
        }).then(res => {
          if (res === "confirm") {
            this.$cookies.remove("token")
            this.$store.commit("logout")
            this.$router.replace("/")
          }
        })
      },
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    #pe-nav-bar, #bottom-wrap, #pe-account {
      display: none;
    }


    #up-wrap {
      padding-top: 40px;
    }

    #info-wrap {
      padding: 20px;
    }

    #avatar {
      float: left;
      border: 1px solid #ccc;
      border-radius: 50%;
      margin: 0 20px;
    }

    #info {
      float: left;
    }

    #username {
      font-size: 20px;
      line-height: 24px;
      font-weight: 600;
    }

    #experience {
      width: 12vw;
    }

    #account {
      float: right;
      text-align: center;
      margin: 20px 30px 20px 0;
    }

    .item {
      display: inline-block;
      margin: 9px;
    }

    #left-wrap {
      width: 30%;
      float: left;
    }

    #left-card {
      margin: 20px 10px 0 0;
    }

    #left-title {
      line-height: 50px;
      text-indent: 5%;
      font-weight: bold;
    }

    .option {
      line-height: 50px;
      font-size: 16px;
      text-indent: 10%;
      cursor: pointer;
    }

    .left-icon {
      margin: 15px 0;
    }

    .option:hover {
      background-color: #eee;
    }

    #right-wrap {
      width: 70%;
      float: left;
    }


    #right-card {
      margin: 20px 0 0 10px;
      height: 50vh;
    }
  }

  @media screen and (max-width: 840px) {

    #left-wrap, #right-wrap, #account {
      display: none;
    }

    #pe-nav-bar {
      position: fixed;
      left: 0;
      top: 0;
      width: 100vw;
      z-index: 1000;
    }

    #menu {
      width: 135px;
      background-color: white;
    }

    #head {
      display: none;
    }

    #up-wrap {
      padding: 10px;
      background: linear-gradient(to top, #fafafa, rgba(150, 150, 150, 1));
    }

    #up-card {
      border-radius: 10px;
    }

    #info-wrap {
      padding: 20px;
    }

    #avatar {
      float: left;
      border: 1px solid #ccc;
      border-radius: 50%;
      margin-right: 10px;
    }

    #username {
      font-size: 20px;
      line-height: 24px;
      font-weight: 600;
    }

    #pe-account {
      text-align: center;
      margin: 10px 0;
    }

    .item {
      display: inline-block;
      margin: 9px;
    }

    #right-wrap {
      margin: 10px;
    }

    #right-card {
      height: 100vh;
      border-radius: 10px;
    }

    #bottom-content {
      background-color: #f6f6f6;
      width: 100vw;
      min-height: 100vh;
    }
  }
</style>