var hnd51;
hnd51 = Module.findExportByName("advapi32","RegSetValueExA");
Interceptor.attach(hnd51, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hKey = get_hkey(args[0]);
        api_arguments.lpValueName = get_lpcstr(args[1]);
        api_arguments.Reserved = get_dword(args[2]);
        api_arguments.dwType = get_registry_type(get_dword(args[3]));
        api_arguments.lpData = get_byte_ptr(args[4]);
        api_arguments.cbData = get_dword(args[5]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "RegSetValueExA"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 