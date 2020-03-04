var hnd40;
hnd40 = Module.findExportByName("advapi32","RegOpenKeyW");
Interceptor.attach(hnd40, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hKey = get_hkey(args[0]);
        api_arguments.lpSubKey = get_lpcwstr(args[1]);
        api_arguments.phkResult = get_dword(args[2]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "RegOpenKeyW"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {
        this.send_data.api_arguments.phkResult = get_phkey(this.send_data.api_arguments.phkResult);

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 