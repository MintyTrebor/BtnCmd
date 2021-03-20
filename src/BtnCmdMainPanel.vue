<template>
    <div style="width: 100%">
		<v-row>
			<v-col :cols="getMainCols()">
				<v-tabs class="elevation-2 mt-0">
					<v-tabs-slider></v-tabs-slider>
					<v-tab v-for="(tab, index) in btnCmd.tabs" :key="tab.tabID" :href="`#general-tab-${index}`" ref="btnGroupTab" @click="onChangeTab(tab.tabID)">
						<v-icon v-if="tab.icon" class="mr-1">{{ tab.icon }}</v-icon> {{ tab.caption }}
					</v-tab>
					<v-tab-item v-for="(tab, index) in btnCmd.tabs" :key="index" :value="`general-tab-${index}`">
						<div style="width: 100%">
							<v-container>
								<v-row class="fill-height overflow-auto" id="container" no-gutters>
									<v-col v-for="(btn, btnIdx) in getTabBtns(index+1)" :key="btn.btnID" :cols="tab.numberOfColumns" class="py-2"> 
										<v-card class="pa-2">
											<v-card-actions class="justify-center">
												<div v-if="btn.btnGroupIdx==index+1 && !editMode">
													<v-tooltip bottom>
														<template v-slot:activator="{ on, attrs }">
															<v-btn v-if="btn.btnType != 'Macro'" v-bind="attrs" v-on="on" :color="btn.btnColour" :elevation="1" :disabled="uiFrozen || chkJobEnabled(btn)" @click="onBtnClick(btn)">
																<span v-if="btn.btnIcon"><v-icon class="mr-1">{{ btn.btnIcon }}</v-icon>{{ btn.btnLabel }}</span>
																<span v-if="!btn.btnIcon">{{ btn.btnLabel }}</span>
															</v-btn>
															<v-btn v-if="btn.btnType == 'Macro'" v-bind="attrs" v-on="on" :color="btn.btnColour" :elevation="1" :disabled="uiFrozen || isPrinting" @click="onBtnClick(btn)">
																<span v-if="btn.btnIcon"><v-icon class="mr-1">{{ btn.btnIcon }}</v-icon>{{ btn.btnLabel }}</span>
																<span v-if="!btn.btnIcon">{{ btn.btnLabel }}</span>
															</v-btn>
														</template>
														<span >{{ btn.btnHoverText }}</span>
													</v-tooltip>
												</div>
												<div v-if="btn.btnGroupIdx==index+1 && editMode" class="pa-md-1">
													<v-tooltip bottom>
														<template v-slot:activator="{ on, attrs }">
															<v-btn v-bind="attrs" v-on="on" :color="btn.btnColour" :elevation="1" @click="onEditBtnClick(btn)">
																<v-icon class="mr-1">mdi-cog</v-icon>{{ btn.btnLabel }}
															</v-btn>
														</template>
														<span>Edit Button Parameters</span>
													</v-tooltip>
												</div>
												<div v-if="btn.btnGroupIdx==index+1 && editMode" class="pa-md-1">
													<v-tooltip bottom>
														<template v-slot:activator="{ on, attrs }">
															<v-btn color="info" v-bind="attrs" v-on="on" :elevation="1" @click="btnDelete(btnIdx)">
																<v-icon class="mr-1">mdi-delete</v-icon>
															</v-btn>
														</template>
														<span>Delete</span>
													</v-tooltip>
												</div>
												<div v-if="btn.btnGroupIdx==index+1 && editMode" class="pa-md-1">
													<v-tooltip bottom>
														<template v-slot:activator="{ on, attrs }">
															<v-btn color="info" v-bind="attrs" v-on="on" :elevation="1" @click="btnClone(btn)">
																<v-icon class="mr-1">mdi-content-duplicate</v-icon>
															</v-btn>
														</template>
														<span>Clone</span>
													</v-tooltip>
												</div>
												<BtnCmdSettingsDialogue v-if="showEdit" v-model="showEdit" :passedObject="objectToPass" :bMQTT="btnCmd.globalSettings.enableMQTT"></BtnCmdSettingsDialogue>
											</v-card-actions>
										</v-card>
									</v-col>
								</v-row>
							</v-container>
						</div>
						<div id="grpCntrl" class="div-grpCntrl">
							<v-simple-table style="width: 100%">
								<tbody>           
									<tr>
										<td>
											<v-layout justify-end>
												<div v-if="editMode" class="pa-md-2">
													<v-tooltip bottom>
														<template v-slot:activator="{ on, attrs }">
															<v-btn :elevation="1" color="blue-grey lighten-2" v-bind="attrs" v-on="on" @click="onTabEditBtnClick()">
																<v-icon class="mr-1">mdi-tab</v-icon>
															</v-btn>
														</template>
														<span>Edit this tab's properties</span>
													</v-tooltip>
												</div>
												<div v-if="editMode" class="pa-md-2">
													<v-tooltip bottom>
														<template v-slot:activator="{ on, attrs }">
															<v-btn color="blue-grey lighten-2" :elevation="1" v-bind="attrs" v-on="on" @click="onTabAddBtnClick()">
																<v-icon class="mr-1">mdi-tab-plus</v-icon>
															</v-btn>
														</template>
														<span>Add new tab</span>
													</v-tooltip>
												</div>
												<div v-if="editMode" class="pa-md-2">
													<v-tooltip bottom>
														<template v-slot:activator="{ on, attrs }">
															<v-btn color="blue-grey lighten-2" v-bind="attrs" v-on="on" :elevation="1" @click="onAddBtnClick()">
																<v-icon class="mr-1">mdi-card-plus</v-icon>
															</v-btn>
														</template>
														<span>Add new Button</span>
													</v-tooltip>
												</div>
												<div class="pa-md-2">
													<v-tooltip bottom>
														<template v-slot:activator="{ on, attrs }">
															<v-btn :color="saveBtnCol" v-bind="attrs" v-on="on" :elevation="1" :disabled="uiFrozen" @click="editModeToggle()">
																<v-icon v-if="!editMode" class="mr-1">mdi-square-edit-outline</v-icon>
																<v-icon v-if="editMode" class="mr-1">mdi-content-save-all</v-icon>
															</v-btn>
														</template>
														<span v-if="!editMode">Edit Mode</span>
														<span v-if="editMode">Save Changes</span>
													</v-tooltip>
												</div>
												<BtnCmdTabSettingsDialogue v-if="showTabEdit" v-model="showTabEdit" :passedObject="tabObjectToPass[0]"></BtnCmdTabSettingsDialogue>
											</v-layout>
										</td>
									</tr>
								</tbody>
							</v-simple-table>
						</div>
					</v-tab-item>
				</v-tabs>
			</v-col>
			<v-col v-if="displayWebCam" cols="5">
				<webcam-panel></webcam-panel>
			</v-col>
		</v-row>
		<v-footer absolute>
			<v-row class="pa-2">
				<span v-if="btnCmd.globalSettings.enableActionMsg" class="text-caption">{{ actionResponse }}</span>
				<v-spacer></v-spacer>
				<div class="pa-md-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn v-bind="attrs" v-on="on" :disabled="uiFrozen || isPrinting" color="primary" @click="saveSettingsToFile()">
								<v-icon class="mr-1">mdi-content-save-move</v-icon>
							</v-btn>
						</template>
						<span>Backup Config to system folder. Warning! This will overwrite current backup file.</span>
					</v-tooltip>
				</div>
				<div class="pa-md-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn v-bind="attrs" v-on="on" :disabled="uiFrozen || isPrinting" color="primary" @click="loadSettingsFromFile()">
								<v-icon class="mr-1">mdi-backup-restore</v-icon>
							</v-btn>
						</template>
						<span>Restore Config from backup. Warning! This will overwrite current settings.</span>
					</v-tooltip>
				</div>
				<div class="pa-md-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="primary" v-bind="attrs" v-on="on" :elevation="1" :disabled="uiFrozen" @click="showGSEdit = !showGSEdit">
								<v-icon class="mr-1">mdi-puzzle-edit</v-icon>
							</v-btn>
						</template>
						<span v-if="!editMode">Edit Plugin Global Settings</span>
					</v-tooltip>
				</div>
				<BtnCmdGlobalSettingsDialogue @exit="saveSettings()" v-if="showGSEdit" v-model="showGSEdit" :passedObject="btnCmd.globalSettings"></BtnCmdGlobalSettingsDialogue>
			</v-row>
		</v-footer>
	</div>
</template>

<script>
'use strict'
import BtnCmdSettingsDialogue from './BtnCmdSettingsDialogue.vue';
import BtnCmdTabSettingsDialogue from './BtnCmdTabSettingsDialogue.vue';
import BtnCmdGlobalSettingsDialogue from './BtnCmdGlobalSettingsDialogue.vue';
import { mapGetters, mapState, mapActions } from 'vuex';
import Path from '../../utils/path.js';
import BaseConnector from '../../store/machine/connector/BaseConnector';
import mqtt from 'mqtt';
import { DisconnectedError, OperationCancelledError } from '../../utils/errors.js';
import { isPrinting } from '../../store/machine/modelEnums.js';



export default {
    components: {
        BtnCmdSettingsDialogue,
		BtnCmdTabSettingsDialogue,
		BtnCmdGlobalSettingsDialogue
    },
	computed: {
		...mapState('machine/model', {
			status: state => state.state.status,
			macrosDirectory: state => state.directories.macros,
			systemDirectory: state => state.directories.system
		}),
		...mapGetters('machine/model', ['jobProgress'], ['uiFrozen']),
		isPrinting() { return isPrinting(this.status); },
	},
	data: function () {
		return {
			editMode: false,
			dialog: false,
			showEdit: false,
			showTabEdit: false,
			showGSEdit: false,
			objectToPass: null,
			tabObjectToPass: null,
			currTab: 1,
			saveBtnCol: 'primary',
			displayWebCam: false,
			directory: Path.macros,
			actionResponse: null,
			btnCmd : {
				lastID: 1,
				lastTabID: 1,
				globalSettings: {
					enableActionMsg: true,
					enableMQTT: false,
					MQTTUserName: '',
					MQTTPassword: '',
					MQTTServer: '',
					MQTTPort: 1883,
					MQTTClientID: 'BtnCmd'
				},
				btns: [
					{
						btnID: '1',
						btnLabel: 'Example',
						btnType: 'Macro',
						btnActionData: 'MacroName.g',
						btnTopicData: '',
						btnEnableWhileJob : false,
						btnColour: 'red',
						btnGroupIdx: 1,
						btnIcon: 'mdi-polymer',
						btnHoverText: 'This is hover text'
					}
				],
				tabs: [
					{
						tabID: 1,
						icon: "mdi-view-module",
						translated: false,
						caption: "Group 1",
						numberOfColumns: 12,
						showWebCam: false						
					}
				]
			}
		}
	},
    methods: {
		...mapActions('machine', ['sendCode']),
		...mapActions('machine', {machineDownload: 'download'}),
        ...mapActions('machine', ['upload']),
		setupPage(){
			this.onChangeTab(1);
		},
		async saveSettingsToFile() {
			const content = new Blob([JSON.stringify(this.btnCmd)]);
			const setFileName = Path.combine(this.systemDirectory, 'BtnCmdSettings.json');
			try {
				await this.upload({ filename: setFileName, content, showSuccess: false });
			} catch (e) {
				console.warn(e);
			}
		},
		async loadSettingsFromFile() {
			try {
				const setFileName = Path.combine(this.systemDirectory, 'BtnCmdSettings.json');
				const response = await this.machineDownload({ filename: setFileName, type: 'json', showSuccess: false });
				this.btnCmd = response;
			} catch (e) {
				if (!(e instanceof DisconnectedError) && !(e instanceof OperationCancelledError)) {
					console.warn(e);
				}
			}
		},
		chkJobEnabled(item){
			if(!item.btnEnableWhileJob && this.isPrinting){
				return true;
			}else {
				return false;
			}
		},
		onBtnClick(btnJSONOb){
			this.setActionResponse('');
			var tmpParent = this;
			if(btnJSONOb.btnType == "Macro" && !this.uiFrozen){
				tmpParent.runFile(btnJSONOb.btnActionData);
				tmpParent.setActionResponse("Last Action :  -- Macro -- " + btnJSONOb.btnActionData);
			}else if(btnJSONOb.btnType == "http"){
				tmpParent.setActionResponse("Last Action :  -- http -- Sending: " + btnJSONOb.btnActionData);
				BaseConnector.request('GET', `${btnJSONOb.btnActionData}`)
						.then(function(result) {
							if (result instanceof Object && result.err === 0) {
								//it worked
								tmpParent.setActionResponse("Last Action :  -- http -- Success Result : " + result);
							} else {
								//it failed
								tmpParent.setActionResponse("Last Action :  -- http -- Failed Result : " + result);
							}
						});
			}else if(btnJSONOb.btnType == "MQTT" && this.btnCmd.globalSettings.enableMQTT){
				var mqttOptions;
				
				if(this.btnCmd.globalSettings.MQTTUserName){
					mqttOptions = {
						clientid: this.btnCmd.globalSettings.MQTTClientID,
						username: this.btnCmd.globalSettings.MQTTUserName,
						password: this.btnCmd.globalSettings.MQTTPassword,
						reconnectPeriod: 0
					};
				}else {
					mqttOptions = {
						clientid: this.btnCmd.globalSettings.MQTTClientID,
						reconnectPeriod: 0
					};
				}
				
				var client  = mqtt.connect(this.btnCmd.globalSettings.MQTTServer, mqttOptions);
				
				client.on('connect', function () {
					client.subscribe(btnJSONOb.btnTopicData, function (e) {
						if(!e){
							client.publish(btnJSONOb.btnTopicData, btnJSONOb.btnActionData, function (err) {
								if (err){
									client.end();
									tmpParent.setActionResponse("Last Action :  -- MQTT -- Message Failed Result = " + err);
								}else{
									client.end();
									tmpParent.setActionResponse("Last Action :  -- MQTT -- Message Sent = " + btnJSONOb.btnActionData);
								}
							});
						}else{
							client.end();
							tmpParent.setActionResponse("Last Action :  -- MQTT -- Failed to Subscribe Topic = " + btnJSONOb.btnTopicData + ". Reason = " + e);
						}
					});
					
				});
		
				client.on('error', function (error) {
					client.end();
					tmpParent.setActionResponse("Last Action :  -- MQTT -- Failed Result : " + error);
				});

			}else if(btnJSONOb.btnType == "MQTT" && !this.btnCmd.globalSettings.enableMQTT){
				tmpParent.setActionResponse("This button has been configured as MQTT, but MQTT is disabled. No Action Taken. Please re-enable MQTT.");
			}
		},
		setActionResponse(actionTxt){
			this.actionResponse = actionTxt;
		},
		getTabBtns(tabIndex){
			var result = this.btnCmd.btns.filter(item => item.btnGroupIdx == tabIndex);
			return result;
		},
		onEditBtnClick(item) {
			this.setActionResponse('');
			this.showEdit = true;
			this.objectToPass = item;
		},
		onTabEditBtnClick() {
			this.setActionResponse('');
			this.showTabEdit = true;
			this.tabObjectToPass = this.btnCmd.tabs.filter(itemTab => itemTab.tabID == this.currTab);
		},
		onTabAddBtnClick() {
			this.setActionResponse('');
			var tmpTabID = this.btnCmd.lastTabID + 1;
			var tmpCaption = 'Group ' + tmpTabID;
			var newTab_object = {
				tabID : tmpTabID,
				icon : '',
				translated : false,
				caption : tmpCaption,
				numberOfColumns : 1
			};
			this.btnCmd.lastTabID = tmpTabID
			this.btnCmd.tabs.push(newTab_object);			
			this.showTabEdit = true;
			this.tabObjectToPass = this.btnCmd.tabs.filter(itemTab => itemTab.tabID == tmpTabID);
		},
		onAddBtnClick(){					
			this.setActionResponse('');
			var tmpBtnID = this.btnCmd.lastID + 1
			this.btnCmd.lastID = tmpBtnID;
			var newBtn_object = {
				btnID: tmpBtnID,
				btnLabel: '',
				btnType: 'Macro',
				btnActionData: '',
				btnTopicData: '',
				btnEnableWhileJob : false,
                btnColour: 'blue',
				btnGroupIdx: this.currTab,
				btnIcon: '',
				btnHoverText: ''
			};
			this.btnCmd.btns.push(newBtn_object);
		},
		btnClone(srcBtn){
			this.setActionResponse('');
			var tmpBtnID = this.btnCmd.lastID + 1
			this.btnCmd.lastID = tmpBtnID;
			var newBtn_object = {
				btnID: tmpBtnID,
				btnLabel: srcBtn.btnLabel,
				btnType: srcBtn.btnType,
				btnActionData: srcBtn.btnActionData,
				btnTopicData: srcBtn.btnTopicData,
				btnEnableWhileJob : srcBtn.btnEnableWhileJob,
                btnColour: srcBtn.btnColour,
				btnGroupIdx: srcBtn.btnGroupIdx,
				btnIcon: srcBtn.btnIcon,
				btnHoverText: srcBtn.btnHoverText
			};
			this.btnCmd.btns.push(newBtn_object);
		},
		btnDelete(idx){
			this.setActionResponse('');
			this.btnCmd.btns.splice(idx, 1);
		},
		saveSettings() {
			localStorage.setItem('btnCmdsettings', JSON.stringify(this.btnCmd));
		},
		loadSettings() {
			var btnString = localStorage.getItem('btnCmdsettings');
				if (btnString) {
					this.btnCmd = JSON.parse(btnString);
				} else {
					this.resetSettings();
			}
		},
		resetSettings(){
			this.btnCmd = {
				lastID: 1,
				lastTabID: 1,
				globalSettings: {
					enableActionMsg: true,
					enableMQTT: false,
					MQTTUserName: '',
					MQTTPassword: '',
					MQTTServer: '',
					MQTTPort: 1883,
					MQTTClientID: 'BtnCmd'
				},
				btns: [
					{
						btnID: '1',
						btnLabel: 'Example',
						btnType: 'Macro',
						btnActionData: 'MacroName.g',
						btnTopicData: '',
						btnEnableWhileJob : false,
						btnColour: 'red',
						btnGroupIdx: 1,
						btnIcon: 'mdi-polymer',
						btnHoverText: 'This is hover text'
					}
				],
				tabs: [
					{
						tabID: 1,
						icon: "mdi-view-module",
						translated: false,
						caption: "Group 1",
						numberOfColumns: 12,
						showWebCam: false						
					}
				]
			};
		},
		editModeToggle(){
			this.setActionResponse('');
			this.editMode = !this.editMode;
			if(!this.editMode){
				this.onChangeTab(this.currTab);
				this.saveSettings();
				this.saveBtnCol = 'primary'
			}else {
				this.saveBtnCol = 'red'
			}
		},
		getMainCols() {
			if(this.displayWebCam){
				return 7;
			}else{
				return 12;
			}
		},
		onChangeTab(tmpTabID){
			this.currTab = tmpTabID;
			var tmpTabObject = this.btnCmd.tabs.filter(itemTab => itemTab.tabID == tmpTabID);
			this.displayWebCam = tmpTabObject[0].showWebCam;
		},
		runFile(filename) {
			this.sendCode(`M98 P"${Path.combine(this.directory, filename)}"`);
		}
	},
	mounted() {
		this.directory = this.macrosDirectory;
		this.loadSettings();
		this.setupPage();
	},
	/*watch: {
		macrosDirectory(to, from) {
			if (Path.equals(this.directory, from) || !Path.startsWith(this.directory, to)) {
				this.directory = to;
			}
		}
	}*/

}
</script>