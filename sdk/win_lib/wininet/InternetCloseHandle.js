var hnd80;
hnd80 = Module.findExportByName("wininet","InternetCloseHandle");
if (hnd80 != null){
    Interceptor.attach(hnd80, {
        onEnter: function (args) {

            var api_arguments = {};
            api_arguments.hInternet = get_hinternet(args[0]);

            this.send_data = {}
            this.send_data.Date = Date()
            this.send_data.api_name = "InternetCloseHandle"
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
    send_data.api_name = "InternetCloseHandle"
    send_data.module_name = "wininet"
    send_data.api_arguments = "Invalid Handle : InternetCloseHandle"
    send_data.api_retval = "warn"
    send(JSON.stringify(send_data, null, 4));
}
 