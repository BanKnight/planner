
<template>
  <div>
    <el-tag v-for="one in current" :key="one._id" :size="size" effect="dark" type="success">
      <i class="el-icon-user">{{one.name}}</i>
    </el-tag>
    <el-tag v-if="current.length == 0" :size="size" effect="plain" type="info">
      <i class="el-icon-user">无</i>
    </el-tag>
  </div>
</template>

<script>
export default {
  data() {
    return {
      current: [],
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
    }
  },
  async mounted() {
    if (this.value == null) {
      return;
    }

    let ids = null;
    if (typeof this.value == "string" && this.value.length > 0) {
      ids = [this.value];
    } else if (this.value instanceof Array) {
      ids = this.value;
    }
    if (ids == null || ids.length == 0) {
      return;
    }

    this.loading = true;

    let resp = await this.$store.dispatch("user_search", ids);

    for (let one of resp) {
      this.current.push(one);
    }

    this.loading = false;
  }
};
</script>