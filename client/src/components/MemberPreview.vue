<template>
  <el-tag v-if="current" :size="size" effect="dark" type="success">
    <i class="el-icon-user">{{ current.name }}</i>
  </el-tag>
  <el-tag v-else :size="size" effect="plain" type="info">
    <i class="el-icon-user"></i>
  </el-tag>
</template>

<script>
import { do_together } from "@/utils";

let fetch = null;

export default {
  data() {
    return {
      current: null,
      loading: false,
      options: []
    };
  },
  props: {
    value: String,
    size: String,
    planner: {
      type: String,
      required: true
    }
  },
  watch: {
    value() {
      this.init();
    }
  },
  async mounted() {
    this.init();
  },
  methods: {
    async init() {
      if (this.value == null || this.value.length == 0) {
        this.current = null;
        return;
      }

      this.loading = true;

      if (fetch == null) {
        fetch = do_together(async ids => {
          return await this.$store.dispatch("user_search", {
            ids
          });
        });
      }

      let resp = await fetch(this.value);

      this.current = resp;

      this.loading = false;
    }
  }
};
</script>
