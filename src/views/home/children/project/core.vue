<template>
  <el-container class="full" direction="vertical">
    <el-row style="padding: 10px" type="flex" justify="start" align="bottom">
      <el-row
        type="flex"
        justify="center"
        align="middle"
        style="width:fit-content;height:60px;background-color:#75b368;color:white;padding:10px"
      >
        <h3>{{title}}</h3>
      </el-row>

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
    </el-row>

    <router-view />
  </el-container>
</template>

<script>
import children from "./children";

export default {
  path: "project/:id",
  weight: 0,
  components: {},
  data() {
    return {
      title: "项目标题"
    };
  },
  computed: {
    children() {
      return children;
    },
    root() {
      return `/project/${this.$route.params.id}`;
    }
  },
  methods: {}
};
</script>

<style scoped>
svg {
  transition-duration: 0.2s;
  transition-timing-function: ease;
  display: block;
  width: 100;
  height: 100;
}

svg text {
  font-size: 25;
}
</style>

