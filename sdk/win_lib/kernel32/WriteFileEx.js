var hnd28;
hnd28 = Module.findExportByName("kernel32","WriteFileEx");
Interceptor.attach(hnd28, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hFile = get_handle(args[0]);
        api_arguments.nNumberOfBytesToWrite = get_dword(args[2]);
        api_arguments.lpBuffer = get_hex_dump(args[1], api_arguments.nNumberOfBytesToWrite);
        api_arguments.lpOverlapped = get_dword(args[3]);
        api_arguments.lpCompletionRoutine = get_dword(args[4]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "WriteFileEx"
        this.send_data.module_name = "kernel32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {
        this.send_data.api_arguments.lpOverlapped = get_lpoverlapped(this.send_data.api_arguments.lpOverlapped);
        this.send_data.api_arguments.lpCompletionRoutine = get_lpoverlapped_completion_routine(this.send_data.api_arguments.lpCompletionRoutine);

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 