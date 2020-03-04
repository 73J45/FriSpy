var hnd74;
hnd74 = Module.findExportByName("wininet","HttpOpenRequestW");
if (hnd74 != null){
    Interceptor.attach(hnd74, {
        onEnter: function (args) {

            var api_arguments = {};
            api_arguments.hConnect = get_hinternet(args[0]);
            api_arguments.lpszVerb = get_lpcwstr(args[1]);
            api_arguments.lpszObjectName = get_lpcwstr(args[2]);
            api_arguments.lpszVersion = get_lpcwstr(args[3]);
            api_arguments.lpszReferrer = get_lpcwstr(args[4]);
            api_arguments.lplpszAcceptTypes = get_dword(args[5]);//get_lpcwstr(args[5]);
            api_arguments.dwFlags = get_dword(args[6]);
            api_arguments.dwContext = get_dword_ptr(args[7]);

            this.send_data = {}
            this.send_data.Date = Date()
            this.send_data.api_name = "HttpOpenRequestW"
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
    send_data.api_name = "HttpOpenRequestW"
    send_data.module_name = "wininet"
    send_data.api_arguments = "Invalid Handle : HttpOpenRequestW"
    send_data.api_retval = "warn"
    send(JSON.stringify(send_data, null, 4));
}
