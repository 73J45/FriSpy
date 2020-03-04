var hnd24;
hnd24 = Module.findExportByName("kernel32","OpenFile");
Interceptor.attach(hnd24, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.lpFileName = get_lpcstr(args[0]);
        api_arguments.lpReOpenBuff = get_lpofstruct(args[1]);
        api_arguments.uStyle = get_uint(args[2]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "OpenFile"
        this.send_data.module_name = "kernel32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 