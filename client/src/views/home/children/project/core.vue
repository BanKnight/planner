<template>
  <el-container class="full" direction="vertical">
    <el-header
      style=" display:flex;padding:2px 10px;justify-content:space-between;align-content:center;background-color:#75b368;color:white;"
      height="auto"
    >
      <i class="el-icon-s-home">{{detail.name}}</i>
      <i class="el-icon-s-tools" style="cursor:pointer"></i>
    </el-header>
    <el-menu
      :default-active="$route.meta.menu_title"
      mode="horizontal"
      background-color="transparent"
      style="width:fit-content;"
      :router="true"
    >
      <el-menu-item
        v-for="child in children"
        :index="child.meta.menu_title"
        :key="child.meta.menu_title"
        :route="{path: `${root}/${child.path}`}"
      >
        <i class="el-icon-menu"></i>
        <span slot="title">{{child.meta.menu_title}}</span>
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
      detail: {
        name: ""
      }
    };
  },
  mounted() {
    this.fetch();
  },
  computed: {
    children() {
      return children.map(one => {
        let view = one.core || one;
        if (view.meta && view.meta.menu_title) {
          return view;
        }
      });
    },
    root() {
      return `/project/${this.$route.params.id}`;
    }
  },
  methods: {
    async fetch() {
      const detail = await this.$store.dispatch("planner_detail", {
        planner: this.$route.params.id
      });

      Object.assign(this.detail, detail);
    }
  }
};
</script>

