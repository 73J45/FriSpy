import os
import sys
import yaml

os.chdir(os.path.dirname(os.path.dirname(__file__)))
# import warnings
# warnings.filterwarnings("error")

class Config:
    config_file_path = ".\\config\\config.yaml"
    config_info = None

    start_page_file_name = ""

    sdk_dir = ""
    win_lib_dir = ""
    common_lib_dir = ""
    common_def_file = ""

    config_dir = ""
    config_file = ""
    api_config = ""
    api_watch_file = ""
    api_reporting_config = ""
    gui_config_file = ""
    api_injector = ""

    config_queue = ""
    event_queue = ""

    log_dir = ""
    execution_log = ""
    error_log = ""
    api_capture_log = ""

    report_dir = ""
    behavior_basic = ""
    behavior_restricted = ""
    behavior_complete = ""

    enable_whitelist = False
    enable_save_api_watch_list = False
    enable_save_behavior_report = False
    capture_report_basic = False
    capture_report_complete = False
    execution_timeout_seconds = 60


    def __init__(self):
        print  ("[-] Loading FriSpy Configurations...")
        if os.path.exists(self.config_file_path):

            #Load config file
            try:
                with open(self.config_file_path, "r" ) as ymlhandle:
                    self.config_info = yaml.safe_load(ymlhandle)

                    # SDK details
                    if "sdk_info" in self.config_info:
                        if "sdk_directory" in self.config_info["sdk_info"]:
                            self.sdk_dir = self.config_info["sdk_info"]["sdk_directory"]
                        if "win_lib" in self.config_info["sdk_info"]:
                            self.win_lib_dir = self.config_info["sdk_info"]["win_lib"]
                        if "common_lib" in self.config_info["sdk_info"]:
                            self.common_lib_dir = self.config_info["sdk_info"]["common_lib"]
                        if "common_def_file" in self.config_info["sdk_info"]:
                            self.common_def_file = self.config_info["sdk_info"]["common_def_file"]

                    # Config Details
                    if "config" in self.config_info:
                        if "config_directory" in self.config_info["config"]:
                            self.config_dir = self.config_info["config"]["config_directory"]                    
                        if "config_file" in self.config_info["config"]:
                            self.config_file = self.config_info["config"]["config_file"]
                        if "api_config" in self.config_info["config"]:
                            self.api_config = self.config_info["config"]["api_config"]
                        if "api_watch_file" in self.config_info["config"]:
                            self.api_watch_file = self.config_info["config"]["api_watch_file"]
                        if "api_reporting_config" in self.config_info["config"]:
                            self.api_reporting_config = self.config_info["config"]["api_reporting_config"]                                                        
                        if "gui_config_file" in self.config_info["config"]:
                            self.gui_config_file = self.config_info["config"]["gui_config_file"]                                                        
                        if "api_injector" in self.config_info["config"]:
                            self.api_injector = self.config_info["config"]["api_injector"]                                                        

                    # MSMQ Details
                    if "queue_info" in self.config_info:
                        if "config_queue" in self.config_info["queue_info"]:
                            self.config_queue = self.config_info["queue_info"]["config_queue"]                    
                        if "event_queue" in self.config_info["queue_info"]:
                            self.event_queue = self.config_info["queue_info"]["event_queue"]
                        
                    # Logging Details
                    if "logger_data" in self.config_info:
                        if "log_directory" in self.config_info["logger_data"]:
                            self.log_dir = self.config_info["logger_data"]["log_directory"]
                        if "execution" in self.config_info["logger_data"]:
                            self.execution_log = self.config_info["logger_data"]["execution"]
                        if "error" in self.config_info["logger_data"]:
                            self.error_log = self.config_info["logger_data"]["error"]
                        if "api_capture" in self.config_info["logger_data"]:
                            self.api_capture_log = self.config_info["logger_data"]["api_capture"]

                    # Report Details
                    if "report" in self.config_info:
                        if "report_directory" in self.config_info["report"]:
                            self.report_dir = self.config_info["report"]["report_directory"]
                        if "basic" in self.config_info["report"]:
                            self.behavior_basic = self.config_info["report"]["basic"]
                        if "restricted" in self.config_info["report"]:
                            self.behavior_restricted = self.config_info["report"]["restricted"]
                        if "complete" in self.config_info["report"]:
                            self.behavior_complete = self.config_info["report"]["complete"]

                    # Miscellaneous Flag Details
                    if "miscellaneous" in self.config_info:
                        if "enable_whitelist" in self.config_info["miscellaneous"]:
                            self.enable_whitelist = self.config_info["miscellaneous"]["enable_whitelist"]
                        if "enable_save_api_watch_list" in self.config_info["miscellaneous"]:
                            self.enable_save_api_watch_list = self.config_info["miscellaneous"]["enable_save_api_watch_list"]
                        if "enable_save_behavior_report" in self.config_info["miscellaneous"]:
                            self.enable_save_behavior_report = self.config_info["miscellaneous"]["enable_save_behavior_report"]
                        if "capture_report_basic" in self.config_info["miscellaneous"]:
                            self.capture_report_basic = self.config_info["miscellaneous"]["capture_report_basic"]
                        if "capture_report_complete" in self.config_info["miscellaneous"]:
                            self.capture_report_complete = self.config_info["miscellaneous"]["capture_report_complete"]
                        if "execution_timeout_seconds" in self.config_info["miscellaneous"]:
                            self.execution_timeout_seconds = self.config_info["miscellaneous"]["execution_timeout_seconds"]
                            

            except Exception as e:
                print ("[x] Exception: Failed to load Configuration file" + str(e))
                self.config_info = None

            if not self.config_info:
                print ("[x] Failed to load Configuration file")
                self.config_info = None
        else:
            print ("[x] Failed to locate Configuration file")
            self.config_info = None


    # SDK INFO
    def get_sdk_directory(self):
        #print  self.sdk_dir
        return self.sdk_dir

    def get_win_lib_directory(self):
        return os.path.join(self.get_sdk_directory(), self.win_lib_dir)

    def get_common_lib_directory(self):
        return os.path.join(self.get_sdk_directory(), self.common_lib_dir)

    def get_common_def_file(self):
        return self.common_def_file

    # Config
    def get_config_directory(self):
        return self.config_dir

    def get_config_file(self):
        return self.config_file

    def get_api_config_file(self):
        return self.api_config

    def get_api_watch_file(self):
        return self.api_watch_file

    def get_api_reporting_config(self):
        return self.api_reporting_config

    def get_gui_config_file(self):
        return self.gui_config_file

    def get_api_injector(self):
        return self.api_injector

    # MSMQ
    def get_config_queue_name(self):
        return self.config_queue

    def get_event_queue_name(self):
        return self.event_queue

    #Logging
    def get_log_directory(self):
        return self.log_dir

    def get_execution_log_file_name(self):
        return self.execution_log

    def get_error_log_file_name(self):
        return self.error_log

    def get_api_log_file_name(self):
        return self.api_capture_log

    #reports
    def get_report_directory(self):
        return self.report_dir

    def get_basic_behavior_report_name(self):
        return self.behavior_basic

    def get_restricted_behavior_report_name(self):
        return self.behavior_restricted
    
    def get_complete_behavior_report_name(self):
        return self.behavior_complete

    #Miscellaneous- Getters
    def get_whitelist_flag_status(self):
        return self.enable_whitelist

    def get_save_api_watch_list_flag_status(self):
        return self.enable_save_api_watch_list

    def get_save_behavior_flag_status(self):
        return self.enable_save_behavior_report

    def get_capture_behavior_report_basic_flag(self):
        return self.capture_report_basic

    def get_capture_behavior_report_complete_flag(self):
        return self.capture_report_complete

    def get_execution_timeout(self):
        return self.execution_timeout_seconds
        
    #Miscellaneous- Setters
    def set_whitelist_flag_status(self, enable_whitelist):
        self.enable_whitelist = enable_whitelist

    def set_save_api_watch_list_flag_status(self, enable_save_api_watch_list):
        self.enable_save_api_watch_list = enable_save_api_watch_list

    def set_save_behavior_flag_status(self, enable_save_behavior_report):
        self.enable_save_behavior_report = enable_save_behavior_report

    def set_capture_behavior_report_basic_flag(self, capture_report_basic):
        self.capture_report_basic = capture_report_basic

    def set_capture_behavior_report_complete_flag(self, capture_report_complete):
        self.capture_report_complete = capture_report_complete

    def set_execution_timeout(self, execution_timeout_seconds):
        self.execution_timeout_seconds = execution_timeout_seconds
        
