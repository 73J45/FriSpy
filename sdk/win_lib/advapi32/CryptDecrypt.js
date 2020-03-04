var hnd84;
hnd84 = Module.findExportByName("advapi32","CryptDecrypt");
Interceptor.attach(hnd84, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hKey = get_hcryptkey(args[0]);
        api_arguments.hHash = get_hcrypthash(args[1]);
        api_arguments.Final = get_bool(args[2]);
        api_arguments.dwFlags = get_dword(args[3]);
        api_arguments.pbData = get_dword(args[4]);
        api_arguments.pdwDataLen = get_dword(args[5]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CryptDecrypt"
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
 