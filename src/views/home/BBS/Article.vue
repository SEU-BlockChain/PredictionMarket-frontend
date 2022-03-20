<template>
  <div id="wrap" class="clear-fix" v-if="ready">
    <div id="left">
      <var-card id="content-card" class="card" elevation="0">
        <template #extra>
          <div id="title">{{article.title}}</div>
          <div id="show"></div>
          <div id="time">文章发表:{{this.$settings.filters.date(article.create_time)}}</div>
          <div id="content" class="limited-xy2" v-html="article.content"/>
        </template>
      </var-card>
      <var-card id="post-content-card" class="card" elevation="0">
        <template #extra>
          <div id="editor-wrap" class="clear-fix">
            <div id="post-content-text">发表评论</div>
            <div id="comment-input" v-if="this.$store.state.is_login">
              <Toolbar
                style="border-bottom: 1px solid #eee"
                editorId="editor"
                :defaultConfig="toolbarConfig"
                :mode="mode"
              />
              <Editor
                style="height:170px; overflow-y: hidden;"
                editorId="editor"
                :defaultConfig="editorConfig"
                :mode="mode"
              />
            </div>
            <div v-if="this.$store.state.is_login" id="post-comment-button">
              <var-button type="success" @click="post_root_comment">确定</var-button>
            </div>

            <div v-else id="login-tip"><a :href="'/user/login/?next=/bbs/article/'+article.id">登录</a> <span>后发表评论</span>
            </div>
          </div>
        </template>
      </var-card>
      <var-card id="comment-card" class="card" elevation="0">
        <template #extra>
          <var-tabs v-model:active="author">
            <div class="space"/>
            <var-tab>全部评论</var-tab>
            <var-tab>只看楼主</var-tab>
            <div id="order"></div>
            <div class="space"/>
          </var-tabs>
          <var-divider margin="0"/>
          <var-list
            :finished="finished"
            v-model:loading="loading"
            @load="load_comments"
          >
            <div :key="comment.id" v-for="comment in comment_list">
              <comment-card :comment="comment" @show_editor="show_editor"
                            @show_children_comments="show_children_comments"
              />
            </div>
          </var-list>
        </template>
      </var-card>
    </div>

    <div id="right">
      <var-card id="user-card" class="card" elevation="0">
        <template #extra>
          <div class="clear-fix">
            <img id="avatar" :src="this.$settings.cos_url+article.author.icon"/>

            <div id="author">{{article.author.username}}</div>
            <div>
              <var-chip id="level" :round="false" type="warning" size="mini">
                Lv.{{this.$settings.rank(article.author.experience).level}}
              </var-chip>
            </div>
          </div>
        </template>
      </var-card>

      <var-card id="other-article-card" class="card" elevation="0">
        <template #extra>
          <div id="other-article-text">
            {{article.author.username}}的其它文章
          </div>
          <var-divider margin="0"/>
          <div style="height: 200px"></div>
        </template>
      </var-card>

      <var-sticky :offset-top="100">
        <var-card id="interact-card" class="card" elevation="0">
          <template #extra>
            <var-row>
              <var-col span="8">
                <div class="interact" style="border-right: 1px solid #eee" @click="to_comment_editor">
                  <img class="interact-icon" src="~assets/img/comment.svg" height="30" alt="">
                  <div class="interact-text">{{article.comment_num}}</div>
                </div>
              </var-col>
              <var-col span="8">
                <div class="interact" style="border-right: 1px solid #eee"
                     :class="{interactActive:article.is_up===true}"
                     @click="voteArticle(1)">
                  <img class="interact-icon" src="~assets/img/up.svg" height="30" alt="">
                  <div class="interact-text">{{article.up_num}}</div>
                </div>
              </var-col>

              <var-col span="6">
                <div class="interact" :class="{interactActive:article.is_up===false}"
                     @click="voteArticle(0)">
                  <img class="interact-icon" src="~assets/img/down.svg" height="30" alt="">
                  <div class="interact-text">{{article.down_num}}</div>
                </div>
              </var-col>
            </var-row>
          </template>
        </var-card>

        <br>
        <var-button type="primary" @click="this.$router.return('/bbs')">返回论坛首页</var-button>
      </var-sticky>
    </div>

    <div id="pop" :class="{hide:!show}" class="var-elevation--24">
      <div id="pop-editor" class="comment">
        <Toolbar
          style="border-bottom: 1px solid #eee"
          editorId="editor2"
          :defaultConfig="toolbarConfig"
          :mode="mode"
        />
        <Editor
          style="height:200px; overflow-y: hidden;border-bottom: 1px solid #eee"
          editorId="editor2"
          :defaultConfig="editorConfig"
          :mode="mode"
        />
        <var-button class="post-children-button" type="success" @click="post_children_comment">确定</var-button>
        <var-button class="post-children-button" type="warning" @click="hide">取消</var-button>
      </div>
    </div>
  </div>

  <var-popup v-model:show="show_children" style="border-radius: 10px;">
    <div class="clear-fix" id="children-wrap">
      <comment-card :comment="opened_comment" :sketch="true" @show_editor="show_editor"/>
      <var-list
        :finished="children_finished"
        v-model:loading="children_loading"
        @load="load_children_comments"
      >
        <div v-for="children_comment in comment_children_list">
          <children-card
            :children_comment="children_comment"
            @show_editor="show_editor"
            :root_comment="opened_comment"/>
        </div>
      </var-list>
    </div>
  </var-popup>

  <div id="pe-tab" class="var-elevation--5">
    <var-row>
      <var-col span="8">
        <div class="interact clear-fix" style="border-right: 1px solid #eee" @click="to_comment_editor">
          <img class="interact-icon" src="~assets/img/comment.svg" alt="">
          <div class="interact-text">{{article.comment_num}}</div>
        </div>
      </var-col>
      <var-col span="8">
        <div class="interact clear-fix" style="border-right: 1px solid #eee"
             :class="{interactActive:article.is_up===true}"
             @click="voteArticle(1)">
          <img class="interact-icon" src="~assets/img/up.svg" alt="">
          <div class="interact-text">{{article.up_num}}</div>
        </div>
      </var-col>

      <var-col span="6">
        <div class="interact clear-fix" :class="{interactActive:article.is_up===false}"
             @click="voteArticle(0)">
          <img class="interact-icon" src="~assets/img/down.svg" alt="">
          <div class="interact-text">{{article.down_num}}</div>
        </div>
      </var-col>
    </var-row>
  </div>


</template>

<script>
  import '@wangeditor/editor/dist/css/style.css'
  import {Editor, Toolbar, getEditor, removeEditor} from '@wangeditor/editor-for-vue'
  import {SlateTransforms} from '@wangeditor/editor'
  import CommentCard from "components/card/CommentCard";
  import ChildrenCard from "components/card/ChildrenCard";

  export default {
    name: "Article",
    components: {
      CommentCard,
      Editor,
      Toolbar,
      ChildrenCard,
    },
    data() {
      return {
        article: {},
        ready: false,
        author: 0,

        finished: false,
        loading: false,
        comment_list: [],
        next: null,

        toolbarConfig: {
          toolbarKeys: [
            "insertLink",
            {
              "key": "group-image",
              "title": "图片",
              "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z\"></path></svg>",
              "menuKeys": [
                "insertImage",
                "uploadImage"
              ]
            },
            "undo",
            "redo",
          ]
        },
        editorConfig: {
          autoFocus: false,
          placeholder: '请输入内容...',
          MENU_CONF: {
            insertImage: {
              checkImage(src) {
                if (src.indexOf('http') !== 0) {
                  return '图片网址必须以 http/https 开头';
                }
                return true;
              }
            },
            uploadImage: {
              server: this.$settings.api_url + "common/image/",
              fieldName: 'file',
              maxFileSize: 5 * 1024 * 1024,
              maxNumberOfFiles: 1,
              allowedFileTypes: ['image/*'],
              headers: {
                Authorization: this.$cookies.get("token")
              },
              base64LimitKB: 5,
              customInsert(result, insertFn) {
                if (result.code === 123) {
                  let url = "https://bc-1304907527.cos.ap-nanjing.myqcloud.com/" + result.result.data
                  insertFn(url)
                } else {
                  this.$tip({
                    content: result.msg,
                    type: "warning",
                    duration: 1000,
                  })
                }
              },
            }
          }
        },
        mode: 'default',

        show: false,
        parent_id: null,

        show_children: false,
        opened_comment: null,

        children_finished: false,
        children_loading: false,
        comment_children_list: [],
        children_next: null,
      }
    },
    methods: {
      load_comments() {
        this.$ajax.api.get(
          this.next || `bbs/article/${this.$route.params.id}/comment`
        ).then(res => {
          if (res.data.code !== 117) {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          } else {
            for (let i of res.data.result.results) {
              this.comment_list.push(i)
            }
            if (res.data.result.next) {
              this.next = res.data.result.next.match(/(\/bbs\/article\/.*)/)[0]
            }
            this.finished = !Boolean(res.data.result.next)
            this.loading = false
          }
        })
      },
      post_root_comment() {
        let editor = getEditor("editor")
        if (editor.isEmpty()) return

        this.$ajax.api.post(
          `bbs/article/${this.$route.params.id}/comment/`,
          {
            content: editor.getHtml()
          }
        ).then(res => {
          if (res.data.code === 118) {
            this.$tip({
              content: "评论成功",
              type: "success",
              duration: 1000,
            })
            let data = res.data.result
            data.new = true
            this.article.comment_num++
            this.comment_list.unshift(data)
            this.to_comment()
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
      },
      to_comment_editor() {
        scrollTo(0, document.getElementById("comment-input").offsetTop - 64)
      },
      voteArticle(is_up) {
        this.$ajax.api.post(
          `bbs/article/${this.$route.params.id}/vote/`,
          {
            is_up
          }
        ).then(res => {
          if (res.data.code === 124) {
            this.$settings.upAndDown(is_up, this.article)
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
      },
      show_editor(parent, target) {
        if (!this.$store.state.is_login) {
          this.$tip({
            content: "请先登录",
            type: "warning",
            duration: 1000,
          })
        } else {
          let editor = getEditor("editor2")
          if (target) {
            SlateTransforms.insertNodes(editor, [{
              type: 'paragraph', children: [{text: '回复 '}, {
                color: "rgb(66, 144, 247)", text: `@${target.author.username}`
              }, {text: ':'}]
            }])
            SlateTransforms.removeNodes(editor, {at: [0]})
          }
          this.show = true
          this.parent_id = parent.id
        }
      },
      hide() {
        this.show = false
        getEditor("editor2").clear()
      },
      post_children_comment() {
        let editor = getEditor("editor2")
        if (editor.isEmpty()) return

        this.$ajax.api.post(
          `bbs/article/${this.$route.params.id}/comment/${this.parent_id}/children_comment/`,
          {
            content: editor.getHtml()
          }
        ).then(res => {
          if (res.data.code === 118) {
            this.$tip({
              content: "评论成功",
              type: "success",
              duration: 1000,
            })
            let data = res.data.result
            data.new = true
            this.article.comment_num++
            if (this.show_children) {
              this.comment_children_list.push(data)
            } else {
              for (let i of this.comment_list) {
                if (i.id === this.parent_id) {
                  i.comment_num++
                  i.children_comment.push(data)
                }
              }
            }
            this.hide()
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
      },
      show_children_comments(comment) {
        this.show_children = true
        this.opened_comment = comment
      },
      load_children_comments() {
        this.$ajax.api.get(
          this.children_next || `bbs/article/${this.$route.params.id}/comment/${this.opened_comment.id}/children_comment/`
        ).then(res => {
          if (res.data.code !== 117) {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          } else {
            for (let i of res.data.result.results) {
              this.comment_children_list.push(i)
            }
            if (res.data.result.next) {
              this.children_next = res.data.result.next.match(/(\/bbs\/article\/.*)/)[0]
            }
            this.children_finished = !Boolean(res.data.result.next)
            this.children_loading = false
          }
        })
      }
    },
    beforeCreate() {
      this.$ajax.api.get(
        `bbs/article/${this.$route.params.id}`
      ).then(res => {
        if (res.data.code !== 111) {
          this.$tip({
            content: res.data.msg,
            type: "warning",
            duration: 1000,
          })
        } else {
          this.article = res.data.result
          this.ready = true
        }
      })
    },
    created() {
      scrollTo(0, 0)
    },
    beforeDestroy() {
      const editor = getEditor("editor")
      if (editor == null) return
      editor.destroy()
      removeEditor("editor")
    },
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    #pe-tab {
      display: none;
    }

    #wrap {
      margin-top: 50px;
    }

    #left {
      float: left;
      width: 68%;
      margin-right: 2%;
    }

    #right {
      float: left;
      width: 30%;
    }

    #post-content-card {
      margin: 40px 0;
    }


    #content-card {
      padding: 30px 60px;
    }


    #editor-wrap {
      margin: 20px 40px;
    }

    #children-wrap {
      width: 600px;
      overflow-x: hidden;
      max-height: 70vh;
    }

    #pop {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 700px;
      z-index: 3000;
      background-color: white;
      border-radius: 10px;
      padding: 10px;
    }


    .post-children-button {
      float: right;
      margin: 20px;
    }

    #comment-card {
      min-height: 200px;
    }

    .interact-icon {
      overflow: hidden;
      position: relative;
      transform: translateY(-80px);
      filter: drop-shadow(0 80px #999);
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      width: 40px;
    }

    .interact {
      cursor: pointer;
    }

    .interact:hover img {
      filter: drop-shadow(0 80px #4ebaee);
    }

    .interact:hover {
      color: #4ebaee;
    }

    .space {
      width: 5%;
    }
  }

  @media screen and (max-width: 840px) {
    #right {
      display: none;
    }

    #wrap {
      margin-top: 10px;
    }

    #left {
      float: left;
      width: calc(100% - 10px);
      margin: 5px;
    }

    #post-content-card {
      margin: 10px 0;
    }

    #content-card {
      padding: 30px 10px;
    }

    #editor-wrap {
      margin: 20px;
    }

    #children-wrap {
      width: 96vw;
      padding: 20px 0 200px;
      overflow-x: hidden;
      max-height: 70vh;
    }

    #pop {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100vw;
      z-index: 3000;
      background-color: white;
      padding-top: 20px;
      border-radius: 5px 5px 0 0;
    }


    .post-children-button {
      margin: 10px;
    }

    #comment-card {
      margin-bottom: 100px;
    }

    #pe-tab {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      overflow: hidden;
      background-color: #f6f6f6;
      z-index: 1000;
    }

    .interact-icon {
      float: left;
      overflow: hidden;
      position: relative;
      transform: translateY(-80px);
      filter: drop-shadow(0 80px #999);
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      width: 30px;
      margin: 5px;
    }

    .interact-text {
      float: left;
    }

    .interact {
      padding: 10px 10px;
      line-height: 30px;
    }
  }


  #order {
    width: 70%;
  }


  #title {
    font-size: 20px;
    font-weight: bold;
  }

  #show {
    background-color: #f2f2f2;
    border-radius: 2px;
    width: 100%;
    height: 30px;
    margin: 20px 0 0;
  }

  #time {
    text-align: center;
    line-height: 30px;
    font-size: 10px;
    color: #999999;
    margin-bottom: 20px;
  }

  #user-card {
    padding: 20px;
    margin-bottom: 30px;
  }

  #avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    float: left;
    cursor: pointer;
    margin-right: 20px;
  }

  #author {
    font-size: 20px;
    font-weight: bold;
    color: #666;
    cursor: pointer;
  }

  #level {
    margin-top: 7px;
    float: left;
    cursor: pointer;
  }

  #interact-card {
    margin-bottom: 20px;
    padding: 10px 0;
    text-align: center;
  }

  #other-article-card {
    margin-bottom: 20px;
  }

  #other-article-text {
    font-size: 14px;
    line-height: 30px;
    text-indent: 10px;
    color: #666666;
  }


  .interactActive {
    color: #4ebaee;
  }

  .interactActive img {
    filter: drop-shadow(0 80px #4ebaee);
  }


  #comment-input {
    border: 1px solid #eee;
    border-radius: 5px;
  }

  #post-content-text {
    line-height: 40px;
    color: #888;
    font-weight: bold;
  }


  #post-comment-button {
    float: right;
    margin: 10px 0;
  }

  #login-tip {
    line-height: 40px;
    text-align: center;
  }

  #pop-editor {
    padding: 10px;
    width: 700px;
  }


  .hide {
    visibility: hidden;
  }


</style>