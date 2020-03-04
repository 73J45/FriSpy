var hnd54;
hnd54 = Module.findExportByName("kernel32","CreateEventW");
Interceptor.attach(hnd54, {
    onEnter: function (args) {

        var api_arguments = {};
        api_arguments.lpEventAttributes = get_lpsecurity_attributes(args[0]);
        api_arguments.bManualReset = get_bool(args[1]);
        api_arguments.bInitialState = get_bool(args[2]);
        api_arguments.lpName = get_lpcwstr(args[3]);

        this.send_data = {}
        this.send_data.Date = Date()
        this.send_data.api_name = "CreateEventW"
        this.send_data.module_name = "kernel32"
        this.send_data.api_arguments = api_arguments

    },
    onLeave: function (retval) {

        this.send_data.api_retval = retval
        send(JSON.stringify(this.send_data, null, 4));
    }
 });
 