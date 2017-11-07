/**
 * @author zjy
 * 通用脚本写这里
 */

//添加对bootstrap-datetimepicker的中文语言显示
$.fn.datetimepicker.dates['zh-CN'] = {
    days: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    today: "今天",
    suffix: [],
    meridiem: ["上午", "下午"]
};

$(document).ready(function () {

    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    Date.prototype.Format = function(fmt)
    { //author: meizz
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    }

    //用户类型的中英文对应
    let nameMap={
        "券商":"SecuritiesTrader",
        "投资人":"Investor",
        "中介":"Intermediary",
    };

    //选项卡的点击监听，修改选项卡外观的同时将存储着用户类型的<input>标签的value改变
    $(".select-item").click(function(event){
        $(".select-item").removeClass("selected");
        $(this).addClass("selected");
        $(this).parent().parent().find("input").val(nameMap[$(this).text().trim()]);
    });

    //显示日期选择器
    if($(".form_date").size()>0){
        $(".form_date").datetimepicker({
            language: "zh-CN",
            format: "yyyy-mm-dd",//日期格式
            // pickerPosition: "top-right",
            weekStart: 0,//一周从哪一天开始。0（星期日）到6（星期六）
            autoclose: 1,//当选择一个日期之后是否立即关闭此日期时间选择器。
            todayHighlight: 1,//如果为true, 高亮当前日期。
            startView: 2, //日期时间选择器打开之后首先显示的视图   2 or 'month' for month view (the default)
            minView: 2, //日期时间选择器所能够提供的最精确的时间选择视图。 2 or 'month' for month view (the default)
            startDate: new Date(), //日期时间选择器能选择的最早的一天
            // initialDate: new Date(), //You can initialize the viewer with a date.
            // daysOfWeekDisabled: [6, 0], //Days of the week that should be disabled. Values are 0 (Sunday) to 6 (Saturday).
            forceParse: true, //当用户在输入框中输入了不正确的日期，选择器将会尽量解析输入的值，并将解析后的正确值按照给定的格式format设置到输入框中
        }).data("datetimepicker");

    }
});