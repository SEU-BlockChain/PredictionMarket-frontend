<template>
  <var-card class="card" id="head" v-if="ready">
    <template #extra>
      <div class="left">
        <img id="icon" :src="this.$settings.cos_url+info[0][3]" alt="">
      </div>
      <div class="left">
        <div id="topic">#{{info[3]}}#</div>
        <div class="clear-fix">
          <div class="left" id="desc"> {{info[0][2]}}</div>
          <div class="left" :class="['state1','state2','state3'][state]">{{["未开始","进行中","已结束"][state]}}
          </div>
        </div>
        <div class="clear-fix">
          <div class="left time" style="margin-right: 20px">开始时间:{{date(info[0][0]*1000)}}</div>
          <div class="left time">截止时间:{{date(info[0][1]*1000)}}</div>
        </div>
        <div class="clear-fix">
          <div class="address">发布人:{{info[2]}}</div>
        </div>
      </div>


      <div class="right box-container">
        <div class="box right">
          <div class="box-title">体量</div>
          <div>{{info[4]}}</div>
        </div>
        <div class="box right">
          <div class="box-title">流动性</div>
          <div>{{info[5]}}</div>

        </div>
        <div class="box right">
          <div class="box-title">权益</div>
          <div>{{info[6]}}</div>

        </div>
      </div>
    </template>
  </var-card>
  <var-card class="card" id="left">
    <template #extra>
      <div id="chart-wrap">
        <div id="chart"/>
      </div>
    </template>
  </var-card>

  <div id="right">
    <var-card class="card" id="option-card" v-if="ready">
      <template #extra>
        <div style="padding: 10px">
          <div class="option clear-fix" :class="{active:option_id===0}" @click="changeOptionId(0)">
            <div class="desc">{{info[1][0][1]}}</div>
            <div class="price">{{(Number(info[1][0][0])/Number(info[4])).toFixed(3)}}</div>
          </div>

          <div class="clear-fix">
            <div class="left share">当前持有:{{my.option0}}份</div>
            <div class="right all">共{{Number(info[1][0][0])}}份</div>
          </div>

          <div class="option clear-fix" :class="{active:option_id===1}" @click="changeOptionId(1)">
            <div class="desc">{{info[1][1][1]}}</div>
            <div class="price">{{(Number(info[1][1][0])/Number(info[4])).toFixed(3)}}</div>
          </div>

          <div class="clear-fix">
            <div class="left share">当前持有:{{my.option1}}份</div>
            <div class="right all">共{{Number(info[1][1][0])}}份</div>
          </div>
          <var-divider margin="0"/>
          <div v-if="state===1">
            <var-tabs v-model:active="sell">
              <var-tab>买入</var-tab>
              <var-tab>卖出</var-tab>
            </var-tabs>
            <var-tabs-items v-model:active="sell" style="margin: 10px">
              <var-tab-item>
                <var-input
                  class="input"
                  type="number"
                  :hint="false"
                  :line="false"
                  focus-color="black"
                  placeholder="花费的PMB数目(至少100)"
                  v-model="amount"
                  @input="longEstimate"
                />
                <div v-if="long_estimate.show">
                  <div class="tip-title">花费{{amount}}PMB购买"{{info[1][option_id][1]}}"</div>
                  <div class="clear-fix tip">
                    <div class="left">可购买份数</div>
                    <div class="right">{{long_estimate.share}}</div>
                  </div>
                  <div class="clear-fix tip">
                    <div class="left">均价</div>
                    <div class="right">{{(amount/long_estimate.share).toFixed(3)}}</div>
                  </div>
                  <div class="clear-fix tip">
                    <div class="left">最大回报率</div>
                    <div class="right">{{(((long_estimate.share-amount)/amount)*100).toFixed(1)}}%</div>
                  </div>
                  <br>
                  <var-button block type="success" @click="longOption">确认买入</var-button>
                </div>
              </var-tab-item>
              <var-tab-item>
                <var-input
                  class="input"
                  type="number"
                  :hint="false"
                  :line="false"
                  focus-color="black"
                  placeholder="卖出份数(至少100)"
                  v-model="share"
                  @input="shortEstimate"
                />
                <div v-if="short_estimate.show">
                  <div class="tip-title">卖出{{amount}}份"{{info[1][option_id][1]}}"</div>
                  <div class="clear-fix tip">
                    <div class="left">可获得PMB</div>
                    <div class="right">{{short_estimate.amount}}</div>
                  </div>
                  <div class="clear-fix tip">
                    <div class="left">均价</div>
                    <div class="right">{{(short_estimate.amount/share).toFixed(3)}}</div>
                  </div>
                  <br>
                  <var-button block type="success" @click="shortOption">确认卖出</var-button>
                </div>
              </var-tab-item>
            </var-tabs-items>
          </div>
        </div>
      </template>
    </var-card>

    <var-card class="card" id="liquidity-card" v-if="ready">
      <template #extra>
        <div id="pool-title">流动池</div>
        <var-progress :value="(100*my.pool/info[5]).toFixed(0)" line-width="20" color="#ff9f00" track-color="#f5cb90"/>
        <div class="clear-fix">
          <div class="left share">我的:{{my.pool}}</div>
          <div class="right all">全部:{{info[5]}}</div>
        </div>
        <div v-if="info[6]*my.pool">
          <div class="clear-fix tip">
            <div class="left">当前期望收益</div>
            <div class="right">{{(info[6]*my.pool/info[5]).toFixed(0)}}</div>
          </div>
          <div class="clear-fix tip">
            <div class="left">当前期望收益率</div>
            <div class="right">{{(100*info[6]/info[5]).toFixed(1)}}%</div>
          </div>
        </div>
        <div v-if="state===1">
          <var-tabs v-model:active="withdraw">
            <var-tab>提供流动性</var-tab>
            <var-tab>取出流动性</var-tab>
          </var-tabs>
          <var-tabs-items v-model:active="withdraw" style="margin: 10px">
            <var-tab-item>
              <var-input
                class="input"
                type="number"
                :hint="false"
                :line="false"
                focus-color="black"
                placeholder="输入提供PMB的数量"
                v-model="long_pool"
              />
              <br>
              <var-button block type="success" @click="longPool">确认提供</var-button>
            </var-tab-item>
            <var-tab-item>
              <var-input
                class="input"
                type="number"
                :hint="false"
                :line="false"
                focus-color="black"
                placeholder="输入取出PMB的数量"
                v-model="short_pool"
              />
              <br>
              <var-button block type="success" @click="shortPool">确认取出</var-button>
            </var-tab-item>
          </var-tabs-items>
        </div>
      </template>
    </var-card>
  </div>
</template>

<script>
  import * as echarts from "echarts"

  export default {
    name: "IssueDetail",
    watch: {
      "$store.state.web3_account": {
        handler: function (newVal, oldVal) {
          this.init()
        }
      }
    },
    data() {
      return {
        contract: null,
        info: null,
        ready: false,
        state: null,
        sell: 0,
        option_id: 0,
        my: {
          option0: 0,
          option1: 0,
          pool: 0
        },
        amount: "",
        share: "",
        long_estimate: {
          show: false,
          share: 0,
        },
        short_estimate: {
          show: false,
          amount: 0,
        },
        withdraw: 0,
        long_pool: "",
        short_pool: "",
      }
    },
    methods: {
      date(timestamp) {
        let date = new this.$settings.DateParser(timestamp)
        return date.all()
      },
      changeOptionId(id) {
        this.option_id = id
        this.longEstimate()
        this.shortEstimate()
      },
      longEstimate() {
        if (this.amount < 100) {
          this.long_estimate.show = false
          return
        }
        this.contract.methods.longOptionEstimate(this.option_id, this.amount).call().then(res => {
          this.long_estimate.share = res
          this.long_estimate.show = true;
        })
      },
      shortEstimate() {
        if (this.share < 100) {
          this.short_estimate.show = false
          return
        }
        this.contract.methods.shortOptionEstimate(this.option_id, this.share).call().then(res => {
          this.short_estimate.amount = res
          this.short_estimate.show = true;
        })
      },
      longOption() {
        this.contract.methods.longOption(this.option_id, this.amount).send({
          from: this.$store.state.web3_account
        }).then(res => {
          this.ready = false
          this.init()
        })
      },
      shortOption() {
        this.contract.methods.shortOption(this.option_id, this.share).send({
          from: this.$store.state.web3_account
        }).then(res => {
          this.ready = false
          this.init()
        })
      },
      longPool() {
        this.contract.methods.longPool(this.long_pool).send({
          from: this.$store.state.web3_account
        }).then(res => {
          this.ready = false
          this.init()
        })
      },
      shortPool() {
        this.contract.methods.shortPool(this.short_pool).send({
          from: this.$store.state.web3_account
        }).then(res => {
          this.ready = false
          this.init()
        })
      },
      init() {
        let parentTag = document.getElementById("chart-wrap")
        let chartTag = document.createElement("div")
        chartTag.setAttribute("id", "chart")
        parentTag.innerHTML = ""
        parentTag.appendChild(chartTag)
        this.contract.methods.getInfo().call().then(res => {
          this.info = res
          this.ready = true
          this.$store.state.web3.eth.getBlock("latest").then(block => {
            this.state = this.$settings.state(res[0][0], res[0][1], block.timestamp)
          })
          this.contract.getPastEvents('ShareChangeEvent', {
            fromBlock: 0,
            toBlock: 'latest'
          }).then(res => {
            let changes = res.map(x => x.returnValues)
            let changes0 = changes.map(x => [x.timestamp * 1000, (Number(x.option0) / (Number(x.option0) + Number(x.option1))).toFixed(3)]);
            changes0.unshift([this.info[0][0] * 1000, 0.5])
            console.log(changes0);
            let changes1 = changes.map(x => [x.timestamp * 1000, (Number(x.option1) / (Number(x.option0) + Number(x.option1))).toFixed(3)]);
            changes1.unshift([this.info[0][0] * 1000, 0.5])
            let charts = echarts.init(document.getElementById("chart"))
            charts.resize({height: '400px'})
            charts.setOption({
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                data: [this.info[1][0][1], this.info[1][1][1]]
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '20px',
                containLabel: true
              },

              toolbox: {
                feature: {
                  saveAsImage: {}
                }
              },
              xAxis: {
                type: 'time',
                boundaryGap: false,
              },
              yAxis: {
                type: 'value'
              },

              series: [
                {
                  name: this.info[1][0][1],
                  type: 'line',
                  symbol: "none",
                  smooth: true,
                  data: changes0
                },
                {
                  name: this.info[1][1][1],
                  type: 'line',
                  symbol: "none",
                  smooth: true,
                  data: changes1
                }
              ]
            })
          })
        })
        if (this.$store.state.web3_account) {
          this.contract.methods.shareOf(this.$store.state.web3_account, 0).call().then(res => this.my.option0 = res)
          this.contract.methods.shareOf(this.$store.state.web3_account, 1).call().then(res => this.my.option1 = res)
          this.contract.methods.poolOf(this.$store.state.web3_account).call().then(res => this.my.pool = res)
        }
        this.clear()
      },
      clear() {
        this.long_estimate = {
          show: false,
          share: 0,
        }
        this.short_estimate = {
          show: false,
          amount: 0,
        }
        this.amount = this.share = this.long_pool = this.short_pool = ""
        this.sell = 0
        this.withdraw = 0
      },
    },
    mounted() {
      this.contract = new this.$store.state.web3.eth.Contract(this.$abi.binaryPrediction, this.$route.params.address)
      this.init()

    },
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    #left {
      float: left;
      margin-top: 20px;
      margin-right: 2%;
      width: 68%;
    }
    #head {
      margin: 20px 0;
      padding: 20px;
    }
    #right {
      float: left;
      margin-top: 20px;
      width: 30%;
    }

    .box-container {
      align-items: center;
      display: flex;
      margin: 1rem;
      padding: 0;
    }

    .box {
      background: #f4f4f4;
      display: block;
      flex-direction: column;
      justify-content: space-between;
      width: 100px;
      padding: .5rem 1rem;
      margin: 0 10px;
      white-space: nowrap;
    }
  }

  @media screen and (max-width: 840px) {
    #left, #right {
      margin-top: 20px;
      width: 100%;
      padding: 5px;
    }
    #head {
      padding: 10px;
    }
    .box-container {
      width: 100%;
    }

    .box {
      background: #f4f4f4;
      display: block;
      flex-direction: column;
      justify-content: space-between;
      width: 29.33%;
      padding: .5rem 1rem;
      margin: 0 2%;
      white-space: nowrap;
    }
  }



  #icon {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }

  #topic {
    font-size: 14px;
    line-height: 20px;
    color: #666666;
  }

  #desc {
    font-size: 20px;
    margin: 5px 0;
  }

  .time {
    font-size: 12px;
    color: #999999;
  }

  .address {
    font-size: 12px;
    color: #999999;
  }


  .box-title {
    font-size: 12px;
    color: #666;
  }

  .option {
    border-radius: 2px;
    height: 50px;
    background-color: #eee;
    line-height: 50px;
    cursor: pointer;
  }

  .desc {
    margin-left: 20px;
    float: left;
    color: black;
    font-weight: bold;
  }

  .price {
    margin-right: 20px;
    float: right;
    color: #666666;
  }

  .all {
    font-size: 12px;
    color: #666;
    margin-bottom: 10px;
  }

  .share {
    font-size: 12px;
    color: #4ebaee;
    margin-bottom: 10px;
  }

  .input {
    border: 1px solid #ddd;
    padding: 3px;
    border-radius: 5px;
  }

  .tip-title {
    font-size: 14px;
    line-height: 30px;
    font-weight: bold;
    text-align: center;
  }

  .tip {
    font-size: 14px;
    line-height: 25px;
    color: #333;
  }

  #option-card {
    padding: 20px;
  }

  #liquidity-card {
    padding: 20px;
    margin-top: 20px;
  }

  #pool-title {
    font-size: 20px;
    line-height: 50px;
    font-weight: bold;
    text-align: center;
  }

  #chart-wrap {
    margin: 20px 0;
  }

  .active {
    background-color: #05b16a;
  }

  .active .desc {
    color: white;
  }

  .active .price {
    color: #f6f6f6;
  }

  .state1, .state2, .state3 {
    font-size: 14px;
    line-height: 15px;
    padding: 5px;
    margin: 5px;
    height: 25px;
    border-radius: 2px;
    font-weight: bold;
    color: #f6f6f6;
  }

  .state1 {
    background-color: #888888;
  }

  .state2 {
    background-color: #05b16a;
  }

  .state3 {
    background-color: #ef1016;
  }
</style>