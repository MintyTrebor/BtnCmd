# BtnCmd
Duet Web Control Custom Buttons Plugin - Run Macros, g-code, Post http GET requests, send MQTT messages, &amp; get status update alerts.

![BtnCmd Main Screen](https://github.com/MintyTrebor/BtnCmd/blob/main/wikires/v0.8.13_BtnCmd_MainWindow_1.png)  

Read the [Wiki](https://github.com/MintyTrebor/BtnCmd/wiki) for more info on how to install configure and use.

In BtnCmd you can create Tabs, with custom buttons in a freeform layout. You may also choose to display a selection of panels including:  
* DWC info panels
* DWC webcam
* Alternatve webcam
* Remote Source (Web service from your LAN)
* Machine Model Values  

![BtnCmd Edit Mode](https://github.com/MintyTrebor/BtnCmd/blob/main/wikires/v0.8.13_BtnCmd_MainWindow_EditMode_1.png)  

The custom buttons can be configured to trigger one of five types of actions:  
* Send a gcode command to the Duet Board  
* Run a Macro  
* Send a simple HTTP request.
* Send a MQTT Message  
* Open a URL in a pop-up window

BtnCmd also offers the ability to monitor the status of the Duet Board and trigger an event when the status matches the event parameters. An event can perform the following actions:  
* Send a Telegram Message (via a telegram bot) useful to get alerted to a status change via your smartphone.
* Send a simple HTTP request.
* Send a MQTT Message


BtnCmd runs in the browser.
  
Short Overview Video Below:  
[![BtnCmd](http://img.youtube.com/vi/q5bTl3c3n_k/0.jpg)](https://www.youtube.com/watch?v=q5bTl3c3n_k "BtnCmd")  

BtnCmd uses the following libraries/modules:  

 - [DeepMerge](https://www.npmjs.com/package/deepmerge)
 - [vue-draggable-resizable](https://www.npmjs.com/package/vue-draggable-resizable)
 - [MQTT.js](https://www.npmjs.com/package/mqtt)
 - [axios](https://www.npmjs.com/package/axios)
 - [jasonpath](https://www.npmjs.com/package/jsonpath)
