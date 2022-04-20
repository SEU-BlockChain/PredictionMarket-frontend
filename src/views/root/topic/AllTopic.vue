<template>
  <div id="head"/>
  <div id="search">
    <var-input
      :hint="false"
      :line="false"
      placeholder="搜索话题"
      text-color="#333"
      focus-color="#4ebaee"
      blur-color="#666"
      v-model="search"
      clearable>
      <template #prepend-icon>
        <var-icon id="search-btn" name="magnify"/>
      </template>
    </var-input>
  </div>

  <div id="all-left">
    <var-card class="card">
      <template #extra>
        {{this.$store.state.web3_account}}
        <var-divider margin="0"/>
        <topic-card :topic="topic" v-for="topic in topics"/>
        <br>
      </template>
    </var-card>
  </div>

  <div id="all-right">
    <var-card class="card">
      <template #extra>
        123
      </template>
    </var-card>
  </div>

  <var-button id="topic-article" type="success" round @click="add_topic">
    <var-icon size="28" name="plus"/>
  </var-button>

  <var-popup v-model:show="add_topic_show" style="border-radius: 5px">
    <var-card class="card">
      <template #extra>
        <div id="add-wrap">
          <div id="add-title">创建话题</div>
          <div class="clear-fix">
            <div class="left text" id="icon-text">话题图标</div>
            <div id="icon-content" class="left">
              <var-uploader
                v-model="_"
                :maxlength="1"
                :maxsize="1024*1024"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                @after-read="upload"
                @oversize="oversize"/>
            </div>
          </div>
          <br>
          <div class="clear-fix">
            <div class="left text">话题名称</div>
            <var-input
              class="left"
              id="title-content"
              :hint="false"
              placeholder="请输入文本"
              v-model="title"
            />
          </div>

          <div class="clear-fix">
            <var-button id="add-btn" type="success" @click="create_topic">创建</var-button>
          </div>
        </div>
      </template>
    </var-card>
  </var-popup>
</template>

<script>

  import TopicCard from "components/card/TopicCard";

  export default {
    name: "AllTopic",
    components: {
      TopicCard
    },
    data() {
      return {
        search: "",
        topic_num: "",
        topics: [],
        add_topic_show: false,
        _: [],
        icon: "",
        title: "",
        contract: ""
      }
    },
    methods: {
      add_topic() {
        this.add_topic_show = true
      },
      upload(file) {
        let forms = new FormData()
        forms.append('file', file.file)
        this.$ajax.api.post(
          "topic/image/",
          forms,
          {headers: {'Content-Type': 'multipart/form-data'}}
        ).then(res => {
          if (res.data.code === 123) {
            this.icon = res.data.result.data
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 2000,
            })
          }
        })
      },
      create_topic() {
        if (!this.icon) return;
        if (!this.title) return;
        this.contract.methods.createTopic(this.title, this.icon).send({
          from: this.$store.state.web3_account
        }).then(res => {
          this.add_topic_show = false
          this.topics = []
          this.title = ""
          this.reload_topics()
        })
      },
      oversize() {
        this.$tip({
          content: "图片不超过1MB",
          type: "warning",
          duration: 2000,
        })
      },
      reload_topics() {
        this.contract.methods.topicNum().call().then(res => {
          this.topic_num = res
          return new Promise(resolve => resolve(res))
        }).then(res => {
          for (let i = 0; i < res; i++) {
            this.contract.methods.topicInfo(i).call().then(res => {
              this.topics.push({
                id: i,
                data: res
              })
            })
          }
        })
      }
    },
    created() {
      this.contract = new this.$store.state.web3.eth.Contract(
        this.$abi.predictionMarket,
        this.$eth.address.predictionMarket
      )
      this.reload_topics()
    },
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    #head {
      margin-top: 20px;
      background-color: #ccc;
      width: 100%;
      height: 150px;
    }

    #all-left {
      float: left;
      width: 68%;
      margin-right: 2%;
    }

    #all-right {
      float: left;
      width: 30%;
    }

    #search {
      margin: 20px 0;
      padding: 3px 5px;
      border-radius: 5px;
      font-size: 16px;
      --input-placeholder-size: 10px;
      background-color: #fafafa;
      cursor: pointer;
    }
  }

  @media screen and (max-width: 840px) {
    #all-left {
      width: 100vw;
      padding: 5px;
    }

    #all-right {
      display: none;
    }

    #head {
      background-color: #ccc;
      margin: 5px;
      width: calc(100% - 10px);
      height: 150px;
      border-radius: 5px;
    }

    #search {
      margin: 5px;
      padding: 3px 5px;
      border-radius: 5px;
      font-size: 16px;
      --input-placeholder-size: 10px;
      background-color: #fafafa;
      cursor: pointer;
    }
  }

  #topic-article {
    position: fixed;
    right: 40px;
    bottom: 120px;
  }


  #search-btn {
    padding: 3px;
    margin: 3px 2px;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, .22);
  }

  #add-wrap {
    width: 400px;
    padding: 20px 20px 40px;
  }

  #add-title {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    color: #666666;
    margin: 20px 0 40px;
  }

  #title-content {
    width: 200px;
  }

  #icon-text {
    line-height: 80px;
  }

  .text {
    margin: 0 40px 0 20px;
    line-height: 32px;
  }

  #add-btn {
    float: right;
    margin: 20px 40px 0;
  }

</style>