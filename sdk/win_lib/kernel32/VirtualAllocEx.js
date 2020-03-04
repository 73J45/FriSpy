var hnd105;
hnd105 = Module.findExportByName("kernel32","VirtualAllocEx");
Interceptor.attach(hnd105, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hProcess = get_handle(args[0]);
        api_arguments.lpAddress = get_lpvoid(args[1]);
        api_arguments.dwSize = get_size_t(args[2]);
        api_arguments.flAllocationType = get_dword(args[3]);
        api_arguments.flProtect = get_dword(args[4]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "VirtualAllocEx"
        this.send_data.module_name = "kernel32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 