<template>
  <el-container class="full">
    <el-header
      height="auto"
      style="display: flex;padding:0;justify-content: space-between;margin-bottom:10px"
    >
      <el-button icon="el-icon-s-fold" @click="folding=!folding" style="margin-right:20px"></el-button>

      <el-input placeholder="请输入标题" v-model="article.title" clearable>
        <el-button slot="append" type="primary" icon="el-icon-upload" @click="summit">提交</el-button>
      </el-input>
    </el-header>

    <el-container class="full scroll-if-need" direction="horizontal">
      <el-aside width="180px" v-if="folding==false" style="margin-right:10px">
        <el-container class="full" direction="vertical">
          <el-table :data="articles" style="width: 100%" height="100%" size="small" :border="true">
            <el-table-column>
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

      <el-container style="border: 1px solid #ebeef5">
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
      },
      folding: false
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
  methods: {
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

