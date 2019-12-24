<template>
  <el-container class="full">
    <el-aside class="sidebar full-height" width="auto">
      <el-container class="full" direction="vertical">
        <el-menu
          :router="true"
          :collapse="collapse"
          :default-active="default_route"
          class="full-width"
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
            <i class="el-icon-finished"></i>
            <span slot="title">{{child.meta.menu_title}}</span>
          </el-menu-item>
        </el-menu>

        <el-menu
          class="full"
          :collapse="collapse"
          default-active="2"
          background-color="#334444"
          text-color="#fff"
          active-text-color="#ff9800"
          style="border-right:0px"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-star-on"></i>
              <span slot="title">收藏</span>
            </template>

            <el-menu-item index="1-1">项目</el-menu-item>
            <el-menu-item index="1-2">项目2</el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-more"></i>
              <span slot="title">更多</span>
            </template>

            <el-menu-item index="2-1">项目</el-menu-item>
            <el-menu-item index="2-2">项目2</el-menu-item>
          </el-submenu>
        </el-menu>

        <el-footer height="auto">
          <el-row class="full" type="flex" justify="space-around" align="middle">
            <el-button type="text" icon="el-icon-s-fold" @click="collapse = !collapse"></el-button>
          </el-row>
        </el-footer>
      </el-container>
    </el-aside>

    <router-view />
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
      collapse: false,
      width: "200px",
      default_route: children[0].menu_title,
      array: []
    };
  },
  computed: {
    children() {
      return children.filter(one => {
        if (one.meta && one.meta.menu_title) {
          return true;
        }

        return false;
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

<style>
.el-collapse-item__header {
  background-color: transparent;
}
</style>>

