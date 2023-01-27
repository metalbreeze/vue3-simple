<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const dialogVisible = ref(true)

const router = useRouter()

const emit = defineEmits(['home-refresh-event'])

const username = ref('')
const usernameZh = ref('')
const password = ref('')
const  token  = ref('')

const logout = () => {
    username.value=''
    password.value=''
    usernameZh.value=''
    token.value=''
    localStorage.setItem('user', '')
    localStorage.setItem('token', '')
    router.push('/')
    dialogVisible.value=true
    axios.defaults.headers.common['Authorization'] = ''
    //emit('home-refresh-event')
    console.log('button force rerender')
}
const login = () => {
    console.log('trigger login')
    axios
      .post('./jsondata/login', {
        username: username,
        password: password
     })
      .then(response => {
        if (response.data.code=='1') {
          usernameZh.value=response.data.data.userTable.name
          localStorage.setItem('user',usernameZh.value)
          localStorage.setItem('token', response.data.data.token)
          console.log('local storage saved token:'+response.data.data.token)
          //https://stackoverflow.com/questions/44245588/how-to-send-authorization-header-with-axios
          axios.defaults.headers.common['Authorization'] = response.data.data.token 
          dialogVisible.value=false
        }
      })

//    emit('home-refresh-event') 
//    router.push('/')
}
</script>

<template>
  <el-row>
    <el-col :span="6">
       <div class="grid-content ep-bg-purple">welcome 
          {{ usernameZh }}</div></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple-light" /></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple-light" >
      <el-button type="primary" @click="logout" > logout </el-button>
      </div>
    </el-col>
  </el-row>

<el-dialog
    v-model="dialogVisible"
    title="Login"
    width="30%"
  >
  <el-input v-model=username placeholder="Please input username  e.g: 111" />
  <el-input
    v-model=password
    type="password"
    placeholder="Please input password e.g:111"
    show-password
  />
    <span> please login </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="login"> login </el-button>
      </span>
    </template>
  </el-dialog>

</template>


<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
