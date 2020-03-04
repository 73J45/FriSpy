from kivy.app import App
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.boxlayout import BoxLayout
from kivy.factory import Factory
from kivy.properties import ObjectProperty
from kivy.uix.popup import Popup
from kivy.uix.dropdown import DropDown
from kivy.core.window import Window
from kivy.uix.gridlayout import GridLayout
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.uix.textinput import TextInput
from kivy.uix.scrollview import ScrollView
from kivy.properties import StringProperty
import os, json, time
import pythoncom, pefile
import win32com.client
from config.config import Config
from config.api_config import ApiConfig
from customlogger import Logger
from config.config import Config
from MSMQCustom import MSMQCustom

config = Config()
logger = Logger(config)

#Window.clearcolor = (1, 1, 1, 1)
event_queue_name = config.get_event_queue_name()
msmqueue_event = MSMQCustom(event_queue_name)

config_queue_name = config.get_config_queue_name()
msmqueue_config = MSMQCustom(config_queue_name)
def empty_queue(self):
    if msmqueue_event.open_queue(1, 0):
        while msmqueue_event.peek(500):
            msg = msmqueue_event.recv_from_queue()
            if msg:
                continue
            else:
                break
        msmqueue_event.close_queue()

window_width, window_height = Window.size

Window.top = 30
Window.left = 30
Window.size = (1200, 900)
Window.bind(on_request_close=empty_queue)

class EndEventScroll(ScrollView):

    def on_scroll_stop(self, *args, **kwargs):
        result = super(EndEventScroll, self).on_scroll_stop(*args, **kwargs)

        if self.scroll_y < 0 and hasattr(self, 'on_end_event'):
            self.on_end_event()
        return result

class ScrolllabelLabel(ScrollView):
    text = StringProperty('')

class CustomScrollView(EndEventScroll):

    layout1 = ObjectProperty(None)

    def on_end_event(self):
        height = 0.0

        for i in range(100):
            btn = Button(text=str(i), size_hint=(None, None),
                            size=(200, 100))
            self.layout1.add_widget(btn)
            height += btn.height
        height = float(height / self.layout1.cols)
        procent = (100.0 * height)/float(self.layout1.height)
        self.scroll_y += procent/100.0


class MyScrollView(FloatLayout):
    myscrollgrid = ObjectProperty(None)
    customscrollview = ObjectProperty(None)
    inside_GridLayout = ObjectProperty(None)
    api_log = ObjectProperty(None)
    refresh = ObjectProperty(None)
    dismiss_popup = ObjectProperty(None)

    def dismiss_popup(self):
        self._popup.dismiss()

    def refresh (self):
        self.update()

    def api_log(self, instance):
        if msmqueue_event.open_queue(1, 0):
            while (msmqueue_event.peek(500)):
                msg = msmqueue_event.recv_from_queue()
                if msg:
                    print("Found")
                    print("Label:", msg.Label)
                    print("Body :", msg.Body)
                    if msg.Label == "ProcessCreate":
                        content = CustomPopup(cancel=self.dismiss_popup)
                        content.info.text = "Process Created"
                        self._popup = Popup(title="Info", content=content,
                                        size_hint=(0.2, 0.2))

                        self._popup.open()
                        break
                    else:
                        continue
            msmqueue_event.close_queue()
            self.update()

            

    def update(self):    
        if msmqueue_event.open_queue(1, 0):
            count = 0

            while (count < 100):
                print("Checking")
                #msg = queue_recv.Receive(0,True,2000,0)
                if msmqueue_event.peek(2000):
                    msg = msmqueue_event.recv_from_queue()
                    if msg:
                        print("Found")
                        print("Label:", msg.Label)
                        print("Body :", msg.Body)
                        if msg.Label == "Event":
                            msg_json = json.loads(msg.body)
                            if "api_name" in msg_json:
                                text = "Module Name : "  +  msg_json["module_name"] + "\n" + "API Name        : "  +  msg_json["api_name"] + "\n" + "Return Value   : " + msg_json["api_retval"] + "\n" + "Process Id       : " + msg_json["process_id"]  + "\n" + "Date                 : " + msg_json["Date"]
                                btn = Button(text=text, size_hint= (1, None), height= self.height*0.20, font_size= 15)
                                self.inside_GridLayout.add_widget(btn)
                                print("Added API name:", msg_json["api_name"])
                                #lbl1 = ScrolllabelLabel(text=json.dumps(msg_json, sort_keys=True, indent=2), height= self.height*0.20)
                                lbl1 = ScrolllabelLabel(text=json.dumps(msg_json["api_arguments"], sort_keys=True, indent=2), height= self.height*0.20)
                                self.inside_GridLayout.add_widget(lbl1)
                            count = count + 1
                            if count == 100:
                                break
                        elif msg.Label == "Exit":
                            content = CustomPopup(cancel=self.dismiss_popup)
                            content.info.text = "Process Exited"
                            self._popup = Popup(title="Info", content=content,
                                            size_hint=(0.2, 0.2))
                            self._popup.open()
                            break
                    else:
                        break
                else:
                    break
            msmqueue_event.close_queue()

class ScrollViewApp():

    def build(self):
        myscroll = MyScrollView()
        root = GridLayout(cols=1)
        root.add_widget(myscroll.scrollview2)
        return root

class LoadDialog(FloatLayout):
    load = ObjectProperty(None)
    cancel = ObjectProperty(None)
    folder_text = ObjectProperty(None)
    filechooser = ObjectProperty(None)
    
    def set_folder(self):
        print(self.folder_text.text)
        if os.path.exists(self.folder_text.text):
            if os.path.isdir(self.folder_text.text):
                self.filechooser.path = self.folder_text.text
            else:
                a = os.path.dirname(os.path.abspath(self.folder_text.text))
                b = [os.path.basename(self.folder_text.text)]
                print(a, b)
                self.load(a,b)
        self.folder_text.text = ""


class CustomProfileDropDown(DropDown):
	select_dropdown = ObjectProperty(None)

class ReportType(DropDown):
    select_dropdown = ObjectProperty(None)

class CustomWatchlist(FloatLayout):
    save_changes = ObjectProperty(None)
    cancel = ObjectProperty(None)
    custom_api_watch_text = ObjectProperty(None)

class CustomPopup(FloatLayout):
    cancel = ObjectProperty(None)
    info = ObjectProperty(None)

class Root(FloatLayout):

    global config
    global logger
    file_to_execute = ''
    default_watch_list = ''
    custom_api_watch_list = ''
    full_report = False
    minimal_report = False
    save_report = False
    save_api_watchlist = False
    loadfile = ObjectProperty(None)
    text_input = ObjectProperty(None)
    api_config = ApiConfig(config, logger)
    
    def checkbox_click(self, instance, value, checkbox_val):
        print(checkbox_val)
        if checkbox_val == "Save Report":
            if value is True:
                print("Save Report Checked")
                self.save_report = True
            else:
                print("Save Report Unchecked")
                self.save_report = False
        if checkbox_val == "Save API watchlist":
            if value is True:
                print("Save API watchlist Checked")
                self.save_api_watchlist = True
            else:
                print("Save API watchlist Unchecked")
                self.save_api_watchlist = False


    def dismiss_popup(self):
        self._popup.dismiss()

    def show_profile_dropdown(self, instance, value):
        if value == "reportingbuton":
            self.dropdown = ReportType()
            callback = self.select_reporting_dropdown
            label = self.reportingbuton
        elif value == "mainbutton":
            self.dropdown = CustomProfileDropDown()
            callback = self.select_profile_dropdown
            label = self.mainbutton
        self.dropdown.open(instance)
        self.dropdown.bind(on_select = lambda instance, x: setattr(label, 'text', x))
        self.dropdown.bind(on_select = callback)

    def select_profile_dropdown(self, instance, value):

        test = self.api_config.create_api_watch_list()

        self.default_watch_list = "\n".join(self.api_config.get_api_watch_list())
        if value == "Default":

            self.custom_api_watch_list = self.default_watch_list
        elif value == "Custom":
            content = CustomWatchlist(save_changes=self.assign_custom_watchlist, cancel=self.dismiss_popup)
            content.custom_api_watch_text.text = self.default_watch_list
            self._popup = Popup(title="Custom API Watchlist", content=content,
                            size_hint=(.9, .9))
            self._popup.open()
        else:

            if value == "Process code injection":
                value = "P_Code_Injection"
            elif value == "Synchronisation object":
                value = "Sync_Object"
            self.api_config.create_api_watch_list_by_category([value])
            self.custom_api_watch_list = "\n".join(self.api_config.get_api_watch_list())
        print("%s was selected" %value)

    def assign_custom_watchlist(self, custom_watch_list):
        self.custom_api_watch_list = custom_watch_list
        print (self.custom_api_watch_list)
        self.dismiss_popup()

    def select_reporting_dropdown(self, instance, value):
        if value == "Full Report":
            self.full_report = True
            self.minimal_report = False
        if value == "Minimal Report":
            self.full_report = False
            self.minimal_report = True
        print("%s was selected" %value)

    def show_load(self):
        content = LoadDialog(load=self.load, cancel=self.dismiss_popup)
        self._popup = Popup(title="Load file", content=content,
                            size_hint=(1, 1))

        self._popup.open()

    


    def show_scroll(self):
        self.scroll_content = MyScrollView()
        #content = TableApp().build()
        json_body = {"filepath": "",
                    "set_save_behavior_flag_status": False,
                    "set_save_api_watch_list_flag_status": False,
                    "set_capture_behavior_report_complete_flag": False,
                    "set_capture_behavior_report_basic_flag": False
                    }
        #msmqueue_config.clear()
        #msmqueue_event.clear()
        if  msmqueue_config.open_queue(2, 0):  # Open a ref to queue
            print("########################")
            print(self.custom_api_watch_list)
            self.api_config.set_api_watch_list(self.custom_api_watch_list)

            self.api_config.save_api_watch_list()
            json_body["filepath"] = str(self.file_to_execute)
            json_body["set_save_behavior_flag_status"] = self.save_report
            json_body["set_save_api_watch_list_flag_status"] = self.save_api_watchlist
            json_body["set_capture_behavior_report_complete_flag"] = self.full_report
            json_body["set_capture_behavior_report_basic_flag"] = self.minimal_report
            msmqueue_config.send_to_queue("start", json.dumps(json_body))
            msmqueue_config.close_queue()
            print(self.scroll_content)
            self._popup = Popup(title="API log", content=self.scroll_content,
                                size_hint=(1, 1))

            self._popup.bind(on_open=self.scroll_content.api_log)
            print("after popup")
            self._popup.open()
        #self.api_log()


    def load(self, path, filename):

        self.file_to_execute = os.path.join(path, filename[0])
        print(self.file_to_execute)
        if os.path.exists(self.file_to_execute):
            #try:
            peinfo = pefile.PE(self.file_to_execute)
            if((peinfo.FILE_HEADER.Characteristics & 2) == 2 and peinfo.OPTIONAL_HEADER.Magic == 267):
                self.text_input.text = self.file_to_execute
                self.dismiss_popup()
                self.show_scroll()
                #else:
                #    raise(Exception)
            '''except Exception as e:
                print(e)
                content = CustomPopup(cancel=self.dismiss_popup)
                content.info.text = "Invalid File Type"
                self._popup = Popup(title="Error", content=content,
                                size_hint=(0.2, 0.2))

                self._popup.open()'''
            
        else:
            content = CustomPopup(cancel=self.dismiss_popup)
            content.info.text = "Invalid File Path"
            self._popup = Popup(title="Error", content=content,
                            size_hint=(0.2, 0.2))

            self._popup.open()


    def write_changes(self):
        self.api_config.set_api_watch_list(self.custom_api_watch_list)
        self.api_config.save_api_watch_list()
        config.set_save_behavior_flag_status(self.save_report)
        config.set_save_api_watch_list_flag_status(self.save_api_watchlist)
        config.set_capture_behavior_report_complete_flag(self.full_report)
        config.set_capture_behavior_report_basic_flag(self.minimal_report)



class FriSpy(App):
    
    '''def build(self):
        Window
    def on_request_close(self, *args):
        self.empty_queue()
    
    def empty_queue(self):
        if msmqueue_event.open_queue(1, 0):
            while msmqueue_event.peek(500):
                msg = msmqueue_event.recv_from_queue()
                if msg:
                    continue
                else:
                    break'''


Factory.register('Root', cls=Root)
Factory.register('LoadDialog', cls=LoadDialog)
Factory.register('CustomProfileDropDown', cls=CustomProfileDropDown)
Factory.register('ReportType', cls=ReportType)
Factory.register('CustomWatchlist', cls=CustomWatchlist)
Factory.register('MyScrollView', cls=MyScrollView)
Factory.register('CustomPopup', cls=CustomPopup)


if __name__ == '__main__':
    FriSpy().run()
