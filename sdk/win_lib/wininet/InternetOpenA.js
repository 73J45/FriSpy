var hnd76;
hnd76 = Module.findExportByName("wininet","InternetOpenA");
if (hnd76 != null){
    Interceptor.attach(hnd76, {
        onEnter: function (args) {

            var api_arguments = {};
            api_arguments.lpszAgent = get_lpcstr(args[0]);
            api_arguments.dwAccessType = get_dword(args[1]);
            api_arguments.lpszProxy = get_lpcstr(args[2]);
            api_arguments.lpszProxyBypass = get_lpcstr(args[3]);
            api_arguments.dwFlags = get_dword(args[4]);

            this.send_data = {}
            this.send_data.Date = Date()
            this.send_data.api_name = "InternetOpenA"
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
    send_data.api_name = "InternetOpenA"
    send_data.module_name = "wininet"
    send_data.api_arguments = "Invalid Handle : InternetOpenA"
    send_data.api_retval = "warn"
    send(JSON.stringify(send_data, null, 4));
}
  