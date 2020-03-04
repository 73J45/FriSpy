var hnd89;
hnd89 = Module.findExportByName("advapi32","CryptExportKey");
Interceptor.attach(hnd89, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hKey = ToHexString(get_dword(args[0]));
        api_arguments.hExpKey = ToHexString(get_dword(args[1]));
        api_arguments.dwBlobType = get_dword(args[2]);
        api_arguments.dwFlags = get_dword(args[3]);
        api_arguments.pbData = get_dword(args[4]);
        api_arguments.pdwDataLen = get_dword(args[5]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CryptExportKey"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {
        this.send_data.api_arguments.pdwDataLen = get_lpvoid(this.send_data.api_arguments.pdwDataLen);
        if (this.send_data.api_arguments.pbData != "0x0"){
            this.send_data.api_arguments.pbData = get_hex_dump_int(this.send_data.api_arguments.pbData, this.send_data.api_arguments.pdwDataLen);
        }
        this.send_data.api_arguments.pdwDataLen = ToHexString(this.send_data.api_arguments.pdwDataLen);

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 