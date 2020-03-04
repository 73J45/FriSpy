import os
import sys
import csv
import json

logger = None
class Reporting:
    basic_report = {}
    complete_report = {}
    behavior_log_list = []

    def __init__(self, config, logger_obj):
        global logger
        logger = logger_obj
        logger.log("info", "Initiating Report Generation Module...")

        self.config = config
        self.enable_save_report_flag = self.config.get_save_behavior_flag_status()

        # Load API reporting configuration file
        self.config_dir = self.config.get_config_directory()
        self.api_reporting_config_name = self.config.get_api_reporting_config()
        self.api_reporting_config_path = os.path.join( self.config_dir, self.api_reporting_config_name)

        self.api_reporting_config_data = None
        if os.path.exists(self.api_reporting_config_path):

            # Read api_config file
            try:
                with open(self.api_reporting_config_path, "r") as csvhandle:
                    self.api_reporting_config_data = list(csv.reader(csvhandle))

                if self.api_reporting_config_data == None:
                    logger.log("error", "Failed to load api_reporting config file")
                    sys.exit(1)

            except Exception as e:
                logger.log("error", "Exception: Failed to locate api_reporting config file :%s"% str(e))
                sys.exit(1)
                
        else:
            logger.log("error", "Failed to locate the api_reporting config file")
            sys.exit(1)

        self.report_dir = self.config.get_report_directory()
        if not os.path.exists(self.report_dir):
            try:
                #Create 'report'directory
                os.mkdir(self.report_dir)
                logger.log("info", "Report directory created")
            except Exception as e:
                logger.log("error", "Exception: Failed to create directory :%s"% str(e))
                sys.exit(1)
                
        #Get Report file names
        self.basic_report_file_name = self.config.get_basic_behavior_report_name()
        self.basic_report_file_path = os.path.join(self.report_dir, self.basic_report_file_name)
        if os.path.exists(self.basic_report_file_path):
            logger.clear_log(self.basic_report_file_path)

        self.complete_report_file_name = self.config.get_complete_behavior_report_name()
        self.complete_report_file_path = os.path.join(self.report_dir, self.complete_report_file_name)
        if os.path.exists(self.complete_report_file_path):
            logger.clear_log(self.complete_report_file_path)

    def add_behavior_to_report(self, json_behavior_obj):

        # Initialize API reporting json object
        argument_report_basic_json_obj = {}
        argument_report_complete_json_obj = {}

        whitelisted = False
        #
        # Do WHITELIST CHECK FOR BEHAVIOR HERE - ToDo
        #

        if not whitelisted:
            # Load API reporting config details for specific API
            api_search_pattern = ("%s_%s" % (json_behavior_obj['module_name'], json_behavior_obj['api_name']))
            api_argument_info = list(filter(lambda x: api_search_pattern in x, self.api_reporting_config_data)) 
            for argument_record in api_argument_info:
               # print ("config api iterate:%d" % index2)
                argument_name = argument_record[3]
                argument_datatype = argument_record[4]
                argument_behavior_basic_flag = int(argument_record[6])
                argument_datatype_complete_flag = int(argument_record[7])

                # Create basic behavior json 
                if argument_behavior_basic_flag:
                    argument_report_basic_json_obj = self.create_behavior_json_obj(argument_report_basic_json_obj, json_behavior_obj, argument_name)
                # Create complete behavior json object
                if argument_datatype_complete_flag:
                    argument_report_complete_json_obj = self.create_behavior_json_obj(argument_report_complete_json_obj, json_behavior_obj, argument_name)
                
            # Save the behavior events in reports_dir
            if self.enable_save_report_flag:
                self.save_behavior_report(self.basic_report_file_path, argument_report_basic_json_obj)
                self.save_behavior_report(self.complete_report_file_path, argument_report_complete_json_obj)
        return (argument_report_basic_json_obj, argument_report_complete_json_obj)

    def create_behavior_json_obj(self, argument_report_json_obj, json_behavior_obj, argument_name):

        if not "api_arguments" in argument_report_json_obj:
            argument_report_json_obj["api_arguments"] = {}
        argument_report_json_obj["api_arguments"][argument_name] = json_behavior_obj["api_arguments"][argument_name]

        if not "Date" in argument_report_json_obj:
            argument_report_json_obj["Date"] = json_behavior_obj["Date"]
            argument_report_json_obj["api_name"] = json_behavior_obj["api_name"]
            argument_report_json_obj["module_name"] = json_behavior_obj["module_name"]
            argument_report_json_obj["process_id"] = json_behavior_obj["process_id"]
            argument_report_json_obj["api_retval"] = json_behavior_obj["api_retval"]

        return argument_report_json_obj

    def save_behavior_report(self, filename, behavior_data):
        if len(behavior_data) != 0:
            try:
                with open (filename, "a") as loghandle:
                    loghandle.write("\n")
                    json.dump(behavior_data, loghandle)
            except Exception as e:
                logger.log("error", "Failed to save behavior report")

