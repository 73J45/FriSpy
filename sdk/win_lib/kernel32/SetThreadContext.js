var hnd104;
hnd104 = Module.findExportByName("kernel32","SetThreadContext");
Interceptor.attach(hnd104, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hThread = get_handle(args[0]);
        api_arguments.lpContext = get_thread_context(args[1]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "SetThreadContext"
        this.send_data.module_name = "kernel32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 