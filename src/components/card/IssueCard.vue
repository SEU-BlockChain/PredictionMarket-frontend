<template>
  <div class="issue-wrap" style="position: relative" @click="this.$router.push(`/issue/${issue.address}`)">
    <div class="clear-fix">
      <img class="left icon" :src="this.$settings.cos_url+issue.data[0][3]">
      <div class="left issue-text">{{issue.data[0][2]}}</div>
    </div>
    <div class="clear-fix" style="margin: 10px 0;">
      <div class="left issue-time" style="margin-right: 20px">开始时间:{{date(issue.data[0][0]*1000)}}</div>
      <div class="left issue-time">截止时间:{{date(issue.data[0][1]*1000)}}</div>
    </div>
    <div class="bottom">
      <var-row>
        <var-col :span="6">
          <div class="issue-desc-head">体量</div>
          <div class="issue-desc">{{issue.data[2]}}</div>
        </var-col>
        <var-col :span="6">
          <div class="issue-desc-head">流动池</div>
          <div class="issue-desc">{{issue.data[3]}}</div>
        </var-col>
        <var-col :span="6">
          <div class="issue-desc-head">{{issue.data[1][0][1]}}</div>
          <div class="issue-option">
            <var-chip :round="false" type="default" size="small">{{Number(issue.data[1][0][0])/Number(issue.data[2])}}
            </var-chip>
          </div>
        </var-col>
        <var-col :span="6">
          <div class="issue-desc-head">{{issue.data[1][1][1]}}</div>
          <div class="issue-option">
            <var-chip :round="false" type="default" size="small">{{Number(issue.data[1][1][0])/Number(issue.data[2])}}
            </var-chip>
          </div>
        </var-col>
      </var-row>
      <div class="issue-address">{{issue.address}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "IssueCard",
    props: {
      issue: null
    },
    methods: {
      date(timestamp) {
        let date = new this.$settings.DateParser(timestamp)
        return date.year_month_day()
      }
    }
  }
</script>

<style scoped>
  .issue-wrap {
    float: left;
    width: 31.33%;
    margin: 1%;
    height: 170px;
    border: 2px solid #42c772;
    background-color: white;
    border-radius: 5px;
    padding: 10px;
    cursor: pointer;
  }

  .issue-wrap:hover {
    background-color: #f6f6f6;
  }

  .issue-text {
    font-size: 16px;
    line-height: 35px;
  }

  .icon{
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 1px solid #ccc;
    margin-right: 10px;
  }

  .issue-time {
    font-size: 12px;
    color: #999999;
  }

  .bottom {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
  }

  .issue-address {
    font-size: 10px;
    overflow-x: scroll;
    overflow-y: hidden;
    color: #999999;
    margin-top: 10px;
  }

  .issue-desc-head {
    text-align: center;
    font-size: 14px;
    color: #666666;
  }

  .issue-option {
    height: 24px;
    text-align: center;
    margin: 4px 0;
    color: #1652f0;
    font-weight: bold;
  }

  .issue-desc {
    font-size: 14px;
    text-align: center;
    line-height: 30px;
  }


</style>