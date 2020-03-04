var hnd32;
hnd32 = Module.findExportByName("kernel32","CreateThread");
Interceptor.attach(hnd32, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.lpThreadAttributes = get_lpsecurity_attributes(args[0]);
        api_arguments.dwStackSize = get_size_t(args[1]);
        api_arguments.lpStartAddress = get_lpthread_start_routine(args[2]);
        api_arguments.lpParameter = ToHexString(get_lpvoid(args[3]));
        api_arguments.dwCreationFlags = get_dword(args[4]);
        api_arguments.lpThreadId = get_dword(args[5]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CreateThread"
        this.send_data.module_name = "kernel32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {
        this.send_data.api_arguments.lpThreadId = ToHexString(get_lpdword(this.send_data.api_arguments.lpThreadId));

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 