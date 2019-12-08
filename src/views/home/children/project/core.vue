<template>
  <el-container class="full">
    <el-aside class="sidebar full-height" :width="width">
      <el-container class="full">
        <el-header height="42px">
          <el-row class="full" type="flex" justify="center" align="middle">
            <h6 :title="title">{{title}}</h6>
            <el-button type="text">
              <i class="el-icon-s-fold" />
            </el-button>
          </el-row>
        </el-header>
        <el-container class="full">
          <el-menu
            :default-active="`${root}/${children[0].path}`"
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
      </el-container>
    </el-aside>

    <transition name="el-fade-in">
      <router-view />
    </transition>
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
      title: "项目标题",
      width: "200px"
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

