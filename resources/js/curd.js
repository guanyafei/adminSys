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
            { field: 'id', title: '用户ID', sortable: true, halign: 'center', align: 'center', visible: false },
            { field: 'username', title: '用户名', halign: 'center', align: 'center' },
            { field: 'name', title: '用户姓名', halign: 'center', align: 'center' },
            { field: 'password', title: '密码', halign: 'center', align: 'center', visible: false },
            { field: 'phone', title: '手机号', halign: 'center', align: 'center' },
            { field: 'birthday', title: '出生日期', sortable: true, halign: 'center', align: 'center' },
            { field: 'sex', title: '性别', halign: 'center', align: 'center', formatter: sexFormatter },
            { field: 'email', title: '邮箱', halign: 'center', align: 'center' },
            { field: 'company', title: '公司', halign: 'center', align: 'center' },
            { field: 'depart', title: '部门', halign: 'center', align: 'center' },
            { field: 'item', title: '项目', halign: 'center', align: 'center' },
            { field: 'address', title: '地址', halign: 'center', align: 'center' },
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
//性别栏渲染
function sexFormatter(value, row, index) {
    if (value === "0") {
        return "男";
    } else if (value === "1") {
        return "女";
    }
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
// 动态高度
function getHeight() {
    return $(window).height() - 20;
}
// function detailFormatter(index, row) {
//     var html = [];
//     $.each(row, function(key, value) {
//         html.push('<p><b>' + key + ':</b> ' + value + '</p>');
//     });
//     return html.join('');
// } 

// 初始化input特效
/*function initMaterialInput() {
    $('form input[type="text"]').each(function () {
        if ($(this).val() != '') {
            $(this).parent().find('label').addClass('active');
        }
    });
}*/

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
            $(".modal-body input[name='username']").val(row.username);
            $(".modal-body input[name='password']").val(row.password);
            $(".modal-body input[name='email']").val(row.email);
            $(".modal-body input[name='phone']").val(row.phone);
            $(".modal-body select[name='sex']").val(row.sex);
            $(".modal-body input[name='company']").val(row.company);
            $(".modal-body input[name='depart']").val(row.depart);
            $(".modal-body input[name='address']").val(row.address);
            $(".modal-body input[name='birthday']").val(row.birthday);
            // $(".modal-body input[name='item']").val(row.item);

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
                $(".modal-body input[name='phone']").popover("destroy");
                $(".modal-body input[name='email']").popover("destroy");
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
    //导入excel表格
    importInfo: function() {
        var formData = new FormData();
        var file = $(".modal-body input[name='file']").get(0).files[0];
        var item = $(".modal-body input[name='item']").val
        formData.append("file", file);
        formData.append("item", item);
        $.ajax({
            url: "/excel/upload_do",
            dataType: "json",
            type: "POST",
            data: formData,
            processData: false, // 告诉jQuery不要去处理发送的数据
            contentType: false, // 告诉jQuery不要去设置Content-Type请求头
            success: function(result) {
                $('.modal').modal('hide');
                if (result.code === "0") {
                    alert({
                        state: "fail",
                        tip: result.message
                    });
                } else {

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
        var formData = new FormData();
        var file = $(".modal-body input[name='file']").get(0).files[0];
        formData.append("file", file);
        $.ajax({
            url: "***********",
            dataType: "json",
            type: "POST",
            data: formData,
            processData: false, // 告诉jQuery不要去处理发送的数据
            contentType: false, // 告诉jQuery不要去设置Content-Type请求头
            success: function(result) {
                $('.modal').modal('hide');
                if (result.code === "0") {
                    alert({
                        state: "fail",
                        tip: result.message
                    });
                } else {
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
                tip: "您的设备不支持图片预览功能，如需该功能请升级您的设备！"
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
    },
    //字段验证
    validation: function(inputDom) {
        var name = $(inputDom).attr("name");
        var reg;
        var inputVal = $(inputDom).val();
        //验证手机号
        if (name === "phone") {
            reg = /^1(3|4|5|7|8)\d{9}$/;
            this.validationTips(reg, inputVal, inputDom);
            //验证邮箱
        } else if (name === "email") {
            reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            this.validationTips(reg, inputVal, inputDom);
        }
    },
    //默认弹出窗提示
    validationTips: function(reg, inputVal, inputDom) {
        if (!reg.test(inputVal)) {
            $(inputDom).popover("show");
        } else {
            // this.repeatValidate(inputDom, inputVal);
            $(inputDom).popover("destroy");
        }
    },
    //验证字段是否重复
    repeatValidate: function(inputDom, inputVal) {
        var inputName = $(inputDom).attr("name");
         $(inputDom).popover("destroy");
        // $.ajax({
        //     url: "************",
        //     method: "GET",
        //     dataType: "json",
        //     data: {
        //         name: inputName,
        //         value: inputVal
        //     },
        //     success: function(result) {
        //         if (result.code === "0") {
        //             $(".modal-body input[name='" + inputName + "']").attr("data-content", result.message);
        //             $(".modal-body input[name='" + inputName + "']").popover("show");
        //         } else if (result.code === "1") {
        //             $(inputDom).popover("destroy");
        //         }
        //     }
        // });
    }
};