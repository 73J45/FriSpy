import os
from MSMQCustom import MSMQCustom
from config.config import Config

def main():
    config = Config()
    if config: 

        # Create Event Queue
        event_queue_name = config.get_event_queue_name()
        msmqueue_event = MSMQCustom(event_queue_name)
        if msmqueue_event.open_queue(1, 0):
            print("[!] '%s': Queue already exists" % (event_queue_name))
            msmqueue_event.clear()
        else:
            msmqueue_event.create()
            print("[+] '%s': Queue created Successfully" % (event_queue_name))

        # Create Config Queue
        config_queue_name = config.get_config_queue_name()
        msmqueue_config = MSMQCustom(config_queue_name)
        if msmqueue_config.open_queue(1, 0):
            msmqueue_config.clear()
            print("[!] '%s': Queue already exists" % (config_queue_name))
        else:
            msmqueue_config.create()
            print("[+] '%s': Queue created Successfully" % (config_queue_name))


main()