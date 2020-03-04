var hnd69;
hnd69 = Module.findExportByName("wininet","InternetReadFile");
if (hnd69 != null){
    Interceptor.attach(hnd69, {
        onEnter: function (args) {

            var api_arguments = {};
            api_arguments.hFile = get_hinternet(args[0]);
            api_arguments.lpBuffer = (args[1]);
            api_arguments.dwNumberOfBytesToRead = get_dword(args[2]);
            api_arguments.lpdwNumberOfBytesRead = (args[3]);

            this.send_data = {}
            this.send_data.Date = Date()
            this.send_data.api_name = "InternetReadFile"
            this.send_data.module_name = "wininet"
            this.send_data.api_arguments = api_arguments

        },
        onLeave: function (retval) {
            this.send_data.api_arguments.lpdwNumberOfBytesRead = (get_lpdword(this.send_data.api_arguments.lpdwNumberOfBytesRead));
            this.send_data.api_arguments.lpBuffer = get_hex_dump_int(this.send_data.api_arguments.lpBuffer, this.send_data.api_arguments.lpdwNumberOfBytesRead);
            this.send_data.api_retval = retval
            send(JSON.stringify(this.send_data, null, 4));
        }
    }); 
}
else{
    var send_data = {}
    send_data.Date = Date()
    send_data.api_name = "InternetReadFile"
    send_data.module_name = "wininet"
    send_data.api_arguments = "Invalid Handle : InternetReadFile"
    send_data.api_retval = "warn"
    send(JSON.stringify(send_data, null, 4));
}

 