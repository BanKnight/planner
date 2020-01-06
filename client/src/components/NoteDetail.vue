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
        <el-tab-pane label="指派">
          <el-form size="mini" label-position="left" label-width="80px">
            <el-form-item label="指派：">
              <member-select
                v-model="form.assignee"
                size="mini"
                :planner="value.planner"
                class="no-border-input"
              ></member-select>
            </el-form-item>

            <el-divider />

            <el-form-item label="里程碑：">
              <milestone-select
                v-model="form.milestone"
                size="mini"
                :planner="value.planner"
                class="no-border-input"
              />
            </el-form-item>

            <el-form-item label="时间：">
              <el-date-picker
                type="date"
                size="mini"
                placeholder="开始时间"
                v-model="form.start"
                class="no-border-input"
              ></el-date-picker>

              <el-form-item>
                <el-date-picker
                  type="date"
                  size="mini"
                  placeholder="结束时间"
                  v-model="form.stop"
                  class="no-border-input"
                ></el-date-picker>
              </el-form-item>
            </el-form-item>

            <el-divider />

            <el-form-item label="需求：">
              <backlog-select
                v-model="form.backlog"
                size="mini"
                :planner="value.planner"
                class="no-border-input"
              ></backlog-select>
              <el-checkbox v-model="form.close_backlog">关联关闭</el-checkbox>
            </el-form-item>

            <el-form-item label="问题：">
              <issue-select
                v-model="form.issue"
                size="mini"
                :planner="value.planner"
                class="no-border-input"
              ></issue-select>
              <el-checkbox v-model="form.close_issue">关联关闭</el-checkbox>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="基础">
          <el-container class="el-card full" direction="vertical">
            <el-input placeholder="标题" v-model="form.title" class="no-border-input" />

            <md-editor
              v-model="form.content"
              theme="mini"
              :editable="this.editing"
              @click.native="editing = true;"
            />
          </el-container>
        </el-tab-pane>

        <el-tab-pane label="需求" v-if="form.backlog && form.backlog.length > 0"></el-tab-pane>

        <el-tab-pane label="问题" v-if="form.issue && form.issue.length > 0"></el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import MemberSelect from "./MemberSelect";
import MilestoneSelect from "./MilestoneSelect";
import BacklogSelect from "./BacklogSelect";
import IssueSelect from "./IssueSelect";
import MdEditor from "./MdEditor";

export default {
  components: { MemberSelect, MilestoneSelect, BacklogSelect, IssueSelect, MdEditor },
  props: {
    planner: String,
    value: Object
  },
  data()  {
    return {
      editing: false,
      form: {}
    };
  },

  mounted()  {
    this.init();
  },
  watch: {
    value()    {
      this.init();
    }
  },
  methods: {
    init()    {
      this.form = Object.assign({}, this.value);
    },
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
    }
  }
};
</script>

