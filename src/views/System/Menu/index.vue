<template>
  <div>
    <el-row :gutter="20">
      <!--菜单树形结构-->
      <el-col :span="10">
        <div style="text-align: center">
          <el-tag style="margin-right: 50px">菜单</el-tag>
          <el-tag type="success">操作</el-tag>
        </div>
        <el-tree
          ref="menuTreeRef"
          :data="menuTree"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :props="defaultProps"
          @node-click="nodeClick">
          <template v-slot="{node}">
            <span v-if="node.data.type === '1'" :class="node.data.icon" style="color: #57a3f3">{{ node.label }}</span>
            <span v-else style="color: #67c23a">{{ node.label }}</span>
          </template>
        </el-tree>
      </el-col>
      <el-col :span="14">
        <el-row>
          <el-col :span="20">
            <div style="text-align: center; margin-bottom: 12px">
              <el-button type="primary" size="small" round
                         icon="el-icon-plus" v-show="this.verify('addSameNode')"
                         @click="addMenu">新增同级节点
              </el-button>
              <el-button type="primary" size="small" round
                         icon="el-icon-plus" v-show="this.verify('addSubNode')"
                         @click="addSubMenu">新增子节点
              </el-button>
              <el-button type="danger" size="small" round
                         icon="el-icon-delete" v-show="this.verify('deleteNode')"
                         @click="deleteNode">删除该节点
              </el-button>
            </div>
            <el-form :model="menuForm" :rules="menuFormRules" ref="menuFormRef" label-width="80px">
              <el-form-item label="父菜单" prop="pTitle">
                <el-input v-model="menuForm.pTitle" disabled></el-input>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-select v-model="menuForm.type">
                  <el-option
                    v-for="item in menuTypeList"
                    :key="item.id"
                    :label="item.text"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="名称" prop="title">
                <el-input v-model="menuForm.title"></el-input>
              </el-form-item>
              <el-form-item label="路径" prop="location">
                <el-input v-model="menuForm.location"></el-input>
              </el-form-item>
              <el-form-item v-if="menuForm.type==='1'" label="图标" :prop="menuForm.type === '1' ? 'icon': ''">
                <e-icon-picker v-model="menuForm.icon"/>
              </el-form-item>
              <el-form-item label="排序" prop="sort">
                <el-input-number style="width: 100%" v-model="menuForm.sort" :step="1" :precision="0" :min="1"
                                 label="请选择节点序号">
                </el-input-number>
              </el-form-item>
              <el-form-item label="启用" prop="enabled">
                <el-switch
                  v-model="menuForm.enabled"
                  active-value="1"
                  inactive-value="0"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-form>
            <div style="text-align: center;margin-top: 12px">
              <el-button type="success" size="small" round icon="el-icon-check" @click="saveMenu">保存</el-button>
              <el-button type="info" size="small" round icon="el-icon-refresh-right" @click="resetMenu">清空</el-button>
            </div>
          </el-col>
          <el-col :span="4">
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getAllMenu, deleteMenuByIdArr, saveMenu, pathIsExist } from '@/api/menu'

export default {
  name: 'Menu',
  data () {
    const validateLocation = async (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入菜单路径！'))
      } else if (value.length > 50) {
        return callback(new Error('菜单路径长度范围为1-50!'))
      } else {
        const res = await pathIsExist(value)
        if (res.status !== 'success') {
          return this.$message.error('菜单路径是否已经存在校验失败！')
        }
        if (res.data) {
          callback(new Error('菜单路径已经存在，请更改！'))
        }
        callback()
      }
    }
    return {
      // 菜单树
      menuTree: [],
      // 当前点击节点
      currentClickMenu: {},
      defaultProps: {
        children: 'children',
        label (node) {
          return node.title
        }
      },
      // 菜单类型列表
      menuTypeList: [
        {
          id: '1',
          text: '菜单'
        }
      ],
      // 菜单表单
      menuForm: {
        pTitle: '',
        parentId: 0,
        title: '',
        location: '',
        icon: '',
        sort: 0,
        enabled: '1',
        type: '1'
      },
      // 菜单表单校验规则
      menuFormRules: {
        title: [
          {
            required: true,
            message: '请输入菜单名称！',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '菜单名称长度范围为1-20',
            trigger: 'blur'
          }
        ],
        location: [
          {
            validator: validateLocation,
            trigger: 'blur'
          }
        ],
        icon: [
          {
            required: true,
            message: '请选择图标！',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 40,
            message: '菜单路径长度范围为1-40',
            trigger: 'blur'
          }
        ],
        sort: [
          {
            required: true,
            message: '请选择序号！',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    // 初始化的时候获取菜单Tree
    this.getMenuTree()
  },
  computed: {},
  methods: {
    // 获取菜单节点
    getMenuTree () {
      getAllMenu().then(res => {
        if (res.status !== 'success') {
          this.$message.error(res.message)
        }
        this.menuTree = res.data
        // 设置menuForm的初始化排序
        this.menuForm.sort = this.menuTree.length + 1
      })
    },
    // 获取点击节点
    nodeClick (menu) {
      this.$refs.menuFormRef.resetFields()
      this.menuForm = {}
      // 拷贝选中节点
      this.currentClickMenu = JSON.parse(JSON.stringify(menu))
      if (this.currentClickMenu.parentId !== 0) {
        const parentMenuNode = this.$refs.menuTreeRef.getNode(this.currentClickMenu.parentId)
        this.$set(this.currentClickMenu, 'pTitle', parentMenuNode.label)
        this.menuTypeList = [
          {
            id: '1',
            text: '菜单'
          },
          {
            id: '2',
            text: '操作'
          }
        ]
      } else {
        this.menuTypeList = [
          {
            id: '1',
            text: '菜单'
          }
        ]
      }
      this.menuForm = this.currentClickMenu
    },
    // 新增同级节点
    addMenu () {
      if (JSON.stringify(this.currentClickMenu) === '{}' || this.currentClickMenu.parentId === 0) {
        this.menuForm = {}
        this.menuTypeList = [
          {
            id: '1',
            text: '菜单'
          }
        ]
        this.$set(this.menuForm, 'parentId', 0)
        this.$set(this.menuForm, 'type', '1')
      } else {
        this.menuForm = {}
        this.menuTypeList = [
          {
            id: '1',
            text: '菜单'
          },
          {
            id: '2',
            text: '操作'
          }
        ]
        this.$set(this.menuForm, 'parentId', this.currentClickMenu.parentId)
        this.$set(this.menuForm, 'pTitle', this.currentClickMenu.pTitle)
        this.$set(this.menuForm, 'type', this.currentClickMenu.type)
      }
      const parentMenuNode = this.$refs.menuTreeRef.getNode(this.currentClickMenu.parentId)
      this.$set(this.menuForm, 'sort', parentMenuNode ? parentMenuNode.childNodes.length + 1 : this.menuTree.length + 1)
      this.$set(this.menuForm, 'enabled', '1')
    },
    // 新增子节点
    addSubMenu () {
      if (JSON.stringify(this.currentClickMenu) === '{}') {
        this.menuForm = {}
        this.menuTypeList = [
          {
            id: '1',
            text: '菜单'
          }
        ]
        this.$set(this.menuForm, 'parentId', 0)
      } else {
        if (this.currentClickMenu.type === '2') {
          return this.$message.info('操作权限不可增加子节点！')
        }
        this.menuForm = {}
        this.menuTypeList = [
          {
            id: '1',
            text: '菜单'
          },
          {
            id: '2',
            text: '操作'
          }
        ]
        this.$set(this.menuForm, 'parentId', this.currentClickMenu.id)
        this.$set(this.menuForm, 'pTitle', this.currentClickMenu.title)
      }
      this.$set(this.menuForm, 'sort', this.currentClickMenu.children ? this.currentClickMenu.children.length + 1 : this.menuTree.length + 1)
      this.$set(this.menuForm, 'type', '1')
      this.$set(this.menuForm, 'enabled', '1')
    },
    // 删除节点
    deleteNode () {
      if (JSON.stringify(this.currentClickMenu) === '{}') {
        return this.$message.info('请选择想要删除的权限！')
      }
      if (this.currentClickMenu.children.length > 0) {
        this.$confirm('<span style="color: red">此权限下存在子权限，如果继续执行将删除此权限和所有子权限，是否继续执行删除操作？</span>', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(() => {
          const idArr = []
          this.getIds(idArr, this.currentClickMenu)
          this.deleteMenuByIdArr(idArr)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$confirm('是否删除此权限？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const idArr = []
          idArr.push(this.currentClickMenu.id)
          this.deleteMenuByIdArr(idArr)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 根据id删除菜单
    deleteMenuByIdArr (idArr) {
      deleteMenuByIdArr({ idArr }).then(res => {
        if (res.status !== 'success') {
          return this.$message.error(res.message)
        }
        this.menuTree = res.data
        this.resetMenu()
        this.$message.success('删除权限成功！')
      })
    },
    // 获取当前节点和子节点id
    getIds (idArr, node) {
      idArr.push(node.id)
      node.children.forEach(subNode => this.getIds(idArr, subNode))
    },
    // 保存菜单
    saveMenu () {
      this.$refs.menuFormRef.validate(valid => {
        if (!valid) {
          return this.$message.error('根据提示完善表单！')
        }
        saveMenu(this.menuForm).then(res => {
          if (res.status !== 'success') {
            return this.$message.error(res.message)
          }
          this.menuTree = res.data
          this.$message.success('保存权限成功！')
        })
      })
    },
    // 重置
    resetMenu () {
      this.$refs.menuFormRef.resetFields()
      this.menuForm = {}
      this.$set(this.menuForm, 'sort', 1)
      this.$set(this.menuForm, 'enabled', '1')
      this.currentClickMenu = {}
      this.menuTypeList = [
        {
          id: '1',
          text: '菜单'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
