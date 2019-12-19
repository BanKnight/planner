<template>
  <el-container class="full">
    <el-aside width="180px" v-if="folding==false">
      <el-container class="full" direction="vertical"></el-container>
    </el-aside>

    <el-container>
      <el-header>
        <el-button-group>
          <el-button size="mini" :icon="fold_icon" @click="folding=!folding"></el-button>
          <el-button size="mini" type="primary" icon="el-icon-plus"></el-button>
        </el-button-group>
        <h1>{{article.title}}</h1>

        <el-button-group>
          <el-button size="mini" icon="el-icon-edit" />
          <el-button size="mini" icon="el-icon-more" />
        </el-button-group>
      </el-header>

      <el-main style="padding:2px">
        <el-row type="flex" justify="space-between" align="middle">
          <el-button-group>
            <el-button size="mini" :icon="fold_icon" @click="folding=!folding"></el-button>
            <el-button size="mini" type="primary" icon="el-icon-plus"></el-button>
          </el-button-group>
          <el-button-group>
            <el-button size="mini" icon="el-icon-edit" />
            <el-button size="mini" icon="el-icon-more" />
          </el-button-group>
        </el-row>

        <div>
          <h1>{{article.title}}</h1>

          <span>
            <el-tag type="success" size="small">标签二</el-tag>
            <el-tag type="info" size="small">标签三</el-tag>
            <el-tag type="warning" size="small">标签四</el-tag>
            <el-tag type="danger" size="small">标签五</el-tag>
          </span>
        </div>
        <mavon-editor
          v-model="article.content"
          :boxShadow="false"
          :ishljs="false"
          :subfield="false"
          :editable="false"
          :toolbarsFlag="false"
          defaultOpen="preview"
          :toolbars="{}"
          toolbarsBackground="#f0f9eb"
          class="full"
        />
      </el-main>
      <el-aside></el-aside>
    </el-container>
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
      },
      folding: true
    };
  },
  computed: {
    fold_icon() {
      if (this.folding == false) {
        return "el-icon-s-fold";
      }
      return "el-icon-s-unfold";
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

