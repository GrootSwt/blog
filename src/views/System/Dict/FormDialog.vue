<template>
  <div>
    <el-dialog
      :title="title"
      :visible="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="类别名称" prop="categoryName">
              <el-input v-model="form.categoryName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="key" prop="categoryKey">
              <el-input v-model="form.categoryKey"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" round icon="el-icon-circle-close" @click="handleClose">取消</el-button>
        <el-button size="mini" round icon="el-icon-circle-check" type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { saveDictionaryCategory } from '@/api/dict'

export default {
  name: 'FormDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      form: {},
      formRules: {
        categoryName: [
          {
            required: true,
            message: '请输入类别名称！',
            trigger: 'blur'
          }
        ],
        categoryKey: [
          {
            required: true,
            message: 'key！',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    formData (n) {
      this.form = n
    }
  },
  methods: {
    handleClose () {
      this.$refs.formRef.resetFields()
      this.$emit('close')
    },
    handleSubmit () {
      this.$refs.formRef.validate(valid => {
        if (!valid) {
          return this.$message.error('请根据表单提示完善表单内容！')
        }
        if (!this.form.id) {
          this.form.enabled = '1'
        }
        saveDictionaryCategory(this.form).then(res => {
          if (res.status !== 'success') {
            return this.$message.error(res.message)
          }
          this.$emit('afterSubmit')
          this.$refs.formRef.resetFields()
          this.$message.success(res.message)
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
