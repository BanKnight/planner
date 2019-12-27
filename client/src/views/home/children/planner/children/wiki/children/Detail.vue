<template>
  <el-container class="full">
    <el-aside width="180px" style="margin-right:10px">
      <articles ref="articles" :planner="planner_id" />
    </el-aside>

    <el-container style="padding:0" class="full" direction="vertical">
      <el-row type="flex" justify="space-between" align="middle">
        <template v-if="editing">
          <el-button-group>
            <el-button size="mini" icon="el-icon-close" @click="editing=false">取消</el-button>
            <el-button size="mini" type="primary" icon="el-icon-upload" @click="summit">保存</el-button>
          </el-button-group>
        </template>

        <template v-else>
          <el-button-group>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="destroy">删除</el-button>
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editing = !editing">编辑</el-button>
          </el-button-group>
        </template>

        <member-preview size="mini" :planner="planner_id" v-model="article.author" />
      </el-row>
      <el-container class="el-card" direction="vertical">
        <div v-if="!editing" class style="text-align:center;">
          <h1>{{article.title}}</h1>
        </div>
        <el-input v-else placeholder="请输入标题" v-model="article.title" clearable></el-input>
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
import MemberPreview from "@/components/MemberPreview";

import Articles from "@/components/Articles";

export default {
  path: "detail/:article",
  weight: 10,
  meta: { require_logined: true },
  components: { Articles, MemberPreview },
  data() {
    return {
      article: {
        title: "",
        content: ""
      },
      editing: false
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

          subfield: true, // 单双栏模式
          preview: true // 预览
        };
      }

      return {};
    },

    root() {
      return `/planner/${this.planner_id}/wiki`;
    },
    planner_id() {
      return this.$route.params.planner;
    },
    id() {
      return this.$route.params.article;
    }
  },
  mounted() {
    this.fetch();
  },
  watch: {
    id() {
      this.fetch();
    }
  },
  methods: {
    async fetch() {
      let article = await this.$store.dispatch("wiki_detail", {
        planner: this.planner_id,
        article: this.id
      });

      this.article = article;
    },
    async summit() {
      let title = this.article.title.trim();

      if (title.length == 0) {
        this.$message.error("请输入完整的标题后再提交");

        return;
      }

      await this.$store.dispatch("wiki_update", {
        planner: this.planner_id,
        article: this.id,
        data: this.article
      });

      this.$message.success("修改成功");

      this.$refs.articles.refresh();

      this.editing = false;
    },
    async destroy() {
      await this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });

      await this.$store.dispatch("wiki_destroy", {
        planner: this.planner_id,
        article: this.id
      });

      this.$message({
        type: "success",
        message: "删除成功!"
      });

      this.$router.push(this.root);
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