var hnd44;
hnd44 = Module.findExportByName("advapi32","RegDeleteKeyW");
Interceptor.attach(hnd44, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hKey = get_hkey(args[0]);
        api_arguments.lpSubKey = get_lpcwstr(args[1]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "RegDeleteKeyW"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 