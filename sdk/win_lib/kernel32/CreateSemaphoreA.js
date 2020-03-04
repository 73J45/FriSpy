var hnd61;
hnd61 = Module.findExportByName("kernel32","CreateSemaphoreA");
Interceptor.attach(hnd61, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.lpSemaphoreAttributes = get_lpsecurity_attributes(args[0]);
        api_arguments.lInitialCount = get_long(args[1]);
        api_arguments.lMaximumCount = get_long(args[2]);
        api_arguments.lpName = get_lpcstr(args[3]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CreateSemaphoreA"
        this.send_data.module_name = "kernel32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 