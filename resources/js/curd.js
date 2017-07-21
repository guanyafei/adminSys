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
        idField: 'systemId',
        maintainSelected: true,
        toolbar: '#toolbar',
        columns: [
            // {field: 'state', checkbox: true},
            { field: 'id', title: '编号', sortable: true, halign: 'center' },
            { field: 'username', title: '账号', halign: 'center' },
            { field: 'password', title: '密码', halign: 'center' },
            { field: 'name', title: '姓名', sortable: true, halign: 'center' },
            { field: 'sex', title: '性别', halign: 'center' },
            { field: 'age', title: '年龄', sortable: true, halign: 'center' },
            { field: 'phone', title: '手机', halign: 'center' },
            { field: 'email', title: '邮箱', halign: 'center' },
            { field: 'address', title: '地址', halign: 'center' },
            { field: 'remark', title: '备注', halign: 'center' },
            { field: 'operate', title: '操作', align: 'center', events: operateEvents, formatter: operateFormatter },
        ]
    }).on('all.bs.table', function(e, name, args) {
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
            var $insert = $("#insert>form");
            $(".modal-body").append($insert);
            $(".modal-footer>.save").attr("onclick", "Handler.insertInfo()");
        } else if (operate === "update") {
            var $update = $("#update>form");
            $("#update input[name='userName']").val(data.username);
            $("#update input[name='pwd']").val(data.password);
            $("#update input[name='email']").val(data.email);
            $("#update input[name='telphone']").val(data.phone);
            $(".modal-body").append($update);
            $(".modal-footer>.save").attr("onclick", "Handler.updateInfo()");
        } else if (operate === "import") {
            var $import = $("#import>form");
            $(".modal-body").append($import);
            $(".modal-footer>.save").attr("onclick", "Handler.importInfo()");
        }
        $(".modal").modal({
            show: true
        });
    },
    //添加客户信息
    insertInfo: function() {
        var data = {
            userName: $(".modal-body input[name='userName']").val(),
            pwd: $(".modal-body input[name='pwd']").val(),
            email: $(".modal-body input[name='email']").val(),
            telphone: $(".modal-body input[name='telphone']").val()
        };
        $.ajax({
            url: "",
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
    updateInfo: function() {
        var data = {
            userName: $(".modal-body input[name='userName']").val(),
            pwd: $(".modal-body input[name='pwd']").val(),
            email: $(".modal-body input[name='email']").val(),
            telphone: $(".modal-body input[name='telphone']").val()
        };
        $.ajax({
            url: "",
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
        $.ajax({
            url: "",
            dataType: "json",
            type: "POST",
            data: file,
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
    }
};