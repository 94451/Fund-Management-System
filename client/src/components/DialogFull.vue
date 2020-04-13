<template>
    <div class="dialog-full">
        <!-- Form -->
        <el-dialog 
            :title="dialog.title" 
            :visible.sync="dialog.show" 
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :modal-append-to-body="false"
        >
            <div class="from">
                <el-form
                    ref="form"
                    :model="formData"
                    :rules="form_rules"
                    label-width="120px"
                    style="margin:10px;width:auto;"
                >
                    <el-form-item prop="type" label="原料类型:">
                        <el-select v-model="formData.type" placeholder="原料类型">
                            <el-option 
                                v-for="(formtype, index) in form_type_list" 
                                :key="index"
                                :label="formtype"
                                :value="formtype"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="describe" label="资金描述:">
                        <el-input type="textarea" v-model="formData.describe" placeholder="资金的具体描述"></el-input>
                    </el-form-item>
                    <el-form-item prop="carat" label="重量:">
                        <el-input type="carat" v-model="formData.carat" placeholder="重量"></el-input>
                    </el-form-item>
                    <el-form-item prop="Perton" label="单价:">
                        <el-input type="Perton" v-model="formData.Perton" placeholder="单价"></el-input>
                    </el-form-item>
                    <el-form-item prop="remak" label="备注:">
                        <el-input type="textarea" v-model="formData.remak" placeholder="备注"></el-input>
                    </el-form-item>

                    <el-form-item class="text_right">
                        <el-button @click="onSubmit('form')" type="primary">
                            提交
                        </el-button>
                        <el-button @click="dialog.show = false" type="danger">
                            取消
                        </el-button>                       
                    </el-form-item>
                </el-form>
            </div>
           
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'dialog-full',
    data() {
        return {
            form_type_list:[
                "AA原料",
                "BB原料",
                "CC原料",
                "DD原料",
                "EE原料",
                "GG原料"
            ],
            form_rules:{
                type:[
                    {
                        required: true,
                        message:'原料类型不能为空',
                        trigger: 'blur'//失去焦点触发
                    }
                ],
                describe:[
                    {
                        required: true,
                        message:'资金描述不能为空',
                        trigger: 'blur'//失去焦点触发
                    }
                ],
                carat:[
                    {
                        required: true,
                        message:'重量不能为空',
                        trigger: 'blur'//失去焦点触发
                    }
                ],
                Perton:[
                    {
                        required: true,
                        message:'单价不能为空',
                        trigger: 'blur'//失去焦点触发
                    }
                ],
            }
        };
    },
    props: {
        dialog: Object,
        formData: Object
    },
    methods:{
        onSubmit (form){
            this.formData.intotal = parseFloat(this.formData.Perton) * parseFloat(this.formData.carat);

            this.$refs[form].validate((valid) => {
                if(valid){
                    const url = this.dialog.option == "add" ? "add" : `edit/${this.formData.id}`;
                    this.$axios.post(`api/profiles/${url}`, this.formData).then(res =>{
                        // 添加成功
                        if(url ==  "add"){
                            this.$message({
                                message: '添加成功！',
                                type: 'success'
                            });
                        } else {
                             this.$message({
                                message: '修改成功！',
                                type: 'success'
                            });
                        }

                        // 隐藏对话框
                        this.dialog.show = false;
                        this.$emit("showfilter", false);
                        // 隐藏筛选金额
                       
                        // 页面自动更新数据
                        this.$emit('update');
                    });                    
                }
            });
        },
    }
}
</script>

<style scoped>


</style>