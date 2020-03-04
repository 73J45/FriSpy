var hnd77;
hnd77 = Module.findExportByName("wininet","InternetOpenW");
if (hnd77 != null){
    Interceptor.attach(hnd77, {
        onEnter: function (args) {

            var api_arguments = {};
            api_arguments.lpszAgent = get_lpcwstr(args[0]);
            api_arguments.dwAccessType = get_dword(args[1]);
            api_arguments.lpszProxy = get_lpcwstr(args[2]);
            api_arguments.lpszProxyBypass = get_lpcwstr(args[3]);
            api_arguments.dwFlags = get_dword(args[4]);

            this.send_data = {}
            this.send_data.Date = Date()
            this.send_data.api_name = "InternetOpenW"
            this.send_data.module_name = "wininet"
            this.send_data.api_arguments = api_arguments

        },
        onLeave: function (retval) {

            this.send_data.api_retval = retval
            send(JSON.stringify(this.send_data, null, 4));
        }
    });
}
else{
    var send_data = {}
    send_data.Date = Date()
    send_data.api_name = "InternetOpenW"
    send_data.module_name = "wininet"
    send_data.api_arguments = "Invalid Handle : InternetOpenW"
    send_data.api_retval = "warn"
    send(JSON.stringify(send_data, null, 4));
}