<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, reactive } from 'vue'
import Title from './components/Title.vue'

const token = ref('')
token.value=localStorage.getItem('token')
 
const username = ref('')
username.value = localStorage.getItem('user')

var i = 0
console.log("app vue setup "+token.value+"--"+username.value)

const helloWorldKey = ref(0)

const forceRerender = () => {
  console.log('forceRerender call in app.vue :'+i++)
  helloWorldKey.value ++ 
}
//// https://michaelnthiessen.com/force-re-render/  how to refresh
</script>

<template>
  <header>
    <div class="wrapper" style="height:10%">
      <Title @home-refresh-event='forceRerender'   
       :key="helloWorldKey"/>
    </div>
  </header>
<el-container  style="height:90%">
  <el-aside width="100px">
    <el-menu   :router="true">
	     <el-menu-item index="/">
                homeView
	     </el-menu-item>
	     <el-menu-item index="/userTable">
                UserTable
	     </el-menu-item>
	     <el-menu-item index="/about">
		About
	     </el-menu-item>
   </el-menu>
   </el-aside>
<el-main>
  <router-view />
</el-main>
</el-container>
</template>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
