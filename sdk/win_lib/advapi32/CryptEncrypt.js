var hnd88;
hnd88 = Module.findExportByName("advapi32","CryptEncrypt");
Interceptor.attach(hnd88, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hKey = get_hcryptkey(args[0]);
        api_arguments.hHash = get_hcrypthash(args[1]);
        api_arguments.Final = get_bool(args[2]);
        api_arguments.dwFlags = get_dword(args[3]);
        api_arguments.pbData = get_dword(args[4]);
        api_arguments.pdwDataLen = get_dword(args[5]);
        api_arguments.dwBufLen = get_dword(args[6]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CryptEncrypt"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {
        this.send_data.api_arguments.pbData = get_byte(this.send_data.api_arguments.pbData);
        this.send_data.api_arguments.pdwDataLen = get_dword(this.send_data.api_arguments.pdwDataLen);

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 