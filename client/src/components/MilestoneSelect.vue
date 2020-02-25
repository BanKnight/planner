<template>
  <el-select
    :value="current"
    @input="input"
    filterable
    clearable
    :disabled="disabled"
    :size="size"
    placeholder="请选择里程碑"
    value-key="_id"
    :loading="loading"
  >
    <el-option
      v-for="item in options"
      :key="item._id"
      :label="item.title"
      :value="item._id"
      :disabled="!!item.closed"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  data()  {
    return {
      current: "",
      loading: false,
      options: []
    };
  },
  props: {
    planner: {
      type: String,
      required: true
    },
    size: String,

    value: String,
    disabled: Boolean
  },
  mounted()  {
    this.current = this.value;

    this.init_options();
  },
  watch: {
    value()    {
      this.current = this.value;
    },
    planner()    {
      this.init_options();
    }
  },
  methods: {
    async init_options()    {
      if (this.loading == true)      {
        return;
      }

      if (this.planner == null)      {
        return;
      }

      this.loading = true;
      this.options = [];

      for (let curr = 1; curr < 100; ++curr)      {
        let page_info = await this.$store.dispatch("milestone_list", {
          planner: this.planner,
          params: {
            curr: curr,
          }
        });

        for (let one of page_info.data)        {
          this.options.push(one);
        }

        if (page_info.count == curr)        {
          break;
        }
      }

      this.loading = false;
    },
    input(value)    {
      this.current = value;
      this.$emit("input", value);
    }
  }
};
</script>
