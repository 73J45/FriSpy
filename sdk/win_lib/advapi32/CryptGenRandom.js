var hnd91;
hnd91 = Module.findExportByName("advapi32","CryptGenRandom");
Interceptor.attach(hnd91, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hProv = get_hcryptprov(args[0]);
        api_arguments.dwLen = get_dword(args[1]);
        api_arguments.pbBuffer = get_dword(args[2]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CryptGenRandom"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {
        this.send_data.api_arguments.pbBuffer = get_byte(this.send_data.api_arguments.pbBuffer);

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 