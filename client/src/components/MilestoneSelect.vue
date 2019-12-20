
<template>
  <el-select
    :value="current"
    @input="input"
    filterable
    clearable
    :disabled="disabled"
    placeholder="请输入名称"
    value-key="_id"
    :loading="loading"
  >
    <el-option v-for="item in options" :key="item._id" :label="item.title" :value="item._id"></el-option>
  </el-select>
</template>

<script>
export default {
  data() {
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
    value: String,
    disabled: Boolean
  },
  async mounted() {
    this.current = this.value;
    this.loading = true;

    for (let curr = 1; curr < 100; ++curr) {
      let page_info = await this.$store.dispatch("milestone_list", {
        planner: this.planner,
        params: {
          curr: curr,
          closed: false
        }
      });

      for (let one of page_info.data) {
        this.options.push(one);
      }

      if (page_info.count == curr) {
        break;
      }
    }

    this.loading = false;
  },
  methods: {
    input(value) {
      this.current = value;
      this.$emit("input", value);
    }
  }
};
</script>