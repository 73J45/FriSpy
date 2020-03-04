var hnd27;
hnd27 = Module.findExportByName("kernel32","WriteFile");
Interceptor.attach(hnd27, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hFile = get_handle(args[0]);
        api_arguments.nNumberOfBytesToWrite = StringToInt(get_dword(args[2]));
        //console.log("WrFile:" + api_arguments.nNumberOfBytesToWrite)
        api_arguments.lpBuffer = get_hex_dump_int(args[1], api_arguments.nNumberOfBytesToWrite);
        api_arguments.lpNumberOfBytesWritten = get_dword(args[3]);
        api_arguments.lpOverlapped = get_dword(args[4]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "WriteFile"
        this.send_data.module_name = "kernel32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {
        this.send_data.api_arguments.lpNumberOfBytesWritten = get_lpdword(this.send_data.api_arguments.lpNumberOfBytesWritten);
        this.send_data.api_arguments.lpOverlapped = get_lpoverlapped(this.send_data.api_arguments.lpOverlapped);

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
});
