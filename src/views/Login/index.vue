<template>
  <div class="login-box">
    <div class="login-container">
      <el-form :model="loginFormData" :rules="loginFormRule" ref="loginFormRef" class="login-form">
        <el-form-item prop="loginName">
          <el-input type="text" v-model="loginFormData.loginName" placeholder="请输入账号"
                    prefix-icon="el-icon-user">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginFormData.password" placeholder="请输入密码"
                    @keyup.enter.native="submit" prefix-icon="el-icon-lock">
          </el-input>
        </el-form-item>
        <div class="form-buttons">
          <el-button type="primary" @click="submit">登录</el-button>
          <el-button @click="cancel">清空</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { login } from '@/api/login'
import { setCookie } from '@/utils/util'

export default {
  name: 'Login',
  data () {
    return {
      redirect: '',
      loginFormData: {
        loginName: '',
        password: ''
      },
      loginFormRule: {
        loginName: [
          {
            required: true,
            message: '请输入账号！',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码！',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    this.redirect = this.$route.query.redirect
  },
  methods: {
    ...mapMutations('user', ['setLoginUserInfo']),
    submit () {
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('帐号或密码未填写！')
        }
        login(this.loginFormData).then(res => {
          if (res.status !== 'success') {
            return this.$message.error(res.message)
          }
          // 用户信息
          this.setLoginUserInfo(res.data)
          setCookie('userInfo', JSON.stringify(res.data.userInfo))
          setCookie('accountName', res.data.accountName)
          setCookie('token', res.data.token)
          this.cancel()
          this.$router.push({ path: this.redirect ? this.redirect : '/' })
        })
      })
    },
    cancel () {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style scoped>
.login-box {
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(to bottom right, #4dcfd1, #9708c4);
}

.login-container {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
  height: 40%;
  min-height: 200px;
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
}

.login-container:before {
  content: '';
  z-index: -1;
  filter: blur(20px);
}

.login-form {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
}

.form-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
</style>
