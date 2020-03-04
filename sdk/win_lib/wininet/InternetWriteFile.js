var hnd72;
hnd72 = Module.findExportByName("wininet","InternetWriteFile");
if (hnd72 != null){
    Interceptor.attach(hnd72, {
        onEnter: function (args) {

            var api_arguments = {};
            api_arguments.hFile = get_hinternet(args[0]);
            api_arguments.lpBuffer = get_dword(args[1]);
            api_arguments.dwNumberOfBytesToWrite = get_dword(args[2]);
            api_arguments.lpdwNumberOfBytesWritten = get_dword(args[3]);

            this.send_data = {}
            this.send_data.Date = Date()
            this.send_data.api_name = "InternetWriteFile"
            this.send_data.module_name = "wininet"
            this.send_data.api_arguments = api_arguments

        },
        onLeave: function (retval) {
            this.send_data.api_arguments.lpdwNumberOfBytesWritten = get_lpdword(this.send_data.api_arguments.lpdwNumberOfBytesWritten);

            this.send_data.api_retval = retval
            send(JSON.stringify(this.send_data, null, 4));
        }
    });

}
else{
    var send_data = {}
    send_data.Date = Date()
    send_data.api_name = "InternetWriteFile"
    send_data.module_name = "wininet"
    send_data.api_arguments = "Invalid Handle : InternetWriteFile"
    send_data.api_retval = "warn"
    send(JSON.stringify(send_data, null, 4));
}
 