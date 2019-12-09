<template>
  <el-container class="full">
    <el-aside class="sidebar full-height" :width="width">
      <el-container class="full" direction="vertical">
        <el-container class="full-width" styl>
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

        <el-collapse v-model="array">
          <el-collapse-item title="Favorites">
            <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
            <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
          </el-collapse-item>
          <el-collapse-item title="More">
            <div>简化流程：设计简洁直观的操作流程；</div>
            <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
            <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
          </el-collapse-item>
        </el-collapse>

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
  }
};
</script>

<style scoped>
.el-collapse-item__header {
  background-color: transparent;
}
</style>>

