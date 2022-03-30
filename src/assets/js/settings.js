let cos_url = "https://bc-1304907527.cos.ap-nanjing.myqcloud.com/"
let api_url = "https://api.chain.seutools.com/"
// let api_url = "http://127.0.0.1:8000/"


let re_pattens = {
  username: /^[a-zA-Z0-9\u4e00-\u9fa5]{1,16}$/,
  password: /^[a-zA-Z0-9-*/+.~!@#$%^&()]{6,16}$/,
  phone: /^1[3-9][0-9]{9}$/,
  email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  school: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
  code: /^[0-9]{4}$/,
  article_title: /^.{1,32}$/,
  article: /^.{1,2000}$/,
}

let validators = {
  username: [
    v => 16 >= v.length && v.length >= 1 || '长度在 1 到 16 个字符',
    v => re_pattens.username.test(v) || "不能含有非法字符",
  ],
  password: [
    v => 16 >= v.length && v.length >= 6 || '长度在 6 到 16 个字符',
    v => re_pattens.password.test(v) || "不能含有非法字符",
  ],
  confirm_password: password => [
    v => 16 >= v.length && v.length >= 6 || '长度在 6 到 16 个字符',
    v => re_pattens.password.test(v) || "不能含有非法字符",
    v => password === v || "两次密码不一致"
  ],
  phone: [
    v => re_pattens.phone.test(v) || "请输入11位电话号码"
  ],
  email: [
    v => re_pattens.email.test(v) || "邮箱格式错误"
  ],
  school: [
    v => 10 >= v.length && v.length >= 1 || '长度在 1 到 10 个字符',
    v => re_pattens.school.test(v) || "不能含有非法字符",
  ],
  code: [
    v => re_pattens.code.test(v) || "4位数验证码"
  ],
  article_title: [
    v => re_pattens.article_title.test(v) || "标题32字以内"
  ],
  article: [
    v => re_pattens.article.test(v) || "文章内容2000字以内"
  ]
}

function rank(experience) {
  experience = Number(experience)
  if (experience < 50) return {level: 0, experience, total: 50}
  if (experience < 120) return {level: 1, experience, total: 120}
  if (experience < 300) return {level: 2, experience, total: 300}
  if (experience < 800) return {level: 3, experience, total: 800}
  if (experience < 2000) return {level: 4, experience, total: 2000}
  if (experience < 5000) return {level: 5, experience, total: 5000}
  return {level: 6, experience, total: "--"}
}

class DateParser {
  constructor(dateString = null) {
    this.date = dateString ? new Date(dateString) : new Date()
  }

  seconds() {
    return this.date.getSeconds()
  }

  hours() {
    return this.date.getHours()
  }

  minutes() {
    return this.date.getMinutes()
  }

  day() {
    return this.date.getDate()
  }

  month() {
    return this.date.getMonth() + 1
  }

  year() {
    return this.date.getFullYear()
  }

  //16:25
  hours_minutes() {
    return this.hours().toString().padStart(2, "0") + ":" + this.minutes().toString().padStart(2, "0")
  }

  //10-21
  month_day() {
    return this.month().toString().padStart(2, "0") + "-" + this.day().toString().padStart(2, "0")
  }

  //10-21 16:25
  month_day_hours_minutes() {
    return this.month_day() + " " + this.hours_minutes()
  }

  //2021-10-21
  year_month_day() {
    return this.year() + "-" + this.month_day()
  }
}

let filters = {
  date(value) {
    let nowDate = new DateParser()
    let valueDate = new DateParser(value)
    if (nowDate.year() > valueDate.year()) return valueDate.year_month_day()
    if (nowDate.month_day() > valueDate.month_day()) return valueDate.month_day()
    if (nowDate.hours() > valueDate.hours()) return `${nowDate.hours() - valueDate.hours()}小时前`
    if (nowDate.minutes() > valueDate.minutes()) return `${nowDate.minutes() - valueDate.minutes()}分钟前`
    if (nowDate.seconds() > valueDate.seconds()) return `${nowDate.seconds() - valueDate.seconds()}秒前`
    return "刚刚"
  }
}

let bbs_category = [
  {
    index: 0,
    id: 0,
    category: "全部"
  },
  {
    index: 1,
    id: 1,
    category: "分类1"
  },
  {
    index: 2,
    id: 2,
    category: "分类2"
  },
]

let upAndDown = function (is_up, obj) {
  if (!is_up) {
    if (obj.is_up === null) {
      obj.is_up = false
      obj.down_num++
    } else {
      if (obj.is_up) {
        obj.up_num--
        obj.down_num++
        obj.is_up = false
      } else {
        obj.down_num--
        obj.is_up = null
      }
    }
  } else {
    if (obj.is_up === null) {
      obj.is_up = true
      obj.up_num++
    } else {
      if (obj.is_up) {
        obj.up_num--
        obj.is_up = null
      } else {
        obj.up_num++
        obj.down_num--
        obj.is_up = true
      }
    }
  }
}

export {
  api_url
}

export default {
  cos_url,
  api_url,
  validators,
  re_pattens,
  rank,
  DateParser,
  filters,
  upAndDown,
  bbs_category
}
