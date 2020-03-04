var hnd73;
hnd73 = Module.findExportByName("wininet","HttpOpenRequestA");
if (hnd73 != null){
    Interceptor.attach(hnd73, {
        onEnter: function (args) {

            var api_arguments = {};
            api_arguments.hConnect = get_hinternet(args[0]);
            api_arguments.lpszVerb = get_lpcstr(args[1]);
            api_arguments.lpszObjectName = get_lpcstr(args[2]);
            api_arguments.lpszVersion = get_lpcstr(args[3]);
            api_arguments.lpszReferrer = get_lpcstr(args[4]);
            api_arguments.lplpszAcceptTypes = get_dword(args[5]);//get_lpcstr(args[5]);
            api_arguments.dwFlags = get_dword(args[6]);
            api_arguments.dwContext = get_dword_ptr(args[7]);

            this.send_data = {}
            this.send_data.Date = Date()
            this.send_data.api_name = "HttpOpenRequestA"
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
    send_data.api_name = "HttpOpenRequestA"
    send_data.module_name = "wininet"
    send_data.api_arguments = "Invalid Handle : HttpOpenRequestA"
    send_data.api_retval = "warn"
    send(JSON.stringify(send_data, null, 4));
}