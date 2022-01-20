<template>
  <div>
    <!--查询输入框、按钮和新增按钮-->
    <search-box class="cg-search-box" :form-width="75" :operation-width="25">
      <template v-slot:form>
        <el-input
          placeholder="请输入数据字典类别名" v-model="searchForm.categoryName" size="small" clearable
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
      </template>
      <template v-slot:operation>
        <el-button type="success" size="small" icon="el-icon-plus" round @click="openFormDialog('1')">新增</el-button>
        <el-button type="danger" size="small" icon="el-icon-delete" round @click="batchDelete">批量删除</el-button>
      </template>
    </search-box>
    <!--数据字典列表-->
    <el-table border stripe :data="tableData" style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column type="index" label="#" width="50" align="center">
      </el-table-column>
      <el-table-column prop="categoryName" label="类别名称">
      </el-table-column>
      <el-table-column prop="categoryKey" label="key">
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
      <el-table-column label="操作" width="270">
        <template v-slot="{ row }">
          <el-button size="mini" type="primary" round icon="el-icon-edit"
                     @click="openFormDialog('2', row)">编辑
          </el-button>
          <el-button size="mini" type="success" round icon="el-icon-view"
                     @click="detailDictionary(row.id)">明细
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
import {
  pageableSearchDictionaryCategory,
  batchDeleteDictionaryCategory,
  changeDictionaryCategoryEnabled
} from '@/api/dict'
import FormDialog from '@/views/System/Dict/FormDialog'
import SearchBox from '@/components/System/SearchBox'

export default {
  name: 'Dict',
  mixins: [BaseMixin],
  components: { SearchBox, FormDialog },
  data () {
    return {
      searchForm: {
        categoryName: '',
        dateRange: [],
        enabled: ''
      },
      tableData: [],
      page: 0,
      size: 8,
      total: 0,
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
      dialogVisible: false,
      formData: {},
      formDialogTitle: '',
      formState: '',
      selectionIdList: []
    }
  },
  created () {
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
      pageableSearchDictionaryCategory(data).then(res => {
        if (res.status !== 'success') {
          return this.$message.error(res.message)
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
        batchDeleteDictionaryCategory(this.selectionIdList).then(res => {
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
      changeDictionaryCategoryEnabled({
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
        batchDeleteDictionaryCategory([id]).then(res => {
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
    },
    detailDictionary (categoryId) {
      this.$router.push({
        path: 'editCategory',
        query: { categoryId }
      })
    }
  }
}
</script>

<style scoped>

.search-condition {
  width: 80%;
}
</style>
