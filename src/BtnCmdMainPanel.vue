<style>
	.tab-item-wrapper {
		height: calc(100vh - 420px);
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
	.handle-tl{top:-15px;left:-15px;cursor:nw-resize}
	.handle-tm{top:-15px;left:50%;margin-left:-5px;cursor:n-resize}
	.handle-tr{top:-15px;right:-15px;cursor:ne-resize}
	.handle-ml{left:-15px;cursor:w-resize}
	.handle-ml,.handle-mr{top:50%;margin-top:-5px}
	.handle-mr{right:-15px;cursor:e-resize}
	.handle-bl{bottom:-15px;left:-15px;cursor:sw-resize}
	.handle-bm{bottom:-15px;left:50%;margin-left:-5px;cursor:s-resize}
	.handle-br{bottom:-15px;right:-15px;cursor:se-resize}@media only screen and (max-width:768px){[class*=handle-]:before{content:"";left:-10px;right:-10px;bottom:-10px;top:-10px;position:absolute}}
	.drag-handle,
	.drag-handle:hover {cursor: move important}
</style>
<template>
    <v-container fluid overflow-y-hidden overflow-x-hidden class="pa-0 ma-0">
		<!--<v-row mt-0><v-col><span class="text-caption">{{ btnCmd.panels }}</span></v-col></v-row>-->
		<v-row>
			<v-tabs class="elevation-2 mt-0 tabs-default">
				<v-tabs-slider></v-tabs-slider>
				<v-tab v-for="(tab, index2) in btnCmd.tabs" :key="tab.tabID" :href="`#general-tab-${index2}`" ref="btnGroupTab" @click="onChangeTab(tab.tabID, index2)">
					<v-icon v-if="tab.icon" class="mr-1">{{ tab.icon }}</v-icon> {{ tab.caption }}
				</v-tab>
				<v-tab-item class="v-data-table__wrapper" v-for="(tab, index) in btnCmd.tabs" :key="index" :value="`general-tab-${index}`">
					<v-card class="tab-item-wrapper">
						<!--this div is here to constrain draggle items within the window-->
						<div style="width: 100%; height: 100%">
							<vue-draggable-resizable v-for="btn in getTabBtns(tab.tabID)" :key="btn.autoSize" :grid="tab.tabGridSize" @mouseover="onDragClick(btn)" :parent="true" :w="btn.btnWsize" :h="btn.btnHsize" class="ma-0 pa-0" :x="btn.btnXpos" :y="btn.btnYpos" :resizable="!btn.autoSize" :draggable="editMode" :drag-handle="'.drag-handle'" @dragstop="lastBtnMovePosition" @resizestop="onBtnResizestop">
								<v-card :key="btn.autoSize" style="height: 98%; width: 98%" class="ma-0 pa-0">
									<v-row style="width: 100%; height: 100%" align="center" justify="center" class="ma-0 pa-0">
										<div v-if="btn.btnGroupIdx==tab.tabID && !editMode && !btn.autoSize" class="ma-0 pa-0" style="width: 100%; height: 100%" align="center" justify="center">
											<v-tooltip bottom>
												<template v-slot:activator="{ on, attrs }">
													<v-btn v-if="!btn.autoSize" block style="height: 100%; width: 100%" v-bind="attrs" v-on="on" :color="btn.btnColour" :elevation="1" :disabled="chkJobEnabled(btn)" @click="onBtnClick(btn)">
														<span v-if="btn.btnIcon"><v-icon class="mr-1">{{ btn.btnIcon }}</v-icon>{{ btn.btnLabel }}</span>
														<span v-if="!btn.btnIcon">{{ btn.btnLabel }}</span>
													</v-btn>
												</template>
												<span >{{ btn.btnHoverText }}</span>
											</v-tooltip>
										</div>
										<div v-if="btn.btnGroupIdx==tab.tabID && !editMode && btn.autoSize" :key="btn.autoSize">
											<v-tooltip bottom>
												<template v-slot:activator="{ on, attrs }">
													<v-btn :key="btn.autoSize" v-if="btn.autoSize" v-bind="attrs" v-on="on" :color="btn.btnColour" :elevation="1" :disabled="chkJobEnabled(btn)" @click="onBtnClick(btn)">
														<span v-if="btn.btnIcon"><v-icon class="mr-1">{{ btn.btnIcon }}</v-icon>{{ btn.btnLabel }}</span>
														<span v-if="!btn.btnIcon">{{ btn.btnLabel }}</span>
													</v-btn>
												</template>
												<span >{{ btn.btnHoverText }}</span>
											</v-tooltip>
										</div>
										<div v-if="btn.btnGroupIdx==tab.tabID && editMode && !btn.autoSize" class="drag-handle ma-0 pa-0" style="width: 100%; height: 100%" align="center" justify="center">
											<v-tooltip bottom>
												<template v-slot:activator="{ on, attrs }">
													<v-btn block v-bind="attrs" style="height: 100%; width: 100%" v-on="on" :color="btn.btnColour" :elevation="1" @mouseover="onDragClick(btn)" @contextmenu="doMenu">
														<v-icon>mdi-cog</v-icon>{{ btn.btnLabel }}
													</v-btn>
												</template>
												<span>Click to enable resize - Click & Hold to drag - Right Click Edit Menu</span>
											</v-tooltip>
										</div>
										<div v-if="btn.btnGroupIdx==tab.tabID && editMode && btn.autoSize" :key="btn.autoSize" class="drag-handle">
											<v-tooltip bottom >
												<template v-slot:activator="{ on, attrs }">
													<v-btn :key="btn.autoSize" v-bind="attrs" v-on="on" :color="btn.btnColour" :elevation="1" @mouseover="onDragClick(btn)" @contextmenu="doMenu">
														<v-icon>mdi-cog</v-icon>{{ btn.btnLabel }}
													</v-btn>
												</template>
												<span>Click & Hold to drag - Right Click Edit Menu</span>
											</v-tooltip>
										</div>
									</v-row>
								</v-card>
							</vue-draggable-resizable>
							<vue-draggable-resizable v-for="panel in getTabPanels(tab.tabID)"  :grid="tab.tabGridSize" :key="panel.panelID" :parent="true" class="ma-0 pa-0" :w="panel.panelWSize" :h="panel.panelHSize" :x="panel.panelXpos" :y="panel.panelYpos" :resizable="true" :draggable="editMode" :drag-handle="'.drag-handle'" @dragstop="lastPanelMovePosition" @resizestop="onPanelResizestop" >
								<v-card style="width: 100%; height: 100%" align="center" justify="center" class="ma-0 pa-0">
									<v-row dense style="width: 100%; height: 100%" align="center" justify="center" class="ma-0 pa-0">
										<td style="width: 100%; height: 100%">
											<job-info-panel v-if="panel.panelType == 'jobinfo'" style="width: 100%; height: 100%" align="center" class="pa-0 ma-0"></job-info-panel>
											<layer-chart v-if="panel.panelType == 'layerchart'" style="width: 100%; height: 100%" min-height="180px" align="center" class="d-flex pa-0 ma-0"></layer-chart>
											<job-estimations-panel v-if="panel.panelType == 'jobestimates'" style="width: 100%; height: 100%" align="center" class="pa-0 ma-0"></job-estimations-panel>
											<job-data-panel v-if="panel.panelType == 'collectdata'" style="width: 100%; height: 100%" align="center" class="pa-0 ma-0"></job-data-panel>
											<fans-panel v-if="panel.panelType == 'fans'" style="width: 100%; height: 100%" align="center" class="pa-0 ma-0"></fans-panel>
											<speed-factor-panel v-if="panel.panelType == 'speed'" style="width: 100%; height: 100%" align="center" class="pa-0 ma-0"></speed-factor-panel>
											<v-overlay :absolute="true" :opacity="0.5" :value="editMode">
												<tbody>
													<row align="center" justify="center">
														<v-spacer></v-spacer>
														<td>
															<div class="pa-md-1">
																<v-tooltip bottom>
																	<template v-slot:activator="{ on, attrs }">
																		<v-btn x-small fab color="info" v-bind="attrs" v-on="on" :elevation="1" @click="panelDelete(panel.panelID)">
																			<v-icon>mdi-delete</v-icon>
																		</v-btn>
																	</template>
																	<span>Delete Panel</span>
																</v-tooltip>
															</div>
														</td>
														<td>
															<div class="drag-handle pa-md-1">
																<v-tooltip bottom>
																	<template v-slot:activator="{ on, attrs }">
																		<v-btn x-small style="cursor: move" fab color="info" v-bind="attrs" v-on="on" :elevation="1" @mouseover="onPanelDragClick(panel)">
																			<v-icon>mdi-drag-variant</v-icon>
																		</v-btn>
																	</template>
																	<span>Click to enable resize - Click & Hold to drag</span>
																</v-tooltip>
															</div>
														</td>
														<v-spacer></v-spacer>
													</row>
												</tbody>
											</v-overlay>
										</td>
									</v-row>
								</v-card>
							</vue-draggable-resizable>
							<vue-draggable-resizable v-for="panel in getTabCamPanels(tab.tabID)" :grid="tab.tabGridSize" :key="panel.panelID" :parent="true" class="ma-0 pa-0" :w="panel.panelWSize" :h="panel.panelHSize" :x="panel.panelXpos" :y="panel.panelYpos" :resizable="true" :draggable="editMode" :drag-handle="'.drag-handle'" @dragstop="lastPanelMovePosition" @resizestop="onPanelResizestop">
								<v-card style="width: 100%; height: 100%" align="center" justify="center" class="ma-0 pa-0">
									<v-row dense style="width: 100%; height: 100%" align="center" justify="center" class="ma-0 pa-0">
										<td style="width: 100%; height: 100%">
											<altWebCamPanel v-if="panel.panelType == 'altwebcam'" style="width: 100%; height: 100%" align="center" justify="center" :passedObject="panel.altWebCamParams" class="pa-0 ma-0"></altWebCamPanel>
											<webcam-panel v-if="panel.panelType == 'webcam'" style="width: 100%; height: 100%" align="center" justify="center" class="pa-0 ma-0"></webcam-panel>
											<v-overlay :absolute="true" :opacity="0.5" :value="editMode">
												<tbody>
													<row align="center" justify="center">
														<v-spacer></v-spacer>
														<td v-if="panel.panelType == 'altwebcam'">
															<div class="pa-md-1">
																<v-tooltip bottom>
																	<template v-slot:activator="{ on, attrs }">
																		<v-btn x-small fab color="info" v-bind="attrs" v-on="on" :elevation="1" @click="panelEdit(panel.panelID)">
																			<v-icon>mdi-playlist-edit</v-icon>
																		</v-btn>
																	</template>
																	<span>Edit Alt Webcam Panel</span>
																</v-tooltip>
															</div>
														</td>
														<td>
															<div class="pa-md-1">
																<v-tooltip bottom>
																	<template v-slot:activator="{ on, attrs }">
																		<v-btn x-small fab color="info" v-bind="attrs" v-on="on" :elevation="1" @click="panelDelete(panel.panelID)">
																			<v-icon>mdi-delete</v-icon>
																		</v-btn>
																	</template>
																	<span>Delete Panel</span>
																</v-tooltip>
															</div>
														</td>
														<td>
															<div class="drag-handle pa-md-1">
																<v-tooltip bottom>
																	<template v-slot:activator="{ on, attrs }">
																		<v-btn x-small style="cursor: move" fab color="info" v-bind="attrs" v-on="on" :elevation="1" @mouseover="onPanelDragClick(panel)">
																			<v-icon>mdi-drag-variant</v-icon>
																		</v-btn>
																	</template>
																	<span>Click to enable resize - Click & Hold to drag</span>
																</v-tooltip>
															</div>
														</td>
														<v-spacer></v-spacer>
													</row>
												</tbody>
											</v-overlay>
										</td>
									</v-row>
								</v-card>
							</vue-draggable-resizable>
						</div>
						<v-footer height="37" absolute style="bottom: 12px;" class="pa-0 ma-0">
							<tbody style="position: absolute; right: 10px;">           
								<tr>
									<td>
										<div v-if="editMode" class="my-2 ma-2">
											<v-tooltip top>
												<template v-slot:activator="{ on, attrs }">
													<v-btn small :elevation="1" color="blue-grey lighten-2" v-bind="attrs" v-on="on" @click="onTabEditBtnClick(tab.tabID)">
														<v-icon class="mr-1">mdi-tab</v-icon>
													</v-btn>
												</template>
												<span>Edit this tab's properties</span>
											</v-tooltip>
										</div>
									</td>
									<td>
										<div v-if="editMode" class="my-2 ma-2">
											<v-tooltip top>
												<template v-slot:activator="{ on, attrs }">
													<v-btn small color="blue-grey lighten-2" :elevation="1" v-bind="attrs" v-on="on" @click="onCloneTabBtnClick(tab.tabID)">
														<v-icon class="mr-1">mdi-table-multiple</v-icon>
													</v-btn>
												</template>
												<span>Clone Current Tab</span>
											</v-tooltip>
										</div>
									</td>
									<td>
										<div v-if="editMode" class="my-2 ma-2">
											<v-tooltip top>
												<template v-slot:activator="{ on, attrs }">
													<v-btn small color="blue-grey lighten-2" :elevation="1" v-bind="attrs" v-on="on" @click="onTabAddBtnClick()">
														<v-icon class="mr-1">mdi-tab-plus</v-icon>
													</v-btn>
												</template>
												<span>Add new tab</span>
											</v-tooltip>
										</div>
									</td>
									<td>
										<div v-if="editMode" class="my-2 ma-2">
											<v-tooltip top>
												<template v-slot:activator="{ on, attrs }">
													<v-btn small color="blue-grey lighten-2" :elevation="1" :disabled="hasBtns()" v-bind="attrs" v-on="on" @click="onTabDelBtnClick(index)">
														<v-icon class="mr-1">mdi-tab-remove</v-icon>
													</v-btn>
												</template>
												<span>Delete current Tab</span>
											</v-tooltip>
										</div>
									</td>
									<td>
										<div v-if="editMode" class="my-2 ma-2">
											<v-tooltip top>
												<template v-slot:activator="{ on, attrs }">
													<v-btn small color="blue-grey lighten-2" :elevation="1" v-bind="attrs" v-on="on" @click="onAddPanelClick(tab)">
														<v-icon class="mr-1">mdi-credit-card-plus</v-icon>
													</v-btn>
												</template>
												<span>Add new panel to the tab</span>
											</v-tooltip>
										</div>
									</td>
									<td>
										<div v-if="editMode" class="my-2 ma-2">
											<v-tooltip top>
												<template v-slot:activator="{ on, attrs }">
													<v-btn small color="blue-grey lighten-2" v-bind="attrs" v-on="on" :elevation="1" @click="onAddBtnClick(tab)">
														<v-icon class="mr-1">mdi-card-plus</v-icon>
													</v-btn>
												</template>
												<span>Add new Button</span>
											</v-tooltip>
										</div>
									</td>
									<td>
										<div class="my-2 ma-2">
											<v-tooltip top>
												<template v-slot:activator="{ on, attrs }">
													<v-btn small :color="saveBtnCol" v-bind="attrs" v-on="on" :elevation="1" :disabled="backupMode" @click="editModeToggle()">
														<v-icon v-if="!editMode" class="mr-1">mdi-square-edit-outline</v-icon>
														<v-icon v-if="editMode" class="mr-1">mdi-content-save-all</v-icon>
													</v-btn>
												</template>
												<span v-if="!editMode">Edit Mode</span>
												<span v-if="editMode">Save Changes & Close</span>
											</v-tooltip>
										</div>
									</td>
									<td>
										<div v-if="editMode" class="my-2 ma-2">
											<v-tooltip top>
												<template v-slot:activator="{ on, attrs }">
													<v-btn small color="red" v-bind="attrs" v-on="on" :elevation="1" @click="undoEditChanges()">
														<v-icon class="mr-1">mdi-progress-close</v-icon>
													</v-btn>
												</template>
												<span>Close & Undo All Changes Since Last Save</span>
											</v-tooltip>
										</div>
									</td>
								</tr>
							</tbody>
						</v-footer>
					</v-card>
				</v-tab-item>
			</v-tabs>
			<v-menu v-model="showMenu" :position-x="menuX" :position-y="menuY" absolute offset-y>
				<v-card>
					<tbody>
						<tr>
							<v-spacer></v-spacer>
								<td>
									<div class="pa-md-1">
										<v-tooltip bottom>
											<template v-slot:activator="{ on, attrs }">
												<v-btn x-small fab color="info" v-bind="attrs" v-on="on" :elevation="1" @click="checkBtnSize(currButtonObj)">
													<v-icon>mdi-image-size-select-small</v-icon>
												</v-btn>
											</template>
											<span>Toggle Auto/Manual Button Sizing</span>
										</v-tooltip>
									</div>
								</td>
								<td>
									<div class="pa-md-1">
										<v-tooltip bottom>
											<template v-slot:activator="{ on, attrs }">
												<v-btn x-small fab color="info" v-bind="attrs" v-on="on" :elevation="1" @click="btnDelete(currButtonObj.btnID)">
													<v-icon>mdi-delete</v-icon>
												</v-btn>
											</template>
											<span>Delete Button</span>
										</v-tooltip>
									</div>
								</td>
								<td>
									<div class="pa-md-1">
										<v-tooltip bottom>
											<template v-slot:activator="{ on, attrs }">
												<v-btn x-small fab color="info" v-bind="attrs" v-on="on" :elevation="1" @click="btnClone(currButtonObj)">
													<v-icon>mdi-content-duplicate</v-icon>
												</v-btn>
											</template>
											<span>Clone Button</span>
										</v-tooltip>
									</div>
								</td>
								<td>
									<div class="pa-md-1">
										<v-tooltip bottom>
											<template v-slot:activator="{ on, attrs }">
												<v-btn x-small fab color="info" v-bind="attrs" v-on="on" :elevation="1" @click="onEditBtnClick(currButtonObj)">
													<v-icon>mdi-playlist-edit</v-icon>
												</v-btn>
											</template>
											<span>Edit Button Settings</span>
										</v-tooltip>
									</div>
								</td>
							<v-spacer></v-spacer>
						</tr>
					</tbody>
				</v-card>
			</v-menu>
			<v-alert dense color="#C5C4C6" border="left" dismissible v-model="showInfo" close-text="Close Info" transition="scale-transition" @close="showInfo=!showInfo" style="position: absolute; z-index:99999; bottom: 36px; left: 10px;">
				<strong>BtnCmd Alpha v{{ btnCmdVersion }}</strong><br>
				Cobbled together by <a href="https://github.com/MintyTrebor" target="_blank">Minty Trebor</a><br>
				BtnCmd uses the following libraries/modules:<br>
				<a href="https://www.npmjs.com/package/deepmerge" target="_blank">DeepMerge</a><span>, </span>
				<a href="https://www.npmjs.com/package/mqtt" target="_blank">MQTT.js</a><span>, </span>
				<a href="https://www.npmjs.com/package/vue-draggable-resizable" target="_blank">vue-draggable-resizable</a><span>, </span>
				<a href="https://www.npmjs.com/package/axios" target="_blank">axios</a><br>
				Plus re-uses components and code from <strong>DWC</strong>.<br>
				<a href="https://github.com/MintyTrebor/BtnCmd/wiki" target="_blank">BtnCmd Wiki</a><br>
				<a href="https://materialdesignicons.com/" target="_blank">Material Design Icon Library</a><br>
			</v-alert>
			<tbody style="position: absolute; z-index:99999; bottom: 18px; left: 10px;">           
				<tr>
					<td>
						<v-layout justify-start>
							<div class="mx-2">
								<v-tooltip top>
									<template v-slot:activator="{ on, attrs }">
										<v-btn small color="primary" v-bind="attrs" v-on="on" :elevation="1" :disabled="editMode || backupMode" @click="showInfo = !showInfo">
											<v-icon>mdi-information</v-icon>
										</v-btn>
									</template>
									<span>BtnCmd Info</span>
								</v-tooltip>
							</div>
							<div class="mx-2">
								<v-tooltip top>
									<template v-slot:activator="{ on, attrs }">
										<v-btn small color="primary" v-bind="attrs" v-on="on" :elevation="1" :disabled="editMode || backupMode" @click="showGSEdit = !showGSEdit">
											<v-icon>mdi-puzzle-edit</v-icon>
										</v-btn>
									</template>
									<span>Edit Plugin Global Settings</span>
								</v-tooltip>
							</div>
							<div class="mx-2" v-if="btnCmd.globalSettings.enableEvents">
								<v-tooltip top>
									<template v-slot:activator="{ on, attrs }">
										<v-btn small  v-bind="attrs" v-on="on" :disabled="editMode || backupMode" color="primary" @click="showESEdit = !showESEdit">
											<v-icon>mdi-monitor-eye</v-icon>
										</v-btn>
									</template>
									<span>Configure Status Event Monitoring</span>
								</v-tooltip>
							</div>				
							<div class="mx-2" v-if="backupMode">
								<v-tooltip top>
									<template v-slot:activator="{ on, attrs }">
										<v-btn small v-bind="attrs" v-on="on" :disabled="isPrinting" color="primary" @click="loadSettingsFromFile()">
											<v-icon>mdi-backup-restore</v-icon>
										</v-btn>
									</template>
									<span>Restore Config from backup. Warning! This will overwrite current settings.</span>
								</v-tooltip>
							</div>
							<div class="mx-2" v-if="backupMode">
								<v-tooltip top>
									<template v-slot:activator="{ on, attrs }">
										<v-btn small v-bind="attrs" v-on="on" :disabled="isPrinting" color="primary" @click="saveSettingsToFile()">
											<v-icon>mdi-content-save-move</v-icon>
										</v-btn>
									</template>
									<span>Backup Config to system folder. Warning! This will overwrite current backup file.</span>
								</v-tooltip>
							</div>
							<div class="mx-2" v-if="backupMode">
								<v-tooltip top>
									<template v-slot:activator="{ on, attrs }">
										<v-btn small v-bind="attrs" v-on="on" :disabled="isPrinting" color="primary" @click="confirmRstSettings = !confirmRstSettings">
											<v-icon>mdi-autorenew</v-icon>
										</v-btn>
									</template>
									<span>Reset config to default settings! Warning: this will remove all exisiting buttons and tabs. </span>
								</v-tooltip>
							</div>
							<div class="mx-2">
								<v-tooltip top>
									<template v-slot:activator="{ on, attrs }">
										<v-btn small v-bind="attrs" v-on="on" :disabled="isPrinting || editMode" :color="brBtnCol" @click="brBtnClick()">
											<v-icon v-if="!backupMode">mdi-database-arrow-right</v-icon>
											<v-icon v-if="backupMode">mdi-database-arrow-left</v-icon>
										</v-btn>
									</template>
									<span v-if="!backupMode">Show Backup & Restore Options</span>
									<span v-if="backupMode">Hide Backup & Restore Options</span>
								</v-tooltip>
							</div>
							<div>
								<span v-if="btnCmd.globalSettings.enableActionMsg" class="text-caption mx-4">{{ actionResponse }}</span>
							</div>
						</v-layout>
					</td>
				</tr>
			</tbody>
		</v-row>
		<BtnCmdSettingsDialogue v-if="showEdit" v-model="showEdit" :passedObject="objectToPass" :bMQTT="btnCmd.globalSettings.enableMQTT" :enableSelects="btnCmd.globalSettings.enableSelects"></BtnCmdSettingsDialogue>
		<BtnCmdTabSettingsDialogue v-if="showTabEdit" v-model="showTabEdit" :passedObject="tabObjectToPass[0]" :enableSelects="btnCmd.globalSettings.enableSelects"></BtnCmdTabSettingsDialogue>
		<BtnCmdPanelSettingsDialogue v-if="showPanelEdit" v-model="showPanelEdit" :passedObject="panelObjectToPass[0]" :enableSelects="btnCmd.globalSettings.enableSelects"></BtnCmdPanelSettingsDialogue>
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
import BtnCmdPanelSettingsDialogue from './BtnCmdPanelSettingsDialogue.vue';
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import Path from '../../utils/path.js';
import mqtt from 'mqtt';
import axios from 'axios';
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
		VueDraggableResizable,
		BtnCmdPanelSettingsDialogue
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
			showInfo: false,
			showPanelEdit: false,
			objectToPass: null,
			tabObjectToPass: null,
			panelObjectToPass: null,
			actionDialog: false,
			currTab: 1,
			currTabIdx: 0,
			saveBtnCol: 'primary',
			brBtnCol: 'primary',
			backupMode: false,
			directory: Path.macros,
			actionResponse: null,
			altWebCamToPass: null,
			confirmRstSettings: false,
			btnCmdVersion: '0.8.8',
			code: '',
			doingCode: false,
			isSimulating: false,
			newData: null,
			currButtonObj: null,
			currTabObj: null,
			currPanelObj: null,
			editDragging: false,
			showMenu: false,
			menuX: 0,
			menuY: 0,
			btnCmd : {
				btnCmdVersion: '0.8.8',
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
					enableSelects: true
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
						btnXpos: 20,
						btnYpos: 20,
						autoSize: true,
						btnHsize: 'auto',
						btnWsize: 'auto',
						btnHttpType: 'GET',
						btnHttpData: null,
						btnHttpContType: 'text'
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
						tabCamYpos: 20,
						tabCamXpos: 20,
						tabCamHSize: 'auto',
						tabCamWSize: 'auto',
						tabEnableSnap: false,
						tabGridSize: [1,1],
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
				],
				panels: [
					{
						panelID: 1,
						tabID: 1,
						panelType: 'webcam',
						panelYpos: 70,
						panelXpos: 70,
						panelHSize: 'auto',
						panelWSize: 'auto',
						altWebCamParams : {
							altWebCamURL : 'http://',
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
					enableSelects: true
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
						btnXpos: 20,
						btnYpos: 20,
						autoSize: true,
						btnHsize: 'auto',
						btnWsize: 'auto',
						btnHttpType: 'GET',
						btnHttpData: null,
						btnHttpContType: 'text'
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
						tabCamYpos: 20,
						tabCamXpos: 20,
						tabCamHSize: 'auto',
						tabCamWSize: 'auto',
						tabEnableSnap: false,
						tabGridSize: [1,1],
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
				],
				panels: [
					{
						panelID: 1,
						tabID: 1,
						panelType: 'webcam',
						panelYpos: 70,
						panelXpos: 70,
						panelHSize: 'auto',
						panelWSize: 'auto',
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
		//PopUpMenu Functions
		doMenu (e) {
			e.preventDefault()
			this.showMenu = false
			this.menuX = e.clientX
			this.menuY = e.clientY
			this.$nextTick(() => {
				this.showMenu = true
			})
		},
		//dragging functions
		lastBtnMovePosition: function (x, y) {
			this.editDragging = false;
			this.dragging = false;
			this.saveBtnPosition(x, y);
		},
		onDragClick(btnObj){
			this.editDragging = true;
			this.currButtonObj = btnObj;
			return true;
		},
		saveBtnPosition(xPos, yPos){
			this.currButtonObj.btnXpos = this.checkGridCompat(xPos);
			this.currButtonObj.btnYpos = this.checkGridCompat(yPos);
		},
		onBtnResizestop: function (x, y, width, height){
			this.resizing = false;
			this.currButtonObj.btnXpos = this.checkGridCompat(x);
			this.currButtonObj.btnYpos = this.checkGridCompat(y);
			this.currButtonObj.btnWsize = this.checkGridCompat(width);
			this.currButtonObj.btnHsize = this.checkGridCompat(height);
		},
		checkBtnSize(btnObj) {
				
			if(btnObj.autoSize){
				btnObj.btnWsize = 200;
				btnObj.btnHsize = 100;
				btnObj.autoSize = false;
			}else {
				btnObj.btnWsize = 'auto';
				btnObj.btnHsize = 'auto';
				btnObj.autoSize = true;
			}
			
		},
		checkGridCompat(gridVal){
			if(this.tabEnableSnap && gridVal >= 0){
				if(!(gridVal % 20 === 0)){
					return (Math.round(gridVal / 20) * 20);
				}else{
					return gridVal;
				}
			}else{
				return gridVal;
			}
		},
		lastPanelMovePosition: function (x, y) {
			this.editDragging = false;
			this.dragging = false;
			this.savePanelPosition(x, y);
		},
		onPanelDragClick(panelObj){
			this.editDragging = true;
			this.currPanelObj = panelObj;
			return true;
		},
		savePanelPosition(xPos, yPos){
			this.currPanelObj.panelXpos = this.checkGridCompat(xPos);
			this.currPanelObj.panelYpos = this.checkGridCompat(yPos);
		},
		onPanelResizestop: function (x, y, width, height){
			this.resizing = false;
			this.currPanelObj.panelXpos = this.checkGridCompat(x);
			this.currPanelObj.panelYpos = this.checkGridCompat(y);
			this.currPanelObj.panelWSize = this.checkGridCompat(width);
			this.currPanelObj.panelHSize = this.checkGridCompat(height);
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
		getTabPanels(tabIndex){
			var result = this.btnCmd.panels.filter(item => item.tabID === tabIndex && item.panelType != "webcam" && item.panelType != "altwebcam");
			return result;
		},
		getTabCamPanels(tabIndex){
			var result = this.btnCmd.panels.filter(item => (item.tabID === tabIndex) && (item.panelType == "webcam" || item.panelType == "altwebcam"));
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
			//check to see if tab has any btns or panels before allowing delete
			var result = this.btnCmd.btns.filter(item => item.btnGroupIdx === this.currTab);
			var result2 = this.btnCmd.panels.filter(item => item.tabID === this.currTab);
			if(result.length >= 1 || this.btnCmd.tabs.length == 1 || result2.length >= 1){
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
			var tmpPanel_object = null;
			var tmpBtnID = null;
			var tmpPanelID = null;
			var tmpNextTabID = this.btnCmd.systemSettings.lastTabID + 1;
			//get the current tab JSON object
			var currTabObject = this.btnCmd.tabs.filter(itemTab => itemTab.tabID == tmpTabID);
			//get the buttons associated with the current tab
			var currTabBtnsObject = this.btnCmd.btns.filter(item => item.btnGroupIdx === tmpTabID);
			//get the panels associated with the current tab
			var currTabPanelsObject = this.btnCmd.panels.filter(item => item.tabID === tmpTabID);
			//
			//Create the new clone Tab
			var tmpNewCaption = currTabObject[0].caption + '-' + tmpNextTabID;
			var newTab_object = merge(this.getRefData().tabs[0], currTabObject[0])
			newTab_object.tabID = tmpNextTabID;
			newTab_object.caption = tmpNewCaption;
			//reset grid after merge
			newTab_object.tabGridSize = currTabObject[0].tabGridSize;
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
			//Now Create the cloned Panels
			for (bi in currTabPanelsObject) {
				tmpPanelID = this.btnCmd.systemSettings.lastPanelID + 1
				tmpPanel_object = merge(this.getRefData().panels[0], currTabPanelsObject[bi]);
				tmpPanel_object.panelID = tmpPanelID;
				tmpPanel_object.tabID = tmpNextTabID;
				this.btnCmd.systemSettings.lastPanelID = tmpPanelID;
				this.btnCmd.panels.push(tmpPanel_object);
			}

		},
		onAddPanelClick(tmpTab){					
			this.setActionResponse('');
			var tmpPanelID = this.btnCmd.systemSettings.lastPanelID + 1
			this.btnCmd.systemSettings.lastPanelID = tmpPanelID;
			var newPanel_object = this.getRefData().panels[0];
			newPanel_object.panelID = tmpPanelID;
			newPanel_object.tabID = tmpTab.tabID;
			this.btnCmd.panels.push(newPanel_object);
			this.panelObjectToPass = this.btnCmd.panels.filter(itemPanel => itemPanel.panelID == tmpPanelID);
			this.showPanelEdit = true;
		},
		panelEdit(panelID){
			this.panelObjectToPass = this.btnCmd.panels.filter(itemPanel => itemPanel.panelID == panelID);
			this.showPanelEdit = true;
		},
		onAddBtnClick(tmpTab){					
			this.setActionResponse('');
			var tmpBtnID = this.btnCmd.systemSettings.lastID + 1
			this.btnCmd.systemSettings.lastID = tmpBtnID;
			var newBtn_object = this.getRefData().btns[0];
			newBtn_object.btnID = tmpBtnID;
			newBtn_object.btnLabel = 'New';
			newBtn_object.btnColour = '#0077FFFF';
			newBtn_object.btnActionData = '';
			newBtn_object.btnGroupIdx = tmpTab.tabID;
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
		panelDelete(idx){
			this.setActionResponse('');
			var requiredIndex = this.btnCmd.panels.findIndex(el => el.panelID == idx);
			if(requiredIndex === -1){
				return false;
			}
			this.btnCmd.panels.splice(requiredIndex, 1);
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
		onChangeTab(tmpTabID, tmpTabIndex){
			this.currTab = tmpTabID;
			this.currTabIdx = tmpTabIndex;
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
		async onBtnClick(btnJSONOb){
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
							tmpParent.setActionResponse("Event Action : -- Success Result : " + JSON.stringify(response));
						})
						.catch(function (error) {
							console.log("Event Action : -- Returned Result : " + JSON.stringify(error));
						});
				}
				if(btnJSONOb.btnHttpType == "GET") {
						axiosHtpp.get(btnJSONOb.btnActionData, { headers: {'Content-Type': `application/${btnJSONOb.btnHttpContType}`}})
						.then(function (response) {
							// handle success
							tmpParent.setActionResponse("Event Action : -- Success Result : " + JSON.stringify(response));
						})
						.catch(function (error) {
							// handle error
							console.log("Event Action : -- Returned Result : " + JSON.stringify(error));
						});
				}
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
									console.log.setActionResponse("Event Action : -- Success Result : " + JSON.stringify(response));
								})
								.catch(function (error) {
									console.log("Event Action : -- Returned Result : " + JSON.stringify(error));
								});
						}
						if(this.btnCmd.monitoredEvents[bi].eventHttpType == "GET") {
							axiosHtpp.get(tmpURL, { headers: {'Content-Type': `application/${tmpParent.btnCmd.monitoredEvents[bi].eventHttpContType}`}})
								.then(function (response) {
									// handle success
									console.log.setActionResponse("Event Action : -- Success Result : " + JSON.stringify(response));
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
	},
	//automated functions
	mounted() {
		this.directory = this.macrosDirectory;
		this.initSettings();
		this.checkDataVersion();
		this.setupPage();
		this.isSimulating = (this.status === StatusType.simulating);
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
