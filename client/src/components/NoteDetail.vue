<template>
  <el-container class="full" direction="vertical">
    <el-form size="mini" label-position="left" label-width="5em">
      <el-form-item label="标题：">
        <el-input placeholder="标题" class="full-width" v-model="form.title" />
      </el-form-item>

      <el-form-item label="指派：">
        <member-select
          v-model="form.assignee"
          class="full-width"
          size="mini"
          :planner="value.planner"
        ></member-select>
      </el-form-item>

      <el-form-item label="结束：">
        <el-date-picker
          type="date"
          size="mini"
          placeholder="结束时间"
          v-model="form.stop"
          value-format="timestamp"
          class="full-width"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="内容：">
        <el-input
          type="textarea"
          class="full-width"
          :rows="2"
          placeholder="内容"
          v-model="form.content"
        />
      </el-form-item>

      <el-divider />

      <el-form-item label="里程碑：">
        <milestone-select
          v-model="form.milestone"
          class="full-width"
          size="mini"
          :planner="value.planner"
        />
      </el-form-item>

      <el-form-item label="需求：">
        <el-row class="full-width">
          <backlog-select v-model="form.backlog" size="mini" :planner="value.planner"></backlog-select>
          <el-link :disabled="!form.backlog" @click="read_backlog = true">
            <i class="el-icon-view el-icon--right"></i>
          </el-link>
        </el-row>

        <el-checkbox :disabled="!form.backlog" v-model="form.close_backlog">关联完成</el-checkbox>
      </el-form-item>

      <el-form-item label="问题：">
        <el-row class="full-width">
          <issue-select v-model="form.issue" size="mini" :planner="value.planner"></issue-select>
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
            type="danger"
            class="full-width"
            icon="el-icon-check"
            @click="close"
          >回收</el-button>
          <el-button
            size="mini"
            type="primary"
            class="full-width"
            icon="el-icon-upload"
            @click="save"
          >保存</el-button>
        </el-row>
      </el-form-item>
    </el-form>

    <el-dialog width="fit-content" :visible.sync="read_backlog" v-if="backlog" append-to-body>
      <div style="text-align:center;">
        <h2>
          {{ backlog.title }}
          <member-preview size="mini" :planner="value.planner" v-model="backlog.assignee" />
        </h2>
      </div>

      <md-editor :value="backlog.content" :editable="false" size="mini" />
    </el-dialog>

    <el-dialog width="fit-content" :visible.sync="read_issue" v-if="issue" append-to-body>
      <div style="text-align:center;">
        <h2>
          {{ issue.title }}
          <member-preview size="mini" :planner="value.planner" v-model="issue.assignee" />
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
    value: Object
  },
  data()  {
    return {
      editing: false,
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

  mounted()  {
    this.init();
  },
  watch: {
    value()    {
      this.init();
    },
    "form.backlog": function(new_val)    {
      this.fetch_backlog(new_val);
    },
    "form.issue": function(new_val)    {
      this.fetch_issue(new_val);
    }
  },

  methods: {
    init()    {
      this.form = Object.assign({}, this.value);
    },
    save()    {
      if (this.form.title.length == 0)      {
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

    close()    {
      this.$confirm(
        "单子回收后，将进行归档不可见(一般交给下单者关闭)",
        "是否确认回收",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() =>        {
          this.form.closed = true;

          this.save();
        })
        .catch(() => { });
    },
    async fetch_backlog()    {
      if (!this.form.backlog)      {
        this.backlog = null;
        return;
      }

      this.backlog = await this.$store.dispatch("backlogs_detail", {
        planner: this.value.planner,
        backlog: this.form.backlog
      });
    },
    async fetch_issue()    {
      if (!this.form.issue)      {
        this.issue = null;
        return;
      }

      this.issue = await this.$store.dispatch("issues_detail", {
        planner: this.value.planner,
        issue: this.form.issue
      });
    }
  }
};
</script>
