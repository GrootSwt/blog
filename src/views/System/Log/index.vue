<template>
  <div>
    <!--日志查询和操作-->
    <search-box :form-width="75" :operation-width="25">
      <template v-slot:form>
        <el-input placeholder="请输入登录账号" v-model="searchForm.loginName" size="small" clearable
                  style="width: 25%; margin-right: 10px"></el-input>
        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          size="small"
          style="width: 25%; margin-right: 10px"
        >
        </el-date-picker>
        <el-switch v-model="searchForm.success" active-text="成功" inactive-text="失败" active-color="#13ce66"
                   inactive-color="#ff4949" style="margin-right: 10px" @change="search">
        </el-switch>
        <el-button type="primary" size="small" icon="el-icon-search" round @click="search">查询</el-button>
      </template>
      <template v-slot:operation>
        <el-button type="danger" size="small" icon="el-icon-delete" round @click="batchDelete">批量删除</el-button>
      </template>
    </search-box>
    <!--日志列表-->
    <el-table border stripe :data="logList" style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column type="index" label="#" width="50" align="center">
      </el-table-column>
      <el-table-column prop="requestMethod" show-overflow-tooltip label="请求方式" width="80">
      </el-table-column>
      <el-table-column prop="requestURI" show-overflow-tooltip label="请求路径" width="300">
      </el-table-column>
      <el-table-column prop="success" label="状态" width="100">
        <template v-slot="{ row }">
          <el-switch
            v-model="row.success"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTimeStr" show-overflow-tooltip label="创建时间" min-width="150">
      </el-table-column>
      <el-table-column prop="loginName" show-overflow-tooltip label="登录账号">
      </el-table-column>

      <el-table-column label="操作" width="180">
        <template v-slot="{ row }">
          <el-button size="mini" type="warning" round icon="el-icon-view" @click="openViewLogDialog(row)">查看
          </el-button>
          <el-button size="mini" type="danger" round icon="el-icon-delete" @click="deleteRoleById(row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页部分-->
    <el-pagination
      style="margin-top: 12px; float: right"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[5, 8, 15, 20]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--日志查看详情对话框-->
    <view-log :dialog-visible="viewLogDialogFlag" :log-detail="logDetail" @closeDialog="closeViewLogDialog"></view-log>
  </div>
</template>

<script>
import BaseMixin from '@/mixins/BaseMixin'
import { pageableSearchLog, batchDeleteLog } from '@/api/log'
import ViewLog from './ViewLog'
import SearchBox from '@/components/System/SearchBox'

export default {
  name: 'Log',
  mixins: [BaseMixin],
  components: { SearchBox, ViewLog },
  data () {
    return {
      searchForm: {
        serviceName: '',
        loginName: '',
        success: false,
        dateRange: []
      },
      page: 1,
      size: 8,
      total: 0,
      logList: [],
      selectionIdList: [],
      viewLogDialogFlag: false,
      logDetail: {}
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    search () {
      this.page = 1
      this.size = 8
      this.pageableSearch()
    },
    async pageableSearch () {
      const data = {
        page: this.page,
        size: this.size,
        searchForm: this.searchForm
      }
      const res = await pageableSearchLog(data)
      if (res.status !== 'success') {
        return this.$message.error('获取日志列表失败！')
      }
      this.logList = res.data
      this.logList.forEach(item => {
        item.createTimeStr = this.formatTime(item.createTime)
      })
      this.total = res.total
    },
    batchDelete () {
      this.$confirm('此操作将永久删除该条日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDeleteLog(this.selectionIdList).then(res => {
          if (res.status !== 'success') {
            return this.$message.error('日志删除失败！')
          }
          this.pageableSearch()
          this.$message.success('删除成功!')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSelectionChange (selection) {
      const idList = []
      selection.forEach(item => {
        idList.push(item.id)
      })
      this.selectionIdList = idList
    },
    deleteRoleById (id) {
      this.selectionIdList = [id]
      this.batchDelete()
    },
    handleSizeChange (currentSize) {
      this.size = currentSize
      this.pageableSearch()
    },
    handleCurrentChange (currentPage) {
      this.page = currentPage
      this.pageableSearch()
    },
    openViewLogDialog (row) {
      this.logDetail = row
      this.viewLogDialogFlag = true
    },
    closeViewLogDialog () {
      this.logDetail = {}
      this.viewLogDialogFlag = false
    }
  }
}
</script>

<style scoped>
.search-form {
  max-width: 90%;
  display: flex;
  align-items: center;
}
</style>
