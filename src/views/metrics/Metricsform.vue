<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="mini" class="demo-ruleForm">
      <el-row :gutter="0"> <!-- 设置列间距 -->
        <el-col :span="6">
          <el-form-item label="编号:" prop="indId">
            <el-input v-model="ruleForm.indId" class="black-input">
              <el-button slot="append" type="warning" icon="el-icon-star-off"
                         style="background-color: grey ; color: white" @click="openDialog">备注
              </el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="名称:" prop="indName">
            <el-input v-model="ruleForm.indName" class="black-input">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="0">
        <el-col :span="12">
          <el-form-item label="类型:" prop="modelName">
            <el-checkbox-group v-model="ruleForm.modelName" class="black-checkbox-group">
              <el-checkbox
                  v-for="item in activityTypes"
                  :key="item.label"
                  :label="item.label"
                  :name="item.label"
                  class="black-checkbox">
                {{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="10">
            <span style="color: red">
           {{ form2.remarkType.filter(item => item).join(', ') }}
            </span>
        </el-col>

      </el-row>

    </el-form>


    <el-dialog
           :title="ruleForm.indName"
        :visible.sync="dialogVisible"
        width="60%"
        @close="handleClose"
        :modal="false"
        :close-on-click-modal="false"
          class="custom-dialog"
             :style="{ 'height': '100vh' }"
    :top="'0px'">





      <!-- 表单 222222-->
      <el-form ref="form2" :model="form2" label-width="80px" :rules="rules2">
        <el-form-item label="问题类型" prop="remarkType">

          <!--          <el-checkbox-group v-model="form2.type">-->
          <!--            <el-checkbox label="美食/餐厅线上活动"></el-checkbox>-->
          <!--            <el-checkbox label="地推活动"></el-checkbox>-->
          <!--            <el-checkbox label="线下主题活动"></el-checkbox>-->
          <!--            <el-checkbox label="单纯品牌曝光"></el-checkbox>-->
          <!--          </el-checkbox-group>-->


          <el-checkbox-group v-model="form2.remarkType" class="black-checkbox-group">
            <el-checkbox
                v-for="item in remarkTypeALL"
                :key="item"
                :label="item"
                :name="item"
                class="black-checkbox">
              {{ item }}
            </el-checkbox>
          </el-checkbox-group>

        </el-form-item>

<!--        <el-form-item label="问题描述与方案" prop="remark">-->
<!--          <el-input-->
<!--              type="textarea"-->
<!--              v-model="form2.remark"-->
<!--              :rows="16"-->
<!--              style="resize: none; width: 100%; font-size: 15px; line-height: 1.2;"-->
<!--              placeholder="请输入详细的问题描述与解决方案"-->
<!--          />-->
<!--        </el-form-item>-->

      </el-form>

  <el-button-group >
    <el-button   type="info"  size="mini"  @click="onSubmit2">保存备注</el-button>
     <el-button type="info" size="mini" @click="resetRemark">重置</el-button>
    <el-button  type="danger"  size="mini" @click="deleteRemark">删除</el-button>

  </el-button-group>




       <QuillEditor ref="quillEditor" v-model="form2.remark" />

    </el-dialog>

  </div>


</template>

<script>

import {EventBus} from "@/utils/eventBus/event-bus";

import {getMetricsTypeData, getMetricsRemarkByIndId, updateMetricsRemark,deleteRemarkByIndId} from "@/api/metricsServer/metricsAPI"
import {mapState} from "vuex";
import QuillEditor from '@/components/QuillEditor.vue';
export default {
    components: {
    QuillEditor,
  },
  props: {
    dataForm: {
      type: Object,
      default: () => ({}),
      required: true, // 如果 Data 是必需的，可以加上 required
    },
  },

  mounted() {
    // console.log('dataForm',this.dataForm)
    // console.log('ruleForm',this.ruleForm)
    this.fetchMetricsTypeData();
    this.getMetricsRemarkByIndId()
  },

  data() {
    return {
      ruleForm: JSON.parse(JSON.stringify(this.dataForm)),
      activityTypes: [],
      rules: {
        indId: [
          {required: true, message: '请输入指标编号', trigger: 'blur'},
          {min: 1, max: 20, message: '指标与sql对应', trigger: 'blur'}
        ],

        indName: [
          {required: true, message: '请输入指标名称', trigger: 'blur'},
          {min: 1, max: 500, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],

        modelName: [
          {type: 'array', required: true, message: '请至少选择一个指标类型', trigger: 'change'}
        ],
      },


      dialogVisible: false, // 控制对话框显示与隐藏
      form2: {
        remarkType: [],  // 活动性质
        remark: '', // 活动形式
        ifsql: false,
      },
      rules2: {
        remarkType: [
          {required: true, message: '请选择备注类型', trigger: 'change'}
        ],
        remark: [
          {required: true, message: '请输入内容', trigger: 'blur'}
        ]
      },


      remarkTypeALL:[],
    //   ['缺表/字段', '数据库设计缺陷', '编号错误（不对应/缺失等）', '逻辑不明', '技术型（过于复杂/sql语言无法统计）', '需NPL处理（AI）', '医院未提供接口数据', '医院无该业务', '医院特定逻辑', '其他']




    };
  },

  methods: {
    fetchMetricsTypeData() {
      getMetricsTypeData().then(response => {
        //   console.log('获取指标类型数据',response);
        // 将后端返回的字符串数组映射为对象数组
        this.activityTypes = response.data.data.map(label => ({label}));
        //  this.ruleForm.modelName = this.ruleForm.modelName.map(name => name.replace(/\s+/g, '')); //去掉空格 删除 让后端去掉
      }).catch(error => {
        console.error('获取指标类型数据失败:', error);
      });
    },


    resetForm() {
      //  console.log("====ffffffff====")
    },


    // 关闭对话框时的处理
    handleClose() {

      console.log('对话框已关闭');
    },
    // 打开对话框
    async openDialog() {
      if (!this.ruleForm.indName || this.ruleForm.indName.trim() === '') {
        this.$message.error('指标名不能为空: ');
        return;
      }
      if (!this.ruleForm.indId || this.ruleForm.indId.trim() === '') {
        this.$message.error('指标编号不能为空: ');
        return;
      }
      if (this.ruleForm.modelName.length === 0) {
        this.$message.error('指标类型不能为空: ');
        return;
      }
      await this.getMetricsRemarkByIndId()
      this.dialogVisible = true;
    },

    async getMetricsRemarkByIndId() {
      let canshu = {
        indId: this.ruleForm.indId
      }
      const response = await getMetricsRemarkByIndId(canshu);
      if (response.data.code === 200) {
      // 如果没有返回 remark 字段，使用默认值 ''
     this.form2.remark = response.data.data?.remark ?? '';
     this.$nextTick(() => {
  if (this.$refs.quillEditor) {
    this.$refs.quillEditor.setContent(this.form2.remark);
  }
});


  // remarkTypeALL 是数组，如果没有返回，使用空数组作为默认值
  this.remarkTypeALL = Array.isArray(response.data.data?.remarkTypeALL)
    ? response.data.data.remarkTypeALL
    : [];
    //   remarkType 是数组，且未返回，使用空数组作为默认值
       this.form2.remarkType = Array.isArray(response.data.data?.remarkType) ? response.data.data.remarkType : [];
      }else {
          await this.$alert('数据加载失败，请重试。', '错误', {
            type: 'error',
            confirmButtonText: '确定',
          });
      }

    },


    // 提交表单
    onSubmit2() {
      this.$refs.form2.validate(async (valid) => {
        if (valid) {
          // 表单验证通过
          console.log('表单提交数据:', this.form2);
          let canshu = {
            indId: this.ruleForm.indId,
            remarkType: this.form2.remarkType,
            indName: this.ruleForm.indName,
            remark: this.form2.remark,
            author:this.user,
          }
          const response = await updateMetricsRemark(canshu);
          if (response.data.code === 200){
        await this.$alert('保存成功。', {type: 'success', confirmButtonText: '确定',});
          }else
          {
        await this.$alert('数据保存失败。'+response.data.message, '错误', {
      type: 'error',
      confirmButtonText: '确定',
    });
          }

          //   this.closeDialog2(); // 提交后关闭对话框
        } else {
          console.log('保存失败');
          return false;
        }
      });
    },
    // 取消按钮，关闭对话框
    resetRemark() {

      this.getMetricsRemarkByIndId()
   //   this.dialogVisible = false;
      //  this.$refs.form2.resetFields(); // 重置表单数据
    },

  deleteRemark() {
  let canshu = {
    indId: this.ruleForm.indId,
  };
  // 使用 this.$alert 弹窗提醒
  this.$alert('您确定要删除该备注吗？', '删除确认', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    showCancelButton: true,
  })
  .then(async () => {
       this.form2.remarkType=[];
    // 用户点击 "确定" 后执行删除操作
    await deleteRemarkByIndId(canshu);

    this.dialogVisible = false;

      this.$message({
          message: '删除成功',
          type: 'warning'
        });
  })
  .catch(() => {
    // 用户点击 "取消" 后可以做一些取消操作，或者不执行任何操作
    console.log('删除操作已取消');
  });
},


  },
  watch: {
    ruleForm: {
      handler(newValue) {
        //   console.log("this.ruleForm.modelName",this.ruleForm.modelName)
        //  console.log("this.ruleForm.modelName",this.ruleForm.modelName)
        EventBus.$emit('updateMetricsRuleForm', newValue); // 触发事件

      },
      deep: true, // 深度监听对象的变化
    }
  },

   computed: {
    // paginatedData() {
    //   const start = (this.currentPage - 1) * this.pageSize;
    //   const end = start + this.pageSize;
    //   return this.resultData.slice(start, end);
    // },
    ...mapState({
      user: state => state.user.user
    })
  },


};
</script>

<style scoped>
/* 深度作用到 el-input 的内部样式，修改边框颜色 */
::v-deep .black-input .el-input__inner {
  border: none; /* 移除所有边框 */
  border-bottom: 0.1px solid lightslategray; /* 添加黑色底线 */
  box-shadow: none; /* 移除阴影 */
  font-size: 15px; /* 文字大小变为 18px */
  font-weight: bolder;
}

/* 设置输入框中的文字大小 */
::v-deep .black-input .el-input__inner::placeholder {
  font-size: 15px; /* placeholder 的字体大小也变为 18px */
}

/* 使复选框在选中时的边框和背景变为黑色，字体为白色 */
::v-deep .black-checkbox-group .el-checkbox__label {
  color: #000; /* 设置未选中时的字体颜色为黑色 */
}

::v-deep .black-checkbox .el-checkbox__input.is-checked + .el-checkbox__label {
  background-color: #b54334; /* 设置选中时的背景颜色为黑色 */
  color: #fff; /* 设置选中时的字体颜色为白色 */
}

/* 调整复选框的圆形背景颜色 */
::v-deep .black-checkbox .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #b54334; /* 选中时复选框的背景颜色 */
  border-color: #b54334; /* 选中时复选框的边框颜色 */
}

/* 鼠标悬停时的样式 */
::v-deep .black-checkbox .el-checkbox__input:hover .el-checkbox__inner {
  border-color: grey; /* 鼠标悬停时复选框的边框颜色 */
}


.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin: 0; /* 确保没有外边距 */
}



.custom-dialog ::v-deep .el-dialog__header,
.custom-dialog ::v-deep .el-dialog__title {
  background-color: #eaebe6;
}

.custom-dialog ::v-deep .el-dialog__body {
  background-color: #eaebe6;
}
</style>
