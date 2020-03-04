var hnd106;
hnd106 = Module.findExportByName("kernel32","ResumeThread");
Interceptor.attach(hnd106, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.hThread = get_handle(args[0]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "ResumeThread"
        this.send_data.module_name = "kernel32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 