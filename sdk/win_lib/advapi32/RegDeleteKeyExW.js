var hnd46;
hnd46 = Module.findExportByName("advapi32","RegDeleteKeyExW");
Interceptor.attach(hnd46, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hKey = get_hkey(args[0]);
        api_arguments.lpSubKey = get_lpcwstr(args[1]);
        api_arguments.samDesired = get_regsam(args[2]);
        api_arguments.Reserved = get_dword(args[3]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "RegDeleteKeyExW"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 