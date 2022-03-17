let cos_url = "https://sc-1304907527.cos.ap-nanjing.myqcloud.com/"
// let api_url = "https://api.chain.seutools.com/"
let api_url = "http://127.0.0.1:8000/"


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
  if (experience < 50) return {level: 0, experience, total: 50}
  if (experience < 120) return {level: 1, experience, total: 120}
  if (experience < 300) return {level: 2, experience, total: 300}
  if (experience < 800) return {level: 3, experience, total: 800}
  if (experience < 2000) return {level: 4, experience, total: 2000}
  if (experience < 5000) return {level: 5, experience, total: 5000}
  return {level: 6, experience, total: "--"}
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
}
