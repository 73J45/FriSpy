import os
import sys
import csv

logger = None
class ApiConfig:
    def __init__(self, config, logger_obj):
        global logger
        logger = logger_obj
        logger.log("info", "Initiating API configurations...")

        self.config = config
        self.config_dir = self.config.get_config_directory()
        self.api_config_file_name = self.config.get_api_config_file()
        self.api_config_file_path = os.path.join( self.config_dir, self.api_config_file_name)
        
        self.api_watch_file_name = self.config.get_api_watch_file()
        self.api_watch_file_path = os.path.join( self.config_dir, self.api_watch_file_name)

        self.api_config_data = None
        if os.path.exists(self.api_config_file_path):

            # Read api_config file
            try:
                with open(self.api_config_file_path, "r") as csvhandle:
                    self.api_config_data = list(csv.reader(csvhandle))

                if self.api_config_data == None:
                   logger.log("error", "Failed to load apiconfig file")

            except Exception as e:
                logger.log("error", "Exception: Failed to locate apiconfig file :%s"% str(e))
                
        else:
           logger.log("error", "Failed to locate the apiconfig file")

    # Creates API watch list
    def create_api_watch_list_by_category(self, api_category_watch_list = ["File"]):

        logger.log("info", "Preparing API watch list...")
        
        if len(self.api_config_data) < 1:
            logger.log("error", "Insufficient information in '%s'"% self.api_config_file_path)
            return False
        
        if len(api_category_watch_list) == 0:
            logger.log("error", "API watch list is empty..!")
            return False

        # List of API categories to watch
        self.api_category_watch_list = api_category_watch_list

        self.api_watch_list = []
        for line in self.api_config_data[1:]:

            # Check the presence of number of columns
            # Get the list of only supported APIs
            if len(line) == 4:
                module_name = line[0]
                api_name = line[1]
                api_category = line[2]

            # Select API list as per category
            if self.check_api_category(api_category):
                (self.api_watch_list).append("%s_%s" % (module_name, api_name))
        
        if len(self.api_watch_list) == 0:
            logger.log("error", "Failed to create API watch list for selected API category")
            return False

        return True

    # Filters the API on the basis of the category of API
    def check_api_category(self, category_str):
        for record in self.api_category_watch_list:
            if record in category_str:
                return True
        return False

    # Create Custom API watch_list
    def create_api_watch_list(self):
        logger.log("info", "Preparing API watch list...")
        
        if len(self.api_config_data) < 1:
            logger.log("error", "Insufficient information in '%s'"% self.api_config_file_path)
            return False
        
        self.api_watch_list = []
        for line in self.api_config_data[1:]:

            # Check the presence of number of columns
            # Get the list of only supported APIs
            if len(line) == 4:
                module_name = line[0]
                api_name = line[1]

                (self.api_watch_list).append("%s_%s" % (module_name, api_name))
        
        if len(self.api_watch_list) == 0:
            logger.log("error", "Failed to create API watch list for selected API category")
            return False

        return True

    # Returns API watch list    
    def get_api_watch_list(self):
        return (self.api_watch_list)

    # Update Default API watch list with Custom List
    def set_api_watch_list(self, custom_watch_list):
        self.api_watch_list = custom_watch_list.split("\n")

    def get_api_config_data(self):
        return self.api_config_data

    # Load API watch List
    def load_api_watch_list(self):
        if os.path.exists(self.api_watch_file_path):
            try:
                with open(self.api_watch_file_path, "r") as watch_handle:
                    file_content = (watch_handle.read().split("\n"))
                    self.api_watch_list = file_content
                    return True
            except Exception as e:
                logger.log("error", "Failed to load API watchlist %s ..." % (str(e)))
                return False
        else:
            logger.log("error", "Failed to locate API watchlist...")
            return False

    # Save the API watch list to a file
    def save_api_watch_list(self):

        logger.log("info", "Saving API watch list...")
        if len(self.api_watch_list) > 0:
            try:
                with open(self.api_watch_file_path, "w") as filehandle:
                    filehandle.write("\n".join(self.api_watch_list))
                    logger.log("info", "API watch list saved successfully : '%s'" % (self.api_watch_file_path))

            except Exception as e:
                logger.log("error", "Exception: Failed to save API watch list : %s" % str(e))
        else:
            logger.log("error", "API watch list is empty")

