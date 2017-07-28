var $table = $('#table');
$(function() {
    $table.bootstrapTable({
        url: '/user/ajax_user_list',
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
        height: getHeight(),
        striped: true,
        search: true,
        searchOnEnterKey: true,
        showRefresh: true,
        showColumns: true,
        minimumCountColumns: 2,
        clickToSelect: true,
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
        // sidePagination: "server",
        uniqueId: 'id',
        columns: [
            // {field: 'state', checkbox: true},
            { field: '', title: '编号', halign: 'center', align: 'center', formatter: indexFormatter },
            { field: 'id', title: 'ID', sortable: true, halign: 'center', align: 'center' },
            { field: 'phone', title: '手机号', halign: 'center', align: 'center' },
            { field: 'password', title: '密码', halign: 'center', align: 'center' },
            { field: 'customername', title: '用户姓名', halign: 'center', align: 'center' },
            { field: 'company', title: '公司', halign: 'center', align: 'center' },
            { field: 'dept', title: '部门', halign: 'center', align: 'center' },
            { field: 'sex', title: '性别', halign: 'center', align: 'center' },
            { field: 'birthday', title: '出生日期', sortable: true, halign: 'center', align: 'center' },
            { field: 'address', title: '地址', halign: 'center', align: 'center' },
            { field: 'email', title: '邮箱', halign: 'center', align: 'center' },
            { field: 'operate', title: '操作', align: 'center', events: operateEvents, formatter: operateFormatter }
        ]
    })
    // .on('all.bs.table', function(e, name, args) {
    //     $('[data-toggle="tooltip"]').tooltip();
    //     $('[data-toggle="popover"]').popover();
    // });
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
//操作栏渲染
function operateFormatter(value, row, index) {
    return [
        '<a class="edit" href="javascript:void(0)" title="更新用户信息">',
        '<i class="zmdi zmdi-edit"></i>',
        '</a>  ',
        '<a class="remove" href="javascript:void(0)" title="删除用户信息">',
        '<i class="zmdi zmdi-close"></i>',
        '</a>'
    ].join('');
}
window.operateEvents = {
    'click .edit': function(e, value, row, index) {
        Handler.openModal("更新用户信息", "update", row);
    },
    'click .remove': function(e, value, row, index) {
        Handler.removeInfo(row);
    }
};

// function detailFormatter(index, row) {
//     var html = [];
//     $.each(row, function(key, value) {
//         html.push('<p><b>' + key + ':</b> ' + value + '</p>');
//     });
//     return html.join('');
// } 

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
    }, 1000);
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
            $(".modal-body input[name='customerName']").val(row.customername);
            $(".modal-body input[name='password']").val(row.password);
            $(".modal-body input[name='email']").val(row.email);
            $(".modal-body input[name='telphone']").val(row.phone);
            $(".modal-body select[name='sex']").val(row.sex);
            $(".modal-body input[name='company']").val(row.company);
            $(".modal-body input[name='dept']").val(row.dept);
            $(".modal-body input[name='address']").val(row.address);
            $(".modal-body input[name='birthday']").val(row.birthday);

            $(".modal-footer>.save").attr("onclick", "Handler.updateInfo(" + row.id + ")");
        } else if (operate === "import") {
            var $import = $("#import>.form-horizontal").clone();
            $(".modal-body").append($import);
            $(".modal-footer>.save").attr("onclick", "Handler.importInfo()");
        } else if (operate === "scan") {
            var $scan = $("#scan>.form-horizontal").clone();
            $(".modal-body").append($scan);
            $(".modal-footer>.save").attr("onclick", "Handler.cardScan()");
        }
        $(".modal").modal({
            show: true
        });
    },
    //添加客户信息
    insertInfo: function() {
        var data = $(".modal-body>.form-horizontal").serializeArray();
        $.ajax({
            url: "/user/user_add",
            dataType: "json",
            type: "POST",
            data: data,
            success: function(result) {
                if (result.code === "0") {
                    alert(result.message);
                    alert({
                        state: "fail！",
                        tip: result.message
                    });
                } else {
                    $('.modal').modal('hide');
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
                if (result.code === "0") {
                    alert({
                        state: "fail",
                        tip: result.message
                    });
                } else {
                    $table.bootstrapTable("refresh", { url: "/user/ajax_user_list" });
                    $('.modal').modal('hide');
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
                console.log(result);
                if (result.code === "0") {
                    alert({
                        state: "fail",
                        tip: result.message
                    });
                } else {
                    $('.modal').modal('hide');
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
    //导入excel表格
    importInfo: function() {
        var file = $(".modal-body input[name='file']").get(0).files[0];
        var data = {
            file: file
        };
        $.ajax({
            url: "************",
            dataType: "json",
            type: "POST",
            data: data,
            processData: false, // 告诉jQuery不要去处理发送的数据
            contentType: false, // 告诉jQuery不要去设置Content-Type请求头
            success: function(result) {
                if (result.code === "0") {
                    alert({
                        state: "fail",
                        tip: result.message
                    });
                } else {
                    $('.modal').modal('hide');
                    alert({
                        state: "success",
                        tip: result.message
                    });
                }
            }
        });
    },
    //扫描名片
    cardScan: function() {
        var file = $(".modal-body>.form-horizontal>img").get(0).files[0];
        var data = {
            file: file
        };
        $.ajax({
            url: "***********",
            dataType: "json",
            type: "POST",
            data: data,
            processData: false, // 告诉jQuery不要去处理发送的数据
            contentType: false, // 告诉jQuery不要去设置Content-Type请求头
            success: function(result) {
                if (result.code === "0") {
                    alert({
                        state: "fail",
                        tip: result.message
                    });
                } else {
                    $('.modal').modal('hide');
                    alert({
                        state: "success",
                        tip: result.message
                    });
                }
            }
        });
    },
    //名片预览
    cardPreview: function(fileDom) {
        //判断是否支持FileReader
        if (window.FileReader) {
            var reader = new FileReader();
        } else {
            alert({
                tip: "您的浏览器不支持图片预览功能，如需该功能请升级您的浏览器！"
            });
        }
        //获取文件
        var $img = $(".modal-body>.form-horizontal>img");
        $img.removeAttr('src');
        var file = $(fileDom).get(0).files[0];
        console.log(file);
        var imageType = /^image\//;
        //判断是否是图片
        if (!imageType.test(file.type)) {
            $(".modal-body>.form-horizontal>span").show("slow");
            return;
        }
        reader.readAsDataURL(file);
        //读取完成
        reader.onload = function(e) {
            $(".modal-body>.form-horizontal>span").hide("slow", function() {
                //图片路径设置为读取的图片
                $img.attr("src", e.target.result);
            });
        };
    }
};