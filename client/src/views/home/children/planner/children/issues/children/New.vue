<template>
  <el-container class="full">
    <el-header
      height="auto"
      style="display: flex;padding:0;justify-content: space-between;align-content:center;margin-bottom:10px"
    >
      <el-button-group>
        <el-button icon="el-icon-s-fold" @click="folding = !folding"
          >选项</el-button
        >
        <el-button type="primary" icon="el-icon-upload" @click="summit"
          >保存</el-button
        >
      </el-button-group>
    </el-header>

    <el-container class="full scroll-if-need">
      <el-aside
        width="180px"
        v-if="folding == false"
        style="margin-right:10px;padding:10px"
        class="el-card"
      >
        <el-form :model="article">
          <el-form-item label="指派:">
            <member-select v-model="article.assignee" :planner="planner_id" />
          </el-form-item>
          <el-form-item label="里程碑:">
            <milestone-select
              v-model="article.milestone"
              :planner="planner_id"
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

      <el-container class="el-card" direction="vertical">
        <el-input placeholder="请输入标题" v-model="article.title" clearable />

        <md-editor
          v-model="article.content"
          theme="small"
          :editable="true"
          @save="summit"
        />
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import MemberSelect from "@/components/MemberSelect";
import MilestoneSelect from "@/components/MilestoneSelect";
import MdEditor from "@/components/MdEditor";

export default {
  path: "new",
  weight: 10,
  meta: { require_logined: true },
  components: { MilestoneSelect, MemberSelect, MdEditor },
  data() {
    return {
      article: {
        title: "",
        content: "",
        assignee: null,
        milestone: null
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
      return `/planner/${this.planner_id}/issues`;
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
      await this.$store.dispatch("issues_create", {
        planner: this.planner_id,
        data: this.article
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
