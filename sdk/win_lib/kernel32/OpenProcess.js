var hnd108;
hnd108 = Module.findExportByName("kernel32","OpenProcess");
Interceptor.attach(hnd108, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.dwDesiredAccess = get_dword(args[0]);
        api_arguments.bInheritHandle = get_bool(args[1]);
        api_arguments.dwProcessId = get_dword(args[2]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "OpenProcess"
        this.send_data.module_name = "kernel32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 