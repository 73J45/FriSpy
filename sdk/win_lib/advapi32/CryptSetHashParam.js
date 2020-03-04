var hnd99;
hnd99 = Module.findExportByName("advapi32","CryptSetHashParam");
Interceptor.attach(hnd99, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hHash = get_hcrypthash(args[0]);
        api_arguments.dwParam = get_dword(args[1]);
        api_arguments.pbData = get_byte(args[2]);
        api_arguments.dwFlags = get_dword(args[3]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CryptSetHashParam"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 