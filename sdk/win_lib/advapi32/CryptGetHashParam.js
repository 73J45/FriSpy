var hnd92;
hnd92 = Module.findExportByName("advapi32","CryptGetHashParam");
Interceptor.attach(hnd92, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hHash = get_hcrypthash(args[0]);
        api_arguments.dwParam = get_dword(args[1]);
        api_arguments.pbData = get_dword(args[2]);
        api_arguments.pdwDataLen = get_dword(args[3]);
        api_arguments.dwFlags = get_dword(args[4]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CryptGetHashParam"
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
 