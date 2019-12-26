<template>
  <el-container class="full" direction="vertical">
    <el-header height="auto" style="padding:0;margin-bottom:10px">
      <el-button-group>
        <el-button size="mini" icon="el-icon-close" @click="cancel">取消</el-button>
        <el-button size="mini" type="primary" icon="el-icon-upload" @click="save">保存</el-button>
      </el-button-group>
    </el-header>

    <el-input placeholder="标题" v-model="form.title" class="no-border-input" />

    <el-row
      type="flex"
      justify="space-between"
      class="el-card"
      align="middle"
      style="padding:5px 10px"
    >
      <el-col :span="12">
        指派：
        <member-select
          v-model="form.assignee"
          size="mini"
          :planner="value.planner"
          class="no-border-input"
        ></member-select>
      </el-col>

      <el-col :span="12">
        里程碑
        <milestone-select
          v-model="form.milestone"
          size="mini"
          :planner="value.planner"
          class="no-border-input"
        />
      </el-col>
    </el-row>
    <el-row
      type="flex"
      justify="space-between"
      class="el-card"
      align="middle"
      style="padding:5px 10px"
    >
      <el-col :span="12">
        开始时间
        <el-date-picker
          type="date"
          size="mini"
          placeholder="开始时间"
          v-model="form.start"
          class="no-border-input"
        ></el-date-picker>
      </el-col>

      <el-col :span="12">
        结束时间
        <el-date-picker
          type="date"
          size="mini"
          placeholder="结束时间"
          v-model="form.stop"
          class="no-border-input"
        ></el-date-picker>
      </el-col>
    </el-row>
    <el-main class="el-card full" direction="vertical" style="padding:0">
      <mavon-editor
        v-model="form.content"
        :boxShadow="false"
        :ishljs="false"
        :subfield="false"
        :editable="true"
        :toolbarsFlag="true"
        :autofocus="true"
        :defaultOpen="default_open"
        :toolbars="options"
        toolbarsBackground="#f0f9eb"
        class="full"
        style="border:none"
        @click.native="editing = true;"
      />
    </el-main>
  </el-container>
</template>

<script>
import MemberSelect from "./MemberSelect";
import MilestoneSelect from "./MilestoneSelect";

export default {
  components: { MemberSelect, MilestoneSelect },
  props: {
    planner: String,
    value: Object
  },
  data() {
    return {
      editing: false,
      form: {}
    };
  },
  computed: {
    options() {
      return {
        imagelink: true, // 图片链接
        table: true, // 表格
        preview: true // 预览
      };
    },
    default_open() {
      if (this.editing) {
        return "edit";
      }
      return "preview";
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    value() {
      this.init();
    }
  },
  methods: {
    init() {
      this.form = {
        title: "",
        content: "",
        assignee: "",
        milestone: "",
        start: null,
        stop: null
      };

      for (let name in this.form) {
        this.form[name] = this.value[name] || this.form[name];
      }

      console.log(this.form);
    },
    cancel() {
      this.$emit("cancel");
    },
    save() {
      this.form.title = this.form.title.trim();
      this.form.content = this.form.content.trim();

      if (this.form.title.length == 0) {
        this.$message.error("请先输入标题");
        return;
      }

      this.$emit("save", this.form);
    }
  }
};
</script>

