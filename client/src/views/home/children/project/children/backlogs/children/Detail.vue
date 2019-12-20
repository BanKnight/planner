<template>
  <el-container class="full">
    <el-header
      height="auto"
      style="display: flex;padding:0;justify-content: space-between;align-content:center;margin-bottom:10px"
    >
      <el-button icon="el-icon-s-fold" @click="folding=!folding" style="margin-right:20px"></el-button>

      <h2>{{article.title}}</h2>

      <el-button-group>
        <el-button icon="el-icon-edit" />
        <el-button icon="el-icon-more" />
      </el-button-group>
    </el-header>

    <el-container class="full scroll-if-need">
      <el-aside
        width="180px"
        v-if="folding==false"
        style="margin-right:10px;padding:10px"
        class="el-card"
      >
        <el-form :model="extra">
          <el-form-item label="指派:">
            <el-select v-model="extra.assignee" placeholder="请选择">
              <el-option
                v-for="item in assignee"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="里程碑:">
            <el-select v-model="extra.assignee" placeholder="请选择">
              <el-option
                v-for="item in assignee"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="标签:">
            <el-select
              v-model="extra.tags"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择文章标签"
            >
              <el-option
                v-for="item in tags"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-aside>

      <el-container class="el-card">
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
          style="border:none"
        />
      </el-container>
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
      folding: true,
      extra: {},
      assignee: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      tags: [
        {
          value: "HTML",
          label: "HTML"
        },
        {
          value: "CSS",
          label: "CSS"
        },
        {
          value: "JavaScript",
          label: "JavaScript"
        }
      ]
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

