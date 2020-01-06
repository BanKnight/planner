<template>
  <mavon-editor
    ref="md"
    :value="content"
    @input="on_input"
    v-bind="options"
    @imgAdd="add_img"
    class="full"
    style="border:none"
    toolbarsBackground="#f0f9eb"
  ></mavon-editor>
</template>

<script>
export default {
  data()  {
    return {
      content: "",
    }
  },
  props: {
    value: {
      type: String,
    },
    theme: {
      type: String,
      default: "mini"
    },
    editable: {
      type: Boolean,
      default: true,
    },
    planner: String,
  },
  computed: {
    options()    {

      let theme = `${this.theme}_${this.editable ? 'edit' : 'preview'}`

      return this[theme]
    },
    mini_edit()    {
      return {
        boxShadow: false,
        ishljs: false,
        subfield: false,
        editable: true,
        toolbarsFlag: false,
        defaultOpen: "edit",
      }
    },
    mini_preview()    {
      return {
        boxShadow: false,
        ishljs: false,
        subfield: false,
        editable: false,
        toolbarsFlag: false,
        defaultOpen: "preview",
      }
    },
    small_edit()    {
      return {
        boxShadow: false,
        ishljs: false,
        subfield: true,
        editable: true,
        toolbarsFlag: true,
        defaultOpen: "edit",
        toolbars: {
          imagelink: true, // 图片链接
          fullscreen: true, // 全屏编辑
          undo: true, // 上一步
          redo: true, // 下一步
          trash: true, // 清空
          table: true, // 表格

          subfield: true, // 单双栏模式
          preview: true // 预览
        }
      }
    },
    small_preview()    {
      return this.mini_preview
    }
  },
  mounted()  {
    this.content = this.value
  },
  watch: {
    value(new_val)    {
      this.content = new_val
    }
  },
  methods: {
    on_input(val)    {
      this.content = val
      this.$emit("input", val)
    },
    async add_img(pos, raw_file)
    {
      const formdata = new FormData();
      formdata.append('file', raw_file);

      let file = await this.$store.dispatch("pan_upload_priavte", {
        planner: this.planner,
        data: formdata
      })

      console.log("upload success", file)

      let url = `${this.$http.defaults.baseURL}/public/upload/${this.planner}/${file.res}`;

      this.$refs.md.$img2Url(pos, url)

    },

  }


}
</script>



