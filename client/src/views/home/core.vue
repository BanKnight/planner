<template>
  <el-container class="full" direction="vertical">
    <el-row type="flex" justify="space-between">
      <el-menu
        :router="true"
        class="full-width"
        mode="horizontal"
        :default-active="default_active"
        active-text-color="#77b36b"
        text-color="#000"
      >
        <el-menu-item
          :index="child.meta.menu_title"
          v-for="child in children"
          :key="child.path"
          :route="{ path: child.path }"
        >
          <i :class="child.meta.menu_icon"></i>
          <span slot="title">{{ child.meta.menu_title }}</span>
        </el-menu-item>

        <el-menu-item
          v-if="planner_id"
          :index="planner_id"
          :route="{ path: '/planner/' + planner_id }"
        >
          <i class="el-icon-star-on"></i>

          <span slot="title">{{ detail.name }}</span>
        </el-menu-item>
      </el-menu>

      <el-button
        icon="el-icon-user"
        style="border-bottom: solid 1px #e6e6e6;"
        class="no-border"
        @click="user_visible = !user_visible"
      >用户</el-button>
    </el-row>

    <el-dialog :visible.sync="user_visible" v-if="user_visible" title="用户">
      <setting />
    </el-dialog>

    <el-main style="padding:0">
      <router-view />
    </el-main>
  </el-container>
</template>

<script>

import Setting from "@/components/Setting"
import children from "./children";

export default {
  path: "/",
  weight: 0,
  meta: { require_logined: true },
  components: { Setting },
  provide()  {
    return {
      reload_menu: this.fetch
    };
  },
  data()  {
    return {
      array: [],
      user_visible: false,
      detail: {
        name: ""
      },
    };
  },
  computed: {
    children()    {
      return children.filter(one =>      {
        if (one.meta && one.meta.menu_title)        {
          return true;
        }

        return false;
      });
    },
    default_active()    {
      if (this.planner_id == null || this.planner_id.length == 0)
      {
        return this.children[0].meta.menu_title
      }
      return this.planner_id
    },
    root()    {
      return "";
    },
    planner_id()    {
      return this.$route.params.planner;
    }
  },
  watch: {
    planner_id()    {
      this.fetch()
    }
  },
  mounted()  {
    this.fetch();
  },
  methods: {
    async fetch()    {

      if (!this.planner_id)
      {
        return
      }

      const public_info = await this.$store.dispatch("planner_public", {
        data: [this.planner_id]
      });

      Object.assign(this.detail, public_info[0]);
    }
  }
};
</script>

