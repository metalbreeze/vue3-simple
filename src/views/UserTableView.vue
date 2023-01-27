<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage,ElMessageBox } from 'element-plus'
import axios from 'axios'

const dialogVisible = ref(true)

const router = useRouter()

const emit = defineEmits(['home-refresh-event'])

const username = ref('')
const usernameZh = ref('')
const password = ref('')
const  token  = ref('')


            const blobImgUrl = ref('')
            const dataList = reactive({value:[]})//当前页要展示的列表数据
            const dialogFormVisible = ref(false)//添加表单是否可见
            const dialogFormVisible4Edit = ref(false)//编辑表单是否可见
            const formData  = reactive({
              id:0,
              org_id:0,
              name_zh:'',
              user:'',
              password:'',
              authority:'',
              birthday:'',
              gender:'',
              relation:'',
              school:'',
              course:'',
              remember:'',
              photo:''
            })//表单数据
            const rules = reactive( {//校验规则
                /*name:[
                    {required:true,message:'请输入用户姓名',trigger:'blur'},
                    {min:3,max:5,message: '长度在3到5个字符',trigger: 'blur'}
                ],
                password:[
                    {required: true,message:'请输入密码',trigger:'change'}
                ]*/
                org_id:[{required:true,message:'机构编号为必填项',trigger: 'blur'}],
                name: [{ required: true, message: '首次登录时间为必填项', trigger: 'blur' }],
                user:[{required:true,message:'使用者为必填项',trigger: 'blur'}],
                password: [{ required: true, message: '密码为必填项', trigger: 'blur' }]
            })
            const pagination = reactive( {//分页相关模型数据
                currentPage: 1,//当前页码
                pageSize:10,//每页显示的记录数
                total:0,//总记录数
                id: "",
                org_id: "",
                name: "",
                user: "",
                password: "",
                authority: "",
                birthday: "",
                gender: "",
                relation: "",
                school: "",
                course: "",
                remember: "",
                photo: ""
            })

getAll()

            //重置列表
          function reset() {
                pagination.id = "";
                pagination.org_id = "";
                pagination.name = "";
                pagination.user = "";
                pagination.password = "";
                pagination.authority = "";
                pagination.birthday = "";
                pagination.gender = "";
                pagination.relation = "";
                pagination.school = "";
                pagination.course = "";
                pagination.remember = "";
                pagination.photo = "";
                getAll();
            }
            //分页查询
          function getAll() {
                //组织参数，拼接url请求地址
                // console.log(pagination.type);
                var param = "?id="+pagination.id;
                param +="&org_id="+pagination.org_id;
                param +="&name="+pagination.name;

                //console.log(param);

                //发送异步请求
                //axios.get("/xwl/userTab/getList/"+pagination.currentPage+"/"+pagination.pageSize+param).then((res)=>{
                axios.get("/jsondata/getUserTable.json").then((res)=>{
                    // console.log(res.data.data.userTabList)
                    pagination.pageSize = res.data.data.size;
                    pagination.currentPage = res.data.data.current;
                    pagination.total = res.data.data.total;

                    //dataList = res.data.data.macDataTimeList;
                    dataList.value = res.data.data.userTabList;
                    let blobData = res.data.data.userTabList[0];

                    // let blob2 = new Blob([blobData.photo]);   // 返回的文件流数据
                    // console.log(window.URL.createObjectURL(blob2))
                    let  basePhoto =btoa(blobData.photo)
                    blobImgUrl.value = basePhoto

                });
            }
            //切换页码
            function handleCurrentChange(currentPage) {
                //修改页码值为当前选中的页码值
                pagination.currentPage = currentPage;
                //执行查询
                getAll();
            }

            //弹出添加窗口
            function handleCreate() {
                dialogFormVisible.value = true;
                resetForm();
            }

            //重置表单
            function resetForm() {
             formData.id=0,
             formData.org_id=0,
             formData.name_zh='',
             formData.user='',
             formData.password='',
             formData.authority='',
             formData.birthday='',
             formData.gender='',
             formData.relation='',
             formData.school='',
             formData.course='',
             formData.remember='',
             formData.photo=''
              }

            //添加
            function handleAdd () {
                axios.post("/xwl/userTab/create",formData).then((res)=>{
                    //判断当前操作是否成功
                    if(res.data.code == 0){
                        //1.关闭弹层
                        dialogFormVisible.value = false;
                        ElMessage.success(res.data.msg);

                    }else{
                        ElMessage.error(res.data.msg);
                    }
                }).finally(()=>{
                    //2.重新加载数据
                    getAll();
                });
            }

            //取消
            function cancel(){
                dialogFormVisible.value = false;
                dialogFormVisible4Edit.value = false;
                ElMessage.info("当前操作取消");
            }

            // 删除
            function handleDelete(row) {

              ElMessageBox.confirm("此操作永久删除当前信息，是否继续？","提示",{type:"info"}).then(()=>{
                    axios.delete("/xwl/userTab/delUserTab/" + row.id)
                        .then((res)=>{
                            if(res.data.code=='1'){
                                ElMessage.success("删除成功");
                            }else{
                                ElMessage.error("数据同步失败，自动刷新");
                            }
                        }).finally(()=>{
                        //2.重新加载数据
                        getAll();
                    });
                }).catch(()=>{
                    ElMessage.info("取消操作");
                });
            }

            //弹出编辑窗口
            function handleUpdate(row) {
                axios.get("/xwl/userTab/edit/" + row.id).then((res)=>{
                    dialogFormVisible4Edit.value = true;
                    console.log(res.data.code)
                    if(res.data.code=='2' && res.data.data != null ){
                        /*dialogFormVisible4Edit = true;*/
                        formData.id=res.data.data.id;
                        formData.org_id=res.data.data.org_id;
                        formData.name_zh=res.data.data.name;
                        formData.user=res.data.data.user;
                        formData.password=res.data.data.password;
                        formData.authority=res.data.data.authority;
                        formData.birthday=res.data.data.birthday;
                        formData.gender=res.data.data.gender;
                        formData.relation=res.data.data.relation;
                        formData.school=res.data.data.school;
                        formData.course=res.data.data.course;
                        formData.remember=res.data.data.remember;
                        formData.photo=res.data.data.photo;
                    }else{
                        ElMessage.error("数据同步失败，自动刷新");
                    }
                }).finally(()=>{
                    //2.重新加载数据
                    getAll();
                });
            }

            //修改
            function handleEdit() {
                axios.put("/xwl/userTab/edit2", JSON.stringify({
                    id: formData.id,
                    org_id: formData.org_id,
                    name: formData.name_zh,
                    user: formData.user,
                    password: formData.password,
                    authority: formData.authority,
                    birthday: formData.birthday,
                    gender: formData.gender,
                    relation: formData.relation,
                    school: formData.school,
                    course: formData.course,
                    remember: formData.remember,
                    photo: formData.photo
                })).then((res)=>{
                    //判断当前操作是否成功
                    if(res.data.code == '3'){
                        //1.关闭弹层
                        dialogFormVisible4Edit.value = false;
                        ElMessage.success("修改成功");
                    }else{
                        ElMessage.error("修改失败");
                    }
                }).finally(()=>{
                    //2.重新加载数据
                    getAll();
                });
            }
</script>

<template>

<div id="app">

<div class="content-header">

    <h1>用户信息管理</h1>

</div>

<div class="app-container">

    <div class="box">

        <div class="filter-container">
            <el-input placeholder="用户编号" v-model="pagination.id" style="width: 200px;" class="filter-item"></el-input>
            <el-input placeholder="机构编号" v-model="pagination.org_id" style="width: 200px;" class="filter-item"></el-input>
            <!--<el-input placeholder="首次登陆时间" v-model="pagination.first_datetime" style="width: 200px;" class="filter-item"></el-input>-->
            <el-input placeholder="用户姓名" v-model="pagination.name" style="width: 220px;" class="filter-item"></el-input>


            <el-button @click="getAll()" class="dalfBut">查询</el-button>
            <el-button type="primary" class="butT" @click="handleCreate()">新建</el-button>

            <el-button @click="reset()" type="success">显示所有用户信息</el-button>
        </div>

        <el-table  size="small" current-row-key="id" :data=dataList.value stripe highlight-current-row>

            <el-table-column prop="id" label="用户id" align="center"></el-table-column>
            <el-table-column prop="org_id" label="机构编号" align="center"></el-table-column>
            <el-table-column prop="name" label="用户姓名" align="center"></el-table-column>
            <el-table-column prop="user" label="使用者" align="center"></el-table-column>
            <el-table-column prop="password" label="密码" align="center"></el-table-column>
            <el-table-column prop="authority" label="权限类别" align="center"></el-table-column>
            <el-table-column prop="birthday" label="生日" align="center"></el-table-column>
            <el-table-column prop="gender" label="性别" align="center"></el-table-column>
            <el-table-column prop="relation" label="亲属关系" align="center"></el-table-column>
            <el-table-column prop="school" label="学校" align="center"></el-table-column>
            <el-table-column prop="course" label="课程" align="center"></el-table-column>
            <el-table-column prop="remember" label="备注" align="center"></el-table-column>
            <el-table-column label="照片" align="center">
              <template #default="scope">
                <a :href="'/xwl/userTab/getImgById?id=' + scope.row.id" target="_blank" >
                    <img :src="'/hamburger.png?id=' + scope.row.id" border="0" width="30" />
                </a>
              </template>
            </el-table-column>         
            <el-table-column label="操作" align="center" width="160">

              <template #default="scope">

                    <el-button  type="primary" size="small" @click="handleUpdate(scope.row)">编辑</el-button>

                    <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>

                </template>

            </el-table-column>

        </el-table>

        <!--分页组件-->
        <div class="pagination-container">

            <el-pagination
                    class="pagiantion"

                    @current-change="handleCurrentChange"

                    :current-page="pagination.currentPage"

                    :page-size="pagination.pageSize"

                    layout="total, prev, pager, next, jumper"

                    :total="pagination.total">

            </el-pagination>

        </div>





        <!-- 新增标签弹层 -->

        <div class="add-form">

            <el-dialog title="新增用户信息" :visible.sync="dialogFormVisible">

                <el-form  ref="dataAddForm" :model="formData" :rules="rules" label-position="right" label-width="150px">

                    <el-row>

                        <el-col :span="15">
                            <el-form-item label="机构编号" prop="org_id" >
                                <el-input v-model="formData.org_id"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="15">
                            <el-form-item label="用户姓名" prop="name" >
                                <el-input v-model="formData.name_zh"/>
                            </el-form-item>
                        </el-col>


                        <el-col :span="15">
                            <el-form-item label="使用者" prop="user" >
                                <el-input v-model="formData.user"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="15">
                            <el-form-item   label="密码" prop="password" >
                                <el-input v-model="formData.password"  type="password" placeholder="请输入密码" show-password/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="15">
                            <el-form-item label="权限类别" prop="authority">
                                <el-input v-model="formData.authority"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="15">
                            <el-form-item label="生日" prop="birthday">
                                <el-input v-model="formData.birthday"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="15">
                            <el-form-item label="性别" prop="gender">
                                <el-input v-model="formData.gender"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="15">
                            <el-form-item label="亲属关系" prop="relation">
                                <el-input v-model="formData.relation"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="15">
                            <el-form-item label="学校" prop="school">
                                <el-input v-model="formData.school"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="15">
                            <el-form-item label="课程" prop="course">
                                <el-input v-model="formData.course"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="15">
                            <el-form-item label="备注" prop="remember">
                                <el-input v-model="formData.remember"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="15">
                            <el-form-item label="照片" prop="photo">
                                <el-input v-model="formData.photo"/>
                            </el-form-item>
                        </el-col>

                    </el-row>


                </el-form>

                <div slot="footer" class="dialog-footer">

                    <el-button @click="cancel()">取消</el-button>

                    <el-button type="primary" @click="handleAdd()">确定</el-button>

                </div>

            </el-dialog>

        </div>

<!--            <img :src="'data:image/png;base64,' + blobImgUrl" />-->

        <!-- 编辑标签弹层 -->

        <div class="add-form">

            <el-dialog title="修改用户信息" :visible.sync="dialogFormVisible4Edit">

                <el-form ref="dataEditForm" :model="formData" :rules="rules" label-position="right" label-width="150px">

                    <el-row>


                        <el-col :span="15">
                            <el-form-item label="用户编号" prop="id">
                                <el-input v-model="formData.id" disabled/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="15">
                            <el-form-item label="机构编号" prop="org_id" >
                                <el-input v-model="formData.org_id"/>
                            </el-form-item>

                            <el-form-item label="用户姓名" prop="name" >
                                <el-input v-model="formData.name_zh"/>
                            </el-form-item>
                        </el-col>


                        <el-col :span="15">
                            <el-form-item label="使用者" prop="user" >
                                <el-input v-model="formData.user"/>
                            </el-form-item>

                        </el-col>

                        <el-col :span="15">
                            <el-form-item type="password"  label="密码" prop="password" >
                                <el-input v-model="formData.password"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="15">
                            <el-form-item label="权限类别" prop="authority">
                                <el-input v-model="formData.authority"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="15">
                            <el-form-item label="生日" prop="birthday">
                                <el-input v-model="formData.birthday"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="15">
                            <el-form-item label="性别" prop="gender">
                                <el-input v-model="formData.gender"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="15">
                            <el-form-item label="亲属关系" prop="relation">
                                <el-input v-model="formData.relation"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="15">
                            <el-form-item label="学校" prop="school">
                                <el-input v-model="formData.school"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="15">
                            <el-form-item label="课程" prop="course">
                                <el-input v-model="formData.course"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="15">
                            <el-form-item label="备注" prop="remember">
                                <el-input v-model="formData.remember"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="15">
                            <el-form-item label="照片" prop="photo">
                                <el-input v-model="formData.photo"/>
                            </el-form-item>
                        </el-col>

                    </el-row>


                </el-form>

                <div slot="footer" class="dialog-footer">

                    <el-button @click="cancel()">取消</el-button>

                    <el-button type="primary" @click="handleEdit()">确定</el-button>

                </div>

            </el-dialog>

        </div>

    </div>

</div>

</div>

</template>


<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
