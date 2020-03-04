//Wrapper implementation on FRIDA APIs for fetching the arguments information for Hooked API 
var b_OS_Win64 = "32-bit"
var msg
//-------------  STRING APIs  -------------//
	var get_lpstr = function(arg_lpstr){
		//Datatype: LPSTR
		if (arg_lpstr == 0){
			return arg_lpstr
		}
		return arg_lpstr.readUtf8String()
	};
	var get_lpcstr = function(arg_lpcstr){
		//Datatype: LPCSTR
		if (arg_lpcstr == 0){
			return arg_lpcstr
		}
		return arg_lpcstr.readUtf8String()
	};
	var get_lpcwstr = function(arg_lpcwstr){
		//Datatype: LPCWSTR
		if (arg_lpcwstr == 0){
			return arg_lpcwstr
		}
		return arg_lpcwstr.readUtf16String()
	};
	var get_lpwstr = function(arg_lpwstr){
		//Datatype: LPWSTR
		if (arg_lpwstr == 0){
			return arg_lpwstr
		}
		return arg_lpwstr.readUtf16String()
	};


//-------------  UTILITY APIs  -------------//
	var ToHexString = function(number){
		//return ('0x' + number.toString([radix = 16]));
		return ('0x' + number.toString(16));
	};
	var seek_address = function(baseaddress, offset){
		return (new NativePointer(ToHexString(StringToInt(baseaddress) + offset)));	
	};
	var get_address_from_hex_string = function(hex_string_address){
		return (new NativePointer(hex_string_address))
	};
	var StringToInt = function(string){
		return string.toInt32();
	};
	var get_bytes = function(base_address, number_of_bytes){
		//Get bytes returns ArrayBuffer
		return Memory.readByteArray(base_address, number_of_bytes)
	};
	var get_hex_dump = function(arg_Buffer, arg_length){

		console.log("--1--hxdmp--" + arg_Buffer+" " + arg_length + "---" +StringToInt(arg_length))
		var str_dump =  hexdump(ToHexString(arg_Buffer), {offset:0, length:StringToInt(arg_length)});
		var array = str_dump.split("\n")
		array [0] = "ADDRESS                               HEX-VIEW                                     ASCII-VIEW"
		return array
	};
	var get_hex_dump_int = function(arg_Buffer, arg_length){

		console.log("--1--hxdmp--" + arg_Buffer+" " + typeof(arg_Buffer)+" " + arg_length + "---" +(arg_length))
		var str_dump =  hexdump(arg_Buffer, {offset:0, length:arg_length});
		var array = str_dump.split("\n")
		array [0] = "ADDRESS                               HEX-VIEW                                     ASCII-VIEW"
		return array
	};
//-------------  APIs to access Data from Memory  -------------//
	var get_dword = function(arg_dword){
		return arg_dword
	};
	var get_word = function(arg_word){
		return arg_word
	};
	var get_long = function(arg_long){
		return arg_long;
	};
	var get_lpbyte = function(arg_lpbyte){
		if (arg_lpbyte == 0){
			return arg_lpbyte;
		};
		return arg_lpbyte.readU8();
	};
	var get_lpvoid = function(arg_lpvoid){
		if (arg_lpvoid == 0){
			return arg_lpvoid;
		};
		return arg_lpvoid.readU32();
	};
	var get_lpcvoid = function(arg_lpcvoid){
		if (arg_lpcvoid == 0){
			return arg_lpcvoid;
		};
		return arg_lpcvoid.readU32();
	};
	var get_handle = function(arg_handle){
		return arg_handle
	};
	var get_phandle = function(arg_phandle, b_OS_Win64){
		//OS specific
		if (arg_phandle == 0){
			return arg_phandle
		}
		if (b_OS_Win64){
				return ToHexString(get_handle(arg_phandle).readU64());
			}
		else{
				return ToHexString(get_handle(arg_phandle).readU32());
			}
	};
	var get_ulong = function(arg_ulong){
		return arg_ulong
	};
	var get_pulong = function(arg_pulong){
		if (arg_pulong == 0){
			return arg_pulong
		}
		return arg_pulong.readU32()
	};
	var get_pvoid = function(arg_pvoid){
		return arg_pvoid
	};
	
	//-------------  APIs to access Data from Memory  -------------//

	var get_access_mask = function(arg_access_mask){
		return get_dword(arg_access_mask)
	};
	var get_punicode_string = function(arg_punicode_string){
		
			if (arg_punicode_string == 0){
				return arg_punicode_string
			}
	
			var sizeof_punicode_32 = 8
			try{
			var info_buffer = get_bytes(arg_punicode_string, sizeof_punicode_32)
			}
			catch(error){
				msg = "error: 1 - " + error
				return msg
			}
	
			var length = new Uint16Array(info_buffer, 0, 1);
			var maximum_length = new Uint16Array(info_buffer, 2, 1);
			var base_address = new Uint32Array(info_buffer, 4, 1);
		
			//Create dictionary
			var _PUNICODE_STRING = {};
			_PUNICODE_STRING.Length = ToHexString(length[0]),
			_PUNICODE_STRING.MaximumLength = ToHexString(maximum_length[0]),
			_PUNICODE_STRING.Buffer = get_address_from_hex_string(ToHexString(base_address[0])).readUtf16String()
			
			return _PUNICODE_STRING;	
		};
	
	var get_pobject_attributes = function(arg_pobject_attributes){

		if (arg_pobject_attributes == 0){
			return arg_pobject_attributes
		}

		var sizeof_pobject_attributes_32 = 24;//4*6

		try{
			var info_buffer = get_bytes(arg_pobject_attributes, sizeof_pobject_attributes_32)
		}
		catch(error){
			msg = "error : 1 : get_pobject_attributes - " + error
			return msg
		}
		
		try{
			//Create dictionary
			var length = new Uint32Array(info_buffer, 0, 1);
			var RootDirectory = new Uint32Array(info_buffer, 4, 1);
			var ObjectName = new Uint32Array(info_buffer, 8, 1);
			var Attributes = new Uint32Array(info_buffer, 12, 1);
			var SecurityDescriptor = new Uint32Array(info_buffer, 16, 1);
			var SecurityQualityOfService = new Uint32Array(info_buffer, 20, 1);
			
			var SECURITY_ATTRIBUTES = {};
			SECURITY_ATTRIBUTES.Length	= ToHexString(length[0]);
			
			SECURITY_ATTRIBUTES.RootDirectory = ToHexString(RootDirectory[0]),
			SECURITY_ATTRIBUTES.ObjectName = get_punicode_string(get_address_from_hex_string(ToHexString(ObjectName[0]))),
			SECURITY_ATTRIBUTES.Attributes = ToHexString(Attributes[0]),
			SECURITY_ATTRIBUTES.SecurityDescriptor = ToHexString(SecurityDescriptor[0])
			SECURITY_ATTRIBUTES.SecurityQualityOfService = ToHexString(SecurityQualityOfService[0])
				
			//console.log(JSON.stringify(SECURITY_ATTRIBUTES, null, 4));
			//console.log(hexdump(arg_securityattributes, {offset: 0,length:0x60}));
			return SECURITY_ATTRIBUTES
		}
		catch(error)
		{
			msg = "error : 2 : get_pobject_attributes - " + error
			return msg
		}
	};		

	var get_pio_status_block = function(arg_pio_status_block){

		if (arg_pio_status_block == 0){
			return arg_pio_status_block
		}

		var sizeof_pio_status_block = 8;//4*2

		try{
			var info_buffer = get_bytes(arg_pio_status_block, sizeof_pio_status_block)
		}
		catch(error){
			msg = "error_code : 1 - " + error
			return msg
		}
		
		try{
			//Create dictionary
			var Status = new Uint32Array(info_buffer, 0, 1);
			var Information = new Uint32Array(info_buffer, 4, 1);
			
			var IO_STATUS_BLOCK = {};
			IO_STATUS_BLOCK.Status	= ToHexString(Status[0]);
			IO_STATUS_BLOCK.Information = ToHexString(Information[0]);
			return IO_STATUS_BLOCK
		}
		catch(error){
			msg = "error_code : 2 - " + error
			return msg
		}
	};

	var get_plarge_integer = function(arg_plarge_integer){
		if (arg_plarge_integer == 0){
			return arg_plarge_integer
		}

		try{
			if (b_OS_Win64 == "32-bit"){
				return arg_plarge_integer.readDouble();
			}
			else{
				return arg_plarge_integer.readU64();
			}			
		}
		catch(error){

			msg = "errorcode : 1 - " + error
			return msg
		}
	};
	var get_dword_ptr = function(arg_dword_ptr, b_OS_Win64){
		if (arg_dword_ptr == 0){
			return arg_dword_ptr
		}

		try{
			if (b_OS_Win64 == "32-bit"){
				return arg_dword_ptr.readULong();
			}
			else{
				return arg_dword_ptr.readU64();
			}			
		}
		catch(error){

			msg = "errorcode : 1 - " + error
			return msg
		}
	};
	var get_pio_apc_routine = function(args_pio_apc_routine){
		//The parameter is reserved 
		return args_pio_apc_routine
	};

	var get_ntstatus = function(args_ntstatus){
		//The parameter is reserved 
		return args_ntstatus
	};
	var get_pclient_id = function(arg_pclient_id){
		return get_phandle(arg_pclient_id)
	};
	var get_hinternet  = function(arg_hinternet){
		return arg_hinternet
	};

	var get_internet_port  = function(arg_internet_port){
		return arg_internet_port.toInt32().toString()
	};

	var get_lpsecurity_attributes = function(arg_lpsecurity_attributes){

		if (arg_lpsecurity_attributes == 0){
			return arg_lpsecurity_attributes
		}

		var sizeof_lpsecurity_attributes = 12;//4*3

		try{
			var info_buffer = get_bytes(arg_lpsecurity_attributes, sizeof_lpsecurity_attributes)
		}
		catch(error){
			msg = "error : 1 : get_lpsecurity_attributes - " + error
			return msg
		}
		
		try{
			//Create dictionary
			var nlength = new Uint32Array(info_buffer, 0, 1);
			var lpSecurityDescriptor = new Uint32Array(info_buffer, 4, 1);
			var bInheritHandle = new Uint32Array(info_buffer, 8, 1);
			
			var SECURITY_ATTRIBUTES = {};
			SECURITY_ATTRIBUTES.nlength	= ToHexString(nlength[0]);
			SECURITY_ATTRIBUTES.lpSecurityDescriptor = ToHexString(lpSecurityDescriptor[0]),
			SECURITY_ATTRIBUTES.bInheritHandle = ToHexString(bInheritHandle[0])
				
			return SECURITY_ATTRIBUTES
		}
		catch(error)
		{
			msg = "error : 2 : get_lpsecurity_attributes - " + error
			return msg
		}
	};
	var get_lpofstruct = function(arg_lpofstruct){
		return get_dword(arg_lpofstruct)
	};
	var get_uint = function(arg_uint){
		return get_dword(arg_uint)
	};
	var get_lpdword = function(arg_lpdword){
		if (arg_lpdword == 0){
			return arg_lpdword;
		};
		return arg_lpdword.readU32();
	};
	var get_lpoverlapped = function(arg_lpoverlapped){
		if (arg_lpoverlapped == 0){
			return arg_lpoverlapped;
		};
		return arg_lpoverlapped.readU32();
	};
	
	var get_lpoverlapped_completion_routine = function(arg_lpoverlapped_completion_routine){
		if (arg_lpoverlapped_completion_routine == 0){
			return arg_lpoverlapped_completion_routine;
		};
		return arg_lpoverlapped_completion_routine.readU32();
	};
	var get_bool = function(arg_bool){ 
		if (arg_bool == 1){
			return "TRUE"
		};
		if (arg_bool == 0){
			return "FALSE"
		};
		return arg_bool;
	};
	var get_boolean = function(arg_boolean){
		if (arg_boolean == 1){
			return "TRUE"
		};
		if (arg_boolean == 0){
			return "FALSE"
		};
		return arg_boolean
	};

	var get_lpproc_thread_attribute_list = function(arg_lpproc_thread_attribute_list){

	};
	var get_lpstartupinfoa = function(arg_lpstartupinfoa){
	
		if (arg_lpstartupinfoa == 0){
			return arg_lpstartupinfoa
		}
	
		var sizeof_lpstartupinfoa = 68
		try{
			var info_buffer = get_bytes(arg_lpstartupinfoa, sizeof_lpstartupinfoa)
		}
		catch(error){
			msg = "error: 1 : get_lpstartupinfoa - " + error
			return msg
		}

		try{
			var cb = new Uint32Array(info_buffer, 0, 1);
			var lpReserved = new Uint32Array(info_buffer, 4, 1);
			var lpDesktop = new Uint32Array(info_buffer, 8, 1);
			var lpTitle = new Uint32Array(info_buffer, 12, 1);
			var dwX = new Uint32Array(info_buffer, 16, 1);
			var dwY = new Uint32Array(info_buffer, 20, 1);
			var dwXSize = new Uint32Array(info_buffer, 24, 1);
			var dwYSize = new Uint32Array(info_buffer, 28, 1);
			var dwXCountChars = new Uint32Array(info_buffer, 32, 1);
			var dwYCountChars = new Uint32Array(info_buffer, 36, 1);
			var dwFillAttribute = new Uint32Array(info_buffer, 40, 1);
			var dwFlags = new Uint32Array(info_buffer, 44, 1);
			var wShowWindow = new Uint16Array(info_buffer, 48, 1);
			var cbReserved2 = new Uint16Array(info_buffer, 50, 1);
			var lpReserved2 = new Uint32Array(info_buffer, 52, 1);
			var hStdInput = new Uint32Array(info_buffer, 56, 1);
			var hStdOutput = new Uint32Array(info_buffer, 60, 1);
			var hStdError = new Uint32Array(info_buffer, 64, 1);
				
			//Create dictionary
			var _STARTUPINFOA = {};
			_STARTUPINFOA.cb = ToHexString(get_dword(cb[0]));
			_STARTUPINFOA.lpReserved = ToHexString(get_lpstr(lpReserved[0]));
			_STARTUPINFOA.lpDesktop = ToHexString(get_lpstr(lpDesktop[0]));
			_STARTUPINFOA.lpTitle = ToHexString(get_lpstr(lpTitle[0]));
			_STARTUPINFOA.dwX = ToHexString(get_dword(dwX[0]));
			_STARTUPINFOA.dwY = ToHexString(get_dword(dwY[0]));
			_STARTUPINFOA.dwXSize = ToHexString(get_dword(dwXSize[0]));
			_STARTUPINFOA.dwYSize = ToHexString(get_dword(dwYSize[0]));
			_STARTUPINFOA.dwXCountChars = ToHexString(get_dword(dwXCountChars[0]));
			_STARTUPINFOA.dwYCountChars = ToHexString(get_dword(dwYCountChars[0]));
			_STARTUPINFOA.dwFillAttribute = ToHexString(get_dword(dwFillAttribute[0]));
			_STARTUPINFOA.dwFlags = ToHexString(get_dword(dwFlags[0]));
			_STARTUPINFOA.wShowWindow = ToHexString(get_word(wShowWindow[0]));
			_STARTUPINFOA.cbReserved2 = ToHexString(get_word(cbReserved2[0]));
			_STARTUPINFOA.lpReserved2 = ToHexString(get_lpbyte(lpReserved2[0]));
			_STARTUPINFOA.hStdInput = ToHexString(get_handle(hStdInput[0]));
			_STARTUPINFOA.hStdOutput = ToHexString(get_handle(hStdOutput[0]));
			_STARTUPINFOA.hStdError = ToHexString(get_handle(hStdError[0]));
	
			return _STARTUPINFOA;	
		}
		catch(error)
		{
			msg = "error : 2 : get_lpstartupinfoa - " + error
			return msg
		}
	};
	var get_lpstartupinfow = function(arg_lpstartupinfow){
	
		if (arg_lpstartupinfow == 0){
			return arg_lpstartupinfow
		}
	
		var sizeof_lpstartupinfow = 68
		try{
			var info_buffer = get_bytes(arg_lpstartupinfow, sizeof_lpstartupinfow)
		}
		catch(error){
			msg = "error: 1 : get_lpstartupinfow - " + error
			return msg
		}

		try{
			var cb = new Uint32Array(info_buffer, 0, 1);
			var lpReserved = new Uint32Array(info_buffer, 4, 1);
			var lpDesktop = new Uint32Array(info_buffer, 8, 1);
			var lpTitle = new Uint32Array(info_buffer, 12, 1);
			var dwX = new Uint32Array(info_buffer, 16, 1);
			var dwY = new Uint32Array(info_buffer, 20, 1);
			var dwXSize = new Uint32Array(info_buffer, 24, 1);
			var dwYSize = new Uint32Array(info_buffer, 28, 1);
			var dwXCountChars = new Uint32Array(info_buffer, 32, 1);
			var dwYCountChars = new Uint32Array(info_buffer, 36, 1);
			var dwFillAttribute = new Uint32Array(info_buffer, 40, 1);
			var dwFlags = new Uint32Array(info_buffer, 44, 1);
			var wShowWindow = new Uint16Array(info_buffer, 48, 1);
			var cbReserved2 = new Uint16Array(info_buffer, 50, 1);
			var lpReserved2 = new Uint32Array(info_buffer, 52, 1);
			var hStdInput = new Uint32Array(info_buffer, 56, 1);
			var hStdOutput = new Uint32Array(info_buffer, 60, 1);
			var hStdError = new Uint32Array(info_buffer, 64, 1);
				
			//Create dictionary
			var _STARTUPINFOW = {};
			_STARTUPINFOW.cb = ToHexString(get_dword(cb[0]));
			_STARTUPINFOW.lpReserved = ToHexString(get_lpwstr(lpReserved[0]));
			_STARTUPINFOW.lpDesktop = ToHexString(get_lpwstr(lpDesktop[0]));
			_STARTUPINFOW.lpTitle = ToHexString(get_lpwstr(lpTitle[0]));
			_STARTUPINFOW.dwX = ToHexString(get_dword(dwX[0]));
			_STARTUPINFOW.dwY = ToHexString(get_dword(dwY[0]));
			_STARTUPINFOW.dwXSize = ToHexString(get_dword(dwXSize[0]));
			_STARTUPINFOW.dwYSize = ToHexString(get_dword(dwYSize[0]));
			_STARTUPINFOW.dwXCountChars = ToHexString(get_dword(dwXCountChars[0]));
			_STARTUPINFOW.dwYCountChars = ToHexString(get_dword(dwYCountChars[0]));
			_STARTUPINFOW.dwFillAttribute = ToHexString(get_dword(dwFillAttribute[0]));
			_STARTUPINFOW.dwFlags = ToHexString(get_dword(dwFlags[0]));
			_STARTUPINFOW.wShowWindow = ToHexString(get_word(wShowWindow[0]));
			_STARTUPINFOW.cbReserved2 = ToHexString(get_word(cbReserved2[0]));
			_STARTUPINFOW.lpReserved2 = ToHexString(get_lpbyte(lpReserved2[0]));
			_STARTUPINFOW.hStdInput = ToHexString(get_handle(hStdInput[0]));
			_STARTUPINFOW.hStdOutput = ToHexString(get_handle(hStdOutput[0]));
			_STARTUPINFOW.hStdError = ToHexString(get_handle(hStdError[0]));
	
			return _STARTUPINFOW;	
		}
		catch(error)
		{
			msg = "error : 2 : get_lpstartupinfow - " + error
			return msg
		}

	};
	var get_lpthread_start_routine = function(arg_lpthread_start_routine){
		return arg_lpthread_start_routine
	};
	var get_size_t = function(arg_size_t){
			return ToHexString(arg_size_t);
	};
	var get_lpprocess_information = function(arg_lpprocess_information){
	
		if (arg_lpprocess_information == 0){
			return arg_lpprocess_information
		}
	
		var sizeof_lpprocess_information = 16
		try{
			var info_buffer = get_bytes(arg_lpprocess_information, sizeof_lpprocess_information);
		}
		catch(error){
			msg = "error: 1 : get_lpprocess_information - " + error
			return msg
		}

		try{
			var hProcess = new Uint32Array(info_buffer, 0, 1);
			var hThread = new Uint32Array(info_buffer, 4, 1);
			var dwProcessId = new Uint32Array(info_buffer, 8, 1);
			var dwThreadId = new Uint32Array(info_buffer, 12, 1);

			var _PROCESS_INFORMATION = {};
			_PROCESS_INFORMATION.hProcess = ToHexString(get_handle(hProcess[0]));
			_PROCESS_INFORMATION.hThread = ToHexString(get_handle(hThread[0]));
			_PROCESS_INFORMATION.dwProcessId = ToHexString(get_dword(dwProcessId[0]));
			_PROCESS_INFORMATION.dwThreadId = ToHexString(get_dword(dwThreadId[0]));

			return _PROCESS_INFORMATION
		}
		catch(error){
			msg = "error: 2 : get_lpprocess_information - " + error
			return msg
		}

	};

	var get_hkey = function(arg_hkey){
		return get_registry_key_hive(arg_hkey);
	};

	var get_phkey = function(arg_phkey){
		//OS specific
		if (arg_phkey == 0){
			return arg_phkey
		}
		return get_phandle(arg_phkey);
	};
	var get_lpinternetbuffersa = function(arg_lpinternetbuffersa){
		if (arg_lpinternetbuffersa == 0){
			return arg_lpinternetbuffersa
		}
	
		var sizeof_lpinternetbuffersa = 40
		try{
			var info_buffer = get_bytes(arg_lpinternetbuffersa, sizeof_lpinternetbuffersa);
		}
		catch(error){
			msg = "error: 1 : get_lpinternetbuffersa - " + error
			return msg
		}

		try{
			var dwStructSize = new Uint32Array(info_buffer, 0, 1);	
			var Next = new Uint32Array(info_buffer, 4, 1);	
			var lpcszHeader = new Uint32Array(info_buffer, 8, 1);	
			var dwHeadersLength = new Uint32Array(info_buffer, 12, 1);	
			var dwHeadersTotal = new Uint32Array(info_buffer, 16, 1);	
			var lpvBuffer = new Uint32Array(info_buffer, 20, 1);	
			var dwBufferLength = new Uint32Array(info_buffer, 24, 1);	
			var dwBufferTotal = new Uint32Array(info_buffer, 28, 1);	
			var dwOffsetLow = new Uint32Array(info_buffer, 32, 1);	
			var dwOffsetHigh = new Uint32Array(info_buffer, 36, 1);	
			
			var _INTERNET_BUFFERSA = {};
			_INTERNET_BUFFERSA.dwStructSize = ToHexString(get_dword(dwStructSize[0]));
			_INTERNET_BUFFERSA.Next =ToHexString(get_lpinternetbuffersa(Next[0]));
			_INTERNET_BUFFERSA.lpcszHeader = ToHexString(get_lpcwstr(lpcszHeader[0]));
			_INTERNET_BUFFERSA.dwHeadersLength = ToHexString(get_dword(dwHeadersLength[0]));
			_INTERNET_BUFFERSA.dwHeadersTotal = ToHexString(get_dword(dwHeadersTotal[0]));
			_INTERNET_BUFFERSA.lpvBuffer = ToHexString(lpvBuffer[0]);
			_INTERNET_BUFFERSA.dwBufferLength = ToHexString(get_dword(dwBufferLength[0]));
			_INTERNET_BUFFERSA.dwBufferTotal = ToHexString(get_dword(dwBufferTotal[0]));
			_INTERNET_BUFFERSA.dwOffsetLow = ToHexString(get_dword(dwOffsetLow[0]));
			_INTERNET_BUFFERSA.dwOffsetHigh = ToHexString(get_dword(dwOffsetHigh[0]));
	
			return _INTERNET_BUFFERSA;	
		}
		catch(error)
		{
			msg = "error : 2 : get_lpinternetbuffersa - " + error
			return msg
		}
	};
	var get_lpinternetbuffersw = function(arg_lpinternetbuffersw){
		if (arg_lpinternetbuffersw == 0){
			return arg_lpinternetbuffersw
		}
		var sizeof_lpinternetbuffersw = 40
		try{
			var info_buffer = get_bytes(arg_lpinternetbuffersw, sizeof_lpinternetbuffersw)
		}
		catch(error){
			msg = "error: 1 : get_lpinternetbuffersw - " + error
			return msg
		}

		try{
			var dwStructSize = new Uint32Array(info_buffer, 0, 1);	
			var Next = new Uint32Array(info_buffer, 4, 1);	
			var lpcszHeader = new Uint32Array(info_buffer, 8, 1);	
			var dwHeadersLength = new Uint32Array(info_buffer, 12, 1);	
			var dwHeadersTotal = new Uint32Array(info_buffer, 16, 1);	
			var lpvBuffer = new Uint32Array(info_buffer, 20, 1);	
			var dwBufferLength = new Uint32Array(info_buffer, 24, 1);	
			var dwBufferTotal = new Uint32Array(info_buffer, 28, 1);	
			var dwOffsetLow = new Uint32Array(info_buffer, 32, 1);	
			var dwOffsetHigh = new Uint32Array(info_buffer, 36, 1);	
			
			var _INTERNET_BUFFERSW = {};
			_INTERNET_BUFFERSW.dwStructSize = ToHexString(get_dword(dwStructSize[0]));
			_INTERNET_BUFFERSW.Next = ToHexString(get_lpinternetbuffersw(Next[0]));
			_INTERNET_BUFFERSW.lpcszHeader = ToHexString(get_lpcstr(lpcszHeader[0]));
			_INTERNET_BUFFERSW.dwHeadersLength = ToHexString(get_dword(dwHeadersLength[0]));
			_INTERNET_BUFFERSW.dwHeadersTotal = ToHexString(get_dword(dwHeadersTotal[0]));
			_INTERNET_BUFFERSW.lpvBuffer = ToHexString(lpvBuffer[0]);
			_INTERNET_BUFFERSW.dwBufferLength = ToHexString(get_dword(dwBufferLength[0]));
			_INTERNET_BUFFERSW.dwBufferTotal = ToHexString(get_dword(dwBufferTotal[0]));
			_INTERNET_BUFFERSW.dwOffsetLow = ToHexString(get_dword(dwOffsetLow[0]));
			_INTERNET_BUFFERSW.dwOffsetHigh = ToHexString(get_dword(dwOffsetHigh[0]));
	
			return _INTERNET_BUFFERSW;
		}
		catch(error)
		{
			msg = "error : 2 : get_lpinternetbuffersw - " + error
			return msg
		}
	};
	var get_hcryptprov = function(arg_hcryptprov){
		if (arg_hcryptprov == 0){
			return arg_hcryptprov
		};
		return arg_hcryptprov.readULong();
	};
	var get_crypto_provider_type = function(arg_crypto_provider_type){

		try {
			if ((arg_crypto_provider_type < 1) || (arg_crypto_provider_type > 23) || (arg_crypto_provider_type == 19)){
				msg = "errorcode : 2 : get_crypto_provider_type - Type not defined"
				return msg
			};

			var arg_crypto_provider_index = StringToInt(arg_crypto_provider_type);
			var array_crypto_provider_type = ["PROV_RSA_FULL","PROV_RSA_SIG","PROV_DSS","PROV_FORTEZZA","PROV_MS_EXCHANGE","PROV_SSL","PROV_STT_MER","PROV_STT_ACQ","PROV_STT_BRND","PROV_STT_ROOT","PROV_STT_ISS","PROV_RSA_SCHANNEL","PROV_DSS_DH","PROV_EC_ECDSA_SIG","PROV_EC_ECNRA_SIG","PROV_EC_ECDSA_FULL","PROV_EC_ECNRA_FULL","PROV_DH_SCHANNEL","","PROV_SPYRUS_LYNKS","PROV_RNG","PROV_INTEL_SEC","PROV_REPLACE_OWF","PROV_RSA_AES"];
			return array_crypto_provider_type[arg_crypto_provider_index - 1]
		}
		catch(error){

			msg = "errorcode : 1 : get_crypto_provider_type - " + error;
			return msg;
		}
	};
	var get_crypto_prov_acquire_context_flag = function(arg_crypto_prov_acquire_context_flag){
		var crypto_prov_acquire_context_flag = StringToInt(arg_crypto_prov_acquire_context_flag);		

		var array_crypto_prov_context_flag = []
		if (crypto_prov_acquire_context_flag & 0xF0000000){
			array_crypto_prov_context_flag.push("CRYPT_VERIFYCONTEXT");
		}
		if (crypto_prov_acquire_context_flag & 0x00000008){
			array_crypto_prov_context_flag.push("CRYPT_NEWKEYSET");
		}
		if (crypto_prov_acquire_context_flag & 0x00000010){
			array_crypto_prov_context_flag.push("CRYPT_DELETEKEYSET");
		}
		if (crypto_prov_acquire_context_flag & 0x00000020){
			array_crypto_prov_context_flag.push("CRYPT_MACHINE_KEYSET");
		}
		if (crypto_prov_acquire_context_flag & 0x00000040){
			array_crypto_prov_context_flag.push("CRYPT_SILENT");
		}
		if (crypto_prov_acquire_context_flag & 0x00000080){
			array_crypto_prov_context_flag.push("CRYPT_DEFAULT_CONTAINER_OPTIONAL");
		}
		if (array_crypto_prov_context_flag.length == 0){
			return arg_crypto_prov_acquire_context_flag
		}
		else{
			return array_crypto_prov_context_flag.join("|")
		}
	};
	var get_byte = function(arg_byte){
		return arg_byte;
	};
	var get_byte_ptr = function(arg_byte_ptr){
		if (arg_byte_ptr == 0){
			return arg_byte_ptr
		};
		return arg_byte_ptr.readULong();
	};
	var get_crypto_prov_alg_id = function(arg_crypto_prov_alg_id){
		var crypto_prov_alg_id_flag = StringToInt(arg_crypto_prov_alg_id);
		// Algorithm Class;
		var ALG_CLASS_ANY = (0);
		var ALG_CLASS_SIGNATURE = (1 << 13);
		var ALG_CLASS_MSG_ENCRYPT = (2 << 13);
		var ALG_CLASS_DATA_ENCRYPT = (3 << 13);
		var ALG_CLASS_HASH = (4 << 13);
		var ALG_CLASS_KEY_EXCHANGE = (5 << 13);
		var ALG_CLASS_ALL = (7 << 13);
		// Algorithm types;
		var ALG_TYPE_ANY = (0);
		var ALG_TYPE_DSS = (1 << 9);
		var ALG_TYPE_RSA = (2 << 9);
		var ALG_TYPE_BLOCK = (3 << 9);
		var ALG_TYPE_STREAM = (4 << 9);
		var ALG_TYPE_DH = (5 << 9);
		var ALG_TYPE_SECURECHANNEL = (6 << 9);
		// Algorithm SubIds
		// Generic sub-ids
		var ALG_SID_ANY = (0);
		// Some RSA sub-ids
		var ALG_SID_RSA_ANY = 0;
		var ALG_SID_RSA_PKCS = 1;
		var ALG_SID_RSA_MSATWORK = 2;
		var ALG_SID_RSA_ENTRUST = 3;
		var ALG_SID_RSA_PGP = 4;
		// Some DSS sub-ids
		var ALG_SID_DSS_ANY = 0;
		var ALG_SID_DSS_PKCS = 1;
		var ALG_SID_DSS_DMS = 2;
		var ALG_SID_ECDSA = 3;
		// Block cipher sub ids - DES sub_ids
		var ALG_SID_DES = 1;
		var ALG_SID_3DES = 3;
		var ALG_SID_DESX = 4;
		var ALG_SID_IDEA = 5;
		var ALG_SID_CAST = 6;
		var ALG_SID_SAFERSK64 = 7;
		var ALG_SID_SAFERSK128 = 8;
		var ALG_SID_3DES_112 = 9;
		var ALG_SID_CYLINK_MEK = 12;
		var ALG_SID_RC5 = 13;
		var ALG_SID_AES_128 = 14;
		var ALG_SID_AES_192 = 15;
		var ALG_SID_AES_256 = 16;
		var ALG_SID_AES = 17;
		// Fortezza sub-ids
		var ALG_SID_SKIPJACK = 10;
		var ALG_SID_TEK = 11;
		// KP_MODE
		var CRYPT_MODE_CBCI = 6;
		var CRYPT_MODE_CFBP = 7;
		var CRYPT_MODE_OFBP = 8;
		var CRYPT_MODE_CBCOFM = 9;
		var CRYPT_MODE_CBCOFMI = 10;
		// RC2 sub-ids
		var ALG_SID_RC2 = 2;
		// Stream cipher sub-ids
		var ALG_SID_RC4 = 1;
		var ALG_SID_SEAL = 2;
		// Diffie-Hellman sub-ids
		var ALG_SID_DH_SANDF = 1;
		var ALG_SID_DH_EPHEM = 2;
		var ALG_SID_AGREED_KEY_ANY = 3;
		var ALG_SID_KEA = 4;
		var ALG_SID_ECDH = 5;
		// Hash sub ids
		var ALG_SID_MD2 = 1;
		var ALG_SID_MD4 = 2;
		var ALG_SID_MD5 = 3;
		var ALG_SID_SHA = 4;
		var ALG_SID_SHA1 = 4;
		var ALG_SID_MAC = 5;
		var ALG_SID_RIPEMD = 6;
		var ALG_SID_RIPEMD160 = 7;
		var ALG_SID_SSL3SHAMD5 = 8;
		var ALG_SID_HMAC = 9;
		var ALG_SID_TLS1PRF = 10;
		var ALG_SID_HASH_REPLACE_OWF = 11;
		var ALG_SID_SHA_256 = 12;
		var ALG_SID_SHA_384 = 13;
		var ALG_SID_SHA_512 = 14;
		// secure channel sub ids
		var ALG_SID_SSL3_MASTER = 1;
		var ALG_SID_SCHANNEL_MASTER_HASH = 2;
		var ALG_SID_SCHANNEL_MAC_KEY = 3;
		var ALG_SID_PCT1_MASTER = 4;
		var ALG_SID_SSL2_MASTER = 5;
		var ALG_SID_TLS1_MASTER = 6;
		var ALG_SID_SCHANNEL_ENC_KEY = 7;
		// misc ECC sub ids
		var ALG_SID_ECMQV = 1;
		//var ALG_SID_EXAMPLE = 80;
		console.log(crypto_prov_alg_id_flag + "----"+ (ALG_CLASS_HASH | ALG_TYPE_ANY | ALG_SID_MD2))
		if (crypto_prov_alg_id_flag & (ALG_CLASS_HASH | ALG_TYPE_ANY | ALG_SID_MD2)){
			return "CALG_MD2";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_HASH | ALG_TYPE_ANY | ALG_SID_MD4)){
			return "CALG_MD4";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_HASH | ALG_TYPE_ANY | ALG_SID_MD5)){
			return "CALG_MD5";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_HASH | ALG_TYPE_ANY | ALG_SID_SHA)){
			return "CALG_SHA";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_HASH | ALG_TYPE_ANY | ALG_SID_SHA1)){
			return "CALG_SHA1";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_HASH | ALG_TYPE_ANY | ALG_SID_MAC)){
			return "CALG_MAC";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_SIGNATURE | ALG_TYPE_RSA | ALG_SID_RSA_ANY)){
			return "CALG_RSA_SIGN";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_SIGNATURE | ALG_TYPE_DSS | ALG_SID_DSS_ANY)){
			return "CALG_DSS_SIGN";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_SIGNATURE | ALG_TYPE_ANY | ALG_SID_ANY)){
			return "CALG_NO_SIGN";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_KEY_EXCHANGE|ALG_TYPE_RSA|ALG_SID_RSA_ANY)){
			return "CALG_RSA_KEYX";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_DATA_ENCRYPT|ALG_TYPE_BLOCK|ALG_SID_DES)){
			return "CALG_DES";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_DATA_ENCRYPT|ALG_TYPE_BLOCK|ALG_SID_3DES_112)){
			return "CALG_3DES_112";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_DATA_ENCRYPT|ALG_TYPE_BLOCK|ALG_SID_3DES)){
			return "CALG_3DES";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_DATA_ENCRYPT|ALG_TYPE_BLOCK|ALG_SID_DESX)){
			return "CALG_DESX";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_DATA_ENCRYPT|ALG_TYPE_BLOCK|ALG_SID_RC2)){
			return "CALG_RC2";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_DATA_ENCRYPT|ALG_TYPE_STREAM|ALG_SID_RC4)){
			return "CALG_RC4";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_DATA_ENCRYPT|ALG_TYPE_STREAM|ALG_SID_SEAL)){
			return "CALG_SEAL";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_KEY_EXCHANGE|ALG_TYPE_DH|ALG_SID_DH_SANDF)){
			return "CALG_DH_SF";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_KEY_EXCHANGE|ALG_TYPE_DH|ALG_SID_DH_EPHEM)){
			return "CALG_DH_EPHEM";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_KEY_EXCHANGE|ALG_TYPE_DH|ALG_SID_AGREED_KEY_ANY)){
			return "CALG_AGREEDKEY_ANY";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_KEY_EXCHANGE|ALG_TYPE_DH|ALG_SID_KEA)){
			return "CALG_KEA_KEYX";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_KEY_EXCHANGE|ALG_TYPE_ANY|ALG_SID_MD5)){
			return "CALG_HUGHES_MD5";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_DATA_ENCRYPT|ALG_TYPE_BLOCK|ALG_SID_SKIPJACK)){
			return "CALG_SKIPJACK";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_DATA_ENCRYPT|ALG_TYPE_BLOCK|ALG_SID_TEK)){
			return "CALG_TEK";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_DATA_ENCRYPT|ALG_TYPE_BLOCK|ALG_SID_CYLINK_MEK)){
			return "CALG_CYLINK_MEK";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_HASH | ALG_TYPE_ANY | ALG_SID_SSL3SHAMD5)){
			return "CALG_SSL3_SHAMD5";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_MSG_ENCRYPT|ALG_TYPE_SECURECHANNEL|ALG_SID_SSL3_MASTER)){
			return "CALG_SSL3_MASTER";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_MSG_ENCRYPT|ALG_TYPE_SECURECHANNEL|ALG_SID_SCHANNEL_MASTER_HASH)){
			return "CALG_SCHANNEL_MASTER_HASH";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_MSG_ENCRYPT|ALG_TYPE_SECURECHANNEL|ALG_SID_SCHANNEL_MAC_KEY)){
			return "CALG_SCHANNEL_MAC_KEY";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_MSG_ENCRYPT|ALG_TYPE_SECURECHANNEL|ALG_SID_SCHANNEL_ENC_KEY)){
			return "CALG_SCHANNEL_ENC_KEY";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_MSG_ENCRYPT|ALG_TYPE_SECURECHANNEL|ALG_SID_PCT1_MASTER)){
			return "CALG_PCT1_MASTER";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_MSG_ENCRYPT|ALG_TYPE_SECURECHANNEL|ALG_SID_SSL2_MASTER)){
			return "CALG_SSL2_MASTER";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_MSG_ENCRYPT|ALG_TYPE_SECURECHANNEL|ALG_SID_TLS1_MASTER)){
			return "CALG_TLS1_MASTER";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_DATA_ENCRYPT|ALG_TYPE_BLOCK|ALG_SID_RC5)){
			return "CALG_RC5";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_HASH | ALG_TYPE_ANY | ALG_SID_HMAC)){
			return "CALG_HMAC";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_HASH | ALG_TYPE_ANY | ALG_SID_TLS1PRF)){
			return "CALG_TLS1PRF";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_HASH | ALG_TYPE_ANY | ALG_SID_HASH_REPLACE_OWF)){
			return "CALG_HASH_REPLACE_OWF";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_DATA_ENCRYPT|ALG_TYPE_BLOCK|ALG_SID_AES_128)){
			return "CALG_AES_128";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_DATA_ENCRYPT|ALG_TYPE_BLOCK|ALG_SID_AES_192)){
			return "CALG_AES_192";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_DATA_ENCRYPT|ALG_TYPE_BLOCK|ALG_SID_AES_256)){
			return "CALG_AES_256";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_DATA_ENCRYPT|ALG_TYPE_BLOCK|ALG_SID_AES)){
			return "CALG_AES";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_HASH | ALG_TYPE_ANY | ALG_SID_SHA_256)){
			return "CALG_SHA_256";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_HASH | ALG_TYPE_ANY | ALG_SID_SHA_384)){
			return "CALG_SHA_384";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_HASH | ALG_TYPE_ANY | ALG_SID_SHA_512)){
			return "CALG_SHA_512";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_KEY_EXCHANGE | ALG_TYPE_DH | ALG_SID_ECDH)){
			return "CALG_ECDH";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_KEY_EXCHANGE | ALG_TYPE_ANY | ALG_SID_ECMQV)){
			return "CALG_ECMQV";
		}
		if (crypto_prov_alg_id_flag & (ALG_CLASS_SIGNATURE | ALG_TYPE_DSS | ALG_SID_ECDSA)){
			return "CALG_ECDSA";
		}
		return arg_crypto_prov_alg_id
	};
	var get_hcryptkey = function(arg_hcryptkey){
		if (arg_hcryptkey == 0){
			return arg_hcryptkey
		};
		
		return arg_hcryptkey.readULong();
	};
	var get_hcrypthash = function(arg_hcrypthash){
		if (arg_hcrypthash == 0){
			return arg_hcrypthash
		};
		return arg_hcrypthash.readULong();
	};
	var get_thread_context = function (arg_thread_context){
		if (arg_thread_context == 0){
			return arg_thread_context;
		}
		//partially support 
		var sizeof_lpinternetbuffersw = 200
		try{
			var info_buffer = get_bytes(arg_thread_context, sizeof_lpinternetbuffersw)

			//initialize ContextFlags
			var CONTEXT_i386 = 0x00010000	
			var CONTEXT_CONTROL = (CONTEXT_i386 | 0x1)
			var CONTEXT_INTEGER = (CONTEXT_i386 | 0x2)
			var CONTEXT_SEGMENTS = (CONTEXT_i386 | 0x4)
			var CONTEXT_FLOATING_POINT = (CONTEXT_i386 | 0x8)
			var CONTEXT_DEBUG_REGISTERS = (CONTEXT_i386 | 0x10)
			var CONTEXT_EXTENDED_REGISTERS = (CONTEXT_i386 | 0x00000020)
			var CONTEXT_FULL = (CONTEXT_CONTROL | CONTEXT_INTEGER | CONTEXT_SEGMENTS)
			var CONTEXT_ALL = (CONTEXT_CONTROL | CONTEXT_INTEGER | CONTEXT_SEGMENTS | CONTEXT_FLOATING_POINT 
			| CONTEXT_DEBUG_REGISTERS | CONTEXT_EXTENDED_REGISTERS)

			var CONTEXT_XSTATE = (CONTEXT_i386 | 0x40)
			var CONTEXT_EXCEPTION_ACTIVE = 0x8000000
			var CONTEXT_SERVICE_ACTIVE = 0x10000000
			var CONTEXT_EXCEPTION_REQUEST = 0x40000000
			var CONTEXT_EXCEPTION_REPORTING = 0x80000000

		}
		catch(error){
			msg = "error: 1 : get_thread_context - " + error
			return msg
		}

		try{
			var _CONTEXT = {};
			var Eip = new Uint32Array(info_buffer, 0xB8, 1);
			_CONTEXT.Eip = ToHexString(get_dword(Eip[0]))
			return _CONTEXT;


			// var dwContextFlag = (get_dword((new Uint32Array(info_buffer, 0, 1))[0]));
			
			// //console.log("Test "+dwContextFlag2);
			// if (dwContextFlag == CONTEXT_DEBUG_REGISTERS){
			// 	// var Dr0 = new Uint32Array(info_buffer, 4, 1);
			// 	// var Dr1 = new Uint32Array(info_buffer, 8, 1);
			// 	// var Dr2 = new Uint32Array(info_buffer, 12, 1);
			// 	// var Dr3 = new Uint32Array(info_buffer, 16, 1);
			// 	// var Dr6 = new Uint32Array(info_buffer, 20, 1);
			// 	// var Dr7 = new Uint32Array(info_buffer, 24, 1);
			// 	// _CONTEXT.Dr0 = ToHexString(get_dword(Dr0[0]));
			// 	// _CONTEXT.Dr1 = ToHexString(get_dword(Dr1[0]));
			// 	// _CONTEXT.Dr2 = ToHexString(get_dword(Dr2[0]));
			// 	// _CONTEXT.Dr3 = ToHexString(get_dword(Dr3[0]));
			// 	// _CONTEXT.Dr6 = ToHexString(get_dword(Dr6[0]));
			// 	// _CONTEXT.Dr7 = ToHexString(get_dword(Dr7[0]));
			// 	_CONTEXT.dwContextFlag = "CONTEXT_DEBUG_REGISTERS"
			// 	return _CONTEXT
			// }
			// if (dwContextFlag == CONTEXT_SEGMENTS){
			// 	// var SegGs = new Uint32Array(info_buffer, 4, 1);
			// 	// var SegFs = new Uint32Array(info_buffer, 8, 1);
			// 	// var SegEs = new Uint32Array(info_buffer, 12, 1);
			// 	// var SegDs = new Uint32Array(info_buffer, 16, 1);
			// 	// _CONTEXT.SegGs = ToHexString(get_dword(SegGs[0]));
			// 	// _CONTEXT.SegFs = ToHexString(get_dword(SegFs[0]));
			// 	// _CONTEXT.SegEs = ToHexString(get_dword(SegEs[0]));
			// 	// _CONTEXT.SegDs = ToHexString(get_dword(SegDs[0]));
			// 	_CONTEXT.dwContextFlag = "CONTEXT_SEGMENTS"
			// 	return _CONTEXT
	
			// }
			// if (dwContextFlag == CONTEXT_INTEGER){
			// 	// var Edi = new Uint32Array(info_buffer, 4, 1);
			// 	// var Esi = new Uint32Array(info_buffer, 8, 1);
			// 	// var Ebx = new Uint32Array(info_buffer, 12, 1);
			// 	// var Edx = new Uint32Array(info_buffer, 16, 1);
			// 	// var Ecx = new Uint32Array(info_buffer, 20, 1);
			// 	// var Eax = new Uint32Array(info_buffer, 24, 1);				
			// 	// _CONTEXT.Edi = ToHexString(get_dword(Edi[0]));
			// 	// _CONTEXT.Esi = ToHexString(get_dword(Esi[0]));
			// 	// _CONTEXT.Ebx = ToHexString(get_dword(Ebx[0]));
			// 	// _CONTEXT.Edx = ToHexString(get_dword(Edx[0]));
			// 	// _CONTEXT.Ecx = ToHexString(get_dword(Ecx[0]));
			// 	// _CONTEXT.Eax = ToHexString(get_dword(Eax[0]));
			// 	_CONTEXT.dwContextFlag = "CONTEXT_INTEGER"
			// 	return _CONTEXT
			// }
			// if (dwContextFlag == CONTEXT_CONTROL){
			// 	// var Ebp = new Uint32Array(info_buffer, 4, 1);
			// 	// var Eip = new Uint32Array(info_buffer, 8, 1);
			// 	// var SegCs = new Uint32Array(info_buffer, 12, 1);
			// 	// var EFlags = new Uint32Array(info_buffer, 16, 1);
			// 	// var Esp = new Uint32Array(info_buffer, 20, 1);
			// 	// var SegSs = new Uint32Array(info_buffer, 24, 1);
			// 	// _CONTEXT.Ebp = ToHexString(get_dword(Ebp[0]));
			// 	// _CONTEXT.Test = get_hex_dump_int(arg_thread_context, 0x200)
			// 	// _CONTEXT.Eip = ToHexString(get_dword(Eip[0]));
			// 	// _CONTEXT.SegCs = ToHexString(get_dword(SegCs[0]));
			// 	// _CONTEXT.EFlags = ToHexString(get_dword(EFlags[0]));
			// 	// _CONTEXT.Esp = ToHexString(get_dword(Esp[0]));
			// 	// _CONTEXT.SegSs = ToHexString(get_dword(SegSs[0]));
			// 	_CONTEXT.dwContextFlag = "CONTEXT_CONTROL"
			// 	return _CONTEXT
			// }
			// if (dwContextFlag == CONTEXT_FLOATING_POINT){
			// 	// var FloatSave = new Uint32Array(info_buffer, 4, 1);
			// 	// _CONTEXT.FloatSave = ToHexString(get_dword(FloatSave[0]));
			// 	_CONTEXT.dwContextFlag = "CONTEXT_FLOATING_POINT"
			// 	return _CONTEXT
			// }
	
			// return arg_thread_context;
		}
		catch(error)
		{
			msg = "error : 2 : get_thread_context - " + error
			return msg
		}
	};
	var get_thread_lpcontext = function(arg_thread_lpcontext){
		if (arg_thread_lpcontext == 0){
			return arg_thread_lpcontext
		}
		return get_thread_context(arg_thread_lpcontext.readULong())
	};
	var get_crypto_prov_key_spec = function(arg_crypto_prov_key_spec){
		if (arg_crypto_prov_key_spec == "0x1"){
			return "AT_KEYEXCHANGE"
		}
		if (arg_crypto_prov_key_spec == "0x2"){
			return "AT_SIGNATURE"
		}
		return arg_crypto_prov_key_spec
	}
//-------------  WINDOWS NATIVE APIs  -------------//
	var get_registry_type = function(arg_registry_type_constant){

		try{
			var arg_registry_type_index = StringToInt(arg_registry_type_constant);
			var array_registry_type =  ["REG_NONE", "REG_SZ", "REG_EXPAND_SZ", "REG_BINARY", "REG_DWORD", "REG_DWORD_BIG_ENDIAN", "REG_LINK", "REG_MULTI_SZ", "REG_RESOURCE_LIST", "REG_FULL_RESOURCE_DESCRIPTOR", "REG_RESOURCE_REQUIREMENTS_LIST", "REG_QWORD"]; 
			if (arg_registry_type_index < 0 || arg_registry_type_index >= array_registry_type.length){
				msg = "errorcode : 2 : get_registry_type - Type not defined"
				return msg
			} 
			return array_registry_type[arg_registry_type_index];
		}
		catch(error){

			msg = "errorcode : 1 : get_registry_type - " + error;
			return msg;
		}
	};
	var get_registry_key_hive = function(arg_registry_key_hive){
		//var registry_key_hive_flag = StringToInt(arg_registry_key_hive);		

		if (arg_registry_key_hive == "0x80000000"){
			return "HKEY_CLASSES_ROOT";
		}
		if (arg_registry_key_hive == "0x80000001"){
			return "HKEY_CURRENT_USER";
		}
		if (arg_registry_key_hive == "0x80000002"){
			return "HKEY_LOCAL_MACHINE";
		}
		if (arg_registry_key_hive == "0x80000003"){
			return "HKEY_USERS";
		}
		if (arg_registry_key_hive == "0x80000004"){
			return "HKEY_PERFORMANCE_DATA";
		}
		if (arg_registry_key_hive == "0x80000005"){
			return "HKEY_CURRENT_CONFIG";
		}
		if (arg_registry_key_hive == "0x80000006"){
			return "HKEY_DYN_DATA";
		}
		if (arg_registry_key_hive == "0x80000007"){
			return "HKEY_CURRENT_USER_LOCAL_SETTINGS";
		}		return arg_registry_key_hive;
	};
	var get_regsam =  function(arg_regsam){
		return get_access_mask(arg_regsam);
	};
	var get_file_desired_access = function(arg_file_desired_access){
		var file_desired_access_flag = StringToInt(arg_file_desired_access);

		var array_file_desired_access = [];
		if (file_desired_access_flag & 0x10000000){
			array_file_desired_access.push("GENERIC_ALL");
		}
		if (file_desired_access_flag & 0x20000000){
			array_file_desired_access.push("GENERIC_EXECUTE");
		}
		if (file_desired_access_flag & 0x40000000){
			array_file_desired_access.push("GENERIC_WRITE");
		}
		if (file_desired_access_flag & 0x80000000){
			array_file_desired_access.push("GENERIC_READ");
		}

		if (array_file_desired_access.length == 0){
			return arg_file_desired_access
		}
		else{
			return array_file_desired_access.join("|")
		}
	};

	var get_file_share_mode = function(arg_file_share_mode){
		var file_share_mode_flag = StringToInt(arg_file_share_mode);

		var array_file_share_mode = [];
		if (file_share_mode_flag & 0x00000001){
			array_file_share_mode.push("FILE_SHARE_READ");
		}
		if (file_share_mode_flag & 0x00000002){
			array_file_share_mode.push("FILE_SHARE_WRITE");
		}
		if (file_share_mode_flag & 0x00000004){
			array_file_share_mode.push("FILE_SHARE_EXECUTE");
		}

		if (array_file_share_mode.length == 0){
			return arg_file_share_mode
		}
		else{
			return array_file_share_mode.join("|")
		}
	};	
	var get_file_creation_disposition = function(arg_file_creation_disposition){

		try{
			var arg_file_creation_disposition_index = StringToInt(arg_file_creation_disposition);
			var array_file_creation_disposition =  ["CREATE_NEW", "CREATE_ALWAYS", "OPEN_NEW", "OPEN_ALWAYS", "TRUNCATE_EXISTING"]; 
			if (arg_file_creation_disposition_index < 1 || arg_file_creation_disposition_index > array_file_creation_disposition.length){
				msg = "errorcode : 2 : get_file_creation_disposition - Type not defined"
				return msg
			} 
			return array_file_creation_disposition[arg_file_creation_disposition_index - 1];
		}
		catch(error){

			msg = "errorcode : 1 : get_file_creation_disposition - " + error;
			return msg;
		}
	};
	var get_file_attributes = function(arg_file_attributes){
		var file_attributes_flag = StringToInt(arg_file_attributes);

		var array_file_attributes = [];
		if (file_attributes_flag & 0x00000001){
			array_file_attributes.push("FILE_ATTRIBUTE_READONLY");
		}
		if (file_attributes_flag & 0x00000002){
			array_file_attributes.push("FILE_ATTRIBUTE_HIDDEN");
		}
		if (file_attributes_flag & 0x00000004){
			array_file_attributes.push("FILE_ATTRIBUTE_SYSTEM");
		}
		if (file_attributes_flag & 0x00000010){
			array_file_attributes.push("FILE_ATTRIBUTE_DIRECTORY");
		}
		if (file_attributes_flag & 0x00000020){
			array_file_attributes.push("FILE_ATTRIBUTE_ARCHIVE");
		}
		if (file_attributes_flag & 0x00000040){
			array_file_attributes.push("FILE_ATTRIBUTE_DEVICE");
		}
		if (file_attributes_flag & 0x00000080){
			array_file_attributes.push("FILE_ATTRIBUTE_NORMAL");
		}
		if (file_attributes_flag & 0x00000100){
			array_file_attributes.push("FILE_ATTRIBUTE_TEMPORARY");
		}
		if (file_attributes_flag & 0x00000200){
			array_file_attributes.push("FILE_ATTRIBUTE_SPARSE_FILE");
		}
		if (file_attributes_flag & 0x00000400){
			array_file_attributes.push("FILE_ATTRIBUTE_REPARSE_POINT");
		}
		if (file_attributes_flag & 0x00000800){
			array_file_attributes.push("FILE_ATTRIBUTE_COMPRESSED");
		}
		if (file_attributes_flag & 0x00001000){
			array_file_attributes.push("FILE_ATTRIBUTE_OFFLINE");
		}
		if (file_attributes_flag & 0x00002000){
			array_file_attributes.push("FILE_ATTRIBUTE_NOT_CONTENT_INDEXED");
		}
		if (file_attributes_flag & 0x00004000){
			array_file_attributes.push("FILE_ATTRIBUTE_ENCRYPTED");
		}
		if (file_attributes_flag & 0x00010000){
			array_file_attributes.push("FILE_ATTRIBUTE_VIRTUAL");
		}
		if (file_attributes_flag & 0x80000000){
			array_file_attributes.push("FILE_FLAG_WRITE_THROUGH");
		}
		if (file_attributes_flag & 0x40000000){
			array_file_attributes.push("FILE_FLAG_OVERLAPPED");
		}
		if (file_attributes_flag & 0x20000000){
			array_file_attributes.push("FILE_FLAG_NO_BUFFERING");
		}
		if (file_attributes_flag & 0x10000000){
			array_file_attributes.push("FILE_FLAG_RANDOM_ACCESS");
		}
		if (file_attributes_flag & 0x08000000){
			array_file_attributes.push("FILE_FLAG_SEQUENTIAL_SCAN");
		}
		if (file_attributes_flag & 0x04000000){
			array_file_attributes.push("FILE_FLAG_DELETE_ON_CLOSE");
		}
		if (file_attributes_flag & 0x02000000){
			array_file_attributes.push("FILE_FLAG_BACKUP_SEMANTICS");
		}
		if (file_attributes_flag & 0x01000000){
			array_file_attributes.push("FILE_FLAG_POSIX_SEMANTICS");
		}
		if (file_attributes_flag & 0x00200000){
			array_file_attributes.push("FILE_FLAG_OPEN_REPARSE_POINT");
		}
		if (file_attributes_flag & 0x00100000){
			array_file_attributes.push("FILE_FLAG_OPEN_NO_RECALL");
		}
		if (file_attributes_flag & 0x00080000){
			array_file_attributes.push("FILE_FLAG_FIRST_PIPE_INSTANCE");
		}
		
		
		if (array_file_attributes.length == 0){
			return arg_file_attributes
		}
		else{
			return array_file_attributes.join("|")
		}
	};	
	var get_process_creation_flag = function(arg_process_creation_flag){
		var process_creation_flag = StringToInt(arg_process_creation_flag);
		var array_process_creation_flag = [];
		if (process_creation_flag & 0x00000001){
			array_process_creation_flag.push("DEBUG_PROCESS");
		}
		if (process_creation_flag & 0x00000002){
			array_process_creation_flag.push("DEBUG_ONLY_THIS_PROCESS");
		}
		if (process_creation_flag & 0x00000004){
			array_process_creation_flag.push("CREATE_SUSPENDED");
		}
		if (process_creation_flag & 0x00000008){
			array_process_creation_flag.push("DETACHED_PROCESS");
		}
		if (process_creation_flag & 0x00000010){
			array_process_creation_flag.push("CREATE_NEW_CONSOLE");
		}
		if (process_creation_flag & 0x00000020){
			array_process_creation_flag.push("NORMAL_PRIORITY_CLASS");
		}
		if (process_creation_flag & 0x00000040){
			array_process_creation_flag.push("IDLE_PRIORITY_CLASS");
		}
		if (process_creation_flag & 0x00000080){
			array_process_creation_flag.push("HIGH_PRIORITY_CLASS");
		}
		if (process_creation_flag & 0x00000100){
			array_process_creation_flag.push("REALTIME_PRIORITY_CLASS");
		}
		if (process_creation_flag & 0x00000200){
			array_process_creation_flag.push("CREATE_NEW_PROCESS_GROUP");
		}
		if (process_creation_flag & 0x00000400){
			array_process_creation_flag.push("CREATE_UNICODE_ENVIRONMENT");
		}
		if (process_creation_flag & 0x00000800){
			array_process_creation_flag.push("CREATE_SEPARATE_WOW_VDM");
		}
		if (process_creation_flag & 0x00001000){
			array_process_creation_flag.push("CREATE_SHARED_WOW_VDM");
		}
		if (process_creation_flag & 0x00002000){
			array_process_creation_flag.push("CREATE_FORCEDOS");
		}
		if (process_creation_flag & 0x00004000){
			array_process_creation_flag.push("BELOW_NORMAL_PRIORITY_CLASS");
		}
		if (process_creation_flag & 0x00008000){
			array_process_creation_flag.push("ABOVE_NORMAL_PRIORITY_CLASS");
		}
		if (process_creation_flag & 0x00010000){
			array_process_creation_flag.push("INHERIT_PARENT_AFFINITY");
		}
		if (process_creation_flag & 0x00020000){
			array_process_creation_flag.push("INHERIT_CALLER_PRIORITY");
		}
		if (process_creation_flag & 0x00040000){
			array_process_creation_flag.push("CREATE_PROTECTED_PROCESS");
		}
		if (process_creation_flag & 0x00080000){
			array_process_creation_flag.push("EXTENDED_STARTUPINFO_PRESENT");
		}
		if (process_creation_flag & 0x00100000){
			array_process_creation_flag.push("PROCESS_MODE_BACKGROUND_BEGIN");
		}
		if (process_creation_flag & 0x00200000){
			array_process_creation_flag.push("PROCESS_MODE_BACKGROUND_END");
		}
		if (process_creation_flag & 0x01000000){
			array_process_creation_flag.push("CREATE_BREAKAWAY_FROM_JOB");
		}
		if (process_creation_flag & 0x02000000){
			array_process_creation_flag.push("CREATE_PRESERVE_CODE_AUTHZ_LEVEL");
		}
		if (process_creation_flag & 0x04000000){
			array_process_creation_flag.push("CREATE_DEFAULT_ERROR_MODE");
		}
		if (process_creation_flag & 0x08000000){
			array_process_creation_flag.push("CREATE_NO_WINDOW");
		}
		if (process_creation_flag & 0x10000000){
			array_process_creation_flag.push("PROFILE_USER");
		}
		if (process_creation_flag & 0x20000000){
			array_process_creation_flag.push("PROFILE_KERNEL");
		}
		if (process_creation_flag & 0x40000000){
			array_process_creation_flag.push("PROFILE_SERVER");
		}
		if (process_creation_flag & 0x80000000){
			array_process_creation_flag.push("CREATE_IGNORE_SYSTEM_DEFAULT");
		}
		
		if (array_process_creation_flag.length == 0){
			return arg_process_creation_flag
		}
		else{
			return array_process_creation_flag.join("|")
		}
	};

