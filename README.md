# vue-export-excel

> 基于vue2的json数据转成Excel文件插件
> 优势：
> 1、逐页从后端拉取数据，对服务器压力很小
> 2、转换全在客户端完成，速度非常快
> 3、可转换条数支持百万级别，理论上无上限
> 4、转换有百分比进度提示
> 5、无需处理长数字字段和日期格式问题，拉取的是什么数据存入到EXCEL的就是什么数据
> 6、会向后端提交两种分页参数，第一种是get方式提交当前分页页码，第二种是post方式提交offset和limit分页查询参数

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
# 使用方法：
### 第一种：页面引入链接方式
```
<div id="app">
    <button onclick="exportExcel()" id="toExcel" class="btn btn-default">导出</button>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue"></script>
<script src="exportExcel/exportExcel.js"></script>
<script>

    function exportExcel() {
        (new Vue).$exportExcel({
            target: 'toExcel', //必须, 触发导出的DOM元素ID
            result: 'export_result', //显示导出进度的DOM元素ID
            columns: [
                { 'label':'订单号', 'prop': 'erp_orders_sn' },
                { 'label':'订单sku', 'prop': 'orders_sku' },
                { 'label':'产品名称', 'prop': 'sku_name' },
                { 'label':'品牌', 'prop': 'brand' },
                { 'label':'净重', 'prop': 'net_weight' },
                { 'label':'毛重', 'prop': 'gross_weight' },
                { 'label':'商品条码', 'prop': 'code' },
                { 'label':'更新时间', 'prop': 'update_time' }
            ], //必须, 列头与字段名映射  如 [{'label':'用户名', 'prop': 'username'},{'label':'角色','prop': 'role'}]
            url: 'http://www.xxxxxx.com/api/Table/index' //后端请求数据地址， 必须
            page: 'page', //请求分页的参数名称，会向后端get方式发此参数的分页数，默认为page, 可选
            parames: {}, //post参数，搜索表单，会向后端post参数外，还会post提交offset和limit分页参数，默认为{}, 可选
            pageSize: 50, //每次拉取数据条数，数字越大下载越快，根据服务器响应速度确定， 默认50, 可选
            fileName: '',//保存的文件名称, 默认为当前日期， 可选
            fileType: 'xlsx' //保存的文件类型， 支持的类型  xlsx, csv, txt, xml，  默认为 xlsx, 可选
        })
    }
</script>
```
### 第二种： Vue项目中使用
#### 先在命令行安装
npm install vue-export-excel -S

```
<template>
    <div id="app">
        <button @click="exportExcel">导出 {{percentage}}</button>
    </div>
</template>

<script>
var app = new Vue({
        el: '#app',
        data: {
            percentage: 0
        },
        methods:{
            exportExcel: function () {
                this.$exportExcel({
                      target: 'toExcel', //必须, 触发导出的DOM元素ID
                      result: 'export_result', //显示导出进度的DOM元素ID
                      columns: [
                          { 'label':'订单号', 'prop': 'erp_orders_sn' },
                          { 'label':'订单sku', 'prop': 'orders_sku' },
                          { 'label':'产品名称', 'prop': 'sku_name' },
                          { 'label':'品牌', 'prop': 'brand' },
                          { 'label':'净重', 'prop': 'net_weight' },
                          { 'label':'毛重', 'prop': 'gross_weight' },
                          { 'label':'商品条码', 'prop': 'code' },
                          { 'label':'更新时间', 'prop': 'update_time' }
                      ], //必须, 列头与字段名映射  如 [{'label':'用户名', 'prop': 'username'},{'label':'角色','prop': 'role'}]
                      url: 'http://www.xxxxxx.com/api/Table/index' //后端请求数据地址， 必须
                      page: 'page', //请求分页的参数名称，默认为page, 可选
                      parames: {}, //post参数，搜索表单，默认为{}, 可选
                      pageSize: 50, //每次拉取数据条数，数字越大下载越快，根据服务器响应速度确定， 默认50, 可选
                      fileName: '',//保存的文件名称, 默认为当前日期， 可选
                      fileType: 'xlsx' //保存的文件类型， 支持的类型  xlsx, csv, txt, xml，  默认为 xlsx, 可选
                  })
            }
        }
    })

</script>
```

#后端接口返回JSON 格式
```
{
    "total": 35374,
    "data": [
        {
            "id": "16170",
            "sku_name": "贝亲—新安抚奶嘴",
            "orgin": "中国"
        },
		{
            "id": "16170",
            "sku_name": "贝亲—新安抚奶嘴",
            "orgin": "中国"
        }
    ]
}
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
