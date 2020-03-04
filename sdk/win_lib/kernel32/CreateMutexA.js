var hnd57;
hnd57 = Module.findExportByName("kernel32","CreateMutexA");
Interceptor.attach(hnd57, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.lpMutexAttributes = get_lpsecurity_attributes(args[0]);
        api_arguments.bInitialOwner = get_bool(args[1]);
        api_arguments.lpName = get_lpcstr(args[2]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CreateMutexA"
        this.send_data.module_name = "kernel32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 