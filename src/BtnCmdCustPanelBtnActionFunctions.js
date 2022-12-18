import mqtt from 'precompiled-mqtt';
import axios from 'axios';
import Path from '../../utils/path';
import jsonpath from 'jsonpath';
import store from "@/store";

//needed to run gcode commands
const conditionalKeywords = ['abort', 'echo', 'if', 'elif', 'else', 'while', 'break', 'var', 'set'];

export default {
	methods: {
        //mqtt Msg Send Functions
		sendMQTTMsg(msgStr, topicStr){
			var mqttOptions;
			var tmpParent = this;
				
				if(this.mainData.globalSettings.MQTTUserName){
					mqttOptions = {
						clientid: this.mainData.globalSettings.MQTTClientID,
						username: this.mainData.globalSettings.MQTTUserName,
						password: this.mainData.globalSettings.MQTTPassword,
						reconnectPeriod: 0
					};
				}else {
					mqttOptions = {
						clientid: this.mainData.globalSettings.MQTTClientID,
						reconnectPeriod: 0
					};
				}
				
				var client  = mqtt.connect(this.mainData.globalSettings.MQTTServer, mqttOptions);
				
				client.on('connect', function () {
					client.subscribe(topicStr, function (e) {
						if(!e){
							client.publish(topicStr, msgStr, function (err) {
								if (err){
									client.end();
									tmpParent.setActionResponse("Last Action :  -- MQTT -- Message Failed Result = " + err);
								}else{
									client.end();
									tmpParent.setActionResponse("Last Action :  -- MQTT -- Message Sent = " + msgStr);
								}
							});
						}else{
							client.end();
							tmpParent.setActionResponse("Last Action :  -- MQTT -- Failed to Subscribe Topic = " + topicStr + ". Reason = " + e);
						}
					});
					
				});
		
				client.on('error', function (error) {
					client.end();
					tmpParent.setActionResponse("Last Action :  -- MQTT -- Failed Result : " + error);
				});

		},
		
		getModelValue(gVarName){
			const jp = jsonpath;
			if(gVarName){
				if(gVarName.startsWith("global.")){
					let tmpStr = gVarName.replace("global.", "");
					if(store.state.machine.model.global.has(tmpStr)){
						return store.state.machine.model.global.get(tmpStr);
					}else{
						return "###";
					}
				}else if(gVarName.startsWith("plugins.")){
					return "plugins Object cannot be used here";
				}else{
					var matchInModel = jp.query(store.state.machine.model, (`$.${gVarName}`));
					if(JSON.stringify(matchInModel) != "[]"){
						return  matchInModel[0];
					}else{
						return "###";
					}
				}
			}else {
				return "###";
			}		
		},

		//functions triggered by custom button click
		onBtnClick(e, btnJSONOb){
			this.currButtonObj = btnJSONOb;
			this.currButtonEventObj = e;
			if(btnJSONOb.btnReqConf){
				this.currBtnPromptTxt = btnJSONOb.btnConfText;
				this.showBtnConfDialog = true;	
			}else{
				this.onBtnConf();
			}
		},
		async onBtnConf(){
			var e = this.currButtonEventObj;
			var btnJSONOb = this.currButtonObj;
			this.setActionResponse('');
			var tmpParent = this;
			const axiosHtpp = axios;
			if(btnJSONOb.btnType == "Macro"){
				tmpParent.runFile(btnJSONOb.btnActionData);
				tmpParent.setActionResponse("Last Action :  -- Macro -- " + btnJSONOb.btnActionData);
			}else if(btnJSONOb.btnType == "http"){
				tmpParent.setActionResponse("Last Action :  -- http -- Sending: " + btnJSONOb.btnActionData);
				if(btnJSONOb.btnHttpType == "POST") {
					axiosHtpp.post(btnJSONOb.btnActionData, btnJSONOb.btnHttpData)
						.then(function (response) {
							//tmpParent.setActionResponse("Event Action : -- Success Result : " + JSON.stringify(response));
							if(btnJSONOb.btnSBCCShowResult){
								try{
									var tmpTxt = response.data
									tmpParent.currBtnPromptTxt = tmpTxt.replace(/(?:\r\n|\r|\n)/g, '<br>');
									tmpParent.showBtnSBCCDialog = true;}
								catch{
									// console.log(response);
									// tmpParent.setActionResponse("Event Action : -- Error. Check Console for more details");
									// tmpParent.$makeNotification('error', 'BtnCmd HTTP encountered an error', `Check Console for more details`);
								}
							}
						})
						.catch(function (error) {
							if(!error.contains("has been blocked by CORS policy")){
								console.log("Post Error:", error);
								tmpParent.setActionResponse("Event Action : -- Error. Check Browser Console for more details");
								tmpParent.$makeNotification('error', 'BtnCmd HTTP encountered an error', `Check Browser Console for more details`);
							}else {
								tmpParent.setActionResponse("Event Action : -- CORS Error. post may still have worked - Check Browser Console for more details");
							}
						});
				}
				if(btnJSONOb.btnHttpType == "GET") {
						axiosHtpp.get(btnJSONOb.btnActionData, { headers: {'Content-Type': `application/${btnJSONOb.btnHttpContType}`}})
						.then(function (response) {
							// handle success
							if(btnJSONOb.btnSBCCShowResult){
								try{
									var tmpTxt = response.data
									tmpParent.currBtnPromptTxt = tmpTxt.replace(/(?:\r\n|\r|\n)/g, '<br>');
									tmpParent.showBtnSBCCDialog = true;}
								catch{
									// console.log(response);
									// tmpParent.setActionResponse("Event Action : -- Error. Check Console for more details");
									// tmpParent.$makeNotification('error', 'BtnCmd HTTP encountered an error', `Check Console for more details`);
								}
							}
						})
						.catch(function (error) {
							if(!error.contains("has been blocked by CORS policy")){
								console.log("Post Error:", error);
								tmpParent.setActionResponse("Event Action : -- Error. Check Browser Console for more details");
								tmpParent.$makeNotification('error', 'BtnCmd HTTP encountered an error', `Check Browser Console for more details`);
							}else {
								tmpParent.setActionResponse("Event Action : -- CORS Error. get may still have worked - Check Browser Console for more details");
							}
						});
				}
			}else if(btnJSONOb.btnType == "MQTT" && this.mainData.globalSettings.enableMQTT){
				this.sendMQTTMsg(btnJSONOb.btnActionData, btnJSONOb.btnTopicData);
			}else if(btnJSONOb.btnType == "gcode"){
				tmpParent.setActionResponse("Last Action :  -- gcode -- " + btnJSONOb.btnActionData);
				tmpParent.code = btnJSONOb.btnActionData;
				tmpParent.send();

			}else if(btnJSONOb.btnType == "MQTT" && !this.mainData.globalSettings.enableMQTT){
				tmpParent.setActionResponse("This button has been configured as MQTT, but MQTT is disabled. No Action Taken. Please re-enable MQTT.");
			}else if(btnJSONOb.btnType == "window"){
				var btnWindow = window.open(btnJSONOb.btnActionData, "BtnCmd", `menubar=0, resizable=0, status=0, toolbar=0, location=0, directories=0, scrollbars=1, width=${btnJSONOb.btnWinWSize}, height=${btnJSONOb.btnWinHSize}`);
				btnWindow.moveTo(e.clientX, e.clientY-210);
			}else if(btnJSONOb.btnType == "SBCC"){
				if(!tmpParent.mainData.globalSettings.enableSBCC || !tmpParent.systemDSFVer){
					tmpParent.setActionResponse("This button has been configured as SBCC, but SBCC is disabled. No Action Taken. Please re-enable SBCC.");
					return;
				}else{
					tmpParent.setActionResponse("Last Action :  -- SBCC -- ID: " + btnJSONOb.btnActionData);
					var ni = 0
					for(ni in tmpParent.tmpSBCCSet){
						if(btnJSONOb.btnActionData == tmpParent.tmpSBCCSet[ni].SBCC_Cmd_ID){
							var tmpHttpData = {"SBCCID": tmpParent.tmpSBCCSet[ni].SBCC_Cmd_ID, "SBCCAPI": tmpParent.mainData.SBCCSettings["API_KEY"], "SBCCCmd": tmpParent.tmpSBCCSet[ni].SBCC_Cmd_CmdText, "SBCCTimeout": tmpParent.tmpSBCCSet[ni].SBCC_Cmd_Timeout};
							//console.log(tmpHttpData);
							axiosHtpp.post(`http://${tmpParent.systemCurrIP}:${tmpParent.mainData.SBCCSettings["HTTP_Port"]}`, tmpHttpData)
								.then(function (response) {
									var tmpTxt
									//console.log(response.data);
									if(btnJSONOb.btnSBCCShowResult){
										tmpTxt = response.data["Cmd_Response"]
										tmpParent.currBtnPromptTxt = tmpTxt.replace(/(?:\r\n|\r|\n)/g, '<br>');
										tmpParent.showBtnSBCCDialog = true;
									}
								})
								.catch(function (error) {
									console.log(error);
									tmpParent.$makeNotification('error', 'SBCC Encountered an error. Response:', `${error}`);
								});
						}
					}
				}
			}
		},
		//set the value of the action footer msg
		setActionResponse(actionTxt){
			//this.propActionResponse = actionTxt;
			this.$emit("updateActionResponse", actionTxt);
		},
		//run maro file
		runFile(filename) {
			this.sendCode(`M98 P"${Path.combine(this.directory, filename)}"`);
		},
		//run gcode commands - taken from codeinput.vue
		hasUnprecedentedParameters: (code) => !code || /(M23|M28|M30|M32|M36|M117)[^0-9]/i.test(code),
		async send() {
			this.mainData.showItems = false;

			const code = (this.code instanceof Object) ?this.code.value : this.code;
			if (code && code.trim() !== '' && !this.doingCode) {
				let codeToSend = '', bareCode = '', inQuotes = false, inExpression = false, inWhiteSpace = false, inComment = false;
				if (!this.hasUnprecedentedParameters(codeToSend) &&
					!conditionalKeywords.some(keyword => code.trim().startsWith(keyword))) {
					// Convert code to upper-case and remove comments
					for (let i = 0; i < code.length; i++) {
						const char = code[i];
						if (inQuotes) {
							if (i < code.length - 1 && char === '\\' && code[i + 1] === '"') {
								codeToSend += '\\"';
								i++;
							} else {
								if (char === '"') {
									inQuotes = false;
								}
								codeToSend += char;
							}
						} else if (inExpression) {
							codeToSend += char;
							inExpression = (char !== '}');
						} else if (inComment) {
							codeToSend += char;
							inComment = (char !== ')');
						} else {
							if (char === '"') {
								// don't convert escaped strings
								inQuotes = true;
							} else if (char === ' ' || char === '\t') {
								// remove duplicate white spaces
								if (inWhiteSpace) {
									continue;
								}
								inWhiteSpace = true;
							} else if (char === ';') {
								// stop when final comments start
								break;
							} else if (char === '(') {
								// don't process chars from encapsulated comments
								inComment = true;
							} else if (char === '{') {
								// don't process chars from expressions
								inExpression = true;
							}
							inWhiteSpace = false;
							codeToSend += char.toUpperCase();
							bareCode += code.toUpperCase();
						}
					}
				} else {
					// Don't modify the user input
					codeToSend = code;
				}

				// Send the code and wait for completion
				this.doingCode = true;
				try {
					const reply = await store.dispatch("machine/sendCode", {
						code: codeToSend,
						fromInput: true
					});

					if (!inQuotes && !store.state.settings.disableAutoComplete &&
						!reply.startsWith("Error: ") && !reply.startsWith("Warning: ") &&
						bareCode.indexOf("M587") === -1 && bareCode.indexOf("M589") === -1) {
						// Automatically remember successful codes
						//store.commit("machine/cache/addLastSentCode", codeToSend.trim());
					}
				} catch {
					// handled before we get here
				}
				this.doingCode = false;
			}
		},
    }
}