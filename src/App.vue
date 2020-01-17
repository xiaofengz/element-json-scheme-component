<template>
    <div class="app-container" id="app">
        <p class="title">element-json-schema-form</p>
        <div class="btns">
            <el-button @click="push('form-default')">Form</el-button>
            <el-button @click="push('table-default')">Table</el-button>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    methods: {
        push(path) {
            this.$router.push(path)
        }
    }
}
</script>

<style scoped>
.app-container {
    display: flex;
    flex-direction: column;
}
.title {
    font-size: 20px;
    font-weight: bold;
    margin-top: 0;
}
.btns {
    margin: -10px 0 10px 0;
}
</style>