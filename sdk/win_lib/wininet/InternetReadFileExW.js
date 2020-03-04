var hnd71;
hnd71 = Module.findExportByName("wininet","InternetReadFileExW");
if (hnd71 != null) {
    Interceptor.attach(hnd71, {
        onEnter: function (args) {

            var api_arguments = {};
            api_arguments.hFile = get_hinternet(args[0]);
            api_arguments.lpBuffersOut = get_dword(args[1]);
            api_arguments.dwFlags = get_dword(args[2]);
            api_arguments.dwContext = get_dword_ptr(args[3]);

            this.send_data = {}
            this.send_data.Date = Date()
            this.send_data.api_name = "InternetReadFileExW"
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
    send_data.api_name = "InternetReadFileExW"
    send_data.module_name = "wininet"
    send_data.api_arguments = "Invalid Handle : InternetReadFileExW"
    send_data.api_retval = "warn"
    send(JSON.stringify(send_data, null, 4));
}