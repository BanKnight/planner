<template>
  <el-container class="full">
    <el-container class="full" direction="vertical" :style="{width:collapse?'68px':'200px'}">
      <el-main style="padding:0;background-color:#334444">
        <el-menu
          :router="true"
          :collapse="collapse"
          :default-active="default_route"
          class="full-width"
          background-color="#334444"
          text-color="#fff"
          active-text-color="#ff9800"
          style="border-right:0px;height:200px;border-bottom:1px solid #6b6f6f"
        >
          <el-menu-item
            :index="child.meta.menu_title"
            v-for="child in children"
            :key="child.path"
            :route="{path:child.path}"
          >
            <i :class="child.meta.menu_icon"></i>
            <span slot="title">{{child.meta.menu_title}}</span>
          </el-menu-item>
        </el-menu>

        <el-menu
          :router="true"
          :collapse="collapse"
          :default-active="planner_id"
          background-color="#334444"
          text-color="#fff"
          active-text-color="#ff9800"
          style="border-right:0px"
        >
          <el-menu-item
            v-for="star in stars"
            :key="star._id"
            :index="star._id"
            :route="{path:'/planner/' + star._id}"
          >
            <i class="el-icon-star-on"></i>

            <span slot="title">{{star.name}}</span>
          </el-menu-item>
        </el-menu>
      </el-main>

      <el-footer
        height="40px"
        style="background-color:#334444;color:white;padding:0 5px;border-top:1px solid #6b6f6f"
      >
        <el-row class="full" type="flex" justify="space-around" align="middle">
          <i class="el-icon-setting clickable" @click="$router.replace('/setting')" />
          <i class="el-icon-s-fold clickable" @click="collapse = !collapse" />
        </el-row>
      </el-footer>
    </el-container>

    <router-view />
  </el-container>
</template>

<script>
import children from "./children";

export default {
  path: "/",
  weight: 0,
  meta: { require_logined: true },
  provide() {
    return {
      reload_menu: this.fetch
    };
  },
  data() {
    return {
      collapse: false,
      width: "200px",
      default_route: children[0].menu_title,
      array: [],
      stars: {}
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
    },
    planner_id() {
      return this.$route.params.planner;
    }
  },
  mounted() {
    this.fetch();
  },
  methods: {
    async fetch() {
      let stars = await this.$store.dispatch("planner_list_star");

      this.stars = await this.$store.dispatch("planner_public", {
        data: stars
      });
    }
  }
};
</script>

<style>
.el-collapse-item__header {
  background-color: transparent;
}
</style>>

