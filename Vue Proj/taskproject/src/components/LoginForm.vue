<template>
<div  class="main-container" v-if="$route.name === 'login'">
<h3>Student Information System</h3>
<el-form v-if="showLoginForm" :model="ruleForm" status-icon :rules="rules" ref="form"  class="demo-ruleForm">
  <el-form-item label="Username" prop="username">
  <el-input v-model="ruleForm.username"></el-input>
</el-form-item>
  <el-form-item label="Password" prop="pass">
    <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item checkbox="Remember Me" prop="remember">
     <el-checkbox >Remember Me</el-checkbox>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm(ruleForm)">Log In</el-button>
  </el-form-item>
</el-form>
</div>
<router-view v-else/>
</template>
<script>
  export default {
    data() {
      return {
        showLoginForm: true,
        showStudentTable: false,
        ruleForm: {
          pass: '',
          username: ''
        },
        rules: {
          pass: [
             {
            required: true,
            message: 'Password is required',
            trigger: "change",
          },
          ],
          username: [
            {
            required: true,
            message: 'Username is required',
            trigger: "change",
          },
          ],
          
        }
      };
    },

    methods: {
    submitForm() {
      this.$refs['form'].validate((valid) => {
            console.log('testSubmit', valid)
          if (valid) {
            this.showLoginForm = false;
            this.showStudentTable = true;
            this.goToStudentList()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    goToStudentList() {
      console.log('test')
      this.$router.push({ name: 'students', params: { showStudentTable: true } });
      }
    },
  }
</script>
<style lang="scss" scoped>
.main-container{
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-self: center;
  margin-top: 30px;
  border: 1px solid black;
  padding: 50px;
}
:deep(){
  .el-form-item__content{
    display: flex;
    justify-content: center;
  }
}
</style>