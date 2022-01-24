<template>
  <div>
    <!--查询输入框、按钮和新增按钮-->
    <search-box>
      <template v-slot:form>
        <el-input placeholder="请输入用户名" v-model="searchForm.username" size="small" clearable
                  style="width: 35%; margin-right: 10px"></el-input>
        <el-input placeholder="请输入角色名" v-model="searchForm.roleName" size="small" clearable
                  style="width: 35%; margin-right: 10px"></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" round @click="pageableSearch">查询</el-button>
      </template>
      <template v-slot:operation>
        <el-button type="success" size="small" icon="el-icon-plus" round @click="openAddDialog">新增</el-button>
        <el-button type="danger" size="small" icon="el-icon-delete" round @click="batchDelete">批量删除</el-button>
      </template>
    </search-box>
    <!--用户列表-->
    <el-table border stripe :data="userList" style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column type="index" label="#" width="50" align="center">
      </el-table-column>
      <el-table-column prop="username" label="用户名">
      </el-table-column>
      <el-table-column prop="loginName" label="账号">
      </el-table-column>
      <el-table-column prop="phoneNumber" label="联系方式" width="200">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="240">
      </el-table-column>
      <el-table-column prop="roleName" label="角色名" width="240">
      </el-table-column>
      <el-table-column prop="enabled" label="启用状态" width="100">
        <template v-slot="{ row }">
          <el-switch
            v-model="row.enabled"
            active-value="1"
            inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeUserEnabled(row.id, row.enabled)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template v-slot="{ row }">
          <el-button size="mini" type="primary" round icon="el-icon-edit" @click="openEditDialog(row)">编辑</el-button>
          <el-button size="mini" type="warning" round icon="el-icon-setting" @click="openAuthorizeDialog(row)">授权
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
      :page-sizes="[5, 10, 15, 20]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--编辑或新增对话框-->
    <el-dialog
      :title="editStatus ? '编辑' : '新增'"
      :visible.sync="editOrAddVisible"
      width="30%"
      :before-close="addOrEditCancel">
      <el-form :model="userForm" :rules="userFormRules" ref="userFormRef" label-width="80px">
        <el-form-item label="账号" prop="loginName" v-if="!editStatus">
          <el-input v-model="userForm.loginName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!editStatus">
          <el-input type="password" v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phoneNumber">
          <el-input type="tel" v-model="userForm.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="userForm.roleId" placeholder="请选择角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态" prop="enabled">
          <el-switch
            v-model="userForm.enabled"
            active-value="1"
            inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" round icon="el-icon-circle-close" @click="addOrEditCancel">取消</el-button>
        <el-button size="mini" round icon="el-icon-circle-check" type="primary" @click="addOrEditSubmit">确定</el-button>
      </span>
    </el-dialog>
    <!--授权对话框-->
    <el-dialog
      title="提示"
      :visible.sync="authorizeDialogFlag"
      width="30%"
      :before-close="closeAuthorizeDialog">
      <el-form :model="authorizeForm" :rules="authorizeFormRules" ref="authorizeFormRef" label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="用户角色" prop="roleId">
          <el-select v-model="authorizeForm.roleId" placeholder="请选择角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button size="mini" round icon="el-icon-circle-close" @click="closeAuthorizeDialog">取 消</el-button>
    <el-button size="mini" round icon="el-icon-circle-check" type="primary" @click="submitAuthorization">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addOrEditUser,
  authorization,
  batchDeleteUser,
  changeUserEnabled, emailIsExist,
  loginNameIsExist,
  pageableSearchUser, phoneNumberIsExist
} from '@/api/user'
import { getAllRoleList } from '@/api/role'
import SearchBox from '@/components/System/SearchBox'

export default {
  name: 'User',
  components: { SearchBox },
  data () {
    const checkRoleId = (rule, value, callback) => {
      let flag = true
      this.roleList.forEach(role => {
        if (role.id === value) {
          if (role.enabled === '0') {
            flag = false
          }
        }
      })
      if (!flag) {
        return callback(new Error('该角色未启用，请选择其他角色！'))
      } else {
        return callback()
      }
    }
    const validateLoginName = async (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入登录名！'))
      }
      if (value.length > 20) {
        return callback(new Error('登录名字符长度范围为1~20！'))
      }
      const res = await loginNameIsExist(value)
      if (res.status !== 'success') {
        return this.$message.error('获取账号名是否存在失败！')
      }
      if (res.data) {
        return callback(new Error('登录名已存在，请更换！'))
      }
      callback()
    }
    const validatePhoneNumber = async (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入联系方式！'))
      }
      if (value.length > 20 || value.length < 4) {
        return callback(new Error('联系方式字符长度范围为4~20！'))
      }
      const res = await phoneNumberIsExist(value)
      if (res.status !== 'success') {
        return this.$message.error('获取联系方式是否存在失败！')
      }
      if (res.data) {
        return callback(new Error('联系方式已存在，请更换！'))
      }
      callback()
    }
    const validateEmail = async (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入电子邮件！'))
      }
      if (value.length > 30 || value.length < 5) {
        return callback(new Error('电子邮件字符长度范围为5~30！'))
      }
      const res = await emailIsExist(value)
      if (res.status !== 'success') {
        return this.$message.error('获取电子邮件是否存在失败！')
      }
      if (res.data) {
        return callback(new Error('电子邮件已存在，请更换！'))
      }
      callback()
    }
    return {
      searchForm: {
        username: '',
        roleName: ''
      },
      page: 1,
      size: 10,
      total: 0,
      userList: [],
      // 批量删除id列表
      batchDeleteIdArr: [],
      editStatus: false,
      editOrAddVisible: false,
      userForm: {
        loginName: '',
        password: '',
        username: '',
        phoneNumber: '',
        email: '',
        roleId: '',
        enabled: '1'
      },
      userFormRules: {
        loginName: [
          {
            validator: validateLoginName,
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '密码的长度范围1-20',
            trigger: 'blur'
          }
        ],
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '用户名的长度范围1-20',
            trigger: 'blur'
          }
        ],
        phoneNumber: [
          {
            validator: validatePhoneNumber,
            trigger: 'blur'
          }
        ],
        email: [
          {
            validator: validateEmail,
            trigger: 'blur'
          }
        ],
        roleId: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'blur'
          },
          {
            validator: checkRoleId,
            trigger: 'change'
          }
        ]
      },
      roleList: [],
      authorizeDialogFlag: false,
      authorizeForm: {
        id: '',
        roleId: ''
      },
      authorizeFormRules: {
        roleId: [
          {
            required: true,
            message: '请选择用户角色！',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getAllRoleList()
    this.pageableSearch()
  },
  methods: {
    // 角色列表
    getAllRoleList () {
      getAllRoleList().then(res => {
        if (res.status !== 'success') {
          return this.$message.error(res.message)
        }
        this.roleList = res.data
      })
    },
    // 条件分页查询用户
    pageableSearch () {
      const data = {
        page: this.page,
        size: this.size,
        searchForm: this.searchForm
      }
      pageableSearchUser(data).then(res => {
        if (res.status !== 'success') {
          this.$message.error(res.message)
        }
        this.userList = res.data
        this.total = res.total
      })
    },
    // 批量删除
    batchDelete () {
      if (this.batchDeleteIdArr.length === 0) {
        return this.$message.info('请选择将要删除的用户！')
      }
      this.$confirm('此操作将删除所有选中用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDeleteUser(this.batchDeleteIdArr).then(res => {
          if (res.status !== 'success') {
            return this.$message.error(res.message)
          }
          this.pageableSearch()
          this.$message.success('批量删除成功！')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSelectionChange (selection) {
      const selectionUserIds = []
      selection.forEach(user => {
        selectionUserIds.push(user.id)
      })
      this.batchDeleteIdArr = selectionUserIds
    },
    // 打开新增对话框
    openAddDialog () {
      this.editStatus = false
      this.editOrAddVisible = true
    },
    // 开启编辑对话框
    openEditDialog (user) {
      this.userForm = JSON.parse(JSON.stringify(user))
      this.editStatus = true
      this.editOrAddVisible = true
    },
    // 根据用户Id删除用户
    deleteRoleById (userId) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const deleteIds = [userId]
        batchDeleteUser(deleteIds).then(res => {
          if (res.status !== 'success') {
            return this.$message.error(res.message)
          }
          this.pageableSearch()
          this.$message.success('删除成功！')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 每页数据量改变
    handleSizeChange (size) {
      this.size = size
      this.pageableSearch()
    },
    // 页码改变
    handleCurrentChange (page) {
      this.page = page
      this.pageableSearch()
    },
    // 取消新增或者编辑用户
    addOrEditCancel () {
      this.$refs.userFormRef.resetFields()
      console.log(this.userForm)
      this.editOrAddVisible = false
    },
    // 提交编辑或新增用户
    addOrEditSubmit () {
      this.$refs.userFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请根据提示完善用户表单！')
        }
        addOrEditUser(this.userForm).then(res => {
          if (res.status !== 'success') {
            if (this.editStatus) {
              return this.$message.error(res.message)
            } else {
              return this.$message.error(res.message)
            }
          }
          this.pageableSearch()
          this.addOrEditCancel()
          if (this.editStatus) {
            return this.$message.success('编辑用户成功！')
          } else {
            return this.$message.success('新增用户成功！')
          }
        })
      })
    },
    // 更改用户的启用状态
    changeUserEnabled (id, enabled) {
      const user = {
        id,
        enabled
      }
      changeUserEnabled(user).then(res => {
        if (res.status !== 'success') {
          return this.$message.error(res.message)
        }
        this.pageableSearch()
        this.$message.success('更改该用户的启用状态成功！')
      })
    },
    // 打开授权对话框
    openAuthorizeDialog (userInfo) {
      this.authorizeForm.id = userInfo.id
      this.authorizeForm.roleId = userInfo.roleId
      this.authorizeDialogFlag = true
    },
    // 关闭授权对话框
    closeAuthorizeDialog () {
      this.$refs.authorizeFormRef.resetFields()
      this.authorizeDialogFlag = false
    },
    // 提交授权
    submitAuthorization () {
      this.$refs.authorizeFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请根据提示完善表单信息！')
        }
        authorization(this.authorizeForm).then(res => {
          if (res.status !== 'success') {
            return this.$message.error(res.message)
          }
          this.pageableSearch()
          this.$message.success(res.message)
          this.closeAuthorizeDialog()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
