<template>
  <el-container class="full" direction="vertical">
    <el-form size="mini" label-position="left" label-width="5em">
      <el-form-item label="标题：">
        <el-input placeholder="标题" class="full-width" v-model="form.title" />
      </el-form-item>

      <el-form-item label="指派：">
        <member-select v-model="form.assignee" class="full-width" size="mini" :planner="planner"></member-select>
      </el-form-item>

      <el-form-item label="结束:">
        <el-date-picker
          type="date"
          size="mini"
          placeholder="结束时间"
          v-model="form.stop"
          class="full-width"
          value-format="timestamp"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="内容：">
        <el-switch v-model="editing" active-text="编辑"></el-switch>

        <el-input
          v-if="editing"
          type="textarea"
          class="full-width"
          :rows="2"
          placeholder="内容"
          v-model="form.content"
        />
        <md-editor v-else :value="form.content" :editable="false" size="mini" />
      </el-form-item>

      <el-divider />

      <el-form-item label="里程碑：">
        <milestone-select
          v-model="form.milestone"
          class="full-width"
          size="mini"
          :planner="planner"
        />
      </el-form-item>

      <el-form-item label="需求：">
        <el-row class="full-width">
          <backlog-select v-model="form.backlog" size="mini" :planner="planner"></backlog-select>
          <el-link :disabled="!form.backlog" @click="read_backlog = true">
            <i class="el-icon-view el-icon--right"></i>
          </el-link>
        </el-row>

        <el-checkbox :disabled="!form.backlog" v-model="form.close_backlog">关联完成</el-checkbox>
      </el-form-item>
      <el-form-item label="问题：">
        <el-row class="full-width">
          <issue-select v-model="form.issue" size="mini" :planner="planner"></issue-select>
          <el-link :disabled="!form.issue" @click="read_issue = true">
            <i class="el-icon-view el-icon--right"></i>
          </el-link>
        </el-row>
        <el-checkbox :disabled="!form.issue" v-model="form.close_issue">关联完成</el-checkbox>
      </el-form-item>

      <el-form-item>
        <el-row type="flex" justify="space-between">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-upload"
            class="full-width"
            @click="save"
          >保存</el-button>
        </el-row>
      </el-form-item>
    </el-form>

    <el-dialog width="fit-content" :visible.sync="read_backlog" v-if="backlog" append-to-body>
      <div style="text-align:center;">
        <h2>
          {{ backlog.title }}
          <member-preview size="mini" :planner="planner" v-model="backlog.assignee" />
        </h2>
      </div>
      <md-editor :value="backlog.content" :editable="false" size="mini" />
    </el-dialog>

    <el-dialog width="fit-content" :visible.sync="read_issue" v-if="issue" append-to-body>
      <div style="text-align:center;">
        <h2>
          {{ issue.title }}
          <member-preview size="mini" :planner="planner" v-model="issue.assignee" />
        </h2>
      </div>
      <md-editor :value="issue.content" :editable="false" size="mini" />
    </el-dialog>
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
      editing: true,
      read_backlog: false,
      read_issue: false,
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
