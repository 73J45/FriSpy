import os
import sys
import datetime
from MSMQCustom import MSMQCustom

class Logger:
    def __init__(self, config):
        
        # Load the logger configurations
        self.log_dir = config.get_log_directory()
        if not os.path.exists(self.log_dir):
            os.mkdir(self.log_dir)
        self.exec_log_path = os.path.join(self.log_dir, config.get_execution_log_file_name())
        self.error_log_path = os.path.join(self.log_dir, config.get_error_log_file_name())
        self.api_log_path = os.path.join(self.log_dir, config.get_api_log_file_name())

        # Clear the logs 
        self.init_log(self.exec_log_path)
        self.init_log(self.error_log_path)
        # Initialize Queue for FriSpyGUI to receive the events
        self.event_queue_name = config.get_event_queue_name()
        self.msmqueue_event = MSMQCustom(self.event_queue_name)

    
    def log(self, message_type, log_message):
        
        # Get datetime
        prefix_datetime = datetime.datetime.now().strftime("%d/%m/%Y, %H:%M:%S")

        prefix_symbol = ""
        if message_type == "error":
            prefix_symbol = "[x]"
        elif message_type == "info":
            prefix_symbol = "[-]"
        elif message_type == "warn":
            prefix_symbol = "[!]"
        else:
            prefix_symbol = "[+]"

        # message to log
        print_msg = ("%s %s %s" % (prefix_datetime, prefix_symbol, log_message))
        gui_msg =  ("%s %s" % (prefix_symbol, log_message))

        # display and log the output
        self.write_to_log(self.exec_log_path, print_msg)
        print (print_msg)
        if message_type == "error":
            self.write_to_log(self.error_log_path, print_msg)
            self.log_to_gui("Error", gui_msg)

    def write_to_log(self, logfile, data):
        with open(logfile, "a") as log_handle:
            log_handle.write(data + "\n")

    def init_log(self, logfile):
        with open(logfile, "w") as log_handle:
            log_handle.write("#-----------FriSpy-----------#\n")

    def clear_log(self, logfile):
        with open(logfile, "w") as log_handle:
            log_handle.write("")

    def log_to_gui(self, msg_label, msg_body):

        self.msmqueue_event.open_queue(2, 0)#MQ_SEND_ACCESS
        self.msmqueue_event.send_to_queue(msg_label, msg_body)
        self.msmqueue_event.close_queue()

