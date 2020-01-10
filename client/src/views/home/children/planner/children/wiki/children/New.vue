<template>
  <el-container class="full">
    <el-header
      height="auto"
      style="display: flex;padding:0;justify-content: space-between;align-content:center"
    >
      <el-button-group>
        <el-button size="mini" icon="el-icon-close" @click="goback">取消</el-button>

        <el-button size="mini" type="primary" icon="el-icon-upload" @click="summit">保存</el-button>
      </el-button-group>
    </el-header>

    <el-container class="el-card" direction="vertical">
      <el-input placeholder="请输入标题" v-model="article.title" clearable />
      <el-header style="background-color:#f0f9eb;" class="scroll-if-need el-card" height="40px">
        <el-row type="flex" justify="start" align="middle" class="full-height">
          <el-upload
            :show-file-list="false"
            :action="upload_url"
            multiple
            with-credentials
            :on-success="on_upload_ok"
          >
            <el-button size="mini" icon="el-icon-plus" style="margin-right:5px">上传附件</el-button>
          </el-upload>

          <el-popover
            placement="bottom-start"
            width="400"
            trigger="hover"
            v-for="one in article.attachments"
            :key="one._id"
          >
            <el-row type="flex" justify="space-between">
              <h2>{{ one.name }}</h2>
              <el-button type="success" @click="copy_link(one)">复制链接</el-button>
            </el-row>

            <el-image v-if="is_img(one)" :src="cal_link(one)"></el-image>
            <div v-else>不支持预览</div>

            <el-tag
              :class="is_img(one) ? 'el-icon-picture' : 'el-icon-document'"
              :closable="true"
              type="success"
              size="mini"
              :effect="is_img(one) ? 'dark' : 'plain'"
              slot="reference"
              @close="close_file(one)"
            >{{ one.name }}</el-tag>
          </el-popover>
        </el-row>
      </el-header>
      <md-editor v-model="article.content" theme="small" :editable="true" :planner="planner_id" />
    </el-container>
  </el-container>
</template>

<script>
import copy from "clipboard-copy";
import { is_img } from "@/utils";

import MdEditor from "@/components/MdEditor";

export default {
  path: "new",
  weight: 10,
  meta: { require_logined: true },
  components: { MdEditor },

  data()  {
    return {
      article: {
        title: "",
        content: "",
        attachments: []
      },
      deleting: [],
      adding: []
    };
  },
  computed: {
    root()    {
      return `/planner/${this.planner_id}/wiki`;
    },
    planner_id()    {
      return this.$route.params.planner;
    },
    upload_url()    {
      return `${this.$http.defaults.baseURL}/api/planner/${this.planner_id}/pan?path=/.private`;
    }
  },
  beforeRouteEnter(to, from, next)  {
    next(vm =>    {
      if (from.fullPath != "/")      {
        vm.from = from.fullPath;
      }
    });
  },
  beforeDestroy()  {
    for (let file of this.adding)    {
      this.$store.dispatch("pan_destroy_priavte", {
        planner: this.planner_id,
        name: file.name
      });
    }
    this.adding = [];
  },
  methods: {
    async summit()    {
      this.article.title = this.article.title.trim();
      this.articlecontent = this.article.content;

      if (this.article.title.length == 0)      {
        this.$message.error("提交前标题不能为空");
        return;
      }

      for (let file of this.deleting)      {
        this.$store.dispatch("pan_destroy_priavte", {
          planner: this.planner_id,
          name: file.name
        });
      }

      this.deleting = [];

      let one = await this.$store.dispatch("wiki_create", {
        planner: this.planner_id,
        data: this.article
      });

      this.adding = [];

      this.$message.success("创建成功");

      this.$router.push(`${this.root}/detail/${one._id}`);
    },
    goback()    {
      if (this.from)      {
        this.$router.push(this.from);
      } else      {
        this.$router.push(this.root);
      }
    },
    on_upload_ok(response)    {
      this.article.attachments = this.article.attachments || [];

      this.article.attachments.push(response);

      this.adding.push(response);
    },
    close_file(file)    {
      let index = this.article.attachments.indexOf(file);
      if (index < 0)      {
        return;
      }

      this.article.attachments.splice(index, 1);

      this.deleting.push(file);
    },
    is_img(file)    {
      return is_img(file.ext);
    },
    cal_link(one)    {
      return `${window.location.host}/public/upload/${this.planner_id}/${one.res}`;
    },
    copy_link(one)    {
      let url = this.cal_link(one);

      copy(url);

      this.$message.success("复制成功");
    }
  }
};
</script>
