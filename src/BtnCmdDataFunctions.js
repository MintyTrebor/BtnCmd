
import { DisconnectedError, OperationCancelledError } from '../../utils/errors.js';
import Path from '../../utils/path.js';
import deepmerge from 'deepmerge';

export default {
    methods: {
        getRefData(){
			//returns a clean copy of the main data structure, used for resetting config, and config data upgrades
			return {
				btnCmdVersion: this.btnCmdVersion,
				systemSettings: {
					lastID: 1,
					lastTabID: 2,
					lastEventID: 1,
					lastPanelID: 1,
					lastTxtIconID: 1,
					last_SBCC_Cmd_ID: 1001,
				},
				globalSettings: {
					enableActionMsg: true,
					enableMQTT: false,
					enableEvents: false,
					MQTTUserName: '',
					MQTTPassword: '',
					MQTTServer: '',
					MQTTPort: 1883,
					MQTTClientID: 'BtnCmd',
					enableSelects: true,
					lastBackupFileName: 'BtnCmdSettings',
					pluginMinimumHeight: 0,
					enableGC_SH_Btn: false,
					defaultGC_Hidden: false,
					enableSBCC: false,
					enableAutoBackup: false,
					ABackupFileName: ''
				},
				SBCCSettings: {					
					HTTP_Port: "8091",
					API_KEY: 1234567890234,
					SUBNET: "0.0.0.0"
				},
				monitoredEvents: [
					{
						eventID: 1,
						eventType: 'status',
						eventOnlyInPrint: true,
						eventTrigValue: 'busy',
						eventTrigActionType: 'http',
						eventTrigActionCmd: 'http://',
						eventTrigActionTopic: '',
						eventEnabled: false,
						eventName: 'Example Event',
						eventTgrmChatID: '',
						eventTgrmAPIToken: '',
						eventHttpType: 'GET',
						eventHttpData: null,
						eventHttpContType: 'text'
					}
				],
				btns: [
					{
						btnID: '1',
						btnLabel: 'Example',
						btnType: 'Macro',
						btnActionData: 'MacroName.g',
						btnTopicData: '',
						btnEnableWhileJob : false,
						btnColour: '#00DBFFFF',
						btnGroupIdx: 1,
						btnIcon: 'mdi-polymer',
						btnHoverText: 'This is hover text',
						btnXpos: 100,
						btnYpos: 100,
						autoSize: true,
						btnHsize: 'auto',
						btnWsize: 'auto',
						btnHttpType: 'GET',
						btnHttpData: null,
						btnHttpContType: 'text',
						btnZIndex: 1,
						btnWinHSize: 200,
						btnWinWSize: 200,
						btnReqConf: false,
						btnConfText: 'Are You Sure?',
						btnSBCCShowResult: false
					}
				],
				tabs: [
					{
						tabID: 1,
						embedTab: false,
						icon: "mdi-view-module",
						translated: false,
						caption: "Layout 1",
						numberOfColumns: 12,
						showWebCam: false,
						showAltWebCam : false,
						tabEnableSnap: false,
						tabGridSize: [1,1],
						lastZIndex: 2
					},
					{
						tabID: 2,
						embedTab: true,
						icon: "mdi-view-module",
						translated: false,
						caption: "Custom Panel 1",
						numberOfColumns: 12,
						showWebCam: false,
						showAltWebCam : false,
						tabEnableSnap: false,
						tabGridSize: [1,1],
						lastZIndex: 2
					}
				],
				panels: [
					{
						panelID: 1,
						tabID: 1,
						panelType: 'jobinfo',
						panelYpos: 150,
						panelXpos: 100,
						panelHSize: 200,
						panelWSize: 200,
						panelZIndex: 2,
						panelMMPrefix: '',
						panelMMPath: '',
						panelMMOrientation: 'H',
						panelMMPrefixColor: '',
						panelMMValueColor: '',
						panelMMTextSize: 'body-2',
						panelColor: '',
						panelBGColor: '',
						panelUseDWCThemeBGColor: true,
						panelHoverText: 'This is hover text',
						borderless: false,
						customPanelID: null,
						altWebCamParams: {
							altWebCamURL: 'http://',
							altWebCamRotation: 0,
							altWebCamFlip: 'none',
							altWebCamUpdateTimer:  5000,
							altWebCamiFrame: false,
							altWebCamAppndHTTP: false,
							altWebCamClickURL: ''					
						},
						MMParams: {

						},
						inputClass: 'variable',
						inputType: 'text',
						inputPrefixText: '',
						inputSuffixText: '',
						inputEnableClear: false,
						inputLastVal: '',
						inputVarName: ''
					}
				],
				SBCC_Cmds: [
					{
						SBCC_Cmd_ID: 1001,
						SBCC_Cmd_Name: "Echo Test",
						SBCC_Cmd_CmdText: "echo 'If you see this Msg SBCC is working'",
						Enable_In_Job: true,
						SBCC_Cmd_Timeout: 30,
						SBCC_ShowResult: true
					},
				]
			};
		},
		saveSettings() {
			localStorage.setItem('btnCmdsettings', JSON.stringify(this.btnCmd));
			if(this.btnCmd.globalSettings.enableAutoBackup){
				this.autoBackupToFile();
			}
		},
		loadSettings() {
			var btnString = localStorage.getItem('btnCmdsettings');
				if (btnString) {
					this.btnCmd = JSON.parse(btnString);
					this.onChangeTab(this.btnCmd.tabs[0].tabID);
				} else {
					this.resetSettings();
			}
		},
		initSettings() {
			var btnString = localStorage.getItem('btnCmdsettings');
				if (btnString) {
					this.btnCmd = JSON.parse(btnString);
				} else {
					this.resetSettings();
			}
		},
		resetSettings(){
			this.btnCmd = this.getRefData();
			this.confirmRstSettings = false;
			this.onChangeTab(this.btnCmd.tabs[0].tabID);
			this.saveSettings();			
		},
		async autoBackupToFile() {
			const content = new Blob([JSON.stringify(this.btnCmd)]);
			var tmpFName = this.btnCmd.globalSettings.ABackupFileName.replace(/\n/g," ").replace(/[<>:"/\\|?*]| +$/g,"").replace(/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/,x=>x+"_");
			const setFileName = Path.combine(this.systemDirectory, `${tmpFName}.json`);
			try {
				await this.upload({ filename: setFileName, content, showSuccess: false });
			} catch (e) {
				console.warn(e);
			}
		},
		async saveSettingsToFile() {
			const content = new Blob([JSON.stringify(this.btnCmd)]);
			const setFileName = Path.combine(this.systemDirectory, `${this.btnCmd.globalSettings.lastBackupFileName}.json`);
			try {
				await this.upload({ filename: setFileName, content, showSuccess: false });
			} catch (e) {
				console.warn(e);
			}
		},
		async loadSettingsFromFile() {
			try {
				const setFileName = Path.combine(this.systemDirectory, `${this.btnCmd.globalSettings.lastBackupFileName}.json`);
				const response = await this.machineDownload({ filename: setFileName, type: 'json', showSuccess: false });
				this.btnCmd = response;
				this.checkDataVersion();
				localStorage.setItem('btnCmdsettings', JSON.stringify(this.btnCmd));
			} catch (e) {
				if (!(e instanceof DisconnectedError) && !(e instanceof OperationCancelledError)) {
					console.warn(e);
				}
			}
		},
		async loadDefSBCCmds() {
			//trys to load the default sbcc commands file. if its not there it creates a single command.
			//This file is used by distro maintainers to ship prebuilt commands with distro
			try {
				const setFileName = Path.combine(this.systemDirectory, 'SBCC_Default_Cmds.json');
				const response = await this.machineDownload({ filename: setFileName, type: 'json', showProgress: false, showSuccess: false, showError: false});
				//console.log("Status = " + response.status)
				this.tmpSBCCDef = response;
			} catch (e) {
				var tmpSBC = {
					SBCC_Cmds: [
						{
							SBCC_Cmd_ID: 1,
							SBCC_Cmd_Name: "SBCC Default Test",
							SBCC_Cmd_CmdText : "echo 'SBCC is working!'",
							Enable_In_Job: true,
							SBCC_Cmd_Timeout : 30,
							SBCC_ShowResult: true            
						}
					]
				}
				this.tmpSBCCDef = tmpSBC;
			}
		},
		async validateFileName(){
			if(this.btnCmd.globalSettings.lastBackupFileName.length !== 0){
				var newName = this.btnCmd.globalSettings.lastBackupFileName.replace(/\n/g," ").replace(/[<>:"/\\|?*]| +$/g,"").replace(/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/,x=>x+"_");
				//var newName = System.Text.RegularExpressions.Regex.Replace(entName, '[^a-z A-Z 0-9 ()]', '');
				if(newName !== this.btnCmd.globalSettings.lastBackupFileName){
					//changes have been made
					this.alertFileChanged = true;
					this.btnCmd.globalSettings.lastBackupFileName = newName;
					await this.sleep(4000);
                    this.alertFileChanged = false;
                    return;
				}else{
					//All conditions met
					if(this.fileAction == 'load'){
						this.loadSettingsFromFile();
						this.showFileDialog = false;
					}else if(this.fileAction == 'save'){
						this.saveSettingsToFile();
						this.showFileDialog = false;
					}
				}
			}else{
				this.alertReqVal = true;
				await this.sleep(4000);
				this.alertReqVal = false;
				return;
			}
			
		},
		btnRestoreSettings(){
			this.fileAction = 'load';
			this.showFileDialog = true;
		},
		btnBackupSettings(){
			this.fileAction = 'save';
			this.showFileDialog = true;
		},
		async sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
		checkDataVersion(){
			//compare the loaded data version with the current plugin verison. If they don't match upgrade the data to the new version
			if(this.btnCmdVersion != this.btnCmd.btnCmdVersion) {
				//versions are different run the upgrade
				this.setActionResponse('Running Configuration Data Upgrade to : ' + this.btnCmdVersion);
				this.newData = {
					btnCmdVersion: null,
					systemSettings: null,
					globalSettings: null,
					SBCCSettings: null,
					monitoredEvents: [],
					btns: [],
					tabs: [],
					panels: [],
					SBCC_Cmds: []
				};				
				var refData = this.getRefData();
				var ni = null;
				var tmpTabObj = null;
				const merge = deepmerge;
				//merge systemSettings
				this.newData.systemSettings = merge(refData.systemSettings, this.btnCmd.systemSettings);
				//merge globalSettings
				this.newData.globalSettings = merge(refData.globalSettings, this.btnCmd.globalSettings);
				//merge SBCCSettings
				//as this is a new key in 0.10.6 we need to just add the default if it does not already exist
				var tmpPropCheckObj = Object.prototype.hasOwnProperty.call(this.btnCmd, "SBCCSettings");
				if(tmpPropCheckObj){
					for(ni in this.btnCmd.SBCCSettings){
						this.newData.SBCCSettings = merge(refData.SBCCSettings, this.btnCmd.SBCCSettings);
					}
				}else{
					this.newData.SBCCSettings = refData.SBCCSettings;
				}				
				//merge events
				for(ni in this.btnCmd.monitoredEvents){
					this.newData.monitoredEvents.push(merge(refData.monitoredEvents[0], this.btnCmd.monitoredEvents[ni]))
				}
				ni = null;
				//merge buttons
				for(ni in this.btnCmd.btns){
					this.newData.btns.push(merge(refData.btns[0], this.btnCmd.btns[ni]))
				}
				ni = null;
				//merge tabs
				for(ni in this.btnCmd.tabs){
					tmpTabObj = merge(refData.tabs[0], this.btnCmd.tabs[ni]);
					//reset grid after merge as deepmerge combines the array
					tmpTabObj.tabGridSize = this.btnCmd.tabs[ni].tabGridSize;
					this.newData.tabs.push(tmpTabObj);
					tmpTabObj = null;
				}
				ni = null;
				//merge panels
				for(ni in this.btnCmd.panels){
					this.newData.panels.push(merge(refData.panels[0], this.btnCmd.panels[ni]))
				}
				ni = null;
				//merge SBCC_Cmds
				//as this is a new key we need to just add the default if it does not already exist
				tmpPropCheckObj = Object.prototype.hasOwnProperty.call(this.btnCmd, "SBCC_Cmds");
				//console.log(tmpPropCheckObj)
				if(tmpPropCheckObj){
					for(ni in this.btnCmd.SBCC_Cmds){
						this.newData.SBCC_Cmds.push(merge(refData.SBCC_Cmds[0], this.btnCmd.SBCC_Cmds[ni]))
					}
				}else{
					this.newData.SBCC_Cmds.push(refData.SBCC_Cmds[0]);
				}
				this.setActionResponse('Configuration Data Upgraded from :' + this.btnCmd.btnCmdVersion + ' to : ' + this.btnCmdVersion);
				this.btnCmd = this.newData;
				this.newData = null;
				this.btnCmd.btnCmdVersion = this.btnCmdVersion;
				this.saveSettings();
			}
		}
    }
  };