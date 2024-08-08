<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="120px"
    >
      <el-form-item
        label="快递尺寸"
        prop="chargesSize"
      >
        <el-input
          v-model="queryParams.chargesSize"
          placeholder="请输入快递尺寸"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="标准收费金额/元"
        prop="chargesAmount"
      >
        <el-input
          v-model="queryParams.chargesAmount"
          placeholder="请输入标准收费金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="创建时间"
        prop="chargesCreateTime"
      >
        <el-date-picker
          clearable
          v-model="queryParams.chargesCreateTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="使用状态"
        prop="chargesStatus"
      >
        <el-select
          v-model="queryParams.chargesStatus"
          placeholder="请选择使用状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
        >重置</el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['charges:charges:add']"
        >新增</el-button>
      </el-col>

      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="chargesList"
      @selection-change="handleSelectionChange"
    >

      <el-table-column
        label="快递尺寸"
        align="center"
        prop="chargesSize"
      />
      <el-table-column
        label="快递尺寸描述"
        align="center"
        prop="chargesIntroduce"
      />
      <el-table-column
        label="标准收费金额/元"
        align="center"
        prop="chargesAmount"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="chargesCreateTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.chargesCreateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="使用状态"
        align="center"
        prop="chargesStatus"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_normal_disable"
            :value="scope.row.chargesStatus"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['charges:charges:edit']"
          >修改</el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改快递标准管理对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="130px"
      >
        <el-form-item
          label="快递尺寸"
          prop="chargesSize"
        >
          <el-input
            v-model="form.chargesSize"
            placeholder="请输入快递尺寸"
          />
        </el-form-item>
        <el-form-item
          label="快递尺寸描述"
          prop="chargesIntroduce"
        >
          <el-input
            v-model="form.chargesIntroduce"
            placeholder="请输入快递尺寸描述"
          />
        </el-form-item>
        <el-form-item
          label="标准收费金额/元"
          prop="chargesAmount"
        >
          <el-input
            v-model.number="form.chargesAmount"
            placeholder="请输入标准收费金额"
          />
        </el-form-item>
        <el-form-item
          label="使用状态"
          prop="chargesStatus"
        >
          <el-radio-group v-model="form.chargesStatus">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitForm"
        >确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCharges,
  getCharges,
  delCharges,
  addCharges,
  updateCharges,
} from "@/api/charges/charges";

export default {
  name: "Charges",
  dicts: ["sys_normal_disable"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 快递标准管理表格数据
      chargesList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        chargesSize: null,
        chargesIntroduce: null,
        chargesAmount: null,
        chargesCreateTime: null,
        chargesStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        chargesSize: [
          { required: true, message: "快递尺寸不能为空", trigger: "blur" },
        ],
        chargesIntroduce: [
          { required: true, message: "快递尺寸描述不能为空", trigger: "blur" },
        ],
        chargesAmount: [
          { required: true, message: "标准收费金额不能为空", trigger: "blur" },
          { type: "number", message: "请输入数字", trigger: "blur" },
        ],
        chargesStatus: [
          { required: true, message: "使用状态不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询快递标准管理列表 */
    getList() {
      this.loading = true;
      listCharges(this.queryParams).then((response) => {
        this.chargesList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        chargesId: null,
        chargesSize: null,
        chargesIntroduce: null,
        chargesAmount: null,
        chargesCreateTime: null,
        chargesStatus: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.chargesId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加快递标准";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const chargesId = row.chargesId || this.ids;
      getCharges(chargesId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改快递标准";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.chargesId != null) {
            updateCharges(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCharges(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const chargesIds = row.chargesId || this.ids;
      this.$modal
        .confirm('是否确认删除快递标准管理编号为"' + chargesIds + '"的数据项？')
        .then(function () {
          return delCharges(chargesIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "charges/charges/export",
        {
          ...this.queryParams,
        },
        `charges_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
