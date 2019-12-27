<template>
  <el-container class="full">
    <el-header
      height="auto"
      style="display: flex;padding:0;justify-content: space-between;align-content:center"
    >
      <el-button-group>
        <el-button size="mini" icon="el-icon-close" @click="goback">取消</el-button>

        <el-button size="mini" type="primary" icon="el-icon-upload" @click="summit">保存</el-button>
      </el-button-group>
    </el-header>

    <el-container class="el-card" direction="vertical">
      <el-input placeholder="请输入标题" v-model="article.title" clearable />

      <mavon-editor
        v-model="article.content"
        @save="summit"
        :ishljs="false"
        :boxShadow="false"
        :toolbars="options"
        toolbarsBackground="#f0f9eb"
        class="full"
        style="border:none"
      />
    </el-container>
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
    },
    root() {
      return `/planner/${this.planner_id}/wiki`;
    },
    planner_id() {
      return this.$route.params.planner;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.fullPath != "/") {
        vm.from = from.fullPath;
      }
    });
  },
  methods: {
    async summit() {
      this.article.title = this.article.title.trim();
      this.articlecontent = this.article.content;

      if (this.article.title.length == 0) {
        this.$message.error("提交前标题不能为空");
        return;
      }
      let one = await this.$store.dispatch("wiki_create", {
        planner: this.planner_id,
        data: this.article
      });

      this.$message.success("创建成功");

      this.$router.push(`${this.root}/detail/${one._id}`);
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

