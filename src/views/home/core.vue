<template>
  <el-container class="full">
    <el-aside class="sidebar full-height" :width="width">
      <el-container class="full">
        <el-container class="full">
          <el-menu
            :default-active="default_route"
            class="full-width"
            :router="true"
            background-color="#334444"
            text-color="#fff"
            active-text-color="#ff9800"
            style="border-right:0px"
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
        </el-container>

        <el-footer height="42px">
          <el-row class="full" type="flex" justify="space-around" align="middle">
            <el-button type="text">
              <i class="el-icon-s-fold" />
            </el-button>
          </el-row>
        </el-footer>
      </el-container>
    </el-aside>

    <el-container>
      <router-view />
    </el-container>
  </el-container>
</template>

<script>
import children from "./children";

export default {
  name: "home",
  path: "/",
  weight: 0,
  data() {
    return {
      width: "200px",
      default_route: "hub"
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
  }
};
</script>

<style>
</style>

