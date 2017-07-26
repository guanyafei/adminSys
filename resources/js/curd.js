var $table = $('#table');
$(function() {
    $(document).on('focus', 'input[type="text"]', function() {
        $(this).parent().find('label').addClass('active');
    }).on('blur', 'input[type="text"]', function() {
        if ($(this).val() == '') {
            $(this).parent().find('label').removeClass('active');
        }
    });

    $table.bootstrapTable({
        url: '../resources/data/data1.json',
        height: getHeight(),
        striped: true,
        search: true,
        searchOnEnterKey: true,
        showRefresh: true,
        // showToggle: true,
        showColumns: true,
        minimumCountColumns: 2,
        // showPaginationSwitch: true,
        clickToSelect: true,
        // detailView: true,
        // detailFormatter: 'detailFormatter',
        pagination: true,
        paginationLoop: false,
        classes: 'table table-hover table-no-bordered',
        //sidePagination: 'server',
        //silentSort: false,
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
            { field: 'id', title: '编号', sortable: true, halign: 'center', align: 'center' },
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
    }).on('all.bs.table', function(e, customername, args) {
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();
    });
});

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
        // alert('You click like action, row: ' + JSON.stringify(row));
        Handler.openModal("更新用户信息", "update", row);
    },
    'click .remove': function(e, value, row, index) {
        $table.bootstrapTable('remove', {
            field: 'id',
            values: [row.id]
        });
        alert("删除");
    }
};

// function detailFormatter(index, row) {
//     var html = [];
//     $.each(row, function(key, value) {
//         html.push('<p><b>' + key + ':</b> ' + value + '</p>');
//     });
//     return html.join('');
// } 

/*用户信息操作*/
var Handler = {
    // 显示模态框
    openModal: function(title, operate, data) {
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
            $(".modal-body input[name='customerName']").val(data.customername);
            $(".modal-body input[name='password']").val(data.password);
            $(".modal-body input[name='email']").val(data.email);
            $(".modal-body input[name='telphone']").val(data.phone);
            $(".modal-body select[name='sex']").val(data.sex);
            $(".modal-body input[name='company']").val(data.company);
            $(".modal-body input[name='dept']").val(data.dept);
            $(".modal-body input[name='address']").val(data.address);
            $(".modal-body input[name='birthday']").val(data.birthday);

            $(".modal-footer>.save").attr("onclick", "Handler.updateInfo(data.id)");
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
            url: "*************",
            dataType: "json",
            type: "POST",
            data: data,
            success: function(result) {
                if (result.code === "0") {
                    alert("添加失败")
                } else {
                    alert("添加成功");
                    $('.modal').modal('hide');
                }
            }
        });
    },
    //修改客户信息
    updateInfo: function(key) {
        var data = $(".modal-body>.form-horizontal").serializeArray();
        $.ajax({
            url: "*********?id="+key,
            dataType: "json",
            type: "POST",
            data: data,
            success: function(result) {
                if (result.code === "0") {
                    alert("添加失败")
                } else {
                    alert("添加成功");
                    $('.modal').modal('hide');
                }
            }
        });
    },
    //导入excel表格
    importInfo: function() {
        var file = $(".modal-body input[name='file']").get(0).files[0];
        var data = {
            data: file
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
                    alert("添加失败")
                } else {
                    alert("添加成功");
                    $('.modal').modal('hide');
                }
            }
        });
    },
    //扫描名片
    cardScan: function() {
        var file = $(".modal-body>.form-horizontal>img").get(0).files[0];
        var data = {
            data: file
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
                    alert("扫描失败")
                } else {
                    alert("扫描成功");
                    $('.modal').modal('hide');
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
            alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
        }
        //获取文件
        var file = $(fileDom).get(0).files[0];
        console.log(file);
        var imageType = /^image\//;
        //判断是否是图片
        if (!imageType.test(file.type)) {
            alert("请选择图片!");
            return;
        }
        reader.readAsDataURL(file);
        //读取完成
        reader.onload = function(e) {
            var $img = $(".modal-body>.form-horizontal>img");
            //图片路径设置为读取的图片
            $img.attr("src", e.target.result);
        };
    }
};