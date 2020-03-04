var hnd87;
hnd87 = Module.findExportByName("advapi32","CryptDestroyKey");
Interceptor.attach(hnd87, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hKey = get_dword(args[0]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CryptDestroyKey"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 