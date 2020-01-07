<template>
  <el-container class="full" direction="vertical">
    <el-header height="auto" style="padding:0;margin-bottom:10px">
      <el-button-group>
        <el-button size="mini" icon="el-icon-close" @click="cancel">取消</el-button>
        <el-button size="mini" type="primary" icon="el-icon-upload" @click="save">保存</el-button>
      </el-button-group>
    </el-header>

    <el-main style="padding:0">
      <el-tabs type="border-card">
        <el-tab-pane label="基础">
          <el-container class="el-card full" direction="vertical">
            <el-input placeholder="标题" v-model="form.title" class="no-border-input" />

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
        </el-tab-pane>

        <el-tab-pane label="选项">
          <el-form size="mini" label-position="left" label-width="6em">
            <el-form-item label="指派：">
              <member-select
                v-model="form.assignee"
                size="mini"
                :planner="planner"
                class="no-border-input"
              ></member-select>
            </el-form-item>

            <el-divider />

            <el-form-item label="里程碑：">
              <milestone-select
                v-model="form.milestone"
                size="mini"
                :planner="planner"
                class="no-border-input"
              />
            </el-form-item>

            <el-form-item label="结束时间:">
              <el-date-picker
                type="date"
                size="mini"
                placeholder="结束时间"
                v-model="form.stop"
                class="no-border-input"
              ></el-date-picker>
            </el-form-item>

            <el-divider />

            <el-form-item label="需求：">
              <backlog-select
                v-model="form.backlog"
                size="mini"
                :planner="planner"
                class="no-border-input"
              ></backlog-select>

              <el-checkbox v-model="form.close_backlog">关联关闭</el-checkbox>
            </el-form-item>

            <el-form-item label="问题：">
              <issue-select
                v-model="form.issue"
                size="mini"
                :planner="planner"
                class="no-border-input"
              ></issue-select>
              <el-checkbox v-model="form.close_issue">关联关闭</el-checkbox>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="需求" v-if="backlog">
          <div style="text-align:center;">
            <h2>
              {{backlog.title}}
              <member-preview size="mini" :planner="planner" v-model="backlog.assignee" />
            </h2>
          </div>
          <md-editor :value="backlog.content" :editable="false" size="mini" />
        </el-tab-pane>

        <el-tab-pane label="问题" v-if="issue">
          <div style="text-align:center;">
            <h2>
              {{issue.title}}
              <member-preview size="mini" :planner="planner" v-model="issue.assignee" />
            </h2>
          </div>
          <md-editor :value="issue.content" :editable="false" size="mini" />
        </el-tab-pane>
      </el-tabs>
    </el-main>
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
  components: { MemberSelect, MemberPreview, MilestoneSelect, BacklogSelect, IssueSelect, MdEditor },
  props: {
    planner: String,
    col: String
  },
  data()  {
    return {
      editable: false,
      form: {
        backlog: null,
        issue: null,
      },
      backlog: null,
      issue: null,
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
      this.fetch_backlog(new_val)
    },
    "form.issue": function(new_val)    {
      this.fetch_issue(new_val)
    }
  },
  methods: {
    cancel()    {
      this.$emit("cancel");
    },
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
    async fetch_backlog()
    {
      if (!this.form.backlog)
      {
        this.backlog = null
        return
      }

      this.backlog = await this.$store.dispatch("backlogs_detail", {
        planner: this.planner,
        backlog: this.form.backlog
      });

    },
    async fetch_issue()
    {
      if (!this.form.issue)
      {
        this.issue = null
        return
      }

      this.issue = await this.$store.dispatch("issues_detail", {
        planner: this.planner,
        issue: this.form.issue
      });

    }
  }
};
</script>

