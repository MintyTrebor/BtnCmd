import axios from 'axios';

export default {
    methods: {
        //Event monitoring functions
		async checkEvents(typeStr, val){
			var bi;
			var tmpParent = this;
			const axiosHtpp = axios;
			for (bi in this.btnCmd.monitoredEvents) {
				//this.setActionResponse("In checkEvents Sending: " + this.btnCmd.monitoredEvents[bi].eventTrigActionCmd);
				if(this.btnCmd.monitoredEvents[bi].eventType === typeStr && this.btnCmd.monitoredEvents[bi].eventEnabled && this.btnCmd.monitoredEvents[bi].eventTrigValue === val) {
					if(this.btnCmd.monitoredEvents[bi].eventTrigActionType == "http" || this.btnCmd.monitoredEvents[bi].eventTrigActionType == "telegram"){
						var tmpURL = null;
						if(this.btnCmd.monitoredEvents[bi].eventTrigActionType == "telegram"){
							this.btnCmd.monitoredEvents[bi].eventHttpType = "POST";
							this.btnCmd.monitoredEvents[bi].eventHttpData = {};
							this.btnCmd.monitoredEvents[bi].eventHttpContType = "json";
							tmpURL = `https://api.telegram.org/bot${this.btnCmd.monitoredEvents[bi].eventTgrmAPIToken}/sendMessage?chat_id=${this.btnCmd.monitoredEvents[bi].eventTgrmChatID}&text=${this.btnCmd.monitoredEvents[bi].eventTrigActionCmd}`;
						}else{
							tmpURL = this.btnCmd.monitoredEvents[bi].eventTrigActionCmd;
						}
						this.setActionResponse("Event Action : -- Sending: " + tmpURL);
						if(this.btnCmd.monitoredEvents[bi].eventHttpType == "POST") {
							axiosHtpp.post(tmpURL, tmpParent.btnCmd.monitoredEvents[bi].eventHttpData)
								.then(function (response) {
									console.log("Event Action : -- Success Result : " + JSON.stringify(response));
								})
								.catch(function (error) {
									console.log("Event Action : -- Returned Result : " + JSON.stringify(error));
								});
						}
						if(this.btnCmd.monitoredEvents[bi].eventHttpType == "GET") {
							axiosHtpp.get(tmpURL, { headers: {'Content-Type': `application/${tmpParent.btnCmd.monitoredEvents[bi].eventHttpContType}`}})
								.then(function (response) {
									// handle success
									console.log("Event Action : -- Success Result : " + JSON.stringify(response));
								})
								.catch(function (error) {
									// handle error
									console.log("Event Action : -- Returned Result : " + JSON.stringify(error));
								});
						}
					}else if (this.btnCmd.monitoredEvents[bi].eventTrigActionType == "MQTT" && this.btnCmd.globalSettings.enableMQTT){
						this.sendMQTTMsg(this.btnCmd.monitoredEvents[bi].eventTrigActionCmd, this.btnCmd.monitoredEvents[bi].eventTrigActionTopic);	
					}
				}
			}
		}
    }
}