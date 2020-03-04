# FriSpy
FriSpy is developed by keeping lack of a easily configurable and intelligent open source API monitoring tool in mind. It makes use of dynamic instrumentation toolkit “FRIDA” to monitor a process.

## Installation
1. Install Python 3.7.x(32-bit) in Windows7 and above
2. Install Frida (https://frida.re/docs/home/)
	* pip install frida-tools

	For more information refer: https://github.com/frida/frida-tools
3. Install kivy
	* pip install --upgrade pip wheel setuptools
	* pip install docutils pygments pypiwin32 kivy.deps.sdl2 kivy.deps.glew
	* pip install kivy.deps.gstreamer
	* pip install kivy.deps.angle
	* pip install kivy
  
	Note: 
	* Update opengl to version >= 2.0
	* For more information refer: https://github.com/kivy/kivy
4. Install packages:
	* pip install pyyaml
	* pip install pefile
5. Download FriSpy
	* Clone : https://github.com/73J45/FriSpy.git
6. MSMQueue setup
	* Open "Turn Windows Features On/Off" 
	* Enable "Microsoft Message Queue(MSMQ) Server"
	* Execute CreateFriSpyQueue.py

## Usage
1. Execute FrispyController.py
2. Execute FriSpy.py to launch FriSpyGUI
