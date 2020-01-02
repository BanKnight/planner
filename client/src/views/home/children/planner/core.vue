<template>
  <el-container class="full" direction="vertical" :key="planner_id">
    <el-header
      style=" display:flex;padding:2px 10px;justify-content:space-between;align-content:center;background-color:#75b368;color:white;"
      height="auto"
    >
      <i class="el-icon-s-home">{{detail.name}}</i>
      <i class="el-icon-s-tools" style="cursor:pointer"></i>
    </el-header>

    <el-row type="flex">
      <el-menu
        :collapse="collapse"
        :default-active="$route.meta.menu_title"
        mode="horizontal"
        background-color="transparent"
        active-text-color="#77b36b"
        text-color="#000"
        style="width:fit-content;"
        :router="true"
      >
        <el-menu-item
          v-for="child in children"
          :index="child.meta.menu_title"
          :key="child.meta.menu_title"
          :route="{path: `${root}/${child.path}`}"
        >
          <i :class="child.meta.menu_icon"></i>
          <span slot="title">{{child.meta.menu_title}}</span>
        </el-menu-item>
      </el-menu>
    </el-row>

    <router-view />
  </el-container>
</template>

<script>
import children from "./children";

export default {
  name: "planner",
  path: "planner/:planner",
  weight: 0,
  meta: { require_logined: true },
  components: {},
  data() {
    return {
      collapse: false,
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
    planner_id() {
      return this.$route.params.planner;
    },
    root() {
      return `/planner/${this.planner_id}`;
    }
  },
  watch: {
    planner_id(new_val) {
      if (new_val != null && new_val.length > 0) {
        this.fetch();
      }
    }
  },
  methods: {
    async fetch() {
      const public_info = await this.$store.dispatch("planner_public", {
        data: [this.planner_id]
      });

      Object.assign(this.detail, public_info[0]);
    }
  }
};
</script>

