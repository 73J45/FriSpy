var hnd23;
hnd23 = Module.findExportByName("kernel32","CreateFileW");
Interceptor.attach(hnd23, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.lpFileName = get_lpcwstr(args[0]);
        api_arguments.dwDesiredAccess = get_file_desired_access(get_dword(args[1]));
        api_arguments.dwShareMode = get_file_share_mode(get_dword(args[2]));
        api_arguments.lpSecurityAttributes = get_lpsecurity_attributes(args[3]);
        api_arguments.dwCreationDisposition = get_file_creation_disposition(get_dword(args[4]));
        api_arguments.dwFlagsAndAttributes = get_file_attributes(get_dword(args[5]));
        api_arguments.hTemplateFile = get_handle(args[6]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CreateFileW"
        this.send_data.module_name = "kernel32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 