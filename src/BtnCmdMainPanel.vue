<style>
	.tab-item-wrapper {
		height: calc(100vh - 470px);
		width: 100%;
	}
	.tabs-default {
		height: 100%;
		width: 100%;
	}
	.butheight {
		height: calc(100% - 60px);
	}
	.v-btnCustom {
		height: 100%;
		min-height: 36px;
	}
	#table .v-data-footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		background: white;
	}
	#table .v-data-table__wrapper {
		margin-bottom: 60px;
		background: lightslategray;
	}
	.vdr{touch-action:none;border:0px #000}
	.handle,
	.vdr{position:absolute;box-sizing:border-box}
	.handle{width:10px;height:10px;background:#eee;border:1px solid #333}
	.handle-tl{top:-10px;left:-10px;cursor:nw-resize}
	.handle-tm{top:-10px;left:50%;margin-left:-5px;cursor:n-resize}
	.handle-tr{top:-10px;right:-10px;cursor:ne-resize}
	.handle-ml{left:-10px;cursor:w-resize}
	.handle-ml,.handle-mr{top:50%;margin-top:-5px}
	.handle-mr{right:-10px;cursor:e-resize}
	.handle-bl{bottom:-70px;left:-10px;cursor:sw-resize}
	.handle-bm{bottom:-70px;left:50%;margin-left:-5px;cursor:s-resize}
	.handle-br{bottom:-70px;right:-10px;cursor:se-resize}@media only screen and (max-width:768px){[class*=handle-]:before{content:"";left:-10px;right:-10px;bottom:-10px;top:-10px;position:absolute}}
</style>
<template>
    <v-container fluid ma-0 pa-0 fill-height fill-width overflow-y-hidden overflow-x-hidden>
		<v-toolbar dense flat class="pa-n2 ma-n2"> 
			<v-row fill-width align="center">
				<v-spacer></v-spacer>
				<div class="my-2 ma-2" v-if="backupMode">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" :disabled="isPrinting" color="primary" @click="confirmRstSettings = !confirmRstSettings">
								<v-icon>mdi-autorenew</v-icon>
							</v-btn>
						</template>
						<span>Reset config to default settings! Warning: this will remove all exisiting buttons and tabs. </span>
					</v-tooltip>
				</div>
				<div class="my-2 ma-2" v-if="backupMode">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" :disabled="isPrinting" color="primary" @click="saveSettingsToFile()">
								<v-icon>mdi-content-save-move</v-icon>
							</v-btn>
						</template>
						<span>Backup Config to system folder. Warning! This will overwrite current backup file.</span>
					</v-tooltip>
				</div>
				<div class="my-2 ma-2" v-if="backupMode">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" :disabled="isPrinting" color="primary" @click="loadSettingsFromFile()">
								<v-icon>mdi-backup-restore</v-icon>
							</v-btn>
						</template>
						<span>Restore Config from backup. Warning! This will overwrite current settings.</span>
					</v-tooltip>
				</div>
				<div class="my-2 ma-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" :disabled="isPrinting || editMode" :color="brBtnCol" @click="brBtnClick()">
								<v-icon v-if="!backupMode">mdi-database-arrow-left</v-icon>
								<v-icon v-if="backupMode">mdi-database-arrow-right</v-icon>
							</v-btn>
						</template>
						<span v-if="!backupMode">Show Backup & Restore Options</span>
						<span v-if="backupMode">Hide Backup & Restore Options</span>
					</v-tooltip>
				</div>
				<div class="my-2 ma-2" v-if="btnCmd.globalSettings.enableEvents">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" :disabled="isPrinting || editMode" color="primary" @click="showESEdit = !showESEdit">
								<v-icon>mdi-monitor-eye</v-icon>
							</v-btn>
						</template>
						<span>Configure Status Event Monitoring</span>
					</v-tooltip>
				</div>				
				<div class="my-2 ma-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small color="primary" v-bind="attrs" v-on="on" :elevation="1" :disabled="editMode || backupMode" @click="showGSEdit = !showGSEdit">
								<v-icon>mdi-puzzle-edit</v-icon>
							</v-btn>
						</template>
						<span>Edit Plugin Global Settings</span>
					</v-tooltip>
				</div>
			</v-row>
		</v-toolbar>
		<!--<v-row mt-0><v-col><span class="text-caption">{{ btnCmd }}</span></v-col></v-row>-->
		<v-row>
			<v-col :cols="12">
				<v-tabs class="elevation-2 mt-0 tabs-default">
					<v-tabs-slider></v-tabs-slider>
					<v-tab v-for="(tab, index2) in btnCmd.tabs" :key="tab.tabID" :href="`#general-tab-${index2}`" ref="btnGroupTab" @click="onChangeTab(tab.tabID, index2)">
						<v-icon v-if="tab.icon" class="mr-1">{{ tab.icon }}</v-icon> {{ tab.caption }}
					</v-tab>
					<v-tab-item class="v-data-table__wrapper" v-for="(tab, index) in btnCmd.tabs" :key="index" :value="`general-tab-${index}`">
						<v-card class="tab-item-wrapper">
							<vue-draggable-resizable @mouseover="onDragClick(btn)" :parent="true" :w="btn.btnWsize" :h="btn.btnHsize" class="my-2" v-for="btn in getTabBtns(tab.tabID)" :key="btn.autoSize" :x="btn.btnXpos" :y="btn.btnYpos" :resizable="!btn.autoSize" :draggable="editMode" :drag-handle="'.drag-handle'" @dragstop="lastBtnMovePosition" @resizestop="onBtnResizestop">
								<v-card style="height: 98%; width: 98%">
									<div v-if="btn.btnGroupIdx==tab.tabID && !editMode && !btn.autoSize" style="width: 99%; height: 99%" align="center" justify="center">
										<v-tooltip bottom>
											<template v-slot:activator="{ on, attrs }">
												<v-btn v-if="!btn.autoSize" class="ma-1 pa-1" block style="height: 100%; width: 100%" v-bind="attrs" v-on="on" :color="btn.btnColour" :elevation="1" :disabled="chkJobEnabled(btn)" @click="onBtnClick(btn)">
													<span v-if="btn.btnIcon"><v-icon class="mr-1">{{ btn.btnIcon }}</v-icon>{{ btn.btnLabel }}</span>
													<span v-if="!btn.btnIcon">{{ btn.btnLabel }}</span>
												</v-btn>
											</template>
											<span >{{ btn.btnHoverText }}</span>
										</v-tooltip>
									</div>
									<div v-if="btn.btnGroupIdx==tab.tabID && !editMode && btn.autoSize">
										<v-tooltip bottom>
											<template v-slot:activator="{ on, attrs }">
												<v-btn v-if="btn.autoSize" class="ma-1 pa-1" v-bind="attrs" v-on="on" :color="btn.btnColour" :elevation="1" :disabled="chkJobEnabled(btn)" @click="onBtnClick(btn)">
													<span v-if="btn.btnIcon"><v-icon class="mr-1">{{ btn.btnIcon }}</v-icon>{{ btn.btnLabel }}</span>
													<span v-if="!btn.btnIcon">{{ btn.btnLabel }}</span>
												</v-btn>
											</template>
											<span >{{ btn.btnHoverText }}</span>
										</v-tooltip>
									</div>
									<div v-if="btn.btnGroupIdx==tab.tabID && editMode && !btn.autoSize" style="width: 99%; height: 99%" align="center" justify="center">
										<v-tooltip bottom>
											<template v-slot:activator="{ on, attrs }">
												<v-btn block v-bind="attrs" class="ma-1 pa-1" style="height: 100%; width: 100%" v-on="on" :color="btn.btnColour" :elevation="1" @click="onEditBtnClick(btn)">
													<v-icon>mdi-cog</v-icon>{{ btn.btnLabel }}
												</v-btn>
											</template>
											<span>Edit Button Parameters</span>
										</v-tooltip>
									</div>
									<div v-if="btn.btnGroupIdx==tab.tabID && editMode && btn.autoSize">
										<v-tooltip bottom>
											<template v-slot:activator="{ on, attrs }">
												<v-btn v-bind="attrs" v-on="on" class="ma-1 pa-1" :color="btn.btnColour" :elevation="1" @click="onEditBtnClick(btn)">
													<v-icon>mdi-cog</v-icon>{{ btn.btnLabel }}
												</v-btn>
											</template>
											<span>Edit Button Parameters</span>
										</v-tooltip>
									</div>
									<BtnCmdSettingsDialogue v-if="showEdit" v-model="showEdit" :passedObject="objectToPass" :bMQTT="btnCmd.globalSettings.enableMQTT" :enableSelects="btnCmd.globalSettings.enableSelects"></BtnCmdSettingsDialogue>
									<v-card-actions v-if="btn.btnGroupIdx==tab.tabID && editMode">
										<v-spacer></v-spacer>
										<div class="pa-md-1">
											<v-tooltip bottom>
												<template v-slot:activator="{ on, attrs }">
													<v-btn x-small fab color="info" v-bind="attrs" v-on="on" :elevation="1" @click="btnDelete(btn.btnID)">
														<v-icon>mdi-delete</v-icon>
													</v-btn>
												</template>
												<span>Delete</span>
											</v-tooltip>
										</div>
										<div class="pa-md-1">
											<v-tooltip bottom>
												<template v-slot:activator="{ on, attrs }">
													<v-btn x-small fab color="info" v-bind="attrs" v-on="on" :elevation="1" @click="btnClone(btn)">
														<v-icon>mdi-content-duplicate</v-icon>
													</v-btn>
												</template>
												<span>Clone</span>
											</v-tooltip>
										</div>
										<div class="drag-handle pa-md-1">
											<v-tooltip bottom>
												<template v-slot:activator="{ on, attrs }">
													<v-btn x-small fab color="info" v-bind="attrs" v-on="on" :elevation="1" @mouseover="onDragClick(btn)">
														<v-icon>mdi-drag-variant</v-icon>
													</v-btn>
												</template>
												<span v-if="btn.autoSize">Click & Hold to drag</span>
												<span v-if="!btn.autoSize">Click to enable resize - Click & Hold to drag</span>
											</v-tooltip>
										</div>
									</v-card-actions>
								</v-card>
							</vue-draggable-resizable>
							<vue-draggable-resizable :parent="true" w="auto" h="auto" class="my-2" v-if="tab.showWebCam && !tab.showAltWebCam" :x="tab.tabCamXpos" :y="tab.tabCamYpos" :resizable="false" :draggable="editMode" :drag-handle="'.drag-handle'" @dragstop="lastTabCamMovePosition">
								<v-row>
									<webcam-panel></webcam-panel>
								</v-row>
								<v-row v-if="editMode">
									<v-spacer></v-spacer>
									<div class="drag-handle pa-md-1">
										<v-tooltip bottom>
											<template v-slot:activator="{ on, attrs }">
												<v-btn x-small fab color="info" v-bind="attrs" v-on="on" :elevation="1" @mouseover="onTabCamDragClick(tab)">
													<v-icon>mdi-drag-variant</v-icon>
												</v-btn>
											</template>
											<span>Move</span>
										</v-tooltip>
									</div>
								</v-row>
							</vue-draggable-resizable>
							<vue-draggable-resizable :parent="true" w="auto" h="auto" class="my-2" v-if="tab.showWebCam && tab.showAltWebCam" :x="tab.tabCamXpos" :y="tab.tabCamYpos" :resizable="false" :draggable="editMode" :drag-handle="'.drag-handle'" @dragstop="lastTabCamMovePosition">
								<v-row>
									<altWebCamPanel :passedObject="altWebCamToPass"></altWebCamPanel>
								</v-row>
								<v-row v-if="editMode">
									<v-spacer></v-spacer>
									<div class="drag-handle pa-md-1">
										<v-tooltip bottom>
											<template v-slot:activator="{ on, attrs }">
												<v-btn x-small fab color="info" v-bind="attrs" v-on="on" :elevation="1" @mouseover="onTabCamDragClick(tab)">
													<v-icon>mdi-drag-variant</v-icon>
												</v-btn>
											</template>
											<span>Move</span>
										</v-tooltip>
									</div>
								</v-row>
							</vue-draggable-resizable>
						</v-card>
						<v-card>
							<v-footer absolute>
								<v-simple-table style="width: 100%">
									<tbody>           
										<tr>
											<td>
												<v-layout justify-end>
													<span v-if="btnCmd.globalSettings.enableActionMsg" class="text-caption pa-md-4">{{ actionResponse }}</span>
													<v-spacer></v-spacer>
													<div v-if="editMode" class="pa-md-2">
														<v-tooltip top>
															<template v-slot:activator="{ on, attrs }">
																<v-btn :elevation="1" color="blue-grey lighten-2" v-bind="attrs" v-on="on" @click="onTabEditBtnClick(tab.tabID)">
																	<v-icon class="mr-1">mdi-tab</v-icon>
																</v-btn>
															</template>
															<span>Edit this tab's properties</span>
														</v-tooltip>
													</div>
													<div v-if="editMode" class="pa-md-2">
														<v-tooltip top>
															<template v-slot:activator="{ on, attrs }">
																<v-btn color="blue-grey lighten-2" :elevation="1" v-bind="attrs" v-on="on" @click="onCloneTabBtnClick(tab.tabID)">
																	<v-icon class="mr-1">mdi-table-multiple</v-icon>
																</v-btn>
															</template>
															<span>Clone Current Tab</span>
														</v-tooltip>
													</div>
													<div v-if="editMode" class="pa-md-2">
														<v-tooltip top>
															<template v-slot:activator="{ on, attrs }">
																<v-btn color="blue-grey lighten-2" :elevation="1" v-bind="attrs" v-on="on" @click="onTabAddBtnClick()">
																	<v-icon class="mr-1">mdi-tab-plus</v-icon>
																</v-btn>
															</template>
															<span>Add new tab</span>
														</v-tooltip>
													</div>
													<div v-if="editMode" class="pa-md-2">
														<v-tooltip top>
															<template v-slot:activator="{ on, attrs }">
																<v-btn color="blue-grey lighten-2" :elevation="1" :disabled="hasBtns()" v-bind="attrs" v-on="on" @click="onTabDelBtnClick(index)">
																	<v-icon class="mr-1">mdi-tab-remove</v-icon>
																</v-btn>
															</template>
															<span>Delete current Tab</span>
														</v-tooltip>
													</div>
													<div v-if="editMode" class="pa-md-2">
														<v-tooltip top>
															<template v-slot:activator="{ on, attrs }">
																<v-btn color="blue-grey lighten-2" v-bind="attrs" v-on="on" :elevation="1" @click="onAddBtnClick(tab.tabID)">
																	<v-icon class="mr-1">mdi-card-plus</v-icon>
																</v-btn>
															</template>
															<span>Add new Button</span>
														</v-tooltip>
													</div>
													<div class="pa-md-2">
														<v-tooltip top>
															<template v-slot:activator="{ on, attrs }">
																<v-btn :color="saveBtnCol" v-bind="attrs" v-on="on" :elevation="1" :disabled="backupMode" @click="editModeToggle()">
																	<v-icon v-if="!editMode" class="mr-1">mdi-square-edit-outline</v-icon>
																	<v-icon v-if="editMode" class="mr-1">mdi-content-save-all</v-icon>
																</v-btn>
															</template>
															<span v-if="!editMode">Edit Mode</span>
															<span v-if="editMode">Save Changes & Close</span>
														</v-tooltip>
													</div>
													<div v-if="editMode" class="pa-md-2">
														<v-tooltip top>
															<template v-slot:activator="{ on, attrs }">
																<v-btn color="red" v-bind="attrs" v-on="on" :elevation="1" @click="undoEditChanges()">
																	<v-icon class="mr-1">mdi-progress-close</v-icon>
																</v-btn>
															</template>
															<span>Close & Undo All Changes Since Last Save</span>
														</v-tooltip>
													</div>
													<BtnCmdTabSettingsDialogue v-if="showTabEdit" v-model="showTabEdit" :passedObject="tabObjectToPass[0]" :enableSelects="btnCmd.globalSettings.enableSelects"></BtnCmdTabSettingsDialogue>
												</v-layout>
											</td>
										</tr>
									</tbody>
								</v-simple-table>
							</v-footer>
						</v-card>
					</v-tab-item>
				</v-tabs>
			</v-col>
		</v-row>
		<BtnCmdGlobalSettingsDialogue @exit="saveSettings()" v-if="showGSEdit" v-model="showGSEdit" :passedObject="btnCmd.globalSettings"></BtnCmdGlobalSettingsDialogue>
		<BtnCmdEventSettingsDialogue @exit="saveSettings()" v-if="showESEdit" v-model="showESEdit" :bMQTT="btnCmd.globalSettings.enableMQTT" :passedObject="btnCmd" :enableSelects="btnCmd.globalSettings.enableSelects"></BtnCmdEventSettingsDialogue>
		<confirm-dialog :shown.sync="confirmRstSettings" title="Reset Settings" prompt="Are you sure?" @confirmed="resetSettings()"></confirm-dialog>
	</v-container>
</template>

<script>
'use strict'
import BtnCmdSettingsDialogue from './BtnCmdSettingsDialogue.vue';
import BtnCmdTabSettingsDialogue from './BtnCmdTabSettingsDialogue.vue';
import BtnCmdGlobalSettingsDialogue from './BtnCmdGlobalSettingsDialogue.vue';
import BtnCmdEventSettingsDialogue from './BtnCmdEventSettingsDialogue.vue';
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import Path from '../../utils/path.js';
import BaseConnector from '../../store/machine/connector/BaseConnector';
import mqtt from 'mqtt';
import deepmerge from 'deepmerge';
import { DisconnectedError, OperationCancelledError } from '../../utils/errors.js';
import { isPrinting, isPaused, StatusType } from '../../store/machine/modelEnums.js';
import altWebCamPanel from './altWebCamPanel.vue';
import VueDraggableResizable from 'vue-draggable-resizable';




//needed to run gcode commands
const conditionalKeywords = ['abort', 'echo', 'if', 'elif', 'else', 'while', 'break', 'var', 'set'];

export default {
    components: {
        BtnCmdSettingsDialogue,
		BtnCmdTabSettingsDialogue,
		BtnCmdGlobalSettingsDialogue,
		altWebCamPanel,
		BtnCmdEventSettingsDialogue,
		VueDraggableResizable
    },
	computed: {
		...mapState('machine/model', {
			status: state => state.state.status,
			macrosDirectory: state => state.directories.macros,
			systemDirectory: state => state.directories.system
		}),
		...mapGetters('machine/model', ['jobProgress']),
		...mapState('machine/settings', ['codes']),
		isPrinting() { return isPrinting(this.status); },
		isPaused() { return isPaused(this.status); },
		eventStatusText() { return this.status; },
	},
	data: function () {
		return {
			editMode: false,
			dialog: false,
			showEdit: false,
			showTabEdit: false,
			showGSEdit: false,
			showESEdit: false,
			objectToPass: null,
			tabObjectToPass: null,
			currTab: 1,
			currTabIdx: 0,
			saveBtnCol: 'primary',
			brBtnCol: 'primary',
			backupMode: false,
			displayWebCam: false,
			displayAltWebCam: false,
			directory: Path.macros,
			actionResponse: null,
			altWebCamToPass: null,
			confirmRstSettings: false,
			btnCmdVersion: '0.8.5',
			code: '',
			doingCode: false,
			isSimulating: false,
			newData: null,
			currButtonObj: null,
			currTabObj: null,
			btnCmd : {
				btnCmdVersion: '0.8.5',
				systemSettings: {
					lastID: 1,
					lastTabID: 1,
					lastEventID: 1
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
					enableSelects: false
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
						eventTgrmAPIToken: ''
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
						btnXpos: 10,
						btnYpos: 10,
						autoSize: true,
						btnHsize: 'auto',
						btnWsize: 'auto'
					}
				],
				tabs: [
					{
						tabID: 1,
						icon: "mdi-view-module",
						translated: false,
						caption: "Group 1",
						numberOfColumns: 12,
						showWebCam: false,
						showAltWebCam : false,
						tabCamYpos: 10,
						tabCamXpos: 10,
						altWebCamParams : {
							altWebCamURL : '',
							altWebCamRotation : 0,
							altWebCamFlip : 'none',
							altWebCamUpdateTimer :  5000,
							altWebCamiFrame : false,
							altWebCamAppndHTTP : false,
							altWebCamClickURL : ''					
						}
					}
				]
			}
		}
	},
    methods: {
		...mapActions('machine', ['sendCode']),
		...mapActions('machine', {machineDownload: 'download'}),
        ...mapActions('machine', ['upload']),
		...mapMutations('machine/settings', ['addCode', 'removeCode']),
		setupPage(){
			this.onChangeTab(this.btnCmd.tabs[0].tabID, 0);
		},
		//Data Manipulation
		getRefData(){
			//returns a clean copy of the main data structure, used for resetting config, and config data upgrades
			return {
				btnCmdVersion: this.btnCmdVersion,
				systemSettings: {
					lastID: 1,
					lastTabID: 1,
					lastEventID: 1
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
					enableSelects: false
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
						eventTgrmAPIToken: ''
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
						btnXpos: 10,
						btnYpos: 10,
						autoSize: true,
						btnHsize: 'auto',
						btnWsize: 'auto'
					}
				],
				tabs: [
					{
						tabID: 1,
						icon: "mdi-view-module",
						translated: false,
						caption: "Group 1",
						numberOfColumns: 12,
						showWebCam: false,
						showAltWebCam : false,
						tabCamYpos: 10,
						tabCamXpos: 10,
						altWebCamParams : {
							altWebCamURL : '',
							altWebCamRotation : 0,
							altWebCamFlip : 'none',
							altWebCamUpdateTimer :  5000,
							altWebCamiFrame : false,
							altWebCamAppndHTTP : false,
							altWebCamClickURL : ''					
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
					this.onChangeTab(this.btnCmd.tabs[0].tabID, 0);
				} else {
					this.resetSettings();
			}
		},
		resetSettings(){
			this.btnCmd = this.getRefData();
			this.confirmRstSettings = false;
			this.saveSettings();
			this.onChangeTab(this.btnCmd.tabs[0].tabID, 0);
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
					tabs: []
				};				
				var refData = this.getRefData();
				var ni = null;
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
					this.newData.tabs.push(merge(refData.tabs[0], this.btnCmd.tabs[ni]))
				}
				this.setActionResponse('Configuration Data Upgraded from :' + this.btnCmd.btnCmdVersion + ' to : ' + this.btnCmdVersion);
				this.btnCmd = this.newData;
				this.newData = null;
				this.btnCmd.btnCmdVersion = this.btnCmdVersion;
				this.saveSettings();
			}
		},
		//dragging functions
		lastBtnMovePosition: function (x, y) {
			this.dragging = false;
			this.saveBtnPosition(x, y);
		},
		onDragClick(btnObj){
			this.currButtonObj = btnObj;
			return true;
		},
		saveBtnPosition(xPos, yPos){
			this.currButtonObj.btnXpos = xPos;
			this.currButtonObj.btnYpos = yPos;
		},
		lastTabCamMovePosition: function (x, y) {
			this.dragging = false;
			this.saveTabCamPosition(x, y);
		},
		onTabCamDragClick(tabObj){
			this.currTabObj = tabObj;
			return true;
		},
		saveTabCamPosition(xPos, yPos){
			this.currTabObj.tabCamXpos = xPos;
			this.currTabObj.tabCamYpos = yPos;
		},
		onBtnResizestop: function (x, y, width, height){
			this.resizing = false;
			this.currButtonObj.btnXpos = x;
			this.currButtonObj.btnYpos = y;
			this.currButtonObj.btnWsize = width;
			this.currButtonObj.btnHsize = height;
		},
		//plugin UI functions
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
				this.checkDataVersion();
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
		getTabBtns(tabIndex){
			var result = this.btnCmd.btns.filter(item => item.btnGroupIdx === tabIndex);
			return result;
		},
		onEditBtnClick(item) {
			this.setActionResponse('');
			this.showEdit = true;
			this.objectToPass = item;
		},
		onTabEditBtnClick(TmpTabID) {
			this.setActionResponse('');
			this.showTabEdit = true;
			this.tabObjectToPass = this.btnCmd.tabs.filter(itemTab => itemTab.tabID === TmpTabID);
		},
		hasBtns(){
			var result = this.btnCmd.btns.filter(item => item.btnGroupIdx === this.currTab);
			if(result.length >= 1 || this.btnCmd.tabs.length == 1){
				return true;
			}else{
				return false;
			}
		},
		onTabDelBtnClick(tabIndex) {
			this.setActionResponse('');
			var tmpTabInx = tabIndex;
			if(this.btnCmd.tabs.length > 1){
				this.btnCmd.tabs.splice(tmpTabInx, 1);
			}
			this.onChangeTab(this.btnCmd.tabs[tmpTabInx - 1].tabID, tmpTabInx - 1);
		},
		onTabAddBtnClick() {
			this.setActionResponse('');
			var tmpTabID = this.btnCmd.systemSettings.lastTabID + 1;
			var newTab_object = this.getRefData().tabs[0];
			newTab_object.tabID = tmpTabID;
			newTab_object.caption = 'Group ' + tmpTabID;
			this.btnCmd.systemSettings.lastTabID = tmpTabID;
			this.btnCmd.tabs.push(newTab_object);			
			this.showTabEdit = true;
			this.tabObjectToPass = this.btnCmd.tabs.filter(itemTab => itemTab.tabID == tmpTabID);
		},
		onCloneTabBtnClick(tmpTabID){
			this.setActionResponse('');
			const merge = deepmerge;
			var tmpBtn_object = null;
			var tmpBtnID = null;
			var tmpNextTabID = this.btnCmd.systemSettings.lastTabID + 1;
			//get the current tab JSON object
			var currTabObject = this.btnCmd.tabs.filter(itemTab => itemTab.tabID == tmpTabID);
			//get the buttons associated with the current tab
			var currTabBtnsObject = this.btnCmd.btns.filter(item => item.btnGroupIdx === tmpTabID);
			//Create the new clone Tab
			var tmpNewCaption = currTabObject[0].caption + '-' + tmpTabID;
			var newTab_object = merge(this.getRefData().tabs[0], currTabObject[0])
			newTab_object.tabID = tmpNextTabID;
			newTab_object.caption = tmpNewCaption;
			this.btnCmd.systemSettings.lastTabID = tmpNextTabID;
			this.btnCmd.tabs.push(newTab_object);
			//Now create the clone buttons
			var bi;
			for (bi in currTabBtnsObject) {
				tmpBtnID = this.btnCmd.systemSettings.lastID + 1
				tmpBtn_object = merge(this.getRefData().btns[0], currTabBtnsObject[bi]);
				tmpBtn_object.btnID = tmpBtnID;
				tmpBtn_object.btnGroupIdx = tmpNextTabID;
				this.btnCmd.systemSettings.lastID = tmpBtnID;
				this.btnCmd.btns.push(tmpBtn_object);
			}
		},
		onAddBtnClick(tmpTabID){					
			this.setActionResponse('');
			var tmpBtnID = this.btnCmd.systemSettings.lastID + 1
			this.btnCmd.systemSettings.lastID = tmpBtnID;
			var newBtn_object = this.getRefData().btns[0];
			newBtn_object.btnID = tmpBtnID;
			newBtn_object.btnLabel = 'New';
			newBtn_object.btnColour = '#0077FFFF';
			newBtn_object.btnActionData = '';
			newBtn_object.btnGroupIdx = tmpTabID;
			newBtn_object.btnHoverText = '';
			this.btnCmd.btns.push(newBtn_object);
		},
		btnClone(srcBtn){
			this.setActionResponse('');
			const merge = deepmerge;
			var tmpBtnID = this.btnCmd.systemSettings.lastID + 1
			this.btnCmd.systemSettings.lastID = tmpBtnID;
			var newBtn_object = merge(this.getRefData().btns[0], srcBtn)
			newBtn_object.btnID = tmpBtnID;
			newBtn_object.btnXpos = srcBtn.btnXpos + 20;
			newBtn_object.btnYpos = srcBtn.btnYpos + 20;
			this.btnCmd.btns.push(newBtn_object);
		},
		btnDelete(idx){
			this.setActionResponse('');
			var requiredIndex = this.btnCmd.btns.findIndex(el => el.btnID == idx);
			if(requiredIndex === -1){
				return false;
			}
			this.btnCmd.btns.splice(requiredIndex, 1);
		},
		editModeToggle(){
			this.setActionResponse('');
			this.editMode = !this.editMode;
			if(!this.editMode){
				this.onChangeTab(this.currTab, this.currTabIdx);
				this.saveSettings();
				this.saveBtnCol = 'primary';
			}else {
				this.saveBtnCol = 'green';
				this.displayWebCam = false;
			}
		},
		undoEditChanges(){
			this.setActionResponse('');
			this.loadSettings();
			this.editModeToggle();
		},
		brBtnClick(){
			this.setActionResponse('');
			this.backupMode = !this.backupMode;
			if(!this.backupMode){
				this.brBtnCol = 'primary';
			}else {
				this.brBtnCol = 'red';
			}
		},
		getMainCols() {
			if(this.displayWebCam){
				return 7;
			}else{
				return 12;
			}
		},
		onChangeTab(tmpTabID, tmpTabIndex){
			this.currTab = tmpTabID;
			this.currTabIdx = tmpTabIndex;
			var tmpTabObject = this.btnCmd.tabs.filter(itemTab => itemTab.tabID == tmpTabID);
			if(this.editMode){
				this.displayWebCam = false;
			}else{
				this.displayWebCam = tmpTabObject[0].showWebCam;
				this.displayAltWebCam = tmpTabObject[0].showAltWebCam;
				this.altWebCamToPass = tmpTabObject[0].altWebCamParams;
			}
		},
		//mqtt Msg Send Functions
		sendMQTTMsg(msgStr, topicStr){
			var mqttOptions;
			var tmpParent = this;
				
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
		//function triggered by custom button click
		onBtnClick(btnJSONOb){
			this.setActionResponse('');
			var tmpParent = this;
			if(btnJSONOb.btnType == "Macro"){
				tmpParent.runFile(btnJSONOb.btnActionData);
				tmpParent.setActionResponse("Last Action :  -- Macro -- " + btnJSONOb.btnActionData);
			}else if(btnJSONOb.btnType == "http"){
				tmpParent.setActionResponse("Last Action :  -- http -- Sending: " + btnJSONOb.btnActionData);
				BaseConnector.request('GET', `${btnJSONOb.btnActionData}`)
						.then(function(result) {
							if (result instanceof Object && result.err === 0) {
								//it worked
								tmpParent.setActionResponse("Last Action :  -- http -- Success Result : " + JSON.stringify(result));
							} else {
								//it failed
								tmpParent.setActionResponse("Last Action :  -- http -- Returned Result : " + JSON.stringify(result));
							}
						});
			}else if(btnJSONOb.btnType == "MQTT" && this.btnCmd.globalSettings.enableMQTT){
				this.sendMQTTMsg(btnJSONOb.btnActionData, btnJSONOb.btnTopicData);
			}else if(btnJSONOb.btnType == "gcode"){
				tmpParent.setActionResponse("Last Action :  -- gcode -- " + btnJSONOb.btnActionData);
				tmpParent.code = btnJSONOb.btnActionData;
				tmpParent.send();

			}else if(btnJSONOb.btnType == "MQTT" && !this.btnCmd.globalSettings.enableMQTT){
				tmpParent.setActionResponse("This button has been configured as MQTT, but MQTT is disabled. No Action Taken. Please re-enable MQTT.");
			}
		},
		//set the value of the action footer msg
		setActionResponse(actionTxt){
			this.actionResponse = actionTxt;
		},
		//run maro file
		runFile(filename) {
			this.sendCode(`M98 P"${Path.combine(this.directory, filename)}"`);
		},
		//run gcode commands - taken from codeinput.vue
		hasUnprecedentedParameters: (code) => !code || /(M23|M28|M30|M32|M36|M117)[^0-9]/i.test(code),
		async send() {
			this.showItems = false;

			const code = (!this.code || this.code.constructor === String) ? this.code : this.code.value;
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
					const reply = await this.sendCode({ code: codeToSend, fromInput: true });
					if (!inQuotes && !reply.startsWith('Error: ') && !reply.startsWith('Warning: ') &&
						bareCode.indexOf('M587') === -1 && bareCode.indexOf('M589') === -1 &&
						!this.disableAutoComplete && this.codes.indexOf(codeToSend.trim()) === -1) {
						// Automatically remember successful codes
						//this.addCode(codeToSend.trim());
					}
				} catch {
					// handled before we get here
				}
				this.doingCode = false;
			}
		},
		//Event monitoring functions
		checkEvents(typeStr, val){
			var bi;
			for (bi in this.btnCmd.monitoredEvents) {
				//this.setActionResponse("In checkEvents Sending: " + this.btnCmd.monitoredEvents[bi].eventTrigActionCmd);
				if(this.btnCmd.monitoredEvents[bi].eventType === typeStr && this.btnCmd.monitoredEvents[bi].eventEnabled && this.btnCmd.monitoredEvents[bi].eventTrigValue === val) {
					if(this.btnCmd.monitoredEvents[bi].eventTrigActionType == "http" || this.btnCmd.monitoredEvents[bi].eventTrigActionType == "telegram"){
						var tmpURL = null;
						if(this.btnCmd.monitoredEvents[bi].eventTrigActionType == "telegram"){
							tmpURL = `https://api.telegram.org/bot${this.btnCmd.monitoredEvents[bi].eventTgrmAPIToken}/sendMessage?chat_id=${this.btnCmd.monitoredEvents[bi].eventTgrmChatID}&text=${this.btnCmd.monitoredEvents[bi].eventTrigActionCmd}`;
						}else{
							tmpURL = this.btnCmd.monitoredEvents[bi].eventTrigActionCmd;
						}
						this.setActionResponse("Event Action : -- Sending: " + tmpURL);
						BaseConnector.request('GET', `${tmpURL}`)
							.then(function(result) {
								if (result instanceof Object && result.err === 0) {
									//it worked
									this.setActionResponse("Event Action : -- Success Result : " + JSON.stringify(result));
								} else {
									//it failed
									this.setActionResponse("Event Action : -- Returned Result : " + JSON.stringify(result));
								}
							});
					}else if (this.btnCmd.monitoredEvents[bi].eventTrigActionType == "MQTT" && this.btnCmd.globalSettings.enableMQTT){
						this.sendMQTTMsg(this.btnCmd.monitoredEvents[bi].eventTrigActionCmd, this.btnCmd.monitoredEvents[bi].eventTrigActionTopic);	
					}
				}
			}
		}
	},
	//automated functions
	mounted() {
		this.directory = this.macrosDirectory;
		this.loadSettings();
		this.setupPage();
		this.isSimulating = (this.status === StatusType.simulating);
		this.checkDataVersion();
	},
	watch: {
		status: function (val) {
					//console.log("Checking Conditions Status change to :" + val);
					if(this.btnCmd.globalSettings.enableEvents && !this.isSimulating){
						//console.log("Conditions Met lauching checkEvents");
						this.checkEvents('status', val);
					}
				}	
	}
}
</script>
