var hnd97;
hnd97 = Module.findExportByName("advapi32","CryptImportKey");
Interceptor.attach(hnd97, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hProv = get_hcryptprov(args[0]);
        api_arguments.pbData = get_byte(args[1]);
        api_arguments.dwDataLen = get_dword(args[2]);
        api_arguments.hPubKey = get_hcryptkey(args[3]);
        api_arguments.dwFlags = get_dword(args[4]);
        api_arguments.phKey = get_dword(args[5]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CryptImportKey"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {
        this.send_data.api_arguments.phKey = get_hcryptkey(this.send_data.api_arguments.phKey);

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 