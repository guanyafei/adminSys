var $table = $('#table');
$(function() {
    // Waves初始化
    Waves.displayEffect();
    // 数据表格动态高度
    $(window).resize(function() {
        $('#table').bootstrapTable('resetView', {
            height: getHeight()
        });
    });
    // 表格初始化
    $table.bootstrapTable({
        url: '/user/ajax_user_list',
        height: getHeight(),
        striped: true,
        search: true,
        searchOnEnterKey: true,
        showRefresh: true,
        showColumns: true,
        minimumCountColumns: 2,
        clickToSelect: true,
        pagination: true,
        paginationLoop: false,
        /*服务端分页*/
        // dataField: "data",
        // pageNumber: 1,
        // queryParams: queryParams, //请求服务器时所传的参数
        // sidePagination: 'server', //指定服务器端分页
        // responseHandler: responseHandler, //请求数据成功后，渲染表格前的方法
        // pageSize: 10, //单页记录数
        // pageList: [10, 20, 30, 40, 50], //分页步进值
        // "queryParamsType": "limit",
        // contentType: "application/x-www-form-urlencoded",
        // sidePagination: "server",
        classes: 'table table-hover table-no-bordered',
        smartDisplay: false,
        idField: 'id',
        sortName: 'id',
        sortOrder: 'desc',
        escape: true,
        searchOnEnterKey: true,
        idField: 'id',
        maintainSelected: true,
        toolbar: '#toolbar',
        uniqueId: 'id',
        columns: [
            // {field: 'state', checkbox: true},
            { field: '', title: '编号', halign: 'center', align: 'center', formatter: indexFormatter },
            { field: 'id', title: '项目ID', sortable: true, halign: 'center', align: 'center', visible: false },
            { field: 'name', title: '项目名称', halign: 'center', align: 'center' },
            { field: 'applicant', title: '申请人', halign: 'center', align: 'center' },
            { field: 'topic', title: '主题', halign: 'center', align: 'center' },
            { field: 'des', title: '描述', halign: 'center', align: 'center' },
            { field: 'catalog', title: '分类', sortable: true, halign: 'center', align: 'center' },
            { field: 'status', title: '状态', halign: 'center', align: 'center', formatter: statusFormatter },
            { field: 'rundate', title: '执行时间', halign: 'center', align: 'center' },
            { field: 'cost', title: '预估成本', halign: 'center', align: 'center' },
            { field: 'amount', title: '预估金额', halign: 'center', align: 'center' },
            { field: 'memo', title: '备注', halign: 'center', align: 'center' },
            { field: 'operate', title: '操作', align: 'center', events: operateEvents, formatter: operateFormatter }
        ]
    })
});


//请求服务数据时所传参数
function queryParams(params) {
    return {
        pageSize: params.limit, //每一页的数据行数，默认是上面设置的10(pageSize)
        pageIndex: params.offset / params.limit + 1 //当前页面,默认是上面设置的1(pageNumber)
    };
}
//请求成功后
function responseHandler(result) {
    var errcode = result.errcode; //在此做了错误代码的判断
    if (errcode != 0) {
        alert("错误代码" + errcode);
        return;
    }
    //如果没有错误则返回数据，渲染表格
    return {
        total: result.dataLength, //总页数,前面的key必须为"total"
        data: result.rowDatas //行数据，前面的key要与之前设置的dataField的值一致.
    };
}
// 编号栏渲染
function indexFormatter(value, row, index) {
    return index + 1;
}
// 状态栏渲染
function statusFormatter(value, row, index) {
    if (value === "0") {
        return "是";
    }else if (value === "1"){
        return "否";
    }
}
//操作栏渲染
function operateFormatter(value, row, index) {
    return [
        '<a class="edit" href="javascript:void(0)" title="更新项目信息">',
        '<i class="zmdi zmdi-edit"></i>',
        '</a>  ',
        '<a class="remove" href="javascript:void(0)" title="删除项目信息">',
        '<i class="zmdi zmdi-close"></i>',
        '</a>'
    ].join('');
}
window.operateEvents = {
    'click .edit': function(e, value, row, index) {
        Handler.openModal("更新项目信息", "update", row);
    },
    'click .remove': function(e, value, row, index) {
        Handler.removeInfo(row);
    }
};
// 动态高度
function getHeight() {
    return $(window).height() - 20;
}

/*弹窗控制*/
function alert(options) {
    if (options.state === "success") {
        $("#main .alert").removeClass('alert-danger').children("strong").text(options.tip);
    } else if (options.state === "fail") {
        $("#main .alert").addClass('alert-danger').children("strong").text(options.tip);
    } else {
        $("#main .alert").children("strong").text(options.tip);
    }
    $("#main .alert").animate({
        left: 0
    }, 1000).delay(1000).animate({
        left: -380
    }, 3000);
}

/*用户信息操作*/
var Handler = {
    // 显示模态框
    openModal: function(title, operate, row) {
        $(".modal-title").text(title);
        // 清空modal-body内部内容
        $(".modal-body").empty()
        //判断操作
        if (operate === "insert") {
            // 修改模态框body内容
            var $insert = $("#insert>form").clone();
            $(".modal-body").append($insert);
            $(".modal-footer>.save").attr("onclick", "Handler.insertInfo()");
        } else if (operate === "update") {
            var $update = $("#update>form").clone();
            $(".modal-body").append($update);
            $(".modal-body input[name='name']").val(row.name);
            $(".modal-body input[name='applicant']").val(row.applicant);
            $(".modal-body input[name='topic']").val(row.topic);
            $(".modal-body input[name='des']").val(row.des);
            $(".modal-body input[name='catalog']").val(row.catalog);
            $(".modal-body select[name='status']").val(row.status);
            $(".modal-body input[name='rundate']").val(row.rundate);
            $(".modal-body input[name='cost']").val(row.cost);
            $(".modal-body input[name='amount']").val(row.amount);
            $(".modal-body input[name='memo']").val(row.memo);

            $(".modal-footer>.save").attr("onclick", "Handler.updateInfo(" + row.id + ")");
        } 
        $(".modal").modal({
            show: true
        });
    },
    //添加客户信息
    insertInfo: function() {
        var data = $(".modal-body>.form-horizontal").serializeArray();
        //判断验证是否通过  不通过禁止提交
        if ($(".modal-body .form-horizontal .popover").length != 0) {
            return;
        }
        $.ajax({
            url: "/user/user_add",
            dataType: "json",
            type: "POST",
            data: {
                data: data
            },
            success: function(result) {
                $('.modal').modal('hide');
                if (result.code === "0") {
                    alert({
                        state: "fail！",
                        tip: result.message
                    });
                } else if (result.code === "1") {
                    $table.bootstrapTable("refresh", { url: "/user/ajax_user_list" });
                    alert({
                        state: "success！",
                        tip: result.message
                    });
                }
            }
        });
    },
    //修改客户信息
    updateInfo: function(id) {
        var data = $(".modal-body>.form-horizontal").serializeArray();
        $.ajax({
            url: "/user/ajax_user_edit",
            dataType: "json",
            type: "POST",
            data: {
                user_id: id,
                data: data
            },
            success: function(result) {
                $('.modal').modal('hide');
                if (result.code === "0") {
                    alert({
                        state: "fail",
                        tip: result.message
                    });
                } else {
                    $table.bootstrapTable("refresh", { url: "/user/ajax_user_list" });
                    alert({
                        state: "success",
                        tip: result.message
                    });
                }
            }
        });
    },
    //删除单条数据
    removeInfo: function(row) {
        console.log(row.id);
        $.ajax({
            url: "/user/ajax_user_del",
            dataType: "json",
            type: "POST",
            data: {
                user_id: row.id
            },
            success: function(result) {
                $('.modal').modal('hide');
                if (result.code === "0") {
                    alert({
                        state: "fail",
                        tip: result.message
                    });
                } else {
                    $table.bootstrapTable('remove', {
                        field: 'id',
                        values: [row.id]
                    });
                    alert({
                        state: "success",
                        tip: result.message
                    });
                }
            }
        });
    },
    // //字段验证
    // validation: function(inputDom) {
    //     var name = $(inputDom).attr("name");
    //     var reg;
    //     var inputVal = $(inputDom).val();
    //     //验证手机号
    //     if (name === "phone") {
    //         reg = /^1(3|4|5|7|8)\d{9}$/;
    //         this.validationTips(reg, inputVal, inputDom);
    //         //验证邮箱
    //     } else if (name === "email") {
    //         reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    //         this.validationTips(reg, inputVal, inputDom);
    //     }
    // },
    // //默认弹出窗提示
    // validationTips: function(reg, inputVal, inputDom) {
    //     if (!reg.test(inputVal)) {
    //         $(inputDom).popover("show");
    //     } else {
    //         // this.repeatValidate(inputDom, inputVal);
    //         $(inputDom).popover("destroy");
    //     }
    // },
    // //验证字段是否重复
    // repeatValidate: function(inputDom, inputVal) {
    //     var inputName = $(inputDom).attr("name");
    //      $(inputDom).popover("destroy");
    //     // $.ajax({
    //     //     url: "************",
    //     //     method: "GET",
    //     //     dataType: "json",
    //     //     data: {
    //     //         name: inputName,
    //     //         value: inputVal
    //     //     },
    //     //     success: function(result) {
    //     //         if (result.code === "0") {
    //     //             $(".modal-body input[name='" + inputName + "']").attr("data-content", result.message);
    //     //             $(".modal-body input[name='" + inputName + "']").popover("show");
    //     //         } else if (result.code === "1") {
    //     //             $(inputDom).popover("destroy");
    //     //         }
    //     //     }
    //     // });
    // }
};