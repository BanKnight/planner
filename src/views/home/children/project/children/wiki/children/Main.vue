<template>
  <el-container class="full">
    <el-aside width="180px">
      <el-container class="full" direction="vertical">
        <el-row type="flex" justify="start" align="middle">
          <el-button size="small">
            <i class="el-icon-s-fold" />
          </el-button>
        </el-row>
        <el-table :data="articles" style="width: 100%" height="100%" size="small" :border="true">
          <el-table-column prop="title" label="地址">
            <template slot="header">
              <el-input
                class="search"
                placeholder="输入关键字"
                v-model="keyword"
                clearable
                size="mini"
                prefix-icon="el-icon-search"
                @clear="on_clear"
                @keydown.enter.native.stop="on_search"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-container>
    </el-aside>
    <el-container>
      <el-main style="padding-top:0">
        <el-card shadow="never">
          <div slot="header">
            <h2>文章标题</h2>
            <el-tag type="success" size="small">标签二</el-tag>
            <el-tag type="info" size="small">标签三</el-tag>
            <el-tag type="warning" size="small">标签四</el-tag>
            <el-tag type="danger" size="small">标签五</el-tag>
          </div>
          <div class="markdown-body" v-html="test_markdown"></div>
        </el-card>
      </el-main>
      <el-aside></el-aside>
    </el-container>
  </el-container>
</template>

<script>
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";

export default {
  path: "",
  weight: 8,
  data() {
    return {
      articles: [
        {
          title: "文章标题1",
          content: `# this is content`
        },
        {
          title: "文章标题1",
          content: `# this is content`
        },
        {
          title: "文章标题3",
          content: `# this is content`
        },
        {
          title: "文章标题4",
          content: `# this is content`
        }
      ]
    };
  },
  computed: {
    root() {
      return `/project/${this.$route.params.id}/wiki`;
    },
    test_markdown() {
      return mavonEditor.markdownIt.render(
        "# this is something\n ## this is you don't know"
      );
    }
  },
  methods: {
    on_clear() {},
    on_search() {}
  }
};
</script>

<style scoped>
.el-tag {
  margin-right: 10px;
}
</style>