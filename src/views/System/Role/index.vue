<template>
  <div>
    <!--查询输入框、按钮和新增按钮-->
    <search-box>
      <template v-slot:form>
        <el-input placeholder="请输入角色名" v-model="searchName" size="small" clearable
                  style="width: 35%; margin-right: 10px"></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" round @click="pageableSearch">查询</el-button>
      </template>
      <template v-slot:operation>
        <el-button type="success" size="small" icon="el-icon-plus" round @click="openAddDialog">新增</el-button>
        <el-button type="danger" size="small" icon="el-icon-delete" round @click="batchDelete">批量删除</el-button>
      </template>
    </search-box>
    <el-table border stripe :data="roleList" style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column type="index" label="#" width="50" align="center">
      </el-table-column>
      <el-table-column prop="name" label="角色名" width="240">
      </el-table-column>
      <el-table-column prop="description" label="描述">
      </el-table-column>
      <el-table-column prop="enabled" label="启用" width="100">
        <template v-slot="{ row }">
          <el-switch
            v-model="row.enabled"
            active-value="1"
            inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeRoleEnabled(row.id,row.enabled)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template v-slot="{ row }">
          <el-button size="mini" type="primary" round icon="el-icon-setting"
                     @click="openAssignDialog(row.id)">分配权限
          </el-button>
          <el-button size="mini" type="warning" round icon="el-icon-edit-outline" @click="openEditDialog(row)">编辑
          </el-button>
          <el-button size="mini" type="danger" round icon="el-icon-delete"
                     @click="deleteRoleById(row.id)">删除
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
      :page-sizes="[5, 10, 15, 20]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--编辑和新增对话框-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form :model="roleForm" :rules="roleFormRules" ref="roleFormRef" label-width="100px">
            <el-form-item label="角色名称" prop="name">
              <el-input size="small" v-model="roleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="description">
              <el-input size="small" v-model="roleForm.description"></el-input>
            </el-form-item>
            <el-form-item label="启用状态" prop="enabled">
              <el-switch
                v-model="roleForm.enabled"
                active-value="1"
                inactive-value="0"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-tree
            ref="addOrEditAssignTreeRef"
            :data="menuTree"
            show-checkbox
            check-strictly
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :props="defaultProps">
            <template v-slot="{node}">
              <span v-if="node.data.type === '1'" :class="node.data.icon" style="color: #57a3f3">{{ node.label }}</span>
              <span v-else style="color: #67c23a">{{ node.label }}</span>
            </template>
          </el-tree>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" round icon="el-icon-circle-close" @click="handleClose">取消</el-button>
        <el-button size="small" type="primary" icon="el-icon-circle-check" round @click="handleSubmit">提交</el-button>
      </span>
    </el-dialog>
    <!--权限分配-->
    <el-dialog
      title="分配权限"
      :visible.sync="assignVisible"
      width="40%"
      :before-close="assignClose">
      <el-tree
        ref="assignTreeRef"
        :data="menuTree"
        show-checkbox
        check-strictly
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :props="defaultProps">
        <template v-slot="{node}">
          <span v-if="node.data.type === '1'" :class="node.data.icon" style="color: #57a3f3">{{ node.label }}</span>
          <span v-else style="color: #67c23a">{{ node.label }}</span>
        </template>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <div style="text-align: center; width: 30%;float: left;">
          <el-tag style="margin-right: 50px">菜单</el-tag>
          <el-tag type="success">操作</el-tag>
        </div>
        <el-button size="small" round icon="el-icon-circle-close" @click="assignClose">取消</el-button>
        <el-button size="small" type="primary" round icon="el-icon-circle-check" @click="assignSubmit">分配</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  assignPermissions,
  batchDeleteByIds, changeRoleEnabled,
  getMenuIdArrByRoleId,
  pageableSearchMenu,
  saveRole,
  roleNameIsExist
} from '@/api/role'
import { getAllMenuForUser } from '@/api/menu'

import SearchBox from '@/components/System/SearchBox'

export default {
  name: 'Role',
  components: { SearchBox },
  data () {
    const validateName = async (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入角色名称！'))
      }
      if (value.length > 20) {
        return callback(new Error('角色名称长度范围在1-20之内！'))
      }
      const res = await roleNameIsExist(value)
      if (res.status !== 'success') {
        return this.$message.error('获取角色名称是否存在失败！')
      }
      if (res.data) {
        return callback(new Error('该角色名已存在，请更改！'))
      }
      callback()
    }
    return {
      // 查询条件角色名
      searchName: '',
      // 角色列表
      roleList: [],
      // 页码
      page: 1,
      // 每页数据条数
      size: 10,
      // 数据总数
      total: 0,
      // 是否为编辑对话框
      isEdit: false,
      // 编辑或新增对话框标志
      dialogVisible: false,
      // 编辑或新增角色表单
      roleForm: {
        name: '',
        description: '',
        enabled: '1'
      },
      // 编辑或新增角色表单校验规则
      roleFormRules: {
        name: [
          {
            validator: validateName,
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: true,
            message: '请输入角色描述！',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 100,
            message: '角色名称长度范围在1-100之内！',
            trigger: 'blur'
          }
        ]
      },
      // 菜单分配对话框标志
      assignVisible: false,
      // 菜单Tree配置
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      // 菜单树
      menuTree: [],
      // 菜单分配角色Id
      assignRoleId: '',
      // 批量删除选中Ids
      selectedRoleIds: []
    }
  },
  computed: {
    dialogTitle () {
      return this.isEdit ? '编辑' : '新增'
    }
  },
  created () {
    this.pageableSearch()
    this.getMenuTree()
  },
  methods: {
    // 获取菜单节点
    getMenuTree () {
      getAllMenuForUser().then(res => {
        if (res.status !== 'success') {
          this.$message.error(res.message)
        }
        this.menuTree = res.data
      })
    },
    // 条件分页查询角色
    pageableSearch () {
      const data = {
        page: this.page,
        size: this.size,
        searchName: this.searchName
      }
      pageableSearchMenu(data).then(res => {
        if (res.status !== 'success') {
          return this.$message.error(res.message)
        }
        this.roleList = res.data
        this.total = res.total
      })
    },
    // 每页数据条数改变
    handleSizeChange (size) {
      this.size = size
      this.pageableSearch()
    },
    // 页码改变
    handleCurrentChange (page) {
      this.page = page
      this.pageableSearch()
    },
    // 取消角色编辑或新增
    handleClose () {
      this.$refs.roleFormRef.resetFields()
      this.$refs.addOrEditAssignTreeRef.setCheckedKeys([])
      this.dialogVisible = false
    },
    // 提交角色编辑或新增
    handleSubmit () {
      this.$refs.roleFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请根据提示完善表单信息！')
        }
        const menuIdArr = this.$refs.addOrEditAssignTreeRef.getCheckedKeys()
        const roleData = {
          ...this.roleForm,
          menuIdArr: menuIdArr
        }
        saveRole(roleData).then(res => {
          if (res.status !== 'success') {
            return this.$message.error(res.message)
          }
          this.pageableSearch()
          this.handleClose()
          this.$message.success('保存角色成功！')
        })
      })
    },
    // 打开新增角色对话框
    openAddDialog () {
      this.isEdit = false
      this.roleForm = {
        enabled: '1'
      }
      this.dialogVisible = true
    },
    // 打开编辑角色对话框
    openEditDialog (editRole) {
      getMenuIdArrByRoleId({ id: editRole.id }).then(res => {
        if (res.status !== 'success') {
          return this.$message.error(res.message)
        }
        this.$set(this.roleForm, 'id', editRole.id)
        this.$set(this.roleForm, 'name', editRole.name)
        this.$set(this.roleForm, 'enabled', editRole.enabled)
        this.$set(this.roleForm, 'description', editRole.description)
        this.isEdit = true
        this.$nextTick(() => {
          this.$refs.addOrEditAssignTreeRef.setCheckedKeys(res.data)
        })
        this.dialogVisible = true
      })
    },
    // 关闭分配菜单
    assignClose () {
      this.$refs.assignTreeRef.setCheckedNodes([])
      this.assignVisible = false
    },
    // 提交分配权限
    assignSubmit () {
      const checkedKeys = this.$refs.assignTreeRef.getCheckedKeys()
      const data = {
        assignRoleId: this.assignRoleId,
        checkedKeys: checkedKeys
      }
      assignPermissions(data).then(res => {
        if (res.status !== 'success') {
          return this.$message.error(res.message)
        }
        this.$refs.assignTreeRef.setCheckedNodes([])
        this.pageableSearch()
        this.assignVisible = false
        this.$message.success('角色分配菜单成功！')
      })
    },
    // 打开分配菜单对话框
    openAssignDialog (id) {
      this.assignRoleId = id
      getMenuIdArrByRoleId({ id }).then(res => {
        if (res.status !== 'success') {
          return this.$message.error(res.message)
        }
        this.assignVisible = true
        this.$nextTick(() => {
          this.$refs.assignTreeRef.setCheckedKeys(res.data)
        })
      })
    },
    // 角色表单批量选择数据
    handleSelectionChange (selection) {
      const roleIds = []
      selection.forEach(role => {
        roleIds.push(role.id)
      })
      this.selectedRoleIds = roleIds
    },
    delete (ids) {
      batchDeleteByIds({ ids }).then(res => {
        if (res.status !== 'success') {
          this.pageableSearch()
          return this.$message.error(res.message)
        }
        this.pageableSearch()
        this.$message.success('批量删除成功！')
      })
    },
    // 批量删除角色
    batchDelete () {
      if (this.selectedRoleIds.length === 0) {
        return this.$message.info('请选择将要删除的角色！')
      }
      this.$confirm('此操作将批量删除角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delete(this.selectedRoleIds)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 根据Id删除
    deleteRoleById (id) {
      const ids = [id]
      this.$confirm('此操作将永久该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delete(ids)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 修改角色启用状态
    changeRoleEnabled (id, enabled) {
      const role = {
        id,
        enabled
      }
      changeRoleEnabled(role).then(res => {
        if (res.status !== 'success') {
          this.pageableSearch()
          return this.$message.error(res.message)
        }
        this.pageableSearch()
        this.$message.success('该角色修改启用状态成功！')
      })
    }
  }
}
</script>

<style scoped>

</style>
