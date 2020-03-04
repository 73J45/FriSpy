var hnd63;
hnd63 = Module.findExportByName("kernel32","CreateSemaphoreExA");
Interceptor.attach(hnd63, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.lpSemaphoreAttributes = get_lpsecurity_attributes(args[0]);
        api_arguments.lInitialCount = get_long(args[1]);
        api_arguments.lMaximumCount = get_long(args[2]);
        api_arguments.lpName = get_lpcstr(args[3]);
        api_arguments.dwFlags = get_dword(args[4]);
        api_arguments.dwDesiredAccess = get_dword(args[5]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CreateSemaphoreExA"
        this.send_data.module_name = "kernel32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 