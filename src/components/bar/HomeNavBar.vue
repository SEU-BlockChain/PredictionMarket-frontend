<template>
  <div id="nav-bar" class="clear-fix var-elevation--5">

    <div id="left">
      <img id="logo" @click="this.$router.replace('/home')"
           :src="this.$settings.cos_url+'static/logo128.png'" alt="">
    </div>

    <var-divider class="divider" vertical/>

    <div id="center">
      <div id="name" @click="this.$router.replace('/home')">
        预测市场
      </div>

      <div id="option">
        <var-tabs
          v-model:active="active"
          color="#eee"
          inactive-color="#333"
          active-color="#4ebaee"
          indicator-color="#4ebaee">
          <var-tab class="tab" :class="{'tab-active':active===0}" @click="this.$router.replace('/home/')">首页</var-tab>
          <var-tab class="tab" :class="{'tab-active':active===1}">话题</var-tab>
          <var-tab class="tab" :class="{'tab-active':active===2}" @click="this.$router.replace('/home/bbs')">论坛
          </var-tab>
          <var-tab class="tab" :class="{'tab-active':active===3}">数据</var-tab>
          <var-tab class="tab" :class="{'tab-active':active===4}">关于</var-tab>
        </var-tabs>
      </div>


      <div id="message">
        <var-badge type="danger" position="right-top" style="line-height: 16px;z-index: 100" :value="0">
          <var-icon name="message-processing-outline" size="26px"/>
        </var-badge>
      </div>

      <div id="search">
        <var-input
          :hint="false"
          :line="false"
          placeholder="输入搜索内容..."
          text-color="#333"
          focus-color="#4ebaee"
          blur-color="#666"
          v-model="value"
          clearable>
          <template #prepend-icon>
            <var-icon id="search-btn" name="magnify"/>
          </template>
        </var-input>
      </div>
    </div>

    <var-divider class="divider" vertical/>

    <div id="right">
      <var-image
        id="avatar"
        width="48px"
        height="48px"
        fit="cover"
        radius="50%"
        style="border: 1px solid gray"
        :src="icon"
        @click="avatar_click"
      />
    </div>

  </div>

  <div id="pe-nav-bar">
    <var-app-bar title="预测市场" text-color="#333" color="#f6f6f6" title-position="center" :elevation="false">
      <template #left>
        <var-image
          id="pc-avatar"
          width="42px"
          height="42px"
          fit="cover"
          radius="50%"
          style="border: 1px solid gray;margin-left: 10px"
          :src="icon"
          @click="avatar_click"
        />
      </template>

      <template #right>
        <var-icon style="margin-right: 10px" size="26px" name="magnify"/>
        <var-badge type="danger" dot position="right-top" style="z-index: 100">
          <var-icon style="margin-right: 10px" name="message-processing-outline" size="26px"/>
        </var-badge>
      </template>
    </var-app-bar>
    <var-tabs
      v-model:active="active"
      color="#eee"
      inactive-color="#333"
      active-color="#4ebaee"
      indicator-color="#4ebaee"
      style="border-radius: 0">
      <var-tab class="tab" :class="{'tab-active':active===0}">首页</var-tab>
      <var-tab class="tab" :class="{'tab-active':active===1}">话题</var-tab>
      <var-tab class="tab" :class="{'tab-active':active===2}">论坛</var-tab>
      <var-tab class="tab" :class="{'tab-active':active===3}">数据</var-tab>
      <var-tab class="tab" :class="{'tab-active':active===4}">关于</var-tab>
    </var-tabs>
  </div>
</template>

<script>
  export default {
    name: "HomeNavBar",
    components: {},
    watch: {
      "$route"() {
        let path = window.location.pathname
        this.active=this.data[path]
      },
    },
    data() {
      return {
        value: "",
        active: 0,
        data: {
          "/home/bbs": 2
        }
      }
    },
    computed: {
      icon() {
        return this.$settings.cos_url + (this.$store.state.user.icon || "icon/login.jpg")
      },
    }, methods: {
      avatar_click() {
        if (this.$store.state.is_login) {
          this.$router.push("/user/")
        } else {
          this.$router.push("/user/login?next=/home")
        }
      }
    },
    created() {
      let path = window.location.pathname
      this.active=this.data[path]
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    #pe-nav-bar {
      display: none;
    }

    #nav-bar {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 996;
      width: 100%;
      line-height: 64px;
      background-color: #eee;
      --tabs-item-horizontal-height: 64px
    }

    #left, #right, #center {
      height: 64px;
      float: left;
      display: inline-block;
    }

    #left {
      width: 22%;
    }

    #center {
      width: calc(56% - 2px);
      text-align: center;
    }

    #right {
      width: 22%;
    }

    .divider {
      margin: 20px 0;
      height: 24px;
      width: 1px;
      background-color: #aaa;
      float: left;
    }

    #logo {
      float: right;
      height: 47px;
      margin: 10px 2%;
      cursor: pointer;
    }

    #name {
      font-size: 16px;
      float: left;
      margin: 0 5% 0 1%;
      font-weight: bold;
      color: #333;
      cursor: pointer;
    }

    #option {
      width: 45%;
      float: left;
    }

    .tab {
      font-size: 17px;
    }

    .tab:hover {
      font-weight: bold;
      background-color: rgba(255, 255, 255, .38);
    }

    .tab-active {
      font-weight: bold;
      color: #4ebaee;
    }

    #search {
      float: right;
      height: 32px;
      margin: 16px 0;
      padding: 0 5px;
      width: 15%;
      border-radius: 10px;
      --input-placeholder-size: 10px;
      background-color: rgba(255, 255, 255, .52);
      cursor: pointer;
    }

    #search-btn {
      padding: 3px;
      margin: 3px 2px;
      border-radius: 5px;
      background-color: rgba(255, 255, 255, .22);
    }

    #search-btn:hover {
      color: #4ebaee;
    }

    #message {
      float: right;
      padding: 19px;
      line-height: 26px;
      cursor: pointer;
    }

    #message:hover {
      background-color: rgba(255, 255, 255, .22);
    }

    #avatar {
      margin: 10px;
      cursor: pointer;
    }
  }


  @media screen and (max-width: 840px) {
    #nav-bar {
      display: none;
    }

    #pe-nav-bar {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 996;
      width: 100%
    }
  }
</style>