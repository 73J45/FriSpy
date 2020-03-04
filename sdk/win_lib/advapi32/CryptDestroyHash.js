var hnd86;
hnd86 = Module.findExportByName("advapi32","CryptDestroyHash");
Interceptor.attach(hnd86, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hHash = get_dword(args[0]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CryptDestroyHash"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 