var hnd25;
hnd25 = Module.findExportByName("kernel32","ReadFile");
Interceptor.attach(hnd25, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hFile = get_handle(args[0]);
        api_arguments.lpBuffer = get_dword(args[1]);
        api_arguments.nNumberOfBytesToRead = get_dword(args[2]);
        api_arguments.lpNumberOfBytesRead = get_dword(args[3]);
        api_arguments.lpOverlapped = get_dword(args[4]);
        console.log("----1------" + api_arguments.lpNumberOfBytesRead + " " + get_lpdword(api_arguments.lpNumberOfBytesRead) )

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "ReadFile"
        this.send_data.module_name = "kernel32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {
        
        this.send_data.api_arguments.lpNumberOfBytesRead = (get_lpdword(this.send_data.api_arguments.lpNumberOfBytesRead));
        this.send_data.api_arguments.lpBuffer = get_hex_dump_int(this.send_data.api_arguments.lpBuffer, this.send_data.api_arguments.lpNumberOfBytesRead);
        this.send_data.api_arguments.lpNumberOfBytesRead = (ToHexString(this.send_data.api_arguments.lpNumberOfBytesRead));


        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 