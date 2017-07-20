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
        '<a class="edit" href="javascript:void(0)" title="编辑">',
        '<i class="zmdi zmdi-edit"></i>',
        '</a>  ',
        '<a class="remove" href="javascript:void(0)" title="删除">',
        '<i class="zmdi zmdi-close"></i>',
        '</a>'
    ].join('');
}
window.operateEvents = {
    'click .edit': function(e, value, row, index) {
        // alert('You click like action, row: ' + JSON.stringify(row));
        alert("编辑");
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

/*表格操作*/
var Handler = {
    // 显示模态框
    openModal: function() {
        $(".modal").modal({
            show: true
        });
    },
    addInfo: function() {
        $('.modal').modal('hide');
        $('.modal').on('hidden.bs.modal', function(e) {
            alert('成功');
        })
    }
};