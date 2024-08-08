<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-form-item
        label="骑手编号"
        prop="riderId"
      >
        <el-input
          v-model="queryParams.riderId"
          placeholder="请输入骑手编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="提现总额/元"
        prop="withdrawalAmount"
      >
        <el-input
          v-model="queryParams.withdrawalAmount"
          placeholder="请输入提现总额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="提现手续费/元"
        prop="withdrawalCommission"
      >
        <el-input
          v-model="queryParams.withdrawalCommission"
          placeholder="请输入提现手续费"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="到账金额/元"
        prop="withdrawalActualAmount"
      >
        <el-input
          v-model="queryParams.withdrawalActualAmount"
          placeholder="请输入到账金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="提现时间"
        prop="withdrawalTime"
      >
        <el-date-picker
          clearable
          v-model="queryParams.withdrawalTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择提现时间"
        >
        </el-date-picker>
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

    <el-table
      v-loading="loading"
      :data="withdrawalList"
      @selection-change="handleSelectionChange"
    >

      <el-table-column
        label="骑手编号"
        align="center"
        prop="riderId"
      />
      <el-table-column
        label="提现总额/元"
        align="center"
        prop="withdrawalAmount"
      />
      <el-table-column
        label="提现手续费/元"
        align="center"
        prop="withdrawalCommission"
      />
      <el-table-column
        label="到账金额/元"
        align="center"
        prop="withdrawalActualAmount"
      />
      <el-table-column
        label="提现时间"
        align="center"
        prop="withdrawalTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.withdrawalTime, '{y}-{m}-{d}') }}</span>
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

    <!-- 添加或修改提现管理对话框 -->
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
        label-width="80px"
      >
        <el-form-item
          label="骑手编号"
          prop="riderId"
        >
          <el-input
            v-model="form.riderId"
            placeholder="请输入骑手编号"
          />
        </el-form-item>
        <el-form-item
          label="提现总额"
          prop="withdrawalAmount"
        >
          <el-input
            v-model="form.withdrawalAmount"
            placeholder="请输入提现总额"
          />
        </el-form-item>
        <el-form-item
          label="提现手续费"
          prop="withdrawalCommission"
        >
          <el-input
            v-model="form.withdrawalCommission"
            placeholder="请输入提现手续费"
          />
        </el-form-item>
        <el-form-item
          label="提现实际金额"
          prop="withdrawalActualAmount"
        >
          <el-input
            v-model="form.withdrawalActualAmount"
            placeholder="请输入提现实际金额"
          />
        </el-form-item>
        <el-form-item
          label="提现时间"
          prop="withdrawalTime"
        >
          <el-date-picker
            clearable
            v-model="form.withdrawalTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择提现时间"
          >
          </el-date-picker>
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
  listWithdrawal,
  getWithdrawal,
  delWithdrawal,
  addWithdrawal,
  updateWithdrawal,
} from "@/api/withdrawal/withdrawal";

export default {
  name: "Withdrawal",
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
      // 提现管理表格数据
      withdrawalList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        riderId: null,
        withdrawalAmount: null,
        withdrawalCommission: null,
        withdrawalActualAmount: null,
        withdrawalTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
    localStorage.setItem("a", true);
    let a = localStorage.getItem("a");
    console.log(typeof a);
  },
  methods: {
    /** 查询提现管理列表 */
    getList() {
      this.loading = true;
      listWithdrawal(this.queryParams).then((response) => {
        this.withdrawalList = response.rows;
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
        withdrawalId: null,
        riderId: null,
        withdrawalAmount: null,
        withdrawalCommission: null,
        withdrawalActualAmount: null,
        withdrawalTime: null,
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
      this.ids = selection.map((item) => item.withdrawalId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加提现管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const withdrawalId = row.withdrawalId || this.ids;
      getWithdrawal(withdrawalId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改提现管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.withdrawalId != null) {
            updateWithdrawal(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWithdrawal(this.form).then((response) => {
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
      const withdrawalIds = row.withdrawalId || this.ids;
      this.$modal
        .confirm('是否确认删除提现管理编号为"' + withdrawalIds + '"的数据项？')
        .then(function () {
          return delWithdrawal(withdrawalIds);
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
        "withdrawal/withdrawal/export",
        {
          ...this.queryParams,
        },
        `withdrawal_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
