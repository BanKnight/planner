<template>
  <el-container class="full">
    <el-main>
      <el-card v-if="article" shadow="never">
        <div slot="header">
          <h1>{{article.title}}</h1>
          <span>
            <el-tag
              v-for="label in article.labels.nodes"
              :key="label.name"
              type="info"
              effect="dark"
            >{{ label.name }}</el-tag>
          </span>
        </div>
        <div class="markdown-body" v-html="article.bodyHTML" />
      </el-card>
    </el-main>
    <el-aside width="180px">
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
    </el-aside>
  </el-container>
</template>

<script>
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
    }
  }
};
</script>