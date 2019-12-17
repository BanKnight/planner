<template>
  <el-container class="full">
    <el-aside class="sidebar full-height" :width="width">
      <el-container class="full" direction="vertical">
        <el-menu
          :default-active="default_route"
          class="full-width"
          :router="true"
          background-color="#334444"
          text-color="#fff"
          active-text-color="#ff9800"
          style="border-right:0px;height:200px"
        >
          <el-menu-item
            :index="`${root}/${child.path}`"
            v-for="child in children"
            :key="child.path"
          >
            <i class="el-icon-menu"></i>
            <span slot="title">{{child.title}}</span>
          </el-menu-item>
        </el-menu>

        <el-menu
          class="full"
          default-active="2"
          background-color="#334444"
          text-color="#fff"
          active-text-color="#ff9800"
          style="border-right:0px"
        >
          <el-submenu index="1">
            <template slot="title">Favorite</template>

            <el-menu-item index="1-1">项目</el-menu-item>
            <el-menu-item index="1-2">项目2</el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">More</template>

            <el-menu-item index="2-1">项目</el-menu-item>
            <el-menu-item index="2-2">项目2</el-menu-item>
          </el-submenu>
        </el-menu>

        <el-footer height="42px">
          <el-row class="full" type="flex" justify="space-around" align="middle">
            <el-button type="text">
              <i class="el-icon-s-fold" />
            </el-button>
          </el-row>
        </el-footer>
      </el-container>
    </el-aside>

    <el-main style="padding:0">
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
import children from "./children";

export default {
  path: "/",
  weight: 0,
  meta: { require_logined: true },
  data() {
    return {
      width: "200px",
      default_route: "hub",
      array: []
    };
  },
  computed: {
    children() {
      return children.filter(one => {
        return one.title != null;
      });
    },
    root() {
      return "";
    }
  },
  mounted() {
    console.log(this.$route);
  }
};
</script>

<style scoped>
.el-collapse-item__header {
  background-color: transparent;
}
</style>>

