var hnd85;
hnd85 = Module.findExportByName("advapi32","CryptDeriveKey");
Interceptor.attach(hnd85, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hProv = get_dword(args[0]);
        api_arguments.Algid = get_crypto_prov_alg_id(args[1]);
        api_arguments.hBaseData = ToHexString(get_dword(args[2]));
        api_arguments.dwFlags = get_dword(args[3]);
        api_arguments.phKey = get_dword(args[4]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CryptDeriveKey"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {
        this.send_data.api_arguments.phKey = ToHexString(get_hcryptkey(this.send_data.api_arguments.phKey));

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 