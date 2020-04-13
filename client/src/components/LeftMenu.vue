<template>
    <div class="left-menu">
        <el-row class="menu_page">
            <el-col>
                <el-menu
                    class="el-menu-vertical-demo"
                    background-color="#0476EB"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                        <router-link to="/home">
                            <el-menu-item index="0">
                                <i class="fa fa-margin el-icon-s-unfold"></i>
                                <span slot="title">首页</span>
                            </el-menu-item>
                        </router-link>
                        <template v-for="item in items"> 
                            <el-submenu v-if="item.children" :index="item.path" :key="item.path">
                                <template slot="title"> 
                                    <i :class="'fa fa-margin '+item.icon"></i>
                                    <span slot="title">{{ item.name }}</span>
                                </template>
                                <router-link v-for="(citem, cindex) in item.children" :to="citem.path" :key="cindex">
                                    <el-menu-item :index="citem.path">
                                        <span slot="title">{{ citem.name }}</span>
                                    </el-menu-item>
                                </router-link>
                            </el-submenu>
                        </template>
                </el-menu>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'head-nav',
    data() {
        return {
            items:[
                {
                    icon: 'el-icon-s-goods',
                    name:'资金管理',
                    path:'fund',
                    children:[
                        {
                            path:'fundlist',
                            name: '资金流水'
                        }
                    ]
                },
                {
                    icon: 'el-icon-user-solid',
                    name:'信息管理',
                    path:'info',
                    children:[
                        {
                            path:'information',
                            name: '个人信息'
                        }
                    ]
                }
            ]
        }
    },
    methods: {
     /*  handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      } */
    }
};
</script>

<style scoped>
.menu_page {
  position: fixed;
  top: 71px;
  left: 0;
  min-height: 100%;
  background-color: #0476EB;
  z-index: 99;
}
.el-menu {
  border: none;
}
.fa-margin {
  margin-right: 5px;
  color: #fff;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 180px;
  min-height: 400px;
}
.el-menu-vertical-demo {
  width: 35px;
}
.el-submenu .el-menu-item {
  min-width: 180px;
}

.hiddenDropdown,
.hiddenDropname {
  display: none;
}
a {
  text-decoration: none;
}
</style>