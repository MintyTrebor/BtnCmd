
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
					lastTabID: 1,
					lastEventID: 1,
					lastPanelID: 1
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
					lastBackupFileName: 'BtnCmdSettings',
					pluginMinimumHeight: 0,
					enableGC_SH_Btn: false,
					defaultGC_Hidden: false
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
						btnColour: '#FF0000FF',
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
						btnConfText: 'Are You Sure?'
					}
				],
				tabs: [
					{
						tabID: 1,
						embedTab: false,
						icon: "mdi-view-module",
						translated: false,
						caption: "Group 1",
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

						}
					}
				]
			};
		},
		saveSettings() {
			localStorage.setItem('btnCmdsettings', JSON.stringify(this.btnCmd));
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
			} catch (e) {
				if (!(e instanceof DisconnectedError) && !(e instanceof OperationCancelledError)) {
					console.warn(e);
				}
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
					monitoredEvents: [],
					btns: [],
					tabs: [],
					panels: []
				};				
				var refData = this.getRefData();
				var ni = null;
				var tmpTabObj = null;
				const merge = deepmerge;
				//merge systemSettings
				this.newData.systemSettings = merge(refData.systemSettings, this.btnCmd.systemSettings);
				//merge globalSettings
				this.newData.globalSettings = merge(refData.globalSettings, this.btnCmd.globalSettings);
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
				this.setActionResponse('Configuration Data Upgraded from :' + this.btnCmd.btnCmdVersion + ' to : ' + this.btnCmdVersion);
				this.btnCmd = this.newData;
				this.newData = null;
				this.btnCmd.btnCmdVersion = this.btnCmdVersion;
				this.saveSettings();
			}
		},
    }
  };
