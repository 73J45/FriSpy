var hnd60;
hnd60 = Module.findExportByName("kernel32","CreateMutexExW");
Interceptor.attach(hnd60, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.lpMutexAttributes = get_lpsecurity_attributes(args[0]);
        api_arguments.lpName = get_lpcwstr(args[1]);
        api_arguments.dwFlags = get_dword(args[2]);
        api_arguments.dwDesiredAccess = get_dword(args[3]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CreateMutexExW"
        this.send_data.module_name = "kernel32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 