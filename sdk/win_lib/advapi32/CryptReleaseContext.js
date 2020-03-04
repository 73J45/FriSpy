var hnd98;
hnd98 = Module.findExportByName("advapi32","CryptReleaseContext");
Interceptor.attach(hnd98, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hProv = get_dword(args[0]);
        api_arguments.dwFlags = get_dword(args[1]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CryptReleaseContext"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 