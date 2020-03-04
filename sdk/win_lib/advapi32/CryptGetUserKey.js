var hnd94;
hnd94 = Module.findExportByName("advapi32","CryptGetUserKey");
Interceptor.attach(hnd94, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hProv = get_dword(args[0]);
        api_arguments.dwKeySpec = get_crypto_prov_key_spec(args[1]);
        api_arguments.phUserKey = get_dword(args[2]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CryptGetUserKey"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {
        this.send_data.api_arguments.phUserKey = ToHexString(get_hcryptkey(this.send_data.api_arguments.phUserKey));

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 