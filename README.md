# BtnCmd
Duet Web Control Custom Buttons Plugin - Run Macros, g-code, Post http GET requests, send MQTT messages, &amp; get status update alerts.

![BtnCmd Main Screen](https://github.com/MintyTrebor/BtnCmd/blob/main/wikires/BtnCmd_MainSplash1.png)  

Read the [Wiki](https://github.com/MintyTrebor/BtnCmd/wiki) for more info on how to install configure and use.

In BtnCmd you can create Tabs, with custom buttons in a freeform layout. You may also choose to display a webcam image within the tab.  

![BtnCmd Edit Mode](https://github.com/MintyTrebor/BtnCmd/blob/main/wikires/BtnCmd_MainSplash2.png)  

The custom buttons can be configured to trigger one of four types of actions:  
* Send a gcode command to the Duet Board  
* Run a Macro  
* Send a simple HTTP get command
* Send a MQTT Message

BtnCmd also offers the ability to monitor the status of the Duet Board and trigger an event when the status matches the event parameters. An event can perform the following actions:  
* Send a Telegram Message (via a telegram bot) useful to get alerted to a status change via your smartphone.
* Send a simple HTTP get command
* Send a MQTT Message


BtnCmd runs completely in the browser.
