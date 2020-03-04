var hnd101;
hnd101 = Module.findExportByName("kernel32","ReadProcessMemory");
Interceptor.attach(hnd101, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hProcess = get_handle(args[0]);
        api_arguments.lpBaseAddress = get_dword(args[1]);
        api_arguments.lpBuffer = get_dword(args[2]);
        api_arguments.nSize = StringToInt(get_dword(args[3]));
        api_arguments.lpNumberOfBytesRead = get_dword(args[4]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "ReadProcessMemory"
        this.send_data.module_name = "kernel32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {
        this.send_data.api_arguments.lpBuffer = get_hex_dump_int(this.send_data.api_arguments.lpBuffer, this.send_data.api_arguments.nSize);
        this.send_data.api_arguments.nSize = ToHexString(get_dword(this.send_data.api_arguments.nSize));
        this.send_data.api_arguments.lpNumberOfBytesRead = get_lpvoid(this.send_data.api_arguments.lpNumberOfBytesRead);

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 