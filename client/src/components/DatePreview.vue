<template>
  <el-tag
    size="mini"
    v-if="value"
    v-bind="day_option"
    :title="title"
    class="el-icon-date"
  >{{content }}</el-tag>
  <el-tag size="mini" v-else effect="plain" type="danger" class="el-icon-date"></el-tag>
</template>

<script>
export default {
  props: {
    value: [Number, String],
    theme: {
      type: String,
      default: "simple"
    }
  },
  computed: {
    diff()    {
      if (this.value == null)      {
        return Infinity;
      }

      const first = this.$dayjs(this.value).endOf("day");
      const second = this.$dayjs().endOf("day");

      return first.diff(second, "day");
    },
    title()    {
      if (this.value == null)
      {
        return ""
      }

      return `${this.$format(this.value)},剩${this.diff}天`;
    },
    content()    {
      if (this.theme == "simple")
      {
        return `剩${this.diff}天`
      }

      return `${this.$format(this.value)}`
    },
    day_option()    {
      if (this.diff <= 0)      {
        return {
          type: "info",
          effect: "dark"
        };
      }

      if (this.diff < 2)      {
        return {
          type: "",
          effect: "dark"
        };
      }

      return {
        type: "success",
        effect: "plain"
      };
    }
  }
}
</script>