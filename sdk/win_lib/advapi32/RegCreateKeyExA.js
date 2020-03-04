var hnd37;
hnd37 = Module.findExportByName("advapi32","RegCreateKeyExA");
Interceptor.attach(hnd37, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hKey = get_hkey(args[0]);
        api_arguments.lpSubKey = get_lpcstr(args[1]);
        api_arguments.Reserved = get_dword(args[2]);
        api_arguments.lpClass = get_lpstr(args[3]);
        api_arguments.dwOptions = get_dword(args[4]);
        api_arguments.samDesired = get_regsam(args[5]);
        api_arguments.lpSecurityAttributes = get_lpsecurity_attributes(args[6]);
        api_arguments.phkResult = get_dword(args[7]);
        api_arguments.lpdwDisposition = get_dword(args[8]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "RegCreateKeyExA"
        this.send_data.module_name = "advapi32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {
        this.send_data.api_arguments.phkResult = get_phkey(this.send_data.api_arguments.phkResult);
        this.send_data.api_arguments.lpdwDisposition = get_lpdword(this.send_data.api_arguments.lpdwDisposition);

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 