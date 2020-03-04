var hnd65;
hnd65 = Module.findExportByName("wininet","HttpSendRequestA");
    if (hnd65 !=null){
    Interceptor.attach(hnd65, {
        onEnter: function (args) {

            var api_arguments = {};
            api_arguments.hRequest = get_hinternet(args[0]);
            api_arguments.lpszHeaders = get_lpcstr(args[1]);
            api_arguments.dwHeadersLength = get_dword(args[2]);
            api_arguments.lpOptional = get_lpvoid(args[3]);
            api_arguments.dwOptionalLength = get_dword(args[4]);

            this.send_data = {}
            this.send_data.Date = Date()
            this.send_data.api_name = "HttpSendRequestA"
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
    send_data.api_name = "HttpSendRequestA"
    send_data.module_name = "wininet"
    send_data.api_arguments = "Invalid Handle : HttpSendRequestA"
    send_data.api_retval = "warn"
    send(JSON.stringify(send_data, null, 4));

}