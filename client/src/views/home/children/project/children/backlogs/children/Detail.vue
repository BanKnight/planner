<template>
  <el-container class="full">
    <el-header
      height="auto"
      style="display: flex;padding:0;justify-content: space-between;align-content:center;margin-bottom:10px"
    >
      <template v-if="editing">
        <el-button icon="el-icon-back" @click="editing=false" style="margin-right:20px"></el-button>

        <el-input placeholder="请输入标题" v-model="article.title" clearable>
          <el-button slot="append" type="primary" icon="el-icon-upload" @click="summit">提交</el-button>
        </el-input>
      </template>

      <template v-else>
        <el-button icon="el-icon-s-fold" @click="folding=!folding" style="margin-right:20px"></el-button>

        <h2>{{article.title}}</h2>

        <el-button-group>
          <el-button icon="el-icon-edit" @click="editing = !editing" />
        </el-button-group>
      </template>
    </el-header>

    <el-container class="full scroll-if-need">
      <el-aside
        width="180px"
        v-if="folding==false || editing == true"
        style="margin-right:10px;padding:10px"
        class="el-card"
      >
        <el-form :model="article">
          <el-form-item label="指派:">
            <member-select v-model="article.assignee" :planner="planner_id" :disabled="!editing" />
          </el-form-item>
          <el-form-item label="里程碑:">
            <milestone-select
              v-model="article.milestone"
              :planner="planner_id"
              :disabled="!editing"
            />
          </el-form-item>

          <!-- <el-form-item label="标签:">
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
          </el-form-item>-->
        </el-form>
      </el-aside>

      <el-container class="el-card">
        <mavon-editor
          v-model="article.content"
          :boxShadow="false"
          :ishljs="false"
          :subfield="editing"
          :editable="editing"
          :toolbarsFlag="editing"
          :defaultOpen="editing?'edit':'preview'"
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
import MemberSelect from "@/components/MemberSelect";
import MilestoneSelect from "@/components/MilestoneSelect";

export default {
  path: "detail/:backlogs",
  weight: 10,
  meta: { require_logined: true },
  components: { MilestoneSelect, MemberSelect },

  data() {
    return {
      article: {
        title: "",
        content: "",
        assignee: null,
        milestone: null
      },
      editing: false,
      folding: true
    };
  },
  computed: {
    options() {
      if (this.editing) {
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

      return {};
    },
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
    },
    backlogs_id() {
      return this.$route.params.backlogs;
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
        backlogs: this.backlogs_id
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

      await this.$store.dispatch("backlogs_update", {
        planner: this.planner_id,
        backlogs: this.backlogs_id,
        data: this.article
      });

      this.$message.success("修改成功");

      this.editing = false;
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

