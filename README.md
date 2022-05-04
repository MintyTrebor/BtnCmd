# BtnCmd
A Duet Web Control (DWC) plugin which allows the user to create custom layouts with new panels and buttons, which can run Macros, g-code, Post http GET requests, send MQTT messages. 

![BtnCmd Main Screen](https://github.com/MintyTrebor/BtnCmd/blob/main/wikires/v0.8.13_BtnCmd_MainWindow_1.png)  

Read the [Wiki](https://github.com/MintyTrebor/BtnCmd/wiki) for more info on how to install configure and use.

In BtnCmd you can create Tabs, with custom buttons in a freeform layout. You may also choose to display a selection of panels including:  
* Standard DWC information & control panels
* Standard DWC webcam
* Alternative webcam
* Remote Source (eg. A web service from your LAN)
* Machine Model Values  
* Text/Label Panel  
* User Created Custom Panels  
* Global Variable Input Panels (Change/update the value of global variables)  

![BtnCmd Edit Mode](https://github.com/MintyTrebor/BtnCmd/blob/main/wikires/v0.8.13_BtnCmd_MainWindow_EditMode_1.png)  

The custom buttons can be configured to trigger one of five types of actions:  
* Send a gcode command to the Duet Board  
* Run a Macro  
* Send a simple HTTP request.
* Send a MQTT Message  
* Open a URL in a pop-up window  

  
BtnCmd runs in the browser, and is compatible with both standalone control boards and SBC + control board configurations.  
  
Short Overview Video Below:  
[![BtnCmd](http://img.youtube.com/vi/q5bTl3c3n_k/0.jpg)](https://www.youtube.com/watch?v=q5bTl3c3n_k "BtnCmd")  

BtnCmd uses the following libraries/modules:  

 - [DeepMerge](https://www.npmjs.com/package/deepmerge)
 - [vue-draggable-resizable](https://www.npmjs.com/package/vue-draggable-resizable)
 - [MQTT.js](https://www.npmjs.com/package/mqtt)
 - [axios](https://www.npmjs.com/package/axios)
 - [jasonpath](https://www.npmjs.com/package/jsonpath)
