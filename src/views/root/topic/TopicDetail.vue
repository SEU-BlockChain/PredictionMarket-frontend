<template>
  <div id="head"/>
  <div id="search">
    <var-input
      :hint="false"
      :line="false"
      placeholder="搜索事件"
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
  <div class="clear-fix">
    <issue-card :issue="issue" v-for="issue in issues"/>
  </div>
  <var-button id="topic-issue" type="success" round @click="add_issue">
    <var-icon size="28" name="plus"/>
  </var-button>

  <var-popup v-model:show="add_issue_show" style="border-radius: 5px">
    <var-card class="card">
      <template #extra>
        <div id="add-wrap">
          <div id="add-title">创建预测</div>
          <div class="clear-fix">
            <div class="left text" id="icon-text">图标</div>
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
            <div class="left text">描述</div>
            <var-input
              class="left content"
              :hint="false"
              placeholder="请输入文本"
              v-model="desc"
            />
          </div>
          <br>
          <div class="clear-fix">
            <div class="left text">开始时间</div>
            <var-input
              class="left content"
              :hint="false"
              placeholder="如2022-03-20 19:00"
              v-model="start"
            />
          </div>
          <br>
          <div class="clear-fix">
            <div class="left text">结束时间</div>
            <var-input
              class="left content"
              :hint="false"
              placeholder="如2022-03-20 19:00"
              v-model="end"
            />
          </div>
          <br>
          <div class="clear-fix">
            <div class="left text">选项一</div>
            <var-input
              class="left content"
              :hint="false"
              placeholder="请输入选项描述"
              v-model="a"
            />
          </div>
          <br>
          <div class="clear-fix">
            <div class="left text">选项二</div>
            <var-input
              class="left content"
              :hint="false"
              placeholder="请输入选项描述"
              v-model="b"
            />
          </div>
          <div class="clear-fix">
            <var-button id="add-btn" type="success" @click="create_issue">创建</var-button>
          </div>
        </div>
      </template>
    </var-card>
  </var-popup>
</template>

<script>
  import IssueCard from "components/card/IssueCard";

  export default {
    name: "TopicDetail",
    components: {
      IssueCard
    },
    data() {
      return {
        search: "",
        add_issue_show: false,
        contract: "",
        _: [],
        issues: [],
        desc: "",
        icon: "",
        start: "",
        end: "",
        a: "",
        b: "",
      }
    },
    methods: {
      add_issue() {
        this.add_issue_show = true
      },
      upload(file) {
        let forms = new FormData()
        forms.append('file', file.file)
        this.$ajax.api.post(
          "issue/image/",
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
      create_issue() {
        if (!this.icon) return;
        if (!this.desc) return;
        if (!this.start) return;
        if (!this.end) return;
        this.contract.methods.CreateBinaryPrediction(
          this.$route.params.id,
          [
            (new Date(this.start)).getTime() / 1000,
            (new Date(this.end)).getTime() / 1000,
            this.desc,
            this.icon
          ],
          [
            this.a,
            this.b
          ]
        ).send({
          from: this.$store.state.web3_account
        }).then(res => {
          this.add_issue_show = false
          this.clear()
          this.reload_issue()
        }).catch(console.log)
      },
      clear() {
        this.issues = []
        this.desc = this.icon = this.start = this.end = this.a = this.b = ""
      },
      oversize() {
        this.$tip({
          content: "图片不超过1MB",
          type: "warning",
          duration: 2000,
        })
      },
      reload_issue() {
        this.contract.methods.topicInfo(this.$route.params.id).call().then(res => {
          return new Promise(resolve => resolve(res))
        }).then(res => {
          for (let i of res.predictions) {
            let BP_contract = new this.$store.state.web3.eth.Contract(this.$abi.binaryPrediction, i)
            BP_contract.methods.getInfo().call().then(res => {
              console.log(res);
              this.issues.push({
                address: i,
                data: res
              });
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
      this.reload_issue()
    }
  }
</script>

<style scoped>
  #head {
    margin-top: 20px;
    background-color: #ccc;
    width: 100%;
    height: 150px;
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

  #topic-issue {
    position: fixed;
    right: 40px;
    bottom: 120px;
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


  #icon-text {
    line-height: 80px;
  }

  .text {
    margin: 0 40px 0 20px;
    line-height: 32px;
    width: 70px;
  }

  #add-btn {
    float: right;
    margin: 20px 40px 0;
  }

  .text {
    margin: 0 40px 0 20px;
    line-height: 32px;
  }

  .content {
    width: 200px;
  }
</style>