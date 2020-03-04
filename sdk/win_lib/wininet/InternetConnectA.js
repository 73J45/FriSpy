var hnd18;
hnd18 = Module.findExportByName("wininet","InternetConnectA");
if (hnd18 != null){
	Interceptor.attach(hnd18, {
		onEnter: function (args) {

			var api_arguments = {};
			api_arguments.hInternet = get_hinternet(args[0]);
			api_arguments.lpszServerName = get_lpcstr(args[1]);
			api_arguments.nServerPort = get_internet_port(args[2]);
			api_arguments.lpszUserName = get_lpcstr(args[3]);
			api_arguments.lpszPassword = get_lpcstr(args[4]);
			api_arguments.dwService = get_dword(args[5]);
			api_arguments.dwFlags = get_dword(args[6]);
			api_arguments.dwContext = get_dword_ptr(args[7]);

			this.send_data = {}
			this.send_data.Date = Date()
			this.send_data.api_name = "InternetConnectA"
			this.send_data.module_name = "wininet"
			this.send_data.api_arguments = api_arguments

			},
		onLeave: function (retval) {

			this.send_data.api_retval = retval
			send(JSON.stringify(this.send_data, null, 4));
			}
	});
}
else{
    var send_data = {}
    send_data.Date = Date()
    send_data.api_name = "InternetConnectA"
    send_data.module_name = "wininet"
    send_data.api_arguments = "Invalid Handle : InternetConnectA"
    send_data.api_retval = "warn"
    send(JSON.stringify(send_data, null, 4));
}
