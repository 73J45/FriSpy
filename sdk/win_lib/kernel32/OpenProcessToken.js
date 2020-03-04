var hnd107;
hnd107 = Module.findExportByName("kernel32","OpenProcessToken");
Interceptor.attach(hnd107, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.ProcessHandle = get_handle(args[0]);
        api_arguments.DesiredAccess = get_dword(args[1]);
        api_arguments.TokenHandle = get_dword(args[2]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "OpenProcessToken"
        this.send_data.module_name = "kernel32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {
        this.send_data.api_arguments.TokenHandle = get_phandle(this.send_data.api_arguments.TokenHandle);

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 