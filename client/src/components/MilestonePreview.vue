
<template>
  <el-tag v-if="current" :size="size" effect="dark" type="warning" :title="title">
    <i class="el-icon-s-opportunity">{{current.title}}</i>
  </el-tag>
  <el-tag v-else :size="size" effect="plain" type="info">
    <i class="el-icon-s-opportunity"></i>
  </el-tag>
</template>

<script>
import { do_together } from "@/utils";

let fetchs = {};

export default {
  data()  {
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
    value()    {
      this.init();
    }
  },
  async mounted()  {
    this.init();
  },
  computed: {
    title()    {
      if (this.current == null)
      {
        return ""
      }
      if (!this.current.due)
      {
        return ""
      }

      const first = this.$dayjs(this.current.due).endOf("day");
      const second = this.$dayjs().endOf("day");

      return `${this.$format(this.current.due)},剩${first.diff(second, "day")}天`;
    }
  },
  methods: {
    async init()    {
      if (this.value == null || this.value.length == 0)      {
        this.current = null;
        return;
      }

      this.loading = true;

      let fetch = fetchs[this.planner];

      let planner_id = this.planner;

      if (fetch == null)      {
        fetch = do_together(async ids =>        {
          return await this.$store.dispatch("milestone_detail", {
            planner: planner_id,
            data: {
              ids
            }
          });
        });

        fetchs[planner_id] = fetch;
      }

      let resp = await fetch(this.value);

      this.current = resp;

      this.loading = false;
    }
  }
};
</script>