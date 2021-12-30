<template>
  <div>
    <el-dialog
      :visible="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <span slot="title" class="default-title"
            :class="{'success-title': logDetail.success, 'failure-title': !logDetail.success}">
        日志详情
      </span>
      <div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-row class="log-detail-item">
              <el-col :span="6">用户名：</el-col>
              <el-col :span="18">{{ logDetail.username }}</el-col>
            </el-row>
            <el-row class="log-detail-item">
              <el-col :span="6">登录名：</el-col>
              <el-col :span="18">{{ logDetail.loginName }}</el-col>
            </el-row>
            <el-row class="log-detail-item">
              <el-col :span="6">邮箱：</el-col>
              <el-col :span="18">{{ logDetail.email }}</el-col>
            </el-row>
            <el-row class="log-detail-item">
              <el-col :span="6">手机号码：</el-col>
              <el-col :span="18">{{ logDetail.phoneNumber }}</el-col>
            </el-row>
            <el-row class="log-detail-item">
              <el-col :span="6">创建时间：</el-col>
              <el-col :span="18">{{ logDetail.createTimeStr }}</el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row class="log-detail-item">
              <el-col :span="6">服务名：</el-col>
              <el-col :span="18">{{ logDetail.serviceName }}</el-col>
            </el-row>
            <el-row class="log-detail-item">
              <el-col :span="6">简单类名：</el-col>
              <el-col :span="18">{{ logDetail.simpleClassName }}</el-col>
            </el-row>
            <el-row class="log-detail-item">
              <el-col :span="6">全类名：</el-col>
              <el-col :span="18">{{ logDetail.fullClassName }}</el-col>
            </el-row>
            <el-row class="log-detail-item">
              <el-col :span="6">方法名：</el-col>
              <el-col :span="18">{{ logDetail.methodName }}</el-col>
            </el-row>
            <el-row class="log-detail-item">
              <el-col :span="6">请求URI：</el-col>
              <el-col :span="18">{{ logDetail.requestURI }}</el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-row class="log-detail-item">
          <el-col :span="6">请求数据：</el-col>
          <el-col :span="18">
            <json-view v-if="logDetail.requestData" :value="JSON.parse(logDetail.requestData)" boxed
                       :expand-depth="5"
                       :copyable="{copyText: '复制', copiedText: '已复制'}"
            ></json-view>
          </el-col>
        </el-row>
        <el-row class="log-detail-item">
          <el-col :span="6">响应数据：</el-col>
          <el-col :span="18">
            <json-view v-if="logDetail.responseData" :value="JSON.parse(logDetail.responseData)" boxed
                       :expand-depth="5"
                       :copyable="{copyText: '复制', copiedText: '已复制'}"
            ></json-view>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
  </div>
</template>

<script>
import JsonView from 'vue-json-viewer'

export default {
  name: 'ViewLog',
  components: { JsonView },
  props: {
    dialogVisible: Boolean,
    logDetail: Object
  },
  methods: {
    handleClose () {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style scoped>
.log-detail-item {
  padding: 5px;
}

.default-title {
  display: inline-block;
  width: 100%;
}

.success-title {
  color: #67c23a;
  text-align: center;
}

.failure-title {
  color: #f56c6c;
  text-align: center;
}

</style>
