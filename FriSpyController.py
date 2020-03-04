# -*- coding: utf-8 -*-
from __future__ import print_function

import os, signal
import json
import sys
import frida
import threading
import codecs
from datetime import datetime
from datetime import timedelta
import pythoncom
import win32com.client
import traceback
from frida_tools.application import Reactor
from config.config import Config
from config.api_config import ApiConfig
from reporting import Reporting
from MSMQCustom import MSMQCustom
from customlogger import Logger

class FriSpyControllerApp(object):
    def __init__(self, config, logger_obj, api_watch_list):

        self.config = config
        self.logger = logger_obj
        self.api_watch_list = api_watch_list
        self.execution_timeout = self.config.get_execution_timeout()
        self.capture_basic_behavior = self.config.get_capture_behavior_report_basic_flag()
        self.capture_complete_behavior = self.config.get_capture_behavior_report_complete_flag()
        self.process_list = []
        self.target_process_pid = None

        # Initialize Reporting Module
        self.report_generator = Reporting(config, logger_obj)

        # Initialize Queue for FriSpyGUI to receive the events
        self.event_queue_name = self.config.get_event_queue_name()
        self.msmqueue_event = MSMQCustom(self.event_queue_name)

        self.config_queue_name = self.config.get_config_queue_name()
        self.msmqueue_config = MSMQCustom(self.config_queue_name)

        # Initialize Controller
        self._stop_requested = threading.Event()
        self._reactor = Reactor(run_until_return=lambda reactor: self._stop_requested.wait())

        self._device = frida.get_local_device()
        self._sessions = set()
        try:

            self._device.on("child-added", lambda child: self._reactor.schedule(lambda: self._on_child_added(child)))
            self._device.on("child-removed", lambda child: self._reactor.schedule(lambda: self._on_child_removed(child)))
            self._device.on("output", lambda pid, fd, data: self._reactor.schedule(lambda: self._on_output(pid, fd, data)))
            self._device.on("process-crashed", lambda crash: self._reactor.schedule(lambda: self._on_process_crashed(crash)))
            self._device.on("lost", lambda crash: self._reactor.schedule(lambda: self._on_process_crashed(crash)))

        except Exception as e:
            self.logger.log("error", "Exception - FriSpyController : run : %s" %(str(e)))
            self.Controller_cleaup(None)
            sys.exit(1)

    def run(self, target_process):

        # Schedule the execution of target process
        try:
            if not target_process:
                self.logger.log("error", "FriSpyController: run: FriSpy Controller failed to locate target process ")
                self.Controller_cleaup(None)
                sys.exit(1)

            self._reactor.schedule(lambda: self._start(target_process))

        except Exception as e:
            self.logger.log("error", "Exception - FriSpyController : schedule_start : %s" %(str(e)))
            self.Controller_cleaup(None)
            sys.exit(1)

        # Initiate the execution of target process
        try:            
            self._reactor.run()
        except Exception as e:
            self.logger.log("error", "Exception - FriSpyController : run : %s" %(str(e)))
            self.Controller_cleaup(None)
            sys.exit(1)

    def _start(self, target_process):

        # Spawn the target process
        try:
            pid = self._device.spawn((target_process,))
            if pid:
                self.target_process_pid = pid
                try:
                    self._instrument(pid, target_process)

                except Exception as e:
                    self.logger.log("error", "Exception -  FriSpyController : _start : Failed to instrument : %s" % (traceback.print_exc(file=sys.stdout)))
                    self.Controller_cleaup(None)
                    sys.exit(1)

            else:
                self.logger.log("error", "Error -  FriSpyController : _start : Failed to instrument")
                self.Controller_cleaup(None)
                sys.exit(1)

        except Exception as e:
            self.logger.log("error", "Exception -  FriSpyController : Failed to spawn : %s" %(str(traceback.print_exc(file=sys.stdout))))
            self.Controller_cleaup(None)
            sys.exit(1)

    def _stop_if_idle(self):
        if len(self._sessions) == 0:
            self._stop_requested.set()

    def prepare_script(self):

        try:
            self.win_lib_dir = self.config.get_win_lib_directory()
            self.common_lib_dir = self.config.get_common_lib_directory()
            self.common_def_file_name =  self.config.get_common_def_file()
            self.common_def_file_path = os.path.join(self.common_lib_dir, self.common_def_file_name)
            self.script_file_content = ""

            #Load common-lib
            common_lib_content = self.get_api_lib_implementation(self.common_def_file_path)

            if common_lib_content == None:
                self.logger.log("error", "FriSpyController: prepare_script : Failed to load common lib")
                return False

            timeout_checker = '''

    var timeout_check = function(timeout){
        var send_data = {}
        send_data.Date = Date()
        send_data.api_name = "timeout_check"
        send_data.module_name = null
        send_data.api_arguments = null
        send(JSON.stringify(send_data, null, 4));
    }
    setInterval(timeout_check, %d)
                '''
            timeout_in_milliseconds = self.config.get_execution_timeout() * 1000# converting seconds to milliseconds
            timeout_checker_content = ((timeout_checker) % timeout_in_milliseconds)
            self.script_file_content = "//////// Common Lib ////////\n\n%s\n%s\n" % (common_lib_content, timeout_checker_content)
            
            self.logger.log("info", "common-lib loaded successfully")

            appended_lib_content = ""
            for lib_info in self.api_watch_list:

                # Get API lib info
                lib_file_parent = lib_info.split("_")[0]
                lib_file_name = lib_info.split("_")[1]
                lib_file_path = os.path.join(self.win_lib_dir ,lib_file_parent, lib_file_name) + ".js"
                lib_content = self.get_api_lib_implementation(lib_file_path)
                if lib_content != None:
                    appended_lib_content = "%s\n//%s\n%s\n" % (appended_lib_content, lib_file_path, lib_content)
            if appended_lib_content == "":
                self.logger.log("error", "FriSpyController: prepare_script : Failed to prepare Script")
                return False

            self.script_file_content =  "%s\n%s\n" % (self.script_file_content, appended_lib_content)
            
            status = self.save_script()
            if not status:
                return False
        except Exception as e:
            self.logger.log("error", "Exception - FriSpyController: prepare_script : Failed to prepare Script: %s"% (str(e)))
            return False

        return True

    def save_script(self):

        self.api_injector_file = os.path.join(self.config.get_config_directory(), self.config.get_api_injector())
        self.logger.log("info", "Saving Script...")
        if len(self.script_file_content) > 0:
            try:
                with open(self.api_injector_file, "w") as filehandle:
                    filehandle.write(self.script_file_content)
                    self.logger.log("info", "Script saved successfully")# : '%s'" % (self.script_file_content))

            except Exception as e:
                self.logger.log("error", "Exception: Failed to save Script watch list : %s" % str(e))
                return False
        else:
            self.logger.log("error", "Injector Script is empty")
            return False
        return True

    def get_api_lib_implementation(self, api_lib_file_path):
        
        lib_content = None
        if os.path.exists(api_lib_file_path):
            try:
                with open (api_lib_file_path, "r") as libhandle:
                    lib_content = libhandle.read()

                    self.logger.log("info", "API Launch Successful : %s" % api_lib_file_path)
        
            except Exception as e:
                self.logger.log("warn", "Exception: Launch Failed : %s"% str(e))
        else:
            self.logger.log("warn", "Launch Failed : %s"% api_lib_file_path)
        return lib_content
            
    def _instrument(self, pid, path):
        try:
            self.logger.log("","Target process attach : pid=({})".format(pid))

            processinfo = {}
            processinfo["pid"] = pid
            processinfo["path"] = path
            self.logger.log_to_gui("ProcessCreate", "%s" %(json.dumps(processinfo)))

            self.process_list.append(pid)
            session = self._device.attach(pid)
            session.on("detached", lambda reason: self._reactor.schedule(lambda: self._on_detached(pid, session, reason)))

            session.enable_child_gating()

            scriptFile = self.script_file_content
            script = session.create_script(scriptFile)
            script.on("message", lambda message, data: self._reactor.schedule(lambda: self._on_message(pid, message)))
            self.logger.log("","Load Injector module")
            script.load()
            self.logger.log("","Resume Execution : pid=({})".format(pid))
            self.target_exec_start_time = datetime.now()
            self.logger.log("","Eventing started {} ".format(self.target_exec_start_time))
            self.target_exec_end_time = self.target_exec_start_time + timedelta(seconds=self.execution_timeout)
            self._device.resume(pid)
            self._sessions.add(session)

        except Exception as e:
            self.logger.log("error", "Exception: instrument(): %s" % (str(e)))
            self.Controller_cleaup(None)
            sys.exit(1)

    def _on_child_added(self, child):
        self.logger.log(""," child_added: {}".format(child))
        self._instrument(child.pid, child.path)

    def _on_child_removed(self, child):
        self.logger.log(""," child_removed: {}".format(child))

    def _on_output(self, pid, fd, data):
        self.logger.log(""," output: pid={}, fd={}, data={}".format(pid, fd, repr(data)))

    def _on_detached(self, pid, session, reason):
        self.logger.log(""," detached: pid={}, reason='{}'".format(pid, reason))
        self._device.kill(pid)
        self._sessions.remove(session)
        self._reactor.schedule(self._stop_if_idle, delay=0.5)
        if len(self._sessions) == 0:
            self.logger.log("","Exiting FriSpy...")
    
    def _on_process_crashed(crash):
        print("on_process_crashed")
        print("\tcrash:", crash)

    def is_ready_to_process(self, jsonobj):

        if "ObjectAttributes" in jsonobj["api_arguments"] and jsonobj["api_arguments"]["ObjectAttributes"] == "0x0":
            return False
        if jsonobj["api_name"] == "OpenProcessToken" and "ProcessHandle" in jsonobj["api_arguments"] and jsonobj["api_arguments"]["ProcessHandle"] == "0xffffffff":
            return False
        if (jsonobj["api_name"] == "CreateEventExW" or jsonobj["api_name"] == "CreateEventExA" or jsonobj["api_name"] == "CreateEventA" or jsonobj["api_name"] == "CreateEventW" or jsonobj["api_name"] == "CreateMutexExW" or jsonobj["api_name"] == "CreateMutexW" or jsonobj["api_name"] == "CreateSemaphoreExW") and "lpName" in jsonobj["api_arguments"] and jsonobj["api_arguments"]["lpName"] == "0x0":
            return False
        return True

    def _on_message(self, pid, message):

        try:
            if message["type"] == "error":
                
                # Check for  errors in loading Injector Module
                print (message)
                self.logger.log("error","Error: Injector Module: %s - %s" % ( message["description"], message["stack"]))
                self.Controller_cleaup(pid)
                sys.exit(1)

            # Get the events from CoreEngine
            jsobj = (json.loads(message["payload"])) 

            # Abort the execution if the Execution Timeout is triggered
            if "api_name" in jsobj and jsobj["api_name"] == "timeout_check":
                self.logger.log("info", "Execution timeout triggered : %s ..." % (jsobj["Date"]))
                self.logger.log_to_gui("Timeout", "Execution timeout triggered. Aborting FriSpy..")
                self.Controller_cleaup(pid)
                return
                #sys.exit(1)

            if "api_retval" in jsobj and jsobj["api_retval"] == "warn":
                self.logger.log("warn", "%s" % (jsobj["api_arguments"]))
            else:
                # Collect the events 
                self.logger.log ("",jsobj)
                jsobj["process_id"] = str(pid)
                #print(self._sessions)
                if self.is_ready_to_process(jsobj):

                    # Enrich the events from CoreEngine
                    argument_report_basic_json_obj = {}
                    argument_report_complete_json_obj = {}
                    (argument_report_basic_json_obj, argument_report_complete_json_obj) = self.report_generator.add_behavior_to_report(jsobj)
                    
                    msg_label = "Event"
                    msg_body = None
                    if self.capture_basic_behavior and argument_report_basic_json_obj:
                        msg_body = json.dumps(argument_report_basic_json_obj)
                    if self.capture_complete_behavior and argument_report_complete_json_obj:
                        msg_body = json.dumps(argument_report_complete_json_obj)
                    # Send events to FriSpyGUI
                    if msg_body:
                        self.msmqueue_event.open_queue(2, 0)#MQ_SEND_ACCESS
                        self.msmqueue_event.send_to_queue(msg_label, msg_body)
                        self.msmqueue_event.close_queue()


        except Exception as e:
            self.logger.log("error","Exception: on_message : %s : %s: %s " % (str(e), str(jsobj), str(traceback.print_exc(file=sys.stdout))))
            self.Controller_cleaup(pid)
            sys.exit(1)

    def Controller_cleaup(self, pid):

        # Terminate the processes
        print(self.process_list)
        for pid in self.process_list:
            if pid:
                try: 
                    os.kill(pid,signal.SIGTERM)
                    #self.process_list.remove(pid)
                except Exception as e:
                    self.logger.log("Error", "%s" % (str(e)))
                    #spass
                
        if self._reactor.is_running():
            self._reactor.stop()
            self._reactor.cancel_all()
        self._stop_requested.set()
# class FriSpyControllerApp End

def start_frispy(config, logger, target_process):

    if not os.path.exists(target_process):
        logger.log("error", "start_frispy : Failed to locate the file to execute the target process: %s"% (target_process))
        sys.exit(1)

    try:
        # Initialize API configurations
        api = ApiConfig(config, logger)
    except Exception as e:
        logger.log("error", "Exception - ApiConfig : %s" % (str(e)))
        sys.exit(1)

    # This target process will be accepted from GUI, after validation
    # Load API to watch
    try:
        # Prepare API watchlist
        if api.load_api_watch_list():
            api_watch_list = api.get_api_watch_list()
            if len(api_watch_list) == 0:
                logger.log("info","API watch list is Empty")
                sys.exit(1)
        else:
            # Error message handled for all cases
            sys.exit(1)

    except Exception as e:
        logger.log("error", "Exception - API watchlist: %s" % (str(e)))
        sys.exit(1)

    # Initialize FriSpiController
    try:
        app = FriSpyControllerApp(config, logger, api_watch_list)
        if not app.prepare_script():
            sys.exit(1)
    except Exception as e:
        logger.log("error", "Exception - FriSpyControllerApp : %s" % (str(e)))
        sys.exit(1)
    
    #Inspect the process
    try:        
        app.run(target_process)
    except Exception as e:
        logger.log("error", "Exception: Run : %s" % (str(e)))
        sys.exit(1)

    logger.log_to_gui("Exit","Successfull")

    
def main():

    #Initialize config     
    config = Config()
    if not config:
        print ("[x] Failed to load FriSpy configurations...")
        return

    #Initialize logger
    logger = Logger(config)
    if not logger:
        print ("[x] Failed to load FriSpy Logger...")
        return

    ContinueExecution = True
    ExecutionSampleCount = 2
    while (ContinueExecution and ExecutionSampleCount):
        # Initialize Config Queue to receieve configurations from GUI
        config_queue_name = config.get_config_queue_name()
        msmqueue_config = MSMQCustom(config_queue_name)
         
        if msmqueue_config.open_queue(1, 0):#MQ_RECEIVE_ACCESS

            msg = msmqueue_config.recv_from_queue()
            if msg:

                # Receive Sample Details from FriSpyGUI
                logger.log("info",str(msg))
                logger.log("info","Found new sample:")
                logger.log("info","Label: %s" % (msg.Label))
                logger.log("info","Body : %s" % (msg.Body))
                if msg.Label == "start":
                    #Load the configurations sent by GUI
                    gui_config = json.loads(msg.Body)
                    target_process = gui_config["filepath"]
                    config.set_save_api_watch_list_flag_status(gui_config["set_save_api_watch_list_flag_status"])
                    config.set_save_behavior_flag_status(gui_config["set_save_behavior_flag_status"])
                    config.set_capture_behavior_report_basic_flag(gui_config["set_capture_behavior_report_basic_flag"])
                    config.set_capture_behavior_report_complete_flag(gui_config["set_capture_behavior_report_complete_flag"])

                    start_frispy(config, logger, target_process)

                    ContinueExecution = False
            msmqueue_config.close_queue()
        else:
            logger.log("error","Config queue not found")

        ExecutionSampleCount = ExecutionSampleCount - 1
    return

#------ ENTRYPOINT ------#
if __name__ == '__main__':
    main()
