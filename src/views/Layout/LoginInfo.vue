<template>
  <div class="login-info">
    <!--用户名下拉框-->
    <el-dropdown placement="top" style="cursor: pointer">
      <span class="el-dropdown-link">
        <el-avatar v-if="this.loginUserInfo.avatar" size="medium" :src="downloadUrl + this.loginUserInfo.avatar"
                   style="vertical-align: center">
        </el-avatar>
        <span v-else>{{ loginUserInfo.username }}</span>
      </span>
      <el-dropdown-menu slot="dropdown" style="text-align: center">
        <el-dropdown-item @click.native="openModifyAvatarDialog">
          <span>设置头像</span>
        </el-dropdown-item>
        <el-dropdown-item @click.native="openModifyUserInfoDialog">
          <span>修改信息</span>
        </el-dropdown-item>
        <el-dropdown-item @click.native="changePassword">
          <span>更改密码</span>
        </el-dropdown-item>
        <el-dropdown-item @click.native="logout">
          <span>退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!--修改密码对话框-->
    <el-dialog
      title="修改密码"
      :visible.sync="changePasswordFlag"
      width="30%"
      :before-close="cancel">
      <el-form :model="passwordForm" :rules="passwordFormRule" ref="passwordFormRef" label-width="80px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" v-model="passwordForm.oldPassword" placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="passwordForm.newPassword" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="再次输入" prop="newPassword2">
          <el-input type="password" v-model="passwordForm.newPassword2" placeholder="请再次输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" round icon="el-icon-circle-close" @click="cancel">取 消</el-button>
        <el-button size="mini" round icon="el-icon-circle-check" type="primary" @click="submit">提 交</el-button>
      </span>
    </el-dialog>
    <!--编辑用户信息对话框-->
    <el-dialog
      title="编辑"
      :visible.sync="modifyUserInfoDialogFlag"
      width="30%"
      :before-close="closeModifyUserInfoDialog">
      <el-form :model="userForm" :rules="userFormRules" ref="userFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phoneNumber">
          <el-input type="tel" v-model="userForm.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="userForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" round icon="el-icon-circle-close" @click="closeModifyUserInfoDialog">取 消</el-button>
        <el-button size="mini" round icon="el-icon-circle-check" type="primary"
                   @click="submitModifyUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!--设置头像对话框-->
    <el-dialog
      title="头像设置"
      :visible.sync="modifyAvatarDialogFlag"
      width="30%"
      :before-close="closeModifyAvatarDialog">
      <div v-if="this.loginUserInfo.avatar">
        <p>
          <el-avatar shape="square" :size="100" fit="fill" :src="downloadUrl + this.loginUserInfo.avatar"
                     style="vertical-align: center">
          </el-avatar>
        </p>
      </div>
      <div>
        <p>
          <el-upload
            :action="uploadUrl"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadAvatarSuccess"
            :on-remove="uploadAvatarRemove"
            :file-list="avatarList"
            :limit="1"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button size="mini" round icon="el-icon-circle-close" @click="closeModifyAvatarDialog(false)">取 消</el-button>
    <el-button size="mini" round icon="el-icon-circle-check" type="primary" @click="submitUploadAvatar">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { removeCookie, getCookie, setCookie } from '@/utils/util'
import { modifyAvatar, modifyUserInfo, changePassword } from '@/api/user'
import { deleteFileById, DOWNLOAD_URL, UPLOAD_URL } from '@/api/oss'
import { logout } from '@/api/login'

export default {
  name: 'LoginInfo',
  data () {
    const validateNewPass = (rule, value, callback) => {
      const oldPass = this.passwordForm.oldPassword
      if (value !== '' && oldPass !== '' && value === oldPass) {
        callback(new Error('新密码与旧密码相同'))
      } else {
        callback()
      }
    }
    const validateNewPass2 = (rule, value, callback) => {
      const newPass = this.passwordForm.newPassword
      if (value !== '' && newPass !== '' && value !== newPass) {
        callback(new Error('新密码两次输入不相同'))
      } else {
        callback()
      }
    }
    return {
      headerImg: require('../../../public/images/header.jpg'),
      changePasswordFlag: false,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        newPassword2: ''
      },
      passwordFormRule: {
        oldPassword: [
          {
            required: true,
            message: '请输入旧密码',
            trigger: 'blur'
          }
        ],
        newPassword: [
          {
            required: true,
            message: '请输入新密码！',
            trigger: 'blur'
          },
          {
            validator: validateNewPass,
            trigger: 'blur'
          }
        ],
        newPassword2: [
          {
            required: true,
            message: '请再次输入新密码！',
            trigger: 'blur'
          },
          {
            validator: validateNewPass2,
            trigger: 'blur'
          }
        ]
      },
      modifyUserInfoDialogFlag: false,
      userForm: {
        username: '',
        phoneNumber: '',
        email: ''
      },
      userFormRules: {
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
            required: true,
            message: '请输入联系方式',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '联系方式的长度范围3-20',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 30,
            message: '邮箱的长度范围5-30',
            trigger: 'blur'
          }
        ]
      },
      modifyAvatarDialogFlag: false,
      downloadUrl: DOWNLOAD_URL,
      uploadUrl: UPLOAD_URL,
      avatarList: [],
      currentAvatar: ''
    }
  },
  computed: {
    ...mapState('user', ['loginUserInfo'])
  },
  created () {
  },
  mounted () {
  },
  methods: {
    ...mapMutations('user', ['setLoginUserInfo']),
    // 退出
    logout () {
      this.$confirm('是否退出系统？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        logout().then(res => {
          if (res.status !== 'success') {
            return this.$message.error('退出失败！')
          }
          this.$message.success(res.message)
          removeCookie('token')
          removeCookie('userInfo')
          removeCookie('accountName')
          this.$router.push('/login')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    },
    changePassword () {
      this.changePasswordFlag = true
    },
    // 提交修改密码
    submit () {
      this.$refs.passwordFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请根据提示完善表单信息！')
        }
        const userInfo = JSON.parse(getCookie('userInfo'))
        const data = {
          id: userInfo.id,
          oldPassword: this.passwordForm.oldPassword,
          newPassword: this.passwordForm.newPassword
        }
        changePassword(data).then(res => {
          if (res.status !== 'success') {
            return this.$message.error(res.message)
          }
          this.$message.success('密码更改成功！')
          this.logout()
        })
      })
    },
    // 取消修改密码
    cancel () {
      this.$refs.passwordFormRef.resetFields()
      this.changePasswordFlag = false
    },
    // 打开修改用户信息对话框
    openModifyUserInfoDialog () {
      const {
        id,
        username,
        phoneNumber,
        email
      } = this.loginUserInfo
      this.userForm = {
        id,
        username,
        phoneNumber,
        email
      }
      this.modifyUserInfoDialogFlag = true
    },
    // 关闭修改用户信息对话框
    closeModifyUserInfoDialog () {
      this.$refs.userFormRef.resetFields()
      this.modifyUserInfoDialogFlag = false
    },
    // 提交修改用户信息表单
    submitModifyUserInfo () {
      this.$refs.userFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请根据提示完善表单信息！')
        }
        modifyUserInfo(this.userForm).then(res => {
          if (res.status !== 'success') {
            return this.$message.error(res.message)
          }
          this.setLoginUserInfo(res.data)
          setCookie('userInfo', res.data)
          this.$message.success(res.message)
          this.closeModifyUserInfoDialog()
        })
      })
    },
    // 打开设置头像对话框
    openModifyAvatarDialog () {
      this.modifyAvatarDialogFlag = true
    },
    // 关闭设置头像对话框
    closeModifyAvatarDialog (submitFlag) {
      if (!submitFlag && this.currentAvatar) {
        deleteFileById({ id: this.currentAvatar })
      }
      this.avatarList = []
      this.currentAvatar = ''
      this.modifyAvatarDialogFlag = false
    },
    // 图片格式和大小校验
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 图片上传成功回调
    uploadAvatarSuccess (res) {
      this.currentAvatar = res.data[0].id
    },
    // 上传头像列表删除回调
    uploadAvatarRemove (file) {
      const id = file.response.data[0].id
      deleteFileById({ id }).then(res => {
        if (res.status !== 'success') {
          return this.$message.error(res.message)
        }
        this.currentAvatar = ''
        this.$message.success(res.message)
      })
    },
    // 点击提交设置头像按钮
    submitUploadAvatar () {
      if (!this.currentAvatar) {
        return this.$message.info('请选择头像！')
      }
      if (this.loginUserInfo.avatar) {
        deleteFileById({ id: this.loginUserInfo.avatar }).then(res => {
          this.modifyAvatar()
        })
      } else {
        this.modifyAvatar()
      }
    },
    // 提交设置头像
    modifyAvatar () {
      modifyAvatar({
        id: this.loginUserInfo.id,
        avatar: this.currentAvatar
      }).then(res => {
        if (res.status !== 'success') {
          this.$message.error(res.message)
        }
        this.setLoginUserInfo(res.data)
        setCookie('userInfo', res.data)
        this.$message.success(res.message)
        this.closeModifyAvatarDialog(true)
      })
    }
  }
}
</script>

<style scoped>
a {
  display: inline-block;
  width: 75px;
  text-align: center;
  color: #515a6e;
}

a:hover {
  border-bottom: 1px solid #57a3f3;
}

.login-info {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

</style>
