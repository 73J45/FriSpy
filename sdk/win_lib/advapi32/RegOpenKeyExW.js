var hnd42;
hnd42 = Module.findExportByName("advapi32","RegOpenKeyExW");
Interceptor.attach(hnd42, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hKey = get_hkey(args[0]);
        api_arguments.lpSubKey = get_lpcwstr(args[1]);
        api_arguments.ulOptions = get_dword(args[2]);
        api_arguments.samDesired = get_regsam(args[3]);
        api_arguments.phkResult = get_dword(args[4]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "RegOpenKeyExW"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {
        this.send_data.api_arguments.phkResult = get_phkey(this.send_data.api_arguments.phkResult);

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 