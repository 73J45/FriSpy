var hnd95;
hnd95 = Module.findExportByName("advapi32","CryptHashData");
Interceptor.attach(hnd95, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hHash = get_dword(args[0]);
        api_arguments.pbData = get_hex_dump_int(get_dword(args[1]), StringToInt(args[2]));
        api_arguments.dwDataLen = get_dword(args[2]);
        api_arguments.dwFlags = get_dword(args[3]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CryptHashData"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 