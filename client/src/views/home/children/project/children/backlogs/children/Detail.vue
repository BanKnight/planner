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

      <h1>{{article.title}}</h1>
    </el-row>

    <mavon-editor
      v-model="article.content"
      :ishljs="false"
      :subfield="false"
      :editable="false"
      :toolbarsFlag="false"
      defaultOpen="preview"
      :toolbars="{}"
      toolbarsBackground="#f0f9eb"
      class="full"
    />
  </el-container>
</template>

<script>
export default {
  path: "detail/:backlogs",
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
    root() {
      return `/project/${this.planner_id}/backlogs`;
    },
    planner_id() {
      return this.$route.params.id;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.fullPath != "/") {
        vm.from = from.fullPath;
      }
    });
  },
  mounted() {
    this.fetch();
  },
  methods: {
    async fetch() {
      let article = await this.$store.dispatch("backlogs_detail", {
        planner: this.planner_id,
        backlogs: this.$route.params.backlogs
      });

      this.article = article;
    },
    async summit() {
      let title = this.article.title.trim();
      let content = this.article.content;

      if (title.length == 0 || content.length == 0) {
        this.$message.error("请输入完整的标题和内容后再提交");

        return;
      }

      await this.$store.dispatch("backlogs_create", {
        planner: this.planner_id,
        data: {
          title,
          content
        }
      });

      this.$message.success("创建成功");

      this.goback();
    },
    goback() {
      if (this.from) {
        this.$router.push(this.from);
      } else {
        this.$router.push(this.root);
      }
    }
  }
};
</script>

