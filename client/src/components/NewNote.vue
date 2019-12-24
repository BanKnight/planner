<template>
  <el-container class="full" direction="vertical">
    <el-header height="auto" style="padding:0;margin-bottom:10px">
      <el-button-group>
        <el-button size="mini" icon="el-icon-close" @click="cancel">取消</el-button>
        <el-button size="mini" type="primary" icon="el-icon-upload" @click="save">保存</el-button>
      </el-button-group>
    </el-header>

    <el-container class="full scroll-if-need">
      <el-aside width="180px" class="el-card" style="margin-right:10px;padding:10px">
        <el-form label-position="top" label-width="auto">
          <el-form-item label="指派:">
            <member-select v-model="form.assignee" :planner="planner" />
          </el-form-item>
          <el-form-item label="里程碑:">
            <milestone-select v-model="form.milestone" :planner="planner" />
          </el-form-item>
          <el-form-item label="开始时间:">
            <el-date-picker
              type="datetime"
              placeholder="开始时间"
              v-model="form.start"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="结束时间:">
            <el-date-picker
              type="datetime"
              placeholder="结束时间"
              v-model="form.stop"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </el-aside>

      <el-container class="el-card" style="width:100%" direction="vertical">
        <el-input placeholder="标题" v-model="form.title" />

        <mavon-editor
          v-model="form.content"
          :boxShadow="false"
          :ishljs="false"
          :subfield="false"
          :editable="true"
          :toolbarsFlag="true"
          defaultOpen="edit"
          :toolbars="options"
          toolbarsBackground="#f0f9eb"
          class="full"
          style="border:none"
        />
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import MemberSelect from "./MemberSelect";
import MilestoneSelect from "./MilestoneSelect";

export default {
  components: { MemberSelect, MilestoneSelect },
  props: {
    planner: String,
    col: String
  },
  data() {
    return {
      editable: false,
      form: {
        title: "",
        assignee: "",
        milestone: "",
        start: null,
        stop: null,
        content: ""
      }
    };
  },
  computed: {
    options() {
      return {
        imagelink: true, // 图片链接
        table: true, // 表格
        preview: true // 预览
      };
    }
  },
  methods: {
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

