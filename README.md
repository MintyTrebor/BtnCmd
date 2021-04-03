# BtnCmd
Duet Web Control Custom Buttons Plugin - Run Macros, g-code, Post http GET requests, send MQTT messages, &amp; get status update alerts.

![BtnCmd Main Screen](https://github.com/MintyTrebor/BtnCmd/blob/main/wikires/BtnCmd_BLTouchTab_Main.png)

Read the [Wiki](https://github.com/MintyTrebor/BtnCmd/wiki) for more info.

In BtnCmd you can create Tabs, with custom buttons in a grid layout of 1 to 4 columns. Custom buttons can be added to the tab as required, they will display in the order the buttons were added to the tab. The tab will scroll vertically when required. You may choose to display a webcam image at the side of a tab for ease of use.

Each button can be configured to trigger one of four types of actions:  
* Send a gcode command to the Duet Board  
* Run a Macro  
* Send a simple HTTP get command
* Send a MQTT Message

BtnCmd also offers the ability to monitor the status of the Duet Board and trigger an event when the status matches the event parameters. An event can perform the following actions:  
* Send a Telegram Message (via a telegram bot) useful to get alerted to a status change via your smartphone.
* Send a simple HTTP get command
* Send a MQTT Message


BtnCmd runs completely in the browser.
