/**
 * 用法：
 <div id="app">
 <button onclick="exportExcel()" id="toExcel" class="btn btn-default">导出</button>
 </div>

 <script src="https://cdn.jsdelivr.net/npm/vue"></script>
 <script src="exportExcel/exportExcel.js"></script>
 <script>

 function exportExcel() {
        (new Vue).$exportExcel({
            target: 'toExcel', //必须, 触发导出的DOM元素ID
            columns: [], //必须, 列头与字段名映射  如 [{'label':'用户名', 'prop': 'username'},{'label':'角色','prop': 'role'}]
            url: 'http://www.b2b.com/api/Table/index', //后端请求数据地址， 必须
            page: 'page', //请求分页的参数名称，默认为page, 可选
            parames: [], //post参数，搜索表单，默认为[], 可选
            pageSize: 50, //每次拉取数据条数，根据服务器响应速度确定， 默认50, 可选
            fileName: '',//保存的文件名称, 默认为当前日期， 可选
            fileType: 'xlsx' //保存的文件类型， 支持的类型  xlsx, csv, txt, xml，  默认为 xlsx, 可选
        })
    }

 </script>
 */


import axios from 'axios'
import jsonExport from './jsonExport'

let exportData = [];
let targetBtnTxt = '';
let targetObj = {};

//拉取要导出的数据的回调
let getExportData = function(response,currentPage,data) {
    response.data.data.forEach(function (val, index) {
        let item = []
        //将下载的字段名替换成表格的表头名称
        data.columns.forEach(function (v,k) {
            //只下载显示的列
            if(val[v['prop']] != undefined){
                item[v['label']] = val[v['prop']]
            }
        });
        exportData.push(item)
    })

    let totalPages = Math.ceil(response.data.total / data.pageSize)

    let percentage = Math.ceil(currentPage / totalPages * 100)

    //全部拉取完后，开始下载数据
    if(currentPage == totalPages){
        jsonExport(exportData, data.fileType, data.fileName);
        targetObj.innerText = targetBtnTxt;
        targetObj.removeAttribute('disabled');
        exportData = []; //清除已下载过的数据
    }else{
        targetObj.innerText = '正在导出，已完成 '+ percentage +'%';
        targetObj.setAttribute('disabled',true);
        currentPage++;
        downloadExport(data,currentPage);
    }

}


//下载导出
let downloadExport = function (data,currentPage) {
    //兼容后端只接收offset 和 limit 参数分页处理
    let post_data = {
        offset: data.pageSize * (currentPage -1),
        limit: data.pageSize
    }

    for(let key in data.parames){
        post_data[key] = data.parames[key];
    }

    axios.post(data.url + '?page='+currentPage, post_data)
        .then(function (response) {
            getExportData(response,currentPage,data)
        })
        .catch(function (error) {
            console.log(error);
        });
}

const exportExcelPlugin = {
    install: function(Vue) {
        Vue.prototype.$exportExcel = function (data) {
            if(data == null || data == '' || data == undefined){
                alert('参数缺失！')
                return false;
            }

            if(data.url == undefined || data.url == ''){
                alert('缺少参数url')
                return false;
            }

            if(data.columns == undefined || data.columns == '' || data.columns.length == 0){
                alert('缺少参数columns')
                return false;
            }

            if(data.target == undefined || data.target == ''){
                alert('缺少参数target')
                return false;
            }

            if(data.page == undefined || data.page == '') data.page = 'page'
            if(data.parames == undefined || data.parames == '') data.parames = []
            if(data.pageSize == undefined || data.pageSize == '') data.pageSize = 50
            if(data.fileName == undefined || data.fileName == '') data.fileName = ''
            if(data.fileType == undefined || data.fileType == '') data.fileType = 'xlsx'

            targetObj = document.getElementById(data.target);
            targetBtnTxt = targetObj.innerText;
            downloadExport(data,1)
        }
    }
}

// global 情况下 自动安装
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(exportExcelPlugin)
}
// 导出模块
export default exportExcelPlugin