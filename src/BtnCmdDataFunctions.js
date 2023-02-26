
import { DisconnectedError, OperationCancelledError } from '@/utils/errors';
import Path from '@/utils/path';
import deepmerge from 'deepmerge';
import store from "@/store";

export default {
    methods: {
        getRefData(){
			//returns a clean copy of the main data structure, used for resetting config, and config data upgrades
			return {
				btnCmdVersion: this.btnCmdVersion,
				btnCmdIDUpdateRun: true,
				systemSettings: {
					lastID: 1,
					lastTabID: 2,
					lastEventID: 1,
					lastPanelID: 1,
					lastInputID: 1,
					last_SBCC_Cmd_ID: 1002,
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
					ABackupFileName: '',
					enableLaunchAtLoad: false,
					enableChangeTopBar: false,
					TopBarColor: ''
				},
				SBCCSettings: {					
					HTTP_Port: "8091",
					API_KEY: 1234567890234,
					SUBNET: "0.0.0.0"
				},
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
						btnWinHSize: 100,
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
						panelMMEvalMathStr: '',
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
							altWebCamClickURL: '',
							altWebCamConfigURL: '',
							altWebCamConfigNewWin: false					
						},
						MMParams: {

						},
						inputClass: 'variable',
						inputType: 'text',
						inputPrefixText: '',
						inputSuffixText: '',
						inputEnableClear: false,
						inputLastVal: '',
						inputVarName: '',
						inputDispType: '',
						inputControlVals: [],
						inputControlRange:[],
						inputControlSteps: 1,
						bPanelActivated: false,
						chartLabel: 'Custom Chart',
						chartOMDataArr: [],
						chartYaxisLabel: 'Y Axis',
						chartXaxisLabel: 'X Axis',
						chartYaxisMin: 30,
						chartYaxisMax: 50,
						chartYaxisStep: 10,
						chartYaxisMode: 'time',
						chartTickValue: 5,
						chartXaxisOMData: null,
						chartXaxisMaxSample: 600,
						chartUpdateKey: 0,
						chartRetainData: false,
						inputLinkToOM: false,
						inputAfterChangeGCodeCMD: '',
						inputLinkedOMKey: ''
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
		saveAndRefresh() {
			localStorage.setItem('btnCmdsettings', JSON.stringify(this.btnCmd));
			if(this.btnCmd.globalSettings.enableAutoBackup){
				this.autoBackupToFile();
			}
			this.onChangeTab(this.btnCmd.tabs[0].tabID);
		},
		updatePanObject(panObject){
			var tmpIdx = this.btnCmd.panels.findIndex(itemPanel => itemPanel.panelID == panObject.panelID);
			this.btnCmd.panels[tmpIdx] = panObject;
			this.saveSettings()
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
		async resetSettings(){
			
			const awtAR = await this.autoRestore()
		
			if(awtAR){
				return;
			}
		
			this.btnCmd = this.getRefData();
			var defTabID = this.generateUUID('TAB');
			var defCustTabID = this.generateUUID('TAB');
			var defPanelID = this.generateUUID('PANEL');
			var defBtnID = this.generateUUID('BTN');
			this.btnCmd.btns[0].btnID = defBtnID;
			this.btnCmd.btns[0].btnGroupIdx = defTabID
			this.btnCmd.tabs[0].tabID = defTabID;
			this.btnCmd.tabs[1].tabID = defCustTabID;
			this.btnCmd.panels[0].panelID = defPanelID;
			this.btnCmd.panels[0].tabID = defTabID;
			this.confirmRstSettings = false;
			this.onChangeTab(this.btnCmd.tabs[0].tabID);
			this.saveSettings();			
		},
		async autoRestore(){
			try {
				const setFileName = Path.combine(this.systemDirectory, 'BtnCmdAutoRestore.json');
				const response = await store.dispatch("machine/download", { filename: setFileName, type: 'json', showSuccess: false, showError: false});
				this.btnCmd = response;
				this.checkDataVersion();
				localStorage.setItem('btnCmdsettings', JSON.stringify(this.btnCmd));
				this.onChangeTab(this.btnCmd.tabs[0].tabID);
				this.saveSettings();
				return true;
			} catch (e) {
				if (!(e instanceof DisconnectedError) && !(e instanceof OperationCancelledError)) {
					console.warn(e);
					return false;
				}
			}
		},
		async autoBackupToFile() {
			const content = new Blob([JSON.stringify(this.btnCmd)]);
			var tmpFName = this.btnCmd.globalSettings.ABackupFileName.replace(/\n/g," ").replace(/[<>:"/\\|?*]| +$/g,"").replace(/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/,x=>x+"_");
			const setFileName = Path.combine(this.systemDirectory, `${tmpFName}.json`);
			//console.log("setFileName", setFileName)
			try {
				await store.dispatch("machine/upload", { filename: setFileName, content, showSuccess: false });
			} catch (e) {
				console.warn(e);
			}
		},
		async saveSettingsToFile() {
			const content = new Blob([JSON.stringify(this.btnCmd)]);
			const setFileName = Path.combine(this.systemDirectory, `${this.btnCmd.globalSettings.lastBackupFileName}.json`);
			try {
				await store.dispatch("machine/upload", { filename: setFileName, content, showSuccess: false });
			} catch (e) {
				console.warn(e);
			}
		},
		async loadSettingsFromFile() {
			try {
				const setFileName = Path.combine(this.systemDirectory, `${this.btnCmd.globalSettings.lastBackupFileName}.json`);
				const response = await store.dispatch("machine/download", { filename: setFileName, type: 'json', showSuccess: false });
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
				const response = await store.dispatch("machine/download", { filename: setFileName, type: 'json', showProgress: false, showSuccess: false, showError: false});
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
				var prevVer = this.btnCmd.btnCmdVersion;
				//versions are different run the upgrade
				this.setActionResponse('Running Configuration Data Update to: ' + this.btnCmdVersion);
				this.newData = {
					btnCmdVersion: null,
					btnCmdIDUpdateRun: false,
					systemSettings: null,
					globalSettings: null,
					SBCCSettings: null,
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
				//finished upgrade update live data
				this.btnCmd = this.newData;
				//this check to see if the data has already been migrated from numeric id's to guid's
				if(!this.btnCmd.btnCmdIDUpdateRun){
					//this is done hierarchicaly tab - btn - panel
					ni = null;
					//update tabs
					for(ni in this.btnCmd.tabs){
						//only upgrade if the id is a number assume already done if not - a final safety check
						if(!isNaN(this.btnCmd.tabs[ni].tabID)){
							let oldTABID = this.btnCmd.tabs[ni].tabID;
							let bCustTab = this.btnCmd.tabs[ni].embedTab;
							let newTABID = this.generateUUID('TAB');
							this.btnCmd.tabs[ni].tabID = newTABID;
							let bi = 0;
							//update tab btns
							for(bi in this.btnCmd.btns){
								if(this.btnCmd.btns[bi].btnGroupIdx == oldTABID){
									this.btnCmd.btns[bi].btnGroupIdx = newTABID;
								}
							}
							//update panels
							let pi = 0;
							for(pi in this.btnCmd.panels){
								if(this.btnCmd.panels[pi].tabID == oldTABID){
									this.btnCmd.panels[pi].tabID = newTABID
								}
								if(this.btnCmd.panels[pi].customPanelID == oldTABID && bCustTab){
									this.btnCmd.panels[pi].customPanelID = newTABID
								}
							}
						}
					}
					//update panels
					let pi = 0;
					for(pi in this.btnCmd.panels){
						//let oldPanelID = this.btnCmd.panels[pi].panelID;
						let newPanelID = this.generateUUID('PANEL');
						if(!isNaN(this.btnCmd.panels[pi].panelID)){
							this.btnCmd.panels[pi].panelID = newPanelID;
						}
					}
					//update buttons
					let bi = 0;
					for(bi in this.btnCmd.btns){
						//let oldPanelID = this.btnCmd.panels[pi].panelID;
						let newBtnID = this.generateUUID('BTN');
						if(!isNaN(this.btnCmd.btns[bi].btnID)){
							this.btnCmd.btns[bi].btnID = newBtnID;
						}
					}
					this.btnCmd.btnCmdIDUpdateRun = true;
				}
				this.setActionResponse('Configuration Data updated from: ' + prevVer + ' to : ' + this.btnCmdVersion);
				this.newData = null;
				this.btnCmd.btnCmdVersion = this.btnCmdVersion;
				this.saveSettings();
			}
		}
    }
  };