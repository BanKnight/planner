<template>
  <el-container class="full">
    <el-header style="padding:0">
      <el-menu
        :default-active="`${root}/${children[0].path}`"
        mode="horizontal"
        class="full-width"
        :router="true"
        background-color="transparent"
      >
        <el-menu-item :index="`${root}/${child.path}`" v-for="child in children" :key="child.path">
          <i class="el-icon-menu"></i>
          <span slot="title">{{child.title}}</span>
        </el-menu-item>
      </el-menu>
    </el-header>

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
    return {};
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

