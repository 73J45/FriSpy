var hnd68;
hnd68 = Module.findExportByName("wininet","HttpSendRequestExW");
if (hnd68 != null){
    Interceptor.attach(hnd68, {
        onEnter: function (args) {

            var api_arguments = {};
            api_arguments.hRequest = get_hinternet(args[0]);
            api_arguments.lpBuffersIn = get_lpinternetbuffersw(args[1]);
            api_arguments.lpBuffersOut = get_dword(args[2]);
            api_arguments.dwFlags = get_dword(args[3]);
            api_arguments.dwContext = get_dword_ptr(args[4]);

            this.send_data = {}
            this.send_data.Date = Date()
            this.send_data.api_name = "HttpSendRequestExW"
            this.send_data.module_name = "wininet"
            this.send_data.api_arguments = api_arguments

        },
        onLeave: function (retval) {
            this.send_data.api_arguments.lpBuffersOut = get_lpinternetbuffersw(this.send_data.api_arguments.lpBuffersOut);

            this.send_data.api_retval = retval
            send(JSON.stringify(this.send_data, null, 4));
        }
    });
}
else{
    var send_data = {}
    send_data.Date = Date()
    send_data.api_name = "HttpSendRequestExW"
    send_data.module_name = "wininet"
    send_data.api_arguments = "Invalid Handle : HttpSendRequestExW"
    send_data.api_retval = "warn"
    send(JSON.stringify(send_data, null, 4));

}