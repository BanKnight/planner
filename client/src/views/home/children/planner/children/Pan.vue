<template>
  <layout>
    <el-container class="full">
      <el-header height="auto" style="padding:0;margin-bottom:10px">
        <el-row type="flex" justify="space-between" align="middle">
          <span>
            <template v-for="(one, index) in curr_path_array">
              <el-tag
                type="success"
                size="mini"
                effect="dark"
                v-if="index != curr_path_array.length - 1"
                :key="one.path"
                @click="$router.push(`${root}?path=${one.path}`)"
                style="cursor:pointer"
              >
                {{ one.name }}
                <i class="el-icon-arrow-right" />
              </el-tag>

              <el-tag type="danger" size="mini" effect="dark" v-else :key="one.path">{{ one.name }}</el-tag>
            </template>
          </span>

          <el-button-group>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-upload"
              @click="upload.visible = true"
            >上传</el-button>
            <el-button size="mini" icon="el-icon-folder-add" @click="mkdir">新建</el-button>
          </el-button-group>
        </el-row>

        <el-dialog title="文件上传" :visible.sync="upload.visible">
          <el-upload drag :action="upload_url" multiple with-credentials :file-list="upload.files">
            <i class="el-icon-upload"></i>

            <div class="el-upload__tip" slot="tip">大小不能超过20m</div>
          </el-upload>
        </el-dialog>
      </el-header>

      <el-table
        :data="children"
        size="mini"
        style="width: 100%"
        height="100%"
        border
        v-loading="loading"
        row-key="_id"
      >
        <el-table-column label="名称">
          <template slot-scope="scope">
            <i class="el-icon-folder" v-if="scope.row.directory">
              <router-link
                :to="`${root}?path=${scope.row.path}`"
                class="el-link el-link--default"
              >{{ scope.row.name }}</router-link>
            </i>

            <el-popover
              v-else
              placement="bottom-start"
              width="400px"
              trigger="hover"
              :key="scope.row._id"
            >
              <el-row type="flex" justify="space-between">
                <h2>{{ scope.row.name }}</h2>
                <el-button type="success" @click="copy_link(scope.row)">复制链接</el-button>
              </el-row>

              <el-image v-if="is_img(scope.row)" :src="cal_link(scope.row)" fit="contain"></el-image>
              <div v-else>不支持预览</div>

              <el-tag
                :class="
                  is_img(scope.row) ? 'el-icon-picture' : 'el-icon-document'
                "
                type="success"
                size="mini"
                :effect="is_img(scope.row) ? 'dark' : 'plain'"
                slot="reference"
              >{{ scope.row.name }}</el-tag>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="大小" width="130">
          <template slot-scope="scope" v-if="!scope.row.directory">{{ filesize(scope.row.size) }}</template>
        </el-table-column>

        <el-table-column label="更新时间" width="130">
          <template slot-scope="scope">
            <i v-if="scope.row.updated" class="el-icon-time">{{ $format(scope.row.updated) }}</i>
            <el-tag v-else>无</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="作者" width="130">
          <template slot-scope="scope">
            <member-preview :value="scope.row.author" size="mini" :planner="planner_id" />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" align="right" fixed="right">
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                title="删除"
                size="mini"
                icon="el-icon-delete"
                type="danger"
                @click="destroy(scope.row)"
              ></el-button>

              <el-link
                target="_blank"
                :href="cal_link(scope.row)"
                :download="scope.row.name"
                :underline="false"
              >
                <el-button title="下载" size="mini" icon="el-icon-download" type="success"></el-button>
              </el-link>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-container>
  </layout>
</template>

<script>
import copy from "clipboard-copy";
import filesize from "file-size";
import path from "path";
import layout from "../layout";

import { is_img } from "@/utils";
import MemberPreview from "@/components/MemberPreview";

export default {
  path: "pan",
  weight: 4,
  meta: {
    menu_title: "文件",
    menu_icon: "el-icon-files",
    require_logined: true
  },
  components: { layout, MemberPreview },
  data()  {
    return {
      curr: null,
      children: [],
      loading: false,
      upload: { visible: false, files: [] },
      preview: { visible: false, url: "" }
    };
  },
  computed: {
    root()    {
      return `/planner/${this.planner_id}/pan`;
    },
    curr_path()    {
      return this.$route.query.path || "/";
    },
    curr_path_array()    {
      let array = [];

      let target = this.curr_path;

      for (let i = 0; i < 25; ++i)      {
        let parent = path.dirname(target);

        let name = path.basename(target);

        if (parent == target)        {
          name = "根目录";
        }

        array.unshift({
          path: target,
          name
        });

        if (parent == target)        {
          break;
        }

        target = parent;
      }

      return array;
    },
    upload_url()    {
      return `${this.$http.defaults.baseURL}/api/planner/${this.planner_id}/pan?path=${this.curr_path}`;
    },
    planner_id()    {
      return this.$route.params.planner;
    }
  },
  watch: {
    curr_path()    {
      this.fetch();
    },
    "upload.visible": function()    {
      this.fetch();
    }
  },
  mounted()  {
    this.fetch();
  },
  methods: {
    async fetch()    {
      this.loading = true;
      let resp = await this.$store.dispatch("pan_list", {
        planner: this.planner_id,
        params: {
          path: this.curr_path
        }
      });

      this.loading = false;
      this.curr = resp.file;
      this.children = resp.children;
    },

    async mkdir()    {
      let resp = await this.$prompt("文件夹的名称", "提示", {
        confirmButtonText: "确定"
      });

      await this.$store.dispatch("pan_mkdir", {
        planner: this.planner_id,
        data: {
          path: this.curr_path,
          name: resp.value
        }
      });

      this.$message({
        type: "success",
        message: `创建成功`
      });

      this.fetch();
    },

    async destroy(file)    {
      await this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });

      await this.$store.dispatch("pan_destroy", {
        planner: this.planner_id,
        data: {
          path: this.curr_path,
          name: file.name
        }
      });

      this.$message({
        type: "success",
        message: "删除成功!"
      });

      this.fetch();
    },
    rename()    {
      this.$prompt("请输入新的名字", "修改名字", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) =>        {
          value = value.trim();
          if (value.length == 0)          {
            this.$message.error("名字不能为空");
            return;
          }
        })
        .catch(() => { });
    },
    filesize(number)    {
      return filesize(number).human();
    },
    is_img(file)    {
      return is_img(file.ext);
    },
    cal_link(one)    {
      return `${window.location.origin}/public/upload/${this.planner_id}/${one.res}`;
    },
    copy_link(one)    {
      let url = this.cal_link(one);

      copy(url);

      this.$message.success("复制成功");
    }
  }
};
</script>
