
<template>
  <el-tag v-if="current" :size="size" effect="plain" type="warning">
    <i class="el-icon-s-opportunity">{{current.title}}</i>
  </el-tag>
  <el-tag v-else :size="size" effect="plain" type="info">
    <i class="el-icon-s-opportunity">无</i>
  </el-tag>
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
    value: String,
    size: String,
    planner: {
      type: String,
      required: true
    }
  },
  async mounted() {
    if (this.value == null || this.value.length == 0) {
      return;
    }

    this.loading = true;

    let resp = await this.$store.dispatch("milestone_detail", {
      planner: this.planner,
      milestone: this.value
    });

    this.current = resp;

    this.loading = false;
  }
};
</script>