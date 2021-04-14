<style>
	.tab-item-wrapper {
		width: 100%;
	}
	.div-main-wrapper {
		width: 100%;
		/* overflow-y: auto; */
	}
	.edit-mode-buttons {
		position: absolute; 
		bottom: -3px; 
		right: 10px;
	}
	.tabs-default {
		height: 100%;
		width: 100%;
	}
	.tabs-card {
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
    <div :height="tabCardHeight" class="div-main-wrapper pa-0 ma-0" :key="'maindiv' + tabCardHeight + window.width">
		<v-row class="pa-0 ma-0">
			<v-col cols="12" class="pa-0 ma-0">
				<!-- <v-row mt-0><v-col><span class="text-caption">{{ tabCardHeight }}</span></v-col></v-row> -->
				<!-- <v-row mt-0><v-col><span class="text-caption">{{ window.width }} - {{ window.height }}</span></v-col></v-row> -->
				<v-row>
					<v-tabs class="elevation-2 pa-0 ma-0 tabs-default" >
						<v-tabs-slider></v-tabs-slider>
						<v-tab v-for="(tab, index2) in btnCmd.tabs" :key="'tab'+tab.tabID" :href="`#general-tab-${index2}`" @click="onChangeTab(tab.tabID, index2)" >
							<v-icon v-if="tab.icon" class="mr-1">{{ tab.icon }}</v-icon> {{ tab.caption }}
						</v-tab>
						<v-tab-item v-for="(tab, index) in btnCmd.tabs" :key="'tabitem'+index" :value="`general-tab-${index}`">
							<v-card class="tab-item-wrapper" :height="tabCardHeight" :key="'maincard' + tabCardHeight + window.width">
								<v-container fluid class="pa-0 ma-0 tabs-default">
									<v-row class="pa-0 ma-0 tabs-default">
										<v-col cols="12">
											<!--this div is here to constrain draggle items within the window-->
											<div class="tabs-card" v-if="tab.lastZIndex">
												<vue-draggable-resizable v-for="(btn) in getTabBtns(tab.tabID)" :key="'btn' + btn.btnID + btn.autoSize" :z="btn.btnZIndex" :grid="tab.tabGridSize" @activated="onDragClick(btn)" :parent="true" :w="btn.btnWsize" :h="btn.btnHsize" class="ma-0 pa-0" :x="btn.btnXpos" :y="btn.btnYpos" :resizable="!btn.autoSize" :draggable="editMode" :drag-handle="'.drag-handle'" @dragstop="lastBtnMovePosition" @resizestop="onBtnResizestop">
													<v-card style="height: 98%; width: 98%" class="ma-0 pa-0" :key="'btnCard' + btn.btnID + btn.autoSize">
														<v-row align="center" justify="center" class="tabs-card ma-0 pa-0">
															<div v-if="btn.btnGroupIdx==tab.tabID && !editMode && !btn.autoSize" class="ma-0 pa-0" style="height: 100%; width: 100%" align="center" justify="center">
																<v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
																	<template v-slot:activator="{ on, attrs }">
																		<v-btn v-if="!btn.autoSize" block style="height: 100%; width: 100%" v-bind="attrs" v-on="on" :color="btn.btnColour" :elevation="1" :disabled="chkJobEnabled(btn)" @click="onBtnClick(btn)">
																			<span v-if="btn.btnIcon"><v-icon class="mr-1">{{ btn.btnIcon }}</v-icon>{{ btn.btnLabel }}</span>
																			<span v-if="!btn.btnIcon">{{ btn.btnLabel }}</span>
																		</v-btn>
																	</template>
																	<span >{{ btn.btnHoverText }}</span>
																</v-tooltip>
															</div>
															<div v-if="btn.btnGroupIdx==tab.tabID && !editMode && btn.autoSize">
																<v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
																	<template v-slot:activator="{ on, attrs }">
																		<v-btn v-if="btn.autoSize" v-bind="attrs" v-on="on" :color="btn.btnColour" :elevation="1" :disabled="chkJobEnabled(btn)" @click="onBtnClick(btn)">
																			<span v-if="btn.btnIcon"><v-icon class="mr-1">{{ btn.btnIcon }}</v-icon>{{ btn.btnLabel }}</span>
																			<span v-if="!btn.btnIcon">{{ btn.btnLabel }}</span>
																		</v-btn>
																	</template>
																	<span >{{ btn.btnHoverText }}</span>
																</v-tooltip>
															</div>
															<div v-if="btn.btnGroupIdx==tab.tabID && editMode && !btn.autoSize" class="drag-handle ma-0 pa-0" style="height: 100%; width: 100%" align="center" justify="center">
																<v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
																	<template v-slot:activator="{ on, attrs }">
																		<v-btn block v-bind="attrs" style="height: 100%; width: 100%" v-on="on" :color="btn.btnColour" :elevation="1"  @contextmenu="doMenu($event, btn)">
																			<v-icon>mdi-cog</v-icon>{{ btn.btnLabel }}
																		</v-btn>
																	</template>
																	<span>Click to enable resize - Click & Hold to drag - Right Click Edit Menu</span>
																</v-tooltip>
															</div>
															<div v-if="btn.btnGroupIdx==tab.tabID && editMode && btn.autoSize" class="drag-handle">
																<v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
																	<template v-slot:activator="{ on, attrs }">
																		<v-btn v-bind="attrs" v-on="on" :color="btn.btnColour" :elevation="1" @contextmenu="doMenu($event, btn)">
																			<v-icon>mdi-cog</v-icon>{{ btn.btnLabel }}
																		</v-btn>
																	</template>
																	<span>Click & Hold to drag - Right Click Edit Menu</span>
																</v-tooltip>
															</div>
														</v-row>
													</v-card>
												</vue-draggable-resizable>
												<vue-draggable-resizable v-for="(panel) in getTabPanels(tab.tabID)"  :grid="tab.tabGridSize" :z="panel.panelZIndex" :key="'dwcpan'+panel.panelID" @activated="onPanelDragClick(panel)" :parent="true" class="ma-0 pa-0" :w="panel.panelWSize" :h="panel.panelHSize" :x="panel.panelXpos" :y="panel.panelYpos" :resizable="true" :draggable="editMode" :drag-handle="'.drag-handle'" @dragstop="lastPanelMovePosition" @resizestop="onPanelResizestop" >
													<v-card align="center" justify="center" class="tabs-card ma-0 pa-0">
														<v-row dense  align="center" justify="center" class="tabs-card ma-0 pa-0">
															<td class="tabs-card">
																<job-info-panel v-if="panel.panelType == 'jobinfo'" lign="center" class="tabs-card pa-0 ma-0"></job-info-panel>
																<layer-chart v-if="panel.panelType == 'layerchart'" min-height="180px" align="center" class="tabs-card d-flex pa-0 ma-0"></layer-chart>
																<job-estimations-panel v-if="panel.panelType == 'jobestimates'" align="center" class="tabs-card pa-0 ma-0"></job-estimations-panel>
																<job-data-panel v-if="panel.panelType == 'collectdata'" align="center" class="tabs-card pa-0 ma-0"></job-data-panel>
																<fans-panel v-if="panel.panelType == 'fans'" align="center" class="tabs-card pa-0 ma-0"></fans-panel>
																<speed-factor-panel v-if="panel.panelType == 'speed'" align="center" class="tabs-card pa-0 ma-0"></speed-factor-panel>
																<v-overlay :absolute="true" :opacity="0.5" :value="editMode">
																	<tbody>
																		<tr align="center" justify="center">
																			<v-spacer></v-spacer>
																			<td>
																				<div class="pa-md-1">
																					<v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
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
																					<v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
																						<template v-slot:activator="{ on, attrs }">
																							<v-btn x-small style="cursor: move" fab color="info" v-bind="attrs" v-on="on" :elevation="1" @click="onPanelDragClick(panel)">
																								<v-icon>mdi-drag-variant</v-icon>
																							</v-btn>
																						</template>
																						<span>Click to enable resize - Click & Hold to drag</span>
																					</v-tooltip>
																				</div>
																			</td>
																			<td>
																				<div class="pa-md-1">
																					<v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
																						<template v-slot:activator="{ on, attrs }">
																							<v-btn x-small fab color="info" v-bind="attrs" v-on="on" :elevation="1" @click="bringPanelToFront(panel)">
																								<v-icon>mdi-arrange-bring-to-front</v-icon>
																							</v-btn>
																						</template>
																						<span>Bring the Panel to the top layer</span>
																					</v-tooltip>
																				</div>
																			</td>
																			<v-spacer></v-spacer>
																		</tr>
																	</tbody>
																</v-overlay>
															</td>
														</v-row>
													</v-card>
												</vue-draggable-resizable>
												<vue-draggable-resizable v-for="(panel) in getTabCamPanels(tab.tabID)" :grid="tab.tabGridSize" :z="panel.panelZIndex" :key="'campan'+panel.panelID" @activated="onPanelDragClick(panel)" :parent="true" class="ma-0 pa-0" :w="panel.panelWSize" :h="panel.panelHSize" :x="panel.panelXpos" :y="panel.panelYpos" :resizable="true" :draggable="editMode" :drag-handle="'.drag-handle'" @dragstop="lastPanelMovePosition" @resizestop="onPanelResizestop">
													<v-card align="center" justify="center" class="tabs-card ma-0 pa-0">
														<v-row dense align="center" justify="center" class="tabs-card ma-0 pa-0">
															<td class="tabs-card">
																<altWebCamPanel v-if="panel.panelType == 'altwebcam'" align="center" justify="center" :passedObject="panel.altWebCamParams" class="tabs-card pa-0 ma-0"></altWebCamPanel>
																<webcam-panel v-if="panel.panelType == 'webcam'" align="center" justify="center" class="tabs-card pa-0 ma-0"></webcam-panel>
																<v-overlay :absolute="true" :opacity="0.5" :value="editMode">
																	<tbody>
																		<tr align="center" justify="center">
																			<v-spacer></v-spacer>
																			<td v-if="panel.panelType == 'altwebcam'">
																				<div class="pa-md-1">
																					<v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
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
																					<v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
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
																					<v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
																						<template v-slot:activator="{ on, attrs }">
																							<v-btn x-small style="cursor: move" fab color="info" v-bind="attrs" v-on="on" :elevation="1" @click="onPanelDragClick(panel)">
																								<v-icon>mdi-drag-variant</v-icon>
																							</v-btn>
																						</template>
																						<span>Click to enable resize - Click & Hold to drag</span>
																					</v-tooltip>
																				</div>
																			</td>
																			<td>
																				<div class="pa-md-1">
																					<v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
																						<template v-slot:activator="{ on, attrs }">
																							<v-btn x-small fab color="info" v-bind="attrs" v-on="on" :elevation="1" @click="bringPanelToFront(panel)">
																								<v-icon>mdi-arrange-bring-to-front</v-icon>
																							</v-btn>
																						</template>
																						<span>Bring the Panel to the top layer</span>
																					</v-tooltip>
																				</div>
																			</td>
																			<v-spacer></v-spacer>
																		</tr>
																	</tbody>
																</v-overlay>
															</td>
														</v-row>
													</v-card>
												</vue-draggable-resizable>
											</div>
										</v-col>
									</v-row>
								</v-container>
							</v-card>
						</v-tab-item>
					</v-tabs>
					<v-menu v-if="currTabObj" v-model="showMenu" :position-x="menuX" :position-y="menuY" absolute offset-y :style="`z-index:${currTabObj.lastZIndex+1}`">
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
														<v-btn x-small fab color="info" v-bind="attrs" v-on="on" :elevation="1" @click="bringBtnToFront(currButtonObj)">
															<v-icon>mdi-arrange-bring-to-front</v-icon>
														</v-btn>
													</template>
													<span>Bring the Button to the top layer</span>
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
				</v-row>
				<BtnCmdSettingsDialogue v-if="showEdit" v-model="showEdit" :passedObject="objectToPass" :bMQTT="btnCmd.globalSettings.enableMQTT" :enableSelects="btnCmd.globalSettings.enableSelects"></BtnCmdSettingsDialogue>
				<BtnCmdTabSettingsDialogue v-if="showTabEdit" v-model="showTabEdit" :passedObject="tabObjectToPass[0]" :enableSelects="btnCmd.globalSettings.enableSelects"></BtnCmdTabSettingsDialogue>
				<BtnCmdPanelSettingsDialogue v-if="showPanelEdit" v-model="showPanelEdit" :passedObject="panelObjectToPass[0]" :enableSelects="btnCmd.globalSettings.enableSelects"></BtnCmdPanelSettingsDialogue>
				<BtnCmdGlobalSettingsDialogue @exit="saveSettings()" v-if="showGSEdit" v-model="showGSEdit" :mobileActive="mobileActive" :passedObject="btnCmd.globalSettings"></BtnCmdGlobalSettingsDialogue>
				<BtnCmdEventSettingsDialogue @exit="saveSettings()" v-if="showESEdit" v-model="showESEdit" :bMQTT="btnCmd.globalSettings.enableMQTT" :passedObject="btnCmd" :enableSelects="btnCmd.globalSettings.enableSelects"></BtnCmdEventSettingsDialogue>
				<confirm-dialog :shown.sync="confirmRstSettings" title="Reset Settings" prompt="Are you sure?" @confirmed="resetSettings()"></confirm-dialog>	
			</v-col>
		</v-row>
		<!-- Normal Footer -->
		<v-footer v-if="!editMode" height="37" absolute width="100%" class="pa-0 ma-0" :style="`z-index:${currTabObj.lastZIndex+1}; bottom: 12px;`">
			<v-row class="pa-0 ma-0">
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
				<div class="mx-2" v-if="btnCmd.globalSettings.enableEvents && !mobileActive">
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
							<v-btn small v-bind="attrs" v-on="on" :disabled="isPrinting" color="primary" @click="btnRestoreSettings()">
								<v-icon>mdi-backup-restore</v-icon>
							</v-btn>
						</template>
						<span>Restore Config from backup. Warning! This will overwrite current settings.</span>
					</v-tooltip>
				</div>
				<div class="mx-2" v-if="backupMode">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" :disabled="isPrinting" color="primary" @click="btnBackupSettings()">
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
					<span v-if="btnCmd.globalSettings.enableActionMsg && !mobileActive" class="text-caption mx-4">{{ actionResponse }}</span>
				</div>
				<v-spacer></v-spacer>
				<div class="mx-2" v-if="!backupMode">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small :color="saveBtnCol" v-bind="attrs" v-on="on" :elevation="1" @click="editModeToggle()">
								<v-icon class="mr-1">mdi-square-edit-outline</v-icon>
							</v-btn>
						</template>
						<span>Edit Mode</span>
					</v-tooltip>
				</div>
			</v-row>
		</v-footer>
		<!-- Edit Mode Footer Mobile -->
		<v-footer v-if="editMode && mobileActive" height="37" absolute width="100%" :style="`z-index:${currTabObj.lastZIndex+1}; bottom: 12px;`" class="pa-0 ma-0">
			<v-row class="pa-0 ma-0">
				<v-spacer></v-spacer>
				<div class="mx-1">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn x-small fab v-bind="attrs" v-on="on" @click="onTabEditBtnClick(currTabObj.tabID)">
								<v-icon>mdi-tab</v-icon>
							</v-btn>
						</template>
						<span>Edit this tab's properties</span>
					</v-tooltip>
				</div>
				<div class="mx-1">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn x-small fab v-bind="attrs" v-on="on" @click="onCloneTabBtnClick(currTabObj.tabID)">
								<v-icon >mdi-table-multiple</v-icon>
							</v-btn>
						</template>
						<span>Clone Current Tab</span>
					</v-tooltip>
				</div>
				<div class="mx-1">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn  x-small fab v-bind="attrs" v-on="on" @click="onTabAddBtnClick()">
								<v-icon >mdi-tab-plus</v-icon>
							</v-btn>
						</template>
						<span>Add new tab</span>
					</v-tooltip>
				</div>
				<div class="mx-1">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn  x-small fab :disabled="hasBtns()" v-bind="attrs" v-on="on" @click="onTabDelBtnClick(currTabIdx)">
								<v-icon>mdi-tab-remove</v-icon>
							</v-btn>
						</template>
						<span>Delete current Tab</span>
					</v-tooltip>
				</div>
				<div class="mx-1">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn  x-small fab v-bind="attrs" v-on="on" @click="onAddPanelClick(currTabObj)">
								<v-icon>mdi-credit-card-plus</v-icon>
							</v-btn>
						</template>
						<span>Add new panel to the tab</span>
					</v-tooltip>
				</div>
				<div class="mx-1">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn  x-small fab v-bind="attrs" v-on="on" @click="onAddBtnClick(currTabObj)">
								<v-icon>mdi-card-plus</v-icon>
							</v-btn>
						</template>
						<span>Add new Button</span>
					</v-tooltip>
				</div>
				<div class="mx-1">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn  x-small fab v-bind="attrs" v-on="on" :disabled="backupMode" @click="editModeToggle()">
								<v-icon color="green">mdi-content-save-all</v-icon>
							</v-btn>
						</template>
						<span>Save Changes & Close</span>
					</v-tooltip>
				</div>
				<div class="mx-1">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn  x-small fab v-bind="attrs" v-on="on" @click="undoEditChanges()">
								<v-icon color="red">mdi-progress-close</v-icon>
							</v-btn>
						</template>
						<span>Close & Undo All Changes Since Last Save</span>
					</v-tooltip>
				</div>
				<v-spacer></v-spacer>
			</v-row>
		</v-footer>	
		<!-- Edit Mode Footer -->
		<v-footer v-if="editMode && !mobileActive" height="37" absolute width="100%" :style="`z-index:${currTabObj.lastZIndex+1}; bottom: 12px;`" class="pa-0 ma-0">
			<v-row class="pa-0 ma-0">
				<v-spacer></v-spacer>
				<div class="mx-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" @click="onTabEditBtnClick(currTabObj.tabID)">
								<v-icon>mdi-tab</v-icon>
							</v-btn>
						</template>
						<span>Edit this tab's properties</span>
					</v-tooltip>
				</div>
				<div class="mx-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" @click="onCloneTabBtnClick(currTabObj.tabID)">
								<v-icon >mdi-table-multiple</v-icon>
							</v-btn>
						</template>
						<span>Clone Current Tab</span>
					</v-tooltip>
				</div>
				<div class="mx-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" @click="onTabAddBtnClick()">
								<v-icon >mdi-tab-plus</v-icon>
							</v-btn>
						</template>
						<span>Add new tab</span>
					</v-tooltip>
				</div>
				<div class="mx-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small :disabled="hasBtns()" v-bind="attrs" v-on="on" @click="onTabDelBtnClick(currTabIdx)">
								<v-icon>mdi-tab-remove</v-icon>
							</v-btn>
						</template>
						<span>Delete current Tab</span>
					</v-tooltip>
				</div>
				<div class="mx-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" @click="onAddPanelClick(currTabObj)">
								<v-icon>mdi-credit-card-plus</v-icon>
							</v-btn>
						</template>
						<span>Add new panel to the tab</span>
					</v-tooltip>
				</div>
				<div class="mx-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" @click="onAddBtnClick(currTabObj)">
								<v-icon>mdi-card-plus</v-icon>
							</v-btn>
						</template>
						<span>Add new Button</span>
					</v-tooltip>
				</div>
				<div class="mx-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" :disabled="backupMode" @click="editModeToggle()">
								<v-icon color="green">mdi-content-save-all</v-icon>
							</v-btn>
						</template>
						<span>Save Changes & Close</span>
					</v-tooltip>
				</div>
				<div class="mx-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" @click="undoEditChanges()">
								<v-icon color="red">mdi-progress-close</v-icon>
							</v-btn>
						</template>
						<span>Close & Undo All Changes Since Last Save</span>
					</v-tooltip>
				</div>
				<v-spacer></v-spacer>
			</v-row>
		</v-footer>	
		<v-dialog v-model="showFileDialog" persistent max-width="700px">
			<v-card>
				<v-card-title class="container">
					<v-toolbar dark dense>
						<v-toolbar-title>File Details</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" v-if="fileAction=='save'" text @click="validateFileName()">Backup</v-btn>
						<v-btn color="blue darken-1" v-if="fileAction=='load'" text @click="validateFileName()">Restore</v-btn>
					</v-toolbar>
					<v-alert style="position: absolute; z-index:99999;" :value="alertReqVal" type="error" transition="scale-transition">A File Name not been entered!</v-alert>
					<v-alert style="position: absolute; z-index:99999;" :value="alertFileChanged" type="error" transition="scale-transition">The Filename contained invalid characters & spaces.<br>These have been removed. Please re-confirm.</v-alert>
				</v-card-title>
				<v-card-text>
					<v-row dense class="mx-2 my-n4">
						<v-col cols="12">
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<v-text-field v-bind="attrs" v-on="on" class="custom-label-color" label="File Name*" v-model="btnCmd.globalSettings.lastBackupFileName" placeholder="BtnCmdSettings"></v-text-field>
								</template>
								<span>File name (do not include the file name extension - this will be automatically added for you)</span>
							</v-tooltip>
						</v-col>
					</v-row>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
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
		tabCardHeight () {
			//First set the height modifers
			var tmpUsrHeightMod = 0;
			var tmpHeight = 0;
			var currHeight = parseInt(this.window.height);
			var tmpPlgH = parseInt(this.btnCmd.globalSettings.pluginMinimumHeight)

			if(tmpPlgH < 0){
				//Negative Modifier
				tmpUsrHeightMod = -Math.abs(Math.floor((currHeight / 100)*tmpPlgH));
			}else if(tmpPlgH > 0){
				//Positve Modifier
				tmpUsrHeightMod = Math.floor((currHeight/ 100)*tmpPlgH);
			}	

			if(parseInt(this.window.width) <= 720){
				//Mobile Height modifiers
				tmpHeight = tmpUsrHeightMod + 601;
				if(tmpHeight > (currHeight - 110)) {
					tmpHeight = currHeight - 110;
				}
			}else {
				//Normal Heigh modifiers
				tmpHeight = (tmpUsrHeightMod + currHeight -420);
				if(tmpHeight > (currHeight - 110)) {
					tmpHeight = currHeight - 110;
				}
			}
			return tmpHeight;
		},
		mobileActive() {
			if(!this.$vuetify.breakpoint.mdAndUp){
				return true;
			}else {
				return false;
			}
		},
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
			showFileDialog: false,
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
			btnCmdVersion: '0.8.12',
			code: '',
			doingCode: false,
			isSimulating: false,
			newData: null,
			currButtonObj: {},
			currTabObj: {},
			currPanelObj: {},
			editDragging: false,
			showMenu: false,
			menuX: 0,
			menuY: 0,
			window: {
				width: 0,
				height: 0
			},
			tmpDebgug: null,
			fileAction: 'load',
			alertReqVal: false,
			alertFileChanged: false,
			btnCmd : {
				btnCmdVersion: '0.8.12',
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
					enableSelects: true,
					lastBackupFileName: 'BtnCmdSettings',
					pluginMinimumHeight: 0
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
						btnZIndex: 1
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
						lastZIndex: 2,
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
	created() {
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
		...mapActions('machine', ['sendCode']),
		...mapActions('machine', {machineDownload: 'download'}),
        ...mapActions('machine', ['upload']),
		...mapMutations('machine/settings', ['addCode', 'removeCode']),
		setupPage(){
			this.onChangeTab(this.btnCmd.tabs[0].tabID, 0);
		},
		handleResize() {
            this.window.width = window.innerWidth;
            this.window.height = window.innerHeight;
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
					enableSelects: true,
					lastBackupFileName: 'BtnCmdSettings',
					pluginMinimumHeight: 0
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
						btnZIndex: 1
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
			this.onChangeTab(this.btnCmd.tabs[0].tabID, 0);
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
		//PopUpMenu Functions
		doMenu (e, btnObj) {
			e.preventDefault();
			this.onDragClick(btnObj);
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
			var tmpX = x;
			var tmpY = y;
			if(tmpX < 0 ){
				tmpX = 0;
			}
			if(tmpY < 0 ){
				tmpY = 0;
			}
			this.saveBtnPosition(tmpX, tmpY);
		},
		onDragClick(btnObj){
			this.editDragging = true;
			// btnObj.btnZIndex = this.currTabObj.lastZIndex + 1;
			// this.currTabObj.lastZIndex = this.currTabObj.lastZIndex + 1;
			this.currButtonObj = btnObj;
			return true;
		},
		saveBtnPosition(xPos, yPos){
			this.currButtonObj.btnXpos = xPos; //this.checkGridCompat(xPos);
			this.currButtonObj.btnYpos = yPos; //this.checkGridCompat(yPos);
		},
		onBtnResizestop: function (x, y, width, height){
			this.resizing = false;
			this.currButtonObj.btnXpos = x; //this.checkGridCompat(x);
			this.currButtonObj.btnYpos = y; //this.checkGridCompat(y);
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
				return Math.floor(gridVal);
			}
		},
		lastPanelMovePosition: function (x, y) {
			this.editDragging = false;
			this.dragging = false;
			var tmpX = x;
			var tmpY = y;
			if(tmpX < 0 ){
				tmpX = 0;
			}
			if(tmpY < 0 ){
				tmpY = 0;
			}
			this.savePanelPosition(tmpX, tmpY);
		},
		onPanelDragClick(panelObj){
			this.editDragging = true;
			// panelObj.panelZIndex = this.currTabObj.lastZIndex + 1;
			// this.currTabObj.lastZIndex = this.currTabObj.lastZIndex + 1;
			this.currPanelObj = panelObj;
			return true;
		},
		savePanelPosition(xPos, yPos){
			this.currPanelObj.panelXpos = xPos; //this.checkGridCompat(xPos);
			this.currPanelObj.panelYpos = yPos; //this.checkGridCompat(yPos);
		},
		onPanelResizestop: function (x, y, width, height){
			this.resizing = false;
			this.currPanelObj.panelXpos = x; //this.checkGridCompat(x);
			this.currPanelObj.panelYpos = y; //this.checkGridCompat(y);
			this.currPanelObj.panelWSize = this.checkGridCompat(width);
			this.currPanelObj.panelHSize = this.checkGridCompat(height);
		},
		bringBtnToFront(tmpBtnObj){
			this.currTabObj.lastZIndex = this.currTabObj.lastZIndex + 1;
			tmpBtnObj.btnZIndex = this.currTabObj.lastZIndex;
		},
		bringPanelToFront(tmpPanelObj){
			this.currTabObj.lastZIndex = this.currTabObj.lastZIndex + 1;
			tmpPanelObj.panelZIndex = this.currTabObj.lastZIndex;
		},
		//plugin UI functions
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
			newTab_object.lastZIndex = 1;
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
			this.currTabObj.lastZIndex = this.currTabObj.lastZIndex + 1;
			newPanel_object.panelID = tmpPanelID;
			newPanel_object.tabID = tmpTab.tabID;
			newPanel_object.panelZIndex = this.currTabObj.lastZIndex;
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
			this.currTabObj.lastZIndex = this.currTabObj.lastZIndex + 1;
			newBtn_object.btnID = tmpBtnID;
			newBtn_object.btnLabel = 'New';
			newBtn_object.btnColour = '#0077FFFF';
			newBtn_object.btnActionData = '';
			newBtn_object.btnGroupIdx = tmpTab.tabID;
			newBtn_object.btnHoverText = '';
			newBtn_object.btnZIndex = this.currTabObj.lastZIndex;
			this.btnCmd.btns.push(newBtn_object);
			this.flashBtn(tmpBtnID);
			
		},
		async flashBtn(btnID){
			var tmpNewBtn = this.btnCmd.btns.filter(item => item.btnID == btnID);
			var i = 0;
			for (i = 0; i < 5; i++) {
				tmpNewBtn[0].btnColour = 'red';
				await this.sleep(150);
				tmpNewBtn[0].btnColour = 'green';
				await this.sleep(150);
			}
			tmpNewBtn[0].btnColour = '#0077FFFF';
		},
		btnClone(srcBtn){
			this.setActionResponse('');
			const merge = deepmerge;
			var tmpBtnID = this.btnCmd.systemSettings.lastID + 1
			this.btnCmd.systemSettings.lastID = tmpBtnID;
			var newBtn_object = merge(this.getRefData().btns[0], srcBtn)
			this.currTabObj.lastZIndex = this.currTabObj.lastZIndex + 1;
			newBtn_object.btnID = tmpBtnID;
			newBtn_object.btnXpos = srcBtn.btnXpos + 20;
			newBtn_object.btnYpos = srcBtn.btnYpos + 20;
			newBtn_object.btnZIndex = this.currTabObj.lastZIndex;
			this.btnCmd.btns.push(newBtn_object);
			//this.flashBtn(tmpBtnID);
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
			var tmpTabObj = this.btnCmd.tabs.filter(item => item.tabID == tmpTabID);
			this.currTabObj = tmpTabObj[0];
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
					if(this.btnCmd.globalSettings.enableEvents && !this.isSimulating && !this.mobileActive){
						//console.log("Conditions Met lauching checkEvents");
						this.checkEvents('status', val);
					}
				}	
	}
}
</script>
