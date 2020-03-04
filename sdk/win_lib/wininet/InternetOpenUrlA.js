var hnd78;
hnd78 = Module.findExportByName("wininet","InternetOpenUrlA");
if (hnd78 != null){
    Interceptor.attach(hnd78, {
        onEnter: function (args) {

            var api_arguments = {};
            api_arguments.hInternet = get_hinternet(args[0]);
            api_arguments.lpszUrl = get_lpcstr(args[1]);
            api_arguments.lpszHeaders = get_lpcstr(args[2]);
            api_arguments.dwHeadersLength = get_dword(args[3]);
            api_arguments.dwFlags = get_dword(args[4]);
            api_arguments.dwContext = get_dword_ptr(args[5]);

            this.send_data = {}
            this.send_data.Date = Date()
            this.send_data.api_name = "InternetOpenUrlA"
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
    send_data.api_name = "InternetOpenUrlA"
    send_data.module_name = "wininet"
    send_data.api_arguments = "Invalid Handle : InternetOpenUrlA"
    send_data.api_retval = "warn"
    send(JSON.stringify(send_data, null, 4));
}
  
 