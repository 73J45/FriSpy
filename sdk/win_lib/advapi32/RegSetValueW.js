var hnd50;
hnd50 = Module.findExportByName("advapi32","RegSetValueW");
Interceptor.attach(hnd50, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hKey = get_hkey(args[0]);
        api_arguments.lpSubKey = get_lpcwstr(args[1]);
        api_arguments.dwType = get_registry_type(get_dword(args[2]));
        api_arguments.lpData = get_lpcwstr(args[3]);
        api_arguments.cbData = get_dword(args[4]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "RegSetValueW"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 