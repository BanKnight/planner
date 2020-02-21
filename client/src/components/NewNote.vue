<template>
  <el-container class="full">
    <el-tabs style="margin-right:10px">
      <el-tab-pane label="基础">
        <el-container class="el-card full" direction="vertical">
          <el-input placeholder="输入标题" v-model="form.title" />

          <md-editor v-model="form.content" theme="mini" :editable="true" />
        </el-container>
      </el-tab-pane>

      <el-tab-pane label="需求" v-if="backlog">
        <div style="text-align:center;">
          <h2>
            {{ backlog.title }}
            <member-preview size="mini" :planner="planner" v-model="backlog.assignee" />
          </h2>
        </div>
        <md-editor :value="backlog.content" :editable="false" size="mini" />
      </el-tab-pane>

      <el-tab-pane label="问题" v-if="issue">
        <div style="text-align:center;">
          <h2>
            {{ issue.title }}
            <member-preview size="mini" :planner="planner" v-model="issue.assignee" />
          </h2>
        </div>
        <md-editor :value="issue.content" :editable="false" size="mini" />
      </el-tab-pane>
    </el-tabs>

    <el-aside width="300px">
      <el-card style="margin-top:55px">
        <el-form size="mini" label-position="left" label-width="6em">
          <el-form-item label="指派：">
            <member-select v-model="form.assignee" size="mini" :planner="planner"></member-select>
          </el-form-item>

          <el-form-item label="里程碑：">
            <milestone-select v-model="form.milestone" size="mini" :planner="planner" />
          </el-form-item>

          <el-form-item label="结束时间:">
            <el-date-picker
              type="date"
              size="mini"
              placeholder="结束时间"
              v-model="form.stop"
              value-format="timestamp"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="需求：">
            <backlog-select v-model="form.backlog" size="mini" :planner="planner"></backlog-select>

            <el-checkbox v-model="form.close_backlog">关联完成</el-checkbox>
          </el-form-item>

          <el-form-item label="问题：">
            <issue-select v-model="form.issue" size="mini" :planner="planner"></issue-select>
            <el-checkbox v-model="form.close_issue">关联完成</el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-upload"
              class="full-width"
              @click="save"
            >保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-aside>
  </el-container>
</template>

<script>
import MemberSelect from "./MemberSelect";
import MemberPreview from "./MemberPreview";

import MilestoneSelect from "./MilestoneSelect";
import BacklogSelect from "./BacklogSelect";
import IssueSelect from "./IssueSelect";
import MdEditor from "./MdEditor";

export default {
  components: {
    MemberSelect,
    MemberPreview,
    MilestoneSelect,
    BacklogSelect,
    IssueSelect,
    MdEditor
  },
  props: {
    planner: String,
    col: String
  },
  data()  {
    return {
      editable: false,
      form: {
        backlog: null,
        issue: null
      },
      backlog: null,
      issue: null
    };
  },
  computed: {
    options()    {
      return {
        imagelink: true, // 图片链接
        table: true, // 表格
        preview: true // 预览
      };
    }
  },
  watch: {
    "form.backlog": function(new_val)    {
      this.fetch_backlog(new_val);
    },
    "form.issue": function(new_val)    {
      this.fetch_issue(new_val);
    }
  },
  methods: {
    save()    {
      if (!this.form.title)      {
        this.$message.error("请先输入标题");
        return;
      }

      this.form.title = this.form.title.trim();
      this.form.content = (this.form.content || "").trim();

      if (this.form.title.length == 0)      {
        this.$message.error("请先输入标题");
        return;
      }

      this.$emit("save", this.form);
    },
    async fetch_backlog()    {
      if (!this.form.backlog)      {
        this.backlog = null;
        return;
      }

      this.backlog = await this.$store.dispatch("backlogs_detail", {
        planner: this.planner,
        backlog: this.form.backlog
      });
    },
    async fetch_issue()    {
      if (!this.form.issue)      {
        this.issue = null;
        return;
      }

      this.issue = await this.$store.dispatch("issues_detail", {
        planner: this.planner,
        issue: this.form.issue
      });
    }
  }
};
</script>
