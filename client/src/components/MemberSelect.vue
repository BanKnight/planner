
<template>
  <el-select
    :value="current"
    @input="input"
    filterable
    clearable
    :multiple="multiple"
    :disabled="disabled"
    :size="size"
    placeholder="请输入名称"
    value-key="_id"
    :loading="loading"
  >
    <el-option v-for="item in options" :key="item._id" :label="item.name" :value="item._id"></el-option>
  </el-select>
</template>

<script>
export default {
  data() {
    return {
      current: null,
      loading: false,
      options: []
    };
  },
  props: {
    value: [String, Array],
    size: String,
    planner: {
      type: String,
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: Boolean
  },
  async mounted() {
    this.init_value();
    this.init_options();
  },
  watch: {
    value(new_val) {
      this.current = new_val;
    },
    planner() {
      this.init_options();
    }
  },
  methods: {
    async init_value() {
      this.current = this.value;
    },
    async init_options() {
      if (this.planner == null) {
        this.options = [];
        return;
      }

      this.loading = true;
      this.options = await this.$store.dispatch("member_list", this.planner);
      this.loading = false;

      console.log(this.options);
      console.log(this.current);
    },
    input(value) {
      this.current = value;
      this.$emit("input", value);
    }
  }
};
</script>