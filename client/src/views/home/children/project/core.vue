<template>
  <el-container class="full" direction="vertical">
    <el-header style="padding:0" height="fit-content">
      <el-row
        type="flex"
        justify="center"
        align="middle"
        style="width:100%;height:20px;background-color:#75b368;color:white;padding:10px"
      >
        <h4>{{title}}</h4>
      </el-row>
    </el-header>
    <el-menu
      :default-active="`${root}/${children[0].path}`"
      mode="horizontal"
      :router="true"
      background-color="transparent"
      style="width:fit-content;"
    >
      <el-menu-item :index="`${root}/${child.path}`" v-for="child in children" :key="child.path">
        <i class="el-icon-menu"></i>
        <span slot="title">{{child.title}}</span>
      </el-menu-item>
    </el-menu>
    <router-view />
  </el-container>
</template>

<script>
import children from "./children";

export default {
  name: "project",
  path: "project/:id",
  weight: 0,
  meta: { require_logined: true },
  components: {},
  data() {
    return {
      title: "项目标题"
    };
  },
  computed: {
    children() {
      return children.map(one => {
        let view = one.core || one;
        if (view.title == null) {
          return;
        }
        return view;
      });
    },
    root() {
      return `/project/${this.$route.params.id}`;
    }
  },
  methods: {}
};
</script>

