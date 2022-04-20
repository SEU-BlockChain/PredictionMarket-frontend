<template>
  <div class="background"></div>

  <div class="left-panel">
    <div class="title">
      <var-icon class="icon" name="message-processing-outline"/>
      消息中心
    </div>
    <div class="options">
      <div class="reply" :class="{active:index===0}" @click="this.$router.replace('/user/message/reply')">回复我的</div>
      <div class="at" :class="{active:index===1}" @click="this.$router.replace('/user/message/at')">@我的</div>
      <div class="like" :class="{active:index===2}" @click="this.$router.replace('/user/message/like')">收到的赞</div>
      <div class="system" :class="{active:index===3}" @click="this.$router.replace('/user/message/system')">系统通知</div>
      <div class="private" :class="{active:index===4}" @click="this.$router.replace('/user/message/private')">我的私信</div>
    </div>
  </div>

  <div class="right-panel">
    <var-sticky :offset-top="4">
      <div class="head var-elevation--1">{{["回复我的","@我的","收到的赞","系统通知","我的私信"][index]}}</div>
    </var-sticky>
    <div class="content-wrap">
      <router-view/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "MessageWrap",
    watch: {
      "$route"() {
        for (let i of this.data) {
          if (window.location.pathname.includes(i.path)) {
            this.index = i.active
            break
          }
        }
      },
    },
    data() {
      return {
        index: 0,
        data: [
          {
            path: "/reply",
            active: 0
          },
          {
            path: "/at",
            active: 1
          },
          {
            path: "/like",
            active: 2
          },
          {
            path: "/system",
            active: 3
          },
          {
            path: "/private",
            active: 4
          }
        ]
      }
    },
    created() {
      for (let i of this.data) {
        if (window.location.pathname.includes(i.path)) {
          this.index = i.active
          break
        }
      }
    }
  }
</script>

<style scoped>
  .background {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url(https://newids.seu.edu.cn/authserver/custom/images/bg1.jpg);
    background-size: cover;
    opacity: 0.5;
    z-index: -1;
    overflow: hidden;
  }

  .left-panel {
    float: left;
    width: 13%;
    height: calc(100vh - 64px);
    background-color: rgba(255, 255, 255, 0.8);
  }

  .title {
    text-align: center;
    line-height: 60px;
    font-size: 15px;
    font-weight: bold;
  }

  .icon {
    margin: 20px 0;
  }

  .reply, .at, .like, .system, .private {
    line-height: 40px;
    font-size: 14px;
    text-align: center;
    font-weight: bold;
    color: #666;
    cursor: pointer;
  }

  .reply:hover, .at:hover, .like:hover, .system:hover, .private:hover {
    color: #4ebaee;
  }

  .active {
    color: #4ebaee;
  }

  .right-panel {
    float: left;
    width: 87%;
    height: calc(100vh - 64px);
    background-color: rgba(255, 255, 255, 0.5);
    padding: 10px;
    overflow: scroll;
  }

  .head {
    font-size: 15px;
    color: #444;
    line-height: 40px;
    background-color: white;
    text-indent: 1em;
    border-radius: 5px;
  }

  .content-wrap {
    overflow: scroll;
    height: calc(100vh - 130px)
  }
</style>