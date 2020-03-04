var hnd81;
hnd81 = Module.findExportByName("advapi32","CryptAcquireContextA");
Interceptor.attach(hnd81, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.phProv = get_dword(args[0]);
        api_arguments.szContainer = get_lpcstr(args[1]);
        api_arguments.szProvider = get_lpcstr(args[2]);
        api_arguments.dwProvType = get_crypto_provider_type(args[3]);
        api_arguments.dwFlags = get_crypto_prov_acquire_context_flag(args[4]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CryptAcquireContextA"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {
        this.send_data.api_arguments.phProv = ToHexString(get_hcryptprov(this.send_data.api_arguments.phProv));

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 