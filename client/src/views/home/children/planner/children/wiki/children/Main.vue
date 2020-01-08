<template>
  <el-container class="full">
    <el-aside width="180px" style="margin-right:10px">
      <articles :planner="planner_id" />
    </el-aside>

    <el-row type="flex" justify="center" align="middle" class="full">
      <el-button
        plain
        type="primary"
        icon="el-icon-plus"
        @click="$router.push(`${root}/new`)"
        >新建文章</el-button
      >
    </el-row>
  </el-container>
</template>

<script>
import Articles from "@/components/Articles";

export default {
  path: "",
  weight: -1,
  meta: { require_logined: true },
  components: { Articles },
  data() {
    return {
      keyword: "",
      current: "" //当前显示的wiki
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
      return `/planner/${this.planner_id}/wiki`;
    },
    planner_id() {
      return this.$route.params.planner;
    },
    test_markdown() {
      return this.$md(
        "# this is something\n ## this is you don't know\n > 测试引用"
      );
    }
  },
  methods: {
    on_clear() {},
    on_search() {}
  }
};
</script>
