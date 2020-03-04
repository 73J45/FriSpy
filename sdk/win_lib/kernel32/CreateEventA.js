var hnd53;
hnd53 = Module.findExportByName("kernel32","CreateEventA");
Interceptor.attach(hnd53, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.lpEventAttributes = get_lpsecurity_attributes(args[0]);
        api_arguments.bManualReset = get_bool(args[1]);
        api_arguments.bInitialState = get_bool(args[2]);
        api_arguments.lpName = get_lpcstr(args[3]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CreateEventA"
        this.send_data.module_name = "kernel32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 