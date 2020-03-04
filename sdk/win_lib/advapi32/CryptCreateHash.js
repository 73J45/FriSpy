var hnd83;
hnd83 = Module.findExportByName("advapi32","CryptCreateHash");
Interceptor.attach(hnd83, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hProv = get_dword(args[0]);
        api_arguments.Algid = get_crypto_prov_alg_id(args[1]);
        api_arguments.hKey = get_hcryptkey(args[2]);
        api_arguments.dwFlags = get_dword(args[3]);
        api_arguments.phHash = get_dword(args[4]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CryptCreateHash"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {
        this.send_data.api_arguments.phHash = ToHexString(get_hcrypthash(this.send_data.api_arguments.phHash));

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 