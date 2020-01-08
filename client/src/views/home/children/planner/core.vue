<template>
  <el-container class="full" direction="vertical" :key="planner_id">
    <el-header
      style=" display:flex;padding:2px 10px;justify-content:space-between;align-content:center;background-color:#75b368;color:white;"
      height="auto"
    >
      <i class="el-icon-s-home">{{ detail.name }}</i>
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
          :route="{ path: `${root}/${child.path}` }"
        >
          <i :class="child.meta.menu_icon"></i>
          <span slot="title">{{ child.meta.menu_title }}</span>
        </el-menu-item>
      </el-menu>
    </el-row>

    <router-view v-if="is_showing" />
  </el-container>
</template>

<script>
import children from "./children";

export default {
  path: "planner/:planner",
  weight: 0,
  meta: { require_logined: true },
  components: {},
  provide() {
    return {
      reload_curr: this.reload
    };
  },
  data() {
    return {
      collapse: false,
      is_showing: true,
      detail: {
        name: ""
      },
      check_timer: null,
      last_check: null
    };
  },

  mounted() {
    this.refresh();
  },
  beforeDestroy() {
    clearInterval(this.check_timer);
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
        this.refresh();
      }
    }
  },
  methods: {
    refresh() {
      this.fetch();
      if (this.check_timer) {
        clearInterval(this.check_timer);
      }

      this.last_check = null;
      this.check_timer = setInterval(() => {
        this.check();
      }, 10000);
    },
    async fetch() {
      const public_info = await this.$store.dispatch("planner_public", {
        data: [this.planner_id]
      });

      Object.assign(this.detail, public_info[0]);
    },
    reload() {
      this.is_showing = false;
      this.$nextTick(() => {
        this.is_showing = true;
      });
    },
    async check() {
      let curr = await this.$store.dispatch("mine_list", {
        planner: this.planner_id
      });

      let last_check = this.last_check;
      this.last_check = curr;

      if (last_check == null) {
        return;
      }

      let fields = ["backlogs", "issues", "notes"];

      for (let one of fields) {
        this[`check_${one}`](last_check[one], this.last_check[one]);
      }
    },

    check_backlogs(old_val, new_val) {
      let map_old = old_val.reduce((prev, curr) => {
        prev[curr._id] = curr;
        return prev;
      }, {});

      let map_new = new_val.reduce((prev, curr) => {
        prev[curr._id] = curr;
        return prev;
      }, {});

      for (let id in map_new) {
        let one = map_new[id];
        let existed = map_old[id];
        if (existed == null) {
          this.notify(
            "新需求",
            one.title,
            `${this.root}/backlogs/detail/${one._id}`
          );
          continue;
        }
      }
    },
    check_issues(old_val, new_val) {
      let map_old = old_val.reduce((prev, curr) => {
        prev[curr._id] = curr;
        return prev;
      }, {});

      let map_new = new_val.reduce((prev, curr) => {
        prev[curr._id] = curr;
        return prev;
      }, {});

      for (let id in map_new) {
        let one = map_new[id];
        let existed = map_old[id];
        if (existed == null) {
          this.notify(
            "新Issue",
            one.title,
            `${this.root}/issues/detail/${one._id}`
          );
          continue;
        }
      }
    },
    check_notes(old_val, new_val) {
      let map_old = old_val.reduce((prev, curr) => {
        prev[curr._id] = curr;
        return prev;
      }, {});

      let map_new = new_val.reduce((prev, curr) => {
        prev[curr._id] = curr;
        return prev;
      }, {});

      for (let id in map_new) {
        let one = map_new[id];
        let existed = map_old[id];
        if (existed == null) {
          this.notify("新工单", one.title, `${this.root}/boards`);
          continue;
        }
      }
    },
    notify(title, message, url) {
      const h = this.$createElement;

      this.$notify({
        title,
        type: "info",
        message: h("i", { style: "color: teal" }, message),
        position: "bottom-right",
        onClick: () => {
          this.$router.push({ path: url });
        }
      });
    }
  }
};
</script>
