var hnd96;
hnd96 = Module.findExportByName("advapi32","CryptHashSessionKey");
Interceptor.attach(hnd96, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hHash = get_hcrypthash(args[0]);
        api_arguments.hKey = get_hcryptkey(args[1]);
        api_arguments.dwFlags = get_dword(args[2]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CryptHashSessionKey"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 