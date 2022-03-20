<template>
  <div id="wrap">
    <var-card
      title="发布帖子"
      class="card"
    >
      <template #extra>
        <div id="body">
          <div id="title" class="clear-fix">
            <div id="title-text">标题:</div>
            <div id="title-input">
              <var-input :hint="false" placeholder="请输入标题(必填)" v-model="title"/>
            </div>
          </div>

          <div id="content" class="clear-fix">
            <div id="content-text">文章内容:</div>
            <div id="content-input" style="z-index: 1200">
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                editorId="editor"
                :defaultConfig="toolbarConfig"
                :mode="mode"
              />
              <Editor
                style="height:60vh; overflow-y: hidden;"
                editorId="editor"
                :defaultConfig="editorConfig"
                :mode="mode"
              />
            </div>
          </div>

          <div id="category" class="clear-fix">
            <div id="category-text">文章类别:</div>
            <div id="category-input">
              <var-radio-group v-model="category">
                <var-radio :checked-value="1">分类1</var-radio>
                <var-radio :checked-value="2">分类2</var-radio>
                <var-radio :checked-value="3">分类3</var-radio>
              </var-radio-group>
            </div>
          </div>

          <div id="submit" class="clear-fix">
            <var-button id="post" type="success" @click="post">发布</var-button>
            <var-button id="save" type="info">保存草稿</var-button>
            <var-button id="back" type="warning" @click="this.$router.return('/bbs')">取消</var-button>
          </div>
        </div>
      </template>
    </var-card>
  </div>
</template>

<script>
  import '@wangeditor/editor/dist/css/style.css'
  import {Editor, Toolbar, getEditor, removeEditor} from '@wangeditor/editor-for-vue'
  import {SlateTransforms} from '@wangeditor/editor'

  export default {
    name: "PostArticle",
    components: {
      Editor,
      Toolbar,
    },
    data() {
      return {
        title: "",
        category: 1,
        toolbarConfig: {
          toolbarKeys: [
            "headerSelect",
            "bold",
            "underline",
            "italic",
            {
              "key": "group-more-style",
              "title": "更多",
              "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path><path d=\"M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path><path d=\"M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path></svg>",
              "menuKeys": [
                "through",
                "code",
                "sup",
                "sub",
                "clearStyle"
              ]
            },
            "color",
            "bgColor",
            "fontFamily",
            "todo",
            {
              "key": "group-justify",
              "title": "对齐",
              "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z\"></path></svg>",
              "menuKeys": [
                "justifyLeft",
                "justifyRight",
                "justifyCenter",
              ]
            },
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
            "divider",
            "undo",
            "redo",
            "fullScreen"
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
      }
    },
    methods: {
      post() {
        let editor = getEditor("editor")
        if (!this.title || editor.isEmpty()) return

        this.$ajax.api.post(
          "/bbs/article/",
          {
            title: this.title,
            content: editor.getHtml(),
            raw_content: JSON.stringify(editor.children),
            category_id: this.category
          }
        ).then(res => {
          if (res.data.code === 113) {
            this.$tip({
              content: "发布成功",
              type: "success",
              duration: 1000,
            })
            this.$router.replace(`/bbs/article/${res.data.result.id}`)
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        }).catch(err => {
          this.$tip({
            content: err,
            type: "error",
            duration: 2000,
          })
        })
      }
    },
    beforeDestroy() {
      const editor = getEditor("editor")
      if (editor == null) return
      editor.destroy()
      removeEditor("editor")
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    #title-text, #content-text, #category-text {
      width: 100px;
      line-height: 32px;
      font-size: 16px;
      float: left;
    }

    #title-input, #content-input, #category-input {
      width: calc(100% - 100px);
      float: left;
    }

    #wrap {
      margin-top: 30px;
    }

    #body {
      margin: 50px;
    }

    #content-input {
      border: 1px solid #ccc
    }

    #title, #content, #category {
      margin: 30px 0;
    }
  }

  @media screen and (max-width: 840px) {
    #content-input {
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
    }

    #title, #category {
      margin: 10px;
    }

    #title-text, #content-text {
      display: none;
    }
  }


  #category-input {
    z-index: 1500;
  }

  #post, #save, #back {
    float: right;
    margin: 0 20px 20px 0;
  }
</style>