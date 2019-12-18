<template>
  <el-container class="full" direction="vertical">
    <el-row type="flex" justify="space-between" align="middle" style="margin-bottom:10px">
      <el-button
        icon="el-icon-back"
        @click="goback"
        type="success"
        plain
        style="margin-right:20px"
      >返回</el-button>

      <el-input placeholder="请输入标题" v-model="article.name" clearable>
        <el-button slot="append" type="primary" icon="el-icon-upload">提交</el-button>
      </el-input>
    </el-row>

    <mavon-editor
      v-model="article.content"
      @save="save"
      :ishljs="false"
      :toolbars="options"
      toolbarsBackground="#f0f9eb"
      class="full"
    />
  </el-container>
</template>

<script>
export default {
  path: "new",
  weight: 10,
  meta: { require_logined: true },
  data() {
    return {
      article: {
        title: "",
        content: ""
      }
    };
  },
  computed: {
    options() {
      return {
        imagelink: true, // 图片链接
        fullscreen: true, // 全屏编辑
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        table: true, // 表格

        save: true, // 保存（触发events中的save事件）,
        subfield: true, // 单双栏模式
        preview: true // 预览
      };
    }
  },
  methods: {
    save() {},
    goback() {}
  }
};
</script>

