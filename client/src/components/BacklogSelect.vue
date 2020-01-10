<template>
  <el-select
    :value="current"
    @input="input"
    filterable
    clearable
    remote
    :disabled="disabled"
    :size="size"
    placeholder="输入需求关键字"
    value-key="_id"
    :loading="loading"
    :remote-method="search"
  >
    <el-option v-for="item in options" :key="item._id" :label="item.title" :value="item._id"></el-option>
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
    this.current = this.value || "";
    this.search_id();
  },
  watch: {
    value()    {
      this.current = this.value || "";
      this.search_id();
    }
  },
  methods: {
    async search_id()    {
      this.loading = true;

      let page_info = await this.$store.dispatch("backlogs_list", {
        planner: this.planner,
        params: {
          curr: 1,
          id: this.current
        }
      });

      this.options = [];

      for (let one of page_info.data)      {
        this.options.push(one);
      }

      this.loading = false;
    },
    async search(keyword)    {
      this.loading = true;

      let temp = [];

      for (let curr = 1; curr < 3; ++curr)      {
        let page_info = await this.$store.dispatch("backlogs_list", {
          planner: this.planner,
          params: {
            curr: curr,
            keyword: keyword
          }
        });

        for (let one of page_info.data)        {
          temp.push(one);
        }

        if (page_info.count == curr)        {
          break;
        }
      }

      this.options = temp;
      this.loading = false;
    },
    input(value)    {
      this.current = value;
      this.$emit("input", value);
    }
  }
};
</script>
