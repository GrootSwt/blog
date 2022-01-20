<template>
  <div>
    <div class="cg-search-box">
      <div class="search-condition">
        <el-input
          placeholder="请输入数据字典key" v-model="searchForm.dictionaryKey" size="small" clearable
          style="width: 25%; margin-right: 10px">
        </el-input>
        <el-date-picker
          v-model="searchForm.dateRange" type="daterange" range-separator="~" size="small" start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 25%; margin-right: 10px"
          value-format="timestamp">
        </el-date-picker>
        <el-select
          v-model="searchForm.enabled" placeholder="请选择启用状态" size="small" style="width: 25%;margin-right: 10px;"
          clearable>
          <el-option
            v-for="item in enabledList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          >
          </el-option>
        </el-select>
        <el-button type="primary" size="small" icon="el-icon-search" round @click="search">查询</el-button>
      </div>
      <div>
        <el-button type="success" size="small" icon="el-icon-plus" round @click="openFormDialog('1')">新增</el-button>
        <el-button type="danger" size="small" icon="el-icon-delete" round @click="batchDelete">批量删除</el-button>
      </div>
    </div>
    <!--数据字典列表-->
    <el-table border stripe :data="tableData" style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column type="index" label="#" width="50" align="center">
      </el-table-column>
      <el-table-column prop="dictionaryKey" label="key">
      </el-table-column>
      <el-table-column prop="dictionaryValue" label="value">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="200">
        <template v-slot="{row}">
          {{ formatTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="enabled" label="启用状态">
        <template v-slot="{ row }">
          <el-switch
            v-model="row.enabled"
            active-value="1"
            inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeEnabled(row.id, row.enabled)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述">
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="{ row }">
          <el-button size="mini" type="primary" round icon="el-icon-edit"
                     @click="openFormDialog('2', row)">编辑
          </el-button>
          <el-button size="mini" type="danger" round icon="el-icon-delete"
                     @click="deleteById(row.id)">删除
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
      :page-sizes="[8, 10, 15, 20]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--新增、编辑、查看表单对话框-->
    <form-dialog
      :dialog-visible="dialogVisible" :formData="formData" :title="formDialogTitle"
      @close="closeFormDialog" @afterSubmit="afterSubmit">
    </form-dialog>
  </div>
</template>

<script>
import BaseMixin from '@/mixins/BaseMixin'
import FormDialog from '@/views/System/Dict/EditCategory/FormDialog'
import {
  batchDeleteDictionary,
  changeDictionaryEnabled,
  pageableSearchDictionary
} from '@/api/dict'

export default {
  name: 'EditCategory',
  components: { FormDialog },
  mixins: [BaseMixin],
  data () {
    return {
      searchForm: {
        categoryId: '',
        dictionaryKey: '',
        dateRange: [],
        enabled: ''
      },
      enabledList: [
        {
          key: '0',
          value: '禁用'
        },
        {
          key: '1',
          value: '启用'
        }
      ],
      tableData: [],
      dialogVisible: false,
      formData: {},
      formDialogTitle: '',
      page: 1,
      size: 8,
      total: 0
    }
  },
  created () {
    this.searchForm.categoryId = this.$route.query.categoryId
    this.search()
  },
  methods: {
    search () {
      this.page = 1
      this.size = 8
      this.pageableSearch()
    },
    pageableSearch () {
      const data = {
        page: this.page,
        size: this.size,
        searchForm: this.searchForm
      }
      pageableSearchDictionary(data).then(res => {
        if (res.status !== 'success') {
          return this.$message.error(res.message())
        }
        this.tableData = res.data
        this.total = parseInt(res.total)
      })
    },
    openFormDialog (type, row = {}) {
      this.formState = type
      this.formData = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
      switch (type) {
        case '1':
          this.formData.categoryId = this.searchForm.categoryId
          this.formDialogTitle = '新增'
          break
        case '2':
          this.formDialogTitle = '编辑'
          break
        case '3':
          this.formDialogTitle = '查看'
          break
        default:
          break
      }
    },
    closeFormDialog () {
      this.formData = {}
      this.formState = ''
      this.dialogVisible = false
    },
    afterSubmit () {
      this.pageableSearch()
      this.closeFormDialog()
    },
    handleSelectionChange (selection) {
      const idList = []
      selection.forEach(item => {
        idList.push(item.id)
      })
      this.selectionIdList = idList
    },
    batchDelete () {
      if (this.selectionIdList.length === 0) {
        return this.$message.info('请选择将要删除的数据！')
      }
      this.$confirm('此操作将永久删除所选数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDeleteDictionary(this.selectionIdList).then(res => {
          if (res.status !== 'success') {
            return this.$message.error(res.message)
          }
          this.pageableSearch()
          this.$message.success(res.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    changeEnabled (id, enabled) {
      changeDictionaryEnabled({
        id,
        enabled
      }).then(res => {
        if (res.status !== 'success') {
          return this.$message.error(res.message)
        }
        this.pageableSearch()
        this.$message.success(res.message)
      })
    },
    deleteById (id) {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDeleteDictionary([id]).then(res => {
          if (res.status !== 'success') {
            return this.$message.error(res.message)
          }
          this.pageableSearch()
          this.$message.success(res.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange (size) {
      this.size = size
      this.pageableSearch()
    },
    handleCurrentChange (page) {
      this.page = page
      this.pageableSearch()
    }
  }
}
</script>

<style scoped>

.search-condition {
  width: 80%;
}
</style>
