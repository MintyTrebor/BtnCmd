<style>
	.tab-item-wrapper {
		width: 100%;
	}
	.div-main-wrapper {
		width: 100%;
		/* overflow-y: auto; */
	}
	.tabs-default {
		height: 100%;
		width: 100%;
	}
	.tabs-card {
		height: 100%;
		width: 100%;
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
	.drag-handle:hover {cursor: move !important}
	.drag-button,
	.drag-button:hover {cursor: move !important}
</style>
<template>
    <div :height="tabCardHeight" class="div-main-wrapper pa-0 ma-0">
		<v-row class="pa-0 ma-0">
			<v-col cols="12" class="pa-0 ma-0">
				<!--<v-row mt-0>
					<v-col><span class="text-caption">tab data= {{ directory }}</span></v-col>
					<v-col><span class="text-caption">curr tab = {{ tmpDebgug }}</span></v-col>
				</v-row>-->
				<!-- <v-row mt-0><v-col><span class="text-caption">v-model = {{ tmpDebgug }}</span></v-col></v-row> -->
				<v-row>
					<v-tabs class="elevation-2 pa-0 ma-0 tabs-default" v-model="getCurrTabIndex">
						<v-tabs-slider :style="'color:' + getMainBackgroundColor"></v-tabs-slider>
						<v-tab v-for="(tab) in getTabs" :key="tab.tabID" @click="onChangeTab(tab.tabID)" :href="`#tab-${tab.tabID}`">
							<v-icon v-if="tab.icon" class="mr-1" :style="'color:' + getMainBackgroundColor">{{ tab.icon }}</v-icon><span :style="'color:' + getMainBackgroundColor">{{ tab.caption }}</span>
						</v-tab>
						<v-tabs-items v-model="getCurrTabIndex">
							<v-tab-item v-for="(tab) in getTabs" :key="tab.tabID" :value="`tab-${tab.tabID}`">
								<v-card class="tab-item-wrapper" :height="tabCardHeight" :key="'maincard' + tabCardHeight + window.width">
									<v-container fluid class="pa-0 ma-0 tabs-default">
										<v-row class="pa-0 ma-0 tabs-default">
											<v-col cols="12">
												<!--this div is here to constrain draggle items within the window-->
												<div class="tabs-card" v-if="tab.lastZIndex">
													<vue-draggable-resizable v-for="(panel) in getTabPanels(tab.tabID)"  :grid="tab.tabGridSize" :z="getZidx(panel.panelZIndex)" :key="'dwcpan'+panel.panelID" @activated="onPanelDragClick(panel)" :parent="true" class="ma-0 pa-0" :w="panel.panelWSize" :h="panel.panelHSize" :x="panel.panelXpos" :y="panel.panelYpos" :resizable="true" :draggable="editMode" :drag-handle="'.drag-handle'" @dragstop="lastPanelMovePosition" @resizestop="onPanelResizestop" >
														<v-card align="center" justify="center" class="tabs-card ma-0 pa-0">
															<v-row dense  align="center" justify="center" class="tabs-card ma-0 pa-0">
																<td class="tabs-card">
																	<job-info-panel v-if="panel.panelType == 'jobinfo'" align="center" class="tabs-card pa-0 ma-0"></job-info-panel>
																	<layer-chart v-if="panel.panelType == 'layerchart'" min-height="180px" align="center" class="tabs-card d-flex pa-0 ma-0"></layer-chart>
																	<temperature-chart v-if="panel.panelType == 'temperature-chart'" min-height="180px" align="center" class="tabs-card d-flex pa-0 ma-0"></temperature-chart>
																	<job-estimations-panel v-if="panel.panelType == 'jobestimates'" align="center" class="tabs-card pa-0 ma-0"></job-estimations-panel>
																	<job-data-panel v-if="panel.panelType == 'collectdata'" align="center" class="tabs-card pa-0 ma-0"></job-data-panel>
																	<job-control-panel v-if="panel.panelType == 'job-control-panel'" align="center" class="tabs-card pa-0 ma-0"></job-control-panel>
																	<fans-panel v-if="panel.panelType == 'fans'" align="center" class="tabs-card pa-0 ma-0"></fans-panel>
																	<extrude-panel v-if="panel.panelType == 'extrude-panel'" align="center" class="tabs-card pa-0 ma-0"></extrude-panel>
																	<extrusion-factors-panel v-if="panel.panelType == 'extrusion-factors-panel'" align="center" class="tabs-card pa-0 ma-0"></extrusion-factors-panel>
																	<z-babystep-panel v-if="panel.panelType == 'z-babystep-panel'" align="center" class="tabs-card pa-0 ma-0"></z-babystep-panel>
																	<status-panel v-if="panel.panelType == 'status-panel'" align="center" class="tabs-card pa-0 ma-0"></status-panel>
																	<tools-panel v-if="panel.panelType == 'tools-panel'" align="center" class="tabs-card pa-0 ma-0"></tools-panel>
																	<movement-panel v-if="panel.panelType == 'movement-panel'" align="center" class="tabs-card pa-0 ma-0"></movement-panel>
																	<speed-factor-panel v-if="panel.panelType == 'speed'" align="center" class="tabs-card pa-0 ma-0"></speed-factor-panel>
																	<BtnCmdCustomPanel v-if="panel.panelType == 'custom'" align="center" class="tabs-card pa-0 ma-0" :mainData="btnCmd" :passedObject="panel" @updateActionResponse="updateAR"></BtnCmdCustomPanel>
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
													<vue-draggable-resizable v-for="(panel) in getTabCamPanels(tab.tabID)" :grid="tab.tabGridSize" :z="getZidx(panel.panelZIndex)" :key="'campan'+panel.panelID" @activated="onPanelDragClick(panel)" :parent="true" class="ma-0 pa-0" :w="panel.panelWSize" :h="panel.panelHSize" :x="panel.panelXpos" :y="panel.panelYpos" :resizable="true" :draggable="editMode" :drag-handle="'.drag-handle'" @dragstop="lastPanelMovePosition" @resizestop="onPanelResizestop">
														<v-card align="center" justify="center" class="tabs-card ma-0 pa-0">
															<v-row dense align="center" justify="center" class="tabs-card ma-0 pa-0">
																<td class="tabs-card">
																	<altWebCamPanel :key="'awp'+panel.panelID" v-if="panel.panelType == 'altwebcam'" align="center" justify="center" :passedObject="panel.altWebCamParams" class="tabs-card pa-0 ma-0"></altWebCamPanel>
																	<BtnCmdWebPanel :key="'wbp'+panel.panelID" v-if="panel.panelType == 'remSrc'" align="center" justify="center" :passedObject="panel.altWebCamParams" class="tabs-card pa-0 ma-0"></BtnCmdWebPanel>
																	<BtnCmdMMPanel v-if="panel.panelType == 'mmValue'" :key="'mmV' + panel.panelMMPrefix + panel.panelID + panel.panelMMPath" align="center" justify="center" :passedObject="panel" class="tabs-card pa-0 ma-0"></BtnCmdMMPanel>
																	<webcam-panel :key="'wcp'+panel.panelID" v-if="panel.panelType == 'webcam'" align="center" justify="center" class="tabs-card pa-0 ma-0"></webcam-panel>
																	<v-overlay :absolute="true" :opacity="0.5" :value="editMode">
																		<tbody>
																			<tr align="center" justify="center">
																				<v-spacer></v-spacer>
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
																					<div>
																						<v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
																							<template v-slot:activator="{ on, attrs }">
																								<v-btn x-small style="cursor: pointer" fab color="info" v-bind="attrs" v-on="on" :elevation="1" @click="doPanelMenu($event, panel)">
																									<v-icon>mdi-menu</v-icon>
																								</v-btn>
																							</template>
																							<span>Click To Open Edit Menu</span>
																						</v-tooltip>
																					</div>
																				</td>
																				<v-spacer></v-spacer>
																			</tr>
																		</tbody>
																		<v-menu v-if="currTabObj" :key="'menu'+panel.panelID" v-model="showPanelMenu" :position-x="menuX" :position-y="menuY" absolute offset-y :style="`z-index:${currTabObj.lastZIndex+1}`">
																			<v-card>
																				<tbody>
																					<tr>
																						<v-spacer></v-spacer>
																							<td>
																								<div class="pa-md-1">
																									<v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
																										<template v-slot:activator="{ on, attrs }">
																											<v-btn x-small fab color="info" v-bind="attrs" v-on="on" :elevation="1" @click="bringPanelToFront(panelObjectToPass)">
																												<v-icon>mdi-arrange-bring-to-front</v-icon>
																											</v-btn>
																										</template>
																										<span>Bring the Panel to the top layer</span>
																									</v-tooltip>
																								</div>
																							</td>
																							<td v-if="panel.panelType != 'webcam'">
																								<div class="pa-md-1">
																									<v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
																										<template v-slot:activator="{ on, attrs }">
																											<v-btn x-small fab color="info" v-bind="attrs" v-on="on" :elevation="1" @click="panelEdit(panelObjectToPass)">
																												<v-icon>mdi-playlist-edit</v-icon>
																											</v-btn>
																										</template>
																										<span>Edit Panel</span>
																									</v-tooltip>
																								</div>
																							</td>
																							<td>
																								<div class="pa-md-1">
																									<v-tooltip bottom>
																										<template v-slot:activator="{ on, attrs }">
																											<v-btn x-small fab color="info" v-bind="attrs" v-on="on" :elevation="1" @click="customPanelClone(panelObjectToPass)">
																												<v-icon>mdi-content-duplicate</v-icon>
																											</v-btn>
																										</template>
																										<span>Clone Panel</span>
																									</v-tooltip>
																								</div>
																							</td>
																							<td>
																								<div class="pa-md-1">
																									<v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
																										<template v-slot:activator="{ on, attrs }">
																											<v-btn x-small fab color="info" v-bind="attrs" v-on="on" :elevation="1" @click="panelDelete(panelObjectToPass.panelID)">
																												<v-icon>mdi-delete</v-icon>
																											</v-btn>
																										</template>
																										<span>Delete Panel</span>
																									</v-tooltip>
																								</div>
																							</td>
																						<v-spacer></v-spacer>
																					</tr>
																				</tbody>
																			</v-card>
																		</v-menu>
																	</v-overlay>
																</td>
															</v-row>
														</v-card>
													</vue-draggable-resizable>
													<vue-draggable-resizable v-for="(btn) in getTabBtns(tab.tabID)" :key="'btn' + btn.btnID + btn.autoSize" :z="getZidx(btn.btnZIndex)" :grid="tab.tabGridSize" @activated="onDragClick(btn)" :parent="true" :w="btn.btnWsize" :h="btn.btnHsize" class="ma-0 pa-0" :x="btn.btnXpos" :y="btn.btnYpos" :resizable="!btn.autoSize" :draggable="editMode" :drag-handle="'.drag-handle'" @dragstop="lastBtnMovePosition" @resizestop="onBtnResizestop">
														<v-card style="height: 98%; width: 98%" class="ma-0 pa-0" :key="'btnCard' + btn.btnID + btn.autoSize">
															<v-row align="center" justify="center" class="tabs-card ma-0 pa-0">
																<!--tooltip buttons-->
																<div v-if="btn.btnGroupIdx==tab.tabID && !editMode && !btn.autoSize && btn.btnHoverText.length>0" class="ma-0 pa-0" style="height: 100%; width: 100%" align="center" justify="center">
																	<v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
																		<template v-slot:activator="{ on, attrs }">
																			<v-btn v-if="!btn.autoSize" block style="height: 100%; width: 100%" v-bind="attrs" v-on="on" :color="btn.btnColour" :elevation="1" :disabled="chkJobEnabled(btn)" @click="onBtnClick($event, btn)">
																				<span v-if="btn.btnIcon"><v-icon class="mr-1">{{ btn.btnIcon }}</v-icon>{{ btn.btnLabel }}</span>
																				<span v-if="!btn.btnIcon">{{ btn.btnLabel }}</span>
																			</v-btn>
																		</template>
																		<span >{{ btn.btnHoverText }}</span>
																	</v-tooltip>
																</div>
																<div v-if="btn.btnGroupIdx==tab.tabID && !editMode && btn.autoSize && btn.btnHoverText.length>0">
																	<v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
																		<template v-slot:activator="{ on, attrs }">
																			<v-btn v-if="btn.autoSize" v-bind="attrs" v-on="on" :color="btn.btnColour" :elevation="1" :disabled="chkJobEnabled(btn)" @click="onBtnClick($event, btn)">
																				<span v-if="btn.btnIcon"><v-icon class="mr-1">{{ btn.btnIcon }}</v-icon>{{ btn.btnLabel }}</span>
																				<span v-if="!btn.btnIcon">{{ btn.btnLabel }}</span>
																			</v-btn>
																		</template>
																		<span >{{ btn.btnHoverText }}</span>
																	</v-tooltip>
																</div>
																<!--Non tooltip buttons-->
																<div v-if="btn.btnGroupIdx==tab.tabID && !editMode && !btn.autoSize && btn.btnHoverText.length==0" class="ma-0 pa-0" style="height: 100%; width: 100%" align="center" justify="center">
																	<v-btn v-if="!btn.autoSize" block style="height: 100%; width: 100%" :color="btn.btnColour" :elevation="1" :disabled="chkJobEnabled(btn)" @click="onBtnClick($event, btn)">
																		<span v-if="btn.btnIcon"><v-icon class="mr-1">{{ btn.btnIcon }}</v-icon>{{ btn.btnLabel }}</span>
																		<span v-if="!btn.btnIcon">{{ btn.btnLabel }}</span>
																	</v-btn>
																</div>
																<div v-if="btn.btnGroupIdx==tab.tabID && !editMode && btn.autoSize && btn.btnHoverText.length==0">
																	<v-btn v-if="btn.autoSize" :color="btn.btnColour" :elevation="1" :disabled="chkJobEnabled(btn)" @click="onBtnClick($event, btn)">
																		<span v-if="btn.btnIcon"><v-icon class="mr-1">{{ btn.btnIcon }}</v-icon>{{ btn.btnLabel }}</span>
																		<span v-if="!btn.btnIcon">{{ btn.btnLabel }}</span>
																	</v-btn>
																</div>
																<div v-if="btn.btnGroupIdx==tab.tabID && editMode && !btn.autoSize" class="drag-handle ma-0 pa-0" style="height: 100%; width: 100%" align="center" justify="center">
																	<v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
																		<template v-slot:activator="{ on, attrs }">
																			<v-btn block v-bind="attrs" class="drag-button" style="height: 100%; width: 100%" v-on="on" :color="btn.btnColour" :elevation="1"  @contextmenu="doMenu($event, btn)">
																				<v-icon>mdi-cog</v-icon>{{ btn.btnLabel }}
																			</v-btn>
																		</template>
																		<span>Click to enable resize - Click & Hold to drag - Right Click Edit Menu</span>
																	</v-tooltip>
																</div>
																<!--Other Buttons-->
																<div v-if="btn.btnGroupIdx==tab.tabID && editMode && btn.autoSize" class="drag-handle">
																	<v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
																		<template v-slot:activator="{ on, attrs }">
																			<v-btn v-bind="attrs" class="drag-button" v-on="on" :color="btn.btnColour" :elevation="1" @contextmenu="doMenu($event, btn)">
																				<v-icon>mdi-cog</v-icon>{{ btn.btnLabel }}
																			</v-btn>
																		</template>
																		<span>Click & Hold to drag - Right Click Edit Menu</span>
																	</v-tooltip>
																</div>
															</v-row>
														</v-card>
													</vue-draggable-resizable>
												</div>
											</v-col>
										</v-row>
									</v-container>
								</v-card>
							</v-tab-item>
						</v-tabs-items>
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
						<a href="https://www.npmjs.com/package/axios" target="_blank">axios</a><span>, </span>
						<a href="https://www.npmjs.com/package/jsonpath" target="_blank">jsonpath</a><br>
						Plus re-uses components and code from <strong>DWC</strong>.<br>
						<a href="https://github.com/MintyTrebor/BtnCmd/wiki" target="_blank">BtnCmd Wiki</a><br>
						<a href="https://materialdesignicons.com/" target="_blank">Material Design Icon Library</a><br>
					</v-alert>
				</v-row>
				<BtnCmdSettingsDialogue v-if="showEdit" v-model="showEdit" :passedObject="objectToPass" :bMQTT="btnCmd.globalSettings.enableMQTT" :enableSelects="btnCmd.globalSettings.enableSelects"></BtnCmdSettingsDialogue>
				<BtnCmdTabSettingsDialogue v-if="showTabEdit" v-model="showTabEdit" :passedObject="tabObjectToPass[0]" :enableSelects="btnCmd.globalSettings.enableSelects"></BtnCmdTabSettingsDialogue>
				<BtnCmdPanelSettingsDialogue @exit="afterAddPanel()" v-if="showPanelEdit" v-model="showPanelEdit" :customPanels="getAllCustomPanels()" :passedObject="panelObjectToPass[0]" :enableSelects="btnCmd.globalSettings.enableSelects" :createMode="createMode"></BtnCmdPanelSettingsDialogue>
				<BtnCmdAWCPanelDialogue @exit="saveSettings()" v-if="showAWCPanelEdit" v-model="showAWCPanelEdit" :passedObject="panelObjectToPass[0]" :enableSelects="btnCmd.globalSettings.enableSelects"></BtnCmdAWCPanelDialogue>
				<BtnCmdMMPanelDialogue @exit="saveSettings()" v-if="showMMPanelEdit" v-model="showMMPanelEdit" :passedObject="panelObjectToPass[0]" :enableSelects="btnCmd.globalSettings.enableSelects"></BtnCmdMMPanelDialogue>
				<BtnCmdGlobalSettingsDialogue @exit="saveSettings()" v-if="showGSEdit" v-model="showGSEdit" :mobileActive="mobileActive" :passedObject="btnCmd.globalSettings"></BtnCmdGlobalSettingsDialogue>
				<BtnCmdEventSettingsDialogue @exit="saveSettings()" v-if="showESEdit" v-model="showESEdit" :bMQTT="btnCmd.globalSettings.enableMQTT" :passedObject="btnCmd" :enableSelects="btnCmd.globalSettings.enableSelects"></BtnCmdEventSettingsDialogue>
				<confirm-dialog :shown.sync="confirmRstSettings" title="Reset Settings" prompt="Are you sure?" @confirmed="resetSettings()"></confirm-dialog>
				<confirm-dialog :shown.sync="confirmDelTab" title="Delete" prompt="Delete with all content?" @confirmed="doTabDelete()"></confirm-dialog>
				<confirm-dialog :shown.sync="showBtnConfDialog" title="Confirmation Required" :prompt="currBtnPromptTxt" @confirmed="onBtnConf()"></confirm-dialog>	
			</v-col>
		</v-row>
		<!-- Normal Footer with action messages-->
		<v-footer v-if="!settingsMode && !editMode && !createMode && btnCmd.globalSettings.enableActionMsg" height="37" absolute width="100%" class="pa-0 ma-0" :style="`z-index:${currTabObj.lastZIndex+1}; bottom: 12px;`">
			<v-row class="pa-0 ma-0">	
				<div>
					<span v-if="!mobileActive" class="text-caption mx-4">{{ actionResponse }}</span>
				</div>
				<v-spacer></v-spacer>
				<div class="mx-2" v-if="!backupMode && !editMode && btnCmd.globalSettings.enableGC_SH_Btn && !mobileActive">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" :elevation="1" @click="toggleTopPanelBtn()">
								<v-icon v-if="!currHideTopPanel" class="mr-1" >mdi-eye-off</v-icon>
								<v-icon v-if="currHideTopPanel" class="mr-1" >mdi-eye</v-icon>
							</v-btn>
						</template>
						<span>Show/Hide Top Panel</span>
					</v-tooltip>
				</div>
				<div class="mx-2" v-if="!backupMode && !editMode">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" :elevation="1" @click="settingsMode = !settingsMode">
								<v-icon class="mr-1" >mdi-cog</v-icon>
							</v-btn>
						</template>
						<span>Show Settings</span>
					</v-tooltip>
				</div>
			</v-row>
		</v-footer>
		<!-- Normal Footer No action messages-->
		<v-footer v-if="!settingsMode && !editMode && !createMode && !btnCmd.globalSettings.enableActionMsg" height="37" absolute width="100%" class="pa-0 ma-0" :style="`z-index:${currTabObj.lastZIndex+1}; bottom: 12px; background-color: #FFFFFF00`">
			<v-row class="pa-0 ma-0">	
				<v-spacer></v-spacer>
				<div class="mx-2" v-if="!backupMode && !editMode && btnCmd.globalSettings.enableGC_SH_Btn && !mobileActive">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" :elevation="1" @click="toggleTopPanelBtn()">
								<v-icon v-if="!currHideTopPanel" class="mr-1" >mdi-eye-off</v-icon>
								<v-icon v-if="currHideTopPanel" class="mr-1" >mdi-eye</v-icon>
							</v-btn>
						</template>
						<span>Show/Hide Top Panel</span>
					</v-tooltip>
				</div>
				<div class="mx-2" v-if="!backupMode && !editMode">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small color="#FFFFFF00" v-bind="attrs" v-on="on" :elevation="1" @click="settingsMode = !settingsMode">
								<v-icon class="mr-1" >mdi-cog</v-icon>
							</v-btn>
						</template>
						<span>Show Settings</span>
					</v-tooltip>
				</div>
			</v-row>
		</v-footer>
		<!--Settings Footer -->
		<v-footer v-if="settingsMode && !editMode && !createMode" height="37" absolute width="100%" class="pa-0 ma-0" :style="`z-index:${currTabObj.lastZIndex+1}; bottom: 12px;`">
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
				<!-- <div>
					<span v-if="btnCmd.globalSettings.enableActionMsg && !mobileActive" class="text-caption mx-4">{{ actionResponse }}</span>
				</div> -->
				<v-spacer></v-spacer>
				<div class="mx-2" v-if="!backupMode && !editMode">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small color="red" v-bind="attrs" v-on="on" :elevation="1" @click="createModeToggle()">
								<v-icon class="mr-1" >mdi-wrench</v-icon>
							</v-btn>
						</template>
						<span>Create & Edit Custom Panels</span>
					</v-tooltip>
				</div>
				<div class="mx-2" v-if="!backupMode && !createMode">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small color="green" v-bind="attrs" v-on="on" :elevation="1" @click="editModeToggle()">
								<v-icon class="mr-1">mdi-square-edit-outline</v-icon>
							</v-btn>
						</template>
						<span>Create & Edit Layouts</span>
					</v-tooltip>
				</div>
				<div class="mx-2" v-if="!backupMode && !editMode">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" :elevation="1" @click="settingsMode = !settingsMode">
								<v-icon class="mr-1" >mdi-cog</v-icon>
							</v-btn>
						</template>
						<span>Hide Settings</span>
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
								<v-icon color="indigo">mdi-tab</v-icon>
							</v-btn>
						</template>
						<span v-if="!createMode">Edit current tab properties</span>
						<span v-else>Edit current custom panel properties</span>
					</v-tooltip>
				</div>
				<div class="mx-1">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn x-small fab v-bind="attrs" v-on="on" @click="onCloneTabBtnClick(currTabObj.tabID)">
								<v-icon color="indigo">mdi-table-multiple</v-icon>
							</v-btn>
						</template>
						<span v-if="!createMode">Clone Current Tab</span>
						<span v-else>Clone Current Custom Panel</span>
					</v-tooltip>
				</div>
				<div class="mx-1">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn  x-small fab v-bind="attrs" v-on="on" @click="onTabAddBtnClick()">
								<v-icon color="indigo">mdi-tab-plus</v-icon>
							</v-btn>
						</template>
						<span v-if="!createMode">Add Tab</span>
						<span v-else>Add Custom Panel</span>
					</v-tooltip>
				</div>
				<div class="mx-1">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn  x-small fab :disabled="isLastTab()" v-bind="attrs" v-on="on" @click="onTabDelBtnClick(currTabObj)">
								<v-icon color="red">mdi-tab-remove</v-icon>
							</v-btn>
						</template>
						<span v-if="!createMode">Delete current Tab</span>
						<span v-else>Delete current Custom Panel</span>
					</v-tooltip>
				</div>
				<div class="mx-1">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn  x-small fab v-bind="attrs" v-on="on" @click="onAddPanelClick(currTabObj)">
								<v-icon color="blue">mdi-credit-card-plus</v-icon>
							</v-btn>
						</template>
						<span>Add Panel</span>
					</v-tooltip>
				</div>
				<div class="mx-1">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn  x-small fab v-bind="attrs" v-on="on" @click="onAddBtnClick(currTabObj)">
								<v-icon color="blue">mdi-card-plus</v-icon>
							</v-btn>
						</template>
						<span>Add Button</span>
					</v-tooltip>
				</div>
				<div class="mx-1">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn  x-small fab v-bind="attrs" v-on="on" :disabled="backupMode" @click="saveSettings()">
								<v-icon color="green">mdi-content-save-all</v-icon>
							</v-btn>
						</template>
						<span>Save Changes</span>
					</v-tooltip>
				</div>
				<div class="mx-1">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn  x-small fab v-bind="attrs" v-on="on" :disabled="backupMode" @click="editModeToggle()">
								<v-icon color="green">mdi-content-save-move</v-icon>
							</v-btn>
						</template>
						<span>Save Changes & Exit</span>
					</v-tooltip>
				</div>
				<div class="mx-1">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn  x-small fab v-bind="attrs" v-on="on" @click="undoEditChanges()">
								<v-icon color="red">mdi-progress-close</v-icon>
							</v-btn>
						</template>
						<span>Exit & Undo All Changes Since Last Save</span>
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
								<v-icon dense color="indigo">mdi-tab</v-icon>
							</v-btn>
						</template>
						<span v-if="!createMode">Edit current tab properties</span>
						<span v-else>Edit current custom panel properties</span>
					</v-tooltip>
				</div>
				<div class="mx-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" @click="onCloneTabBtnClick(currTabObj.tabID)">
								<v-icon color="indigo">mdi-table-multiple</v-icon>
							</v-btn>
						</template>
						<span v-if="!createMode">Clone Current Tab</span>
						<span v-else>Clone Current Custom Panel</span>
					</v-tooltip>
				</div>
				<div class="mx-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" @click="onTabAddBtnClick()">
								<v-icon color="indigo">mdi-tab-plus</v-icon>
							</v-btn>
						</template>
						<span v-if="!createMode">Add Tab</span>
						<span v-else>Add Custom Panel</span>
					</v-tooltip>
				</div>
				<div class="mx-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small :disabled="isLastTab()" v-bind="attrs" v-on="on" @click="onTabDelBtnClick(currTabObj)">
								<v-icon color="red">mdi-tab-remove</v-icon>
							</v-btn>
						</template>
						<span v-if="!createMode">Delete current Tab</span>
						<span v-else>Delete current Custom Panel</span>
					</v-tooltip>
				</div>
				<div class="mx-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" @click="onAddPanelClick(currTabObj)">
								<v-icon color="blue">mdi-credit-card-plus</v-icon>
							</v-btn>
						</template>
						<span>Add Panel</span>
					</v-tooltip>
				</div>
				<div class="mx-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" @click="onAddBtnClick(currTabObj)">
								<v-icon color="blue">mdi-card-plus</v-icon>
							</v-btn>
						</template>
						<span>Add Button</span>
					</v-tooltip>
				</div>
				<div class="mx-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" :disabled="backupMode" @click="saveSettings()">
								<v-icon color="green">mdi-content-save-all</v-icon>
							</v-btn>
						</template>
						<span>Save Changes</span>
					</v-tooltip>
				</div>
				<div class="mx-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" :disabled="backupMode" @click="editModeToggle()">
								<v-icon color="green">mdi-content-save-move</v-icon>
							</v-btn>
						</template>
						<span>Save Changes & Exit</span>
					</v-tooltip>
				</div>
				<div class="mx-2">
					<v-tooltip top>
						<template v-slot:activator="{ on, attrs }">
							<v-btn small v-bind="attrs" v-on="on" @click="undoEditChanges()">
								<v-icon color="red">mdi-progress-close</v-icon>
							</v-btn>
						</template>
						<span>Exit & Undo All Changes Since Last Save</span>
					</v-tooltip>
				</div>
				<v-spacer></v-spacer>
			</v-row>
		</v-footer>	
		<v-dialog v-model="showFileDialog" max-width="700px">
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

import BtnCmdSettingsDialogue from './BtnCmdSettingsDialogue.vue';
import BtnCmdTabSettingsDialogue from './BtnCmdTabSettingsDialogue.vue';
import BtnCmdGlobalSettingsDialogue from './BtnCmdGlobalSettingsDialogue.vue';
import BtnCmdEventSettingsDialogue from './BtnCmdEventSettingsDialogue.vue';
import BtnCmdPanelSettingsDialogue from './BtnCmdPanelSettingsDialogue.vue';
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import Path from '../../utils/path.js';
import deepmerge from 'deepmerge';
import { isPrinting, isPaused, StatusType } from '../../store/machine/modelEnums.js';
import altWebCamPanel from './altWebCamPanel.vue';
import VueDraggableResizable from 'vue-draggable-resizable';
import BtnCmdWebPanel from './BtnCmdWebPanel.vue';
import BtnCmdMMPanel from './BtnCmdMMPanel.vue';
import BtnCmdAWCPanelDialogue from './BtnCmdAWCPanelDialogue.vue';
import BtnCmdMMPanelDialogue from './BtnCmdMMPanelDialogue.vue';
import BtnCmdDataFunctions from './BtnCmdDataFunctions.js';
import BtnCmdEventFunctions from './BtnCmdEventFunctions.js';
import BtnCmdBtnActionFunctions from './BtnCmdBtnActionFunctions.js';
import BtnCmdCustomPanel from './BtnCmdCustomPanel.vue';

export default {
    components: {
        BtnCmdSettingsDialogue,
		BtnCmdTabSettingsDialogue,
		BtnCmdGlobalSettingsDialogue,
		altWebCamPanel,
		BtnCmdEventSettingsDialogue,
		VueDraggableResizable,
		BtnCmdPanelSettingsDialogue,
		BtnCmdWebPanel,
		BtnCmdMMPanel,
		BtnCmdAWCPanelDialogue,
		BtnCmdMMPanelDialogue,
		BtnCmdCustomPanel
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
			var tmpPlgH = parseInt(this.btnCmd.globalSettings.pluginMinimumHeight);
			var iNormHeightModifier = 420;

			if(this.currHideTopPanel){
				iNormHeightModifier = 110;
			}


			if(tmpPlgH < 0){
				//Negative Modifier
				tmpUsrHeightMod = -Math.abs(Math.floor((currHeight / 100)*tmpPlgH));
			}else if(tmpPlgH > 0){
				//Positve Modifier
				tmpUsrHeightMod = Math.floor((currHeight/ 100)*tmpPlgH);
			}	

			if(parseInt(this.window.width) <= 720){
				//Mobile Height modifiers
				if(!this.dialogDisplayed()){
					tmpHeight = tmpUsrHeightMod + 601;
					if(tmpHeight > (currHeight - 110)) {
						tmpHeight = currHeight - 110;
					}
				}else{
					return;
				}
			}else {
				//Normal Heigh modifiers
				tmpHeight = (tmpUsrHeightMod + currHeight - iNormHeightModifier);
				if(tmpHeight > (currHeight - 110)) {
					tmpHeight = currHeight - 110;
				}
			}
			return tmpHeight;
		},
		mobileActive() {
			if(this.$vuetify.breakpoint.mdAndDown){
				return true;
			}else {
				return false;
			}
		},
		getTabs(){
			return this.btnCmd.tabs.filter(item => item.embedTab === this.createMode);
		},
		getMainBackgroundColor(){
			if(this.editMode){
				if(this.createMode){
					return 'red';
				}else{
					return 'green';
				}
			}else{
				return '';
			}
		}	
	},
	mixins: [
		BtnCmdDataFunctions,
		BtnCmdEventFunctions,
		BtnCmdBtnActionFunctions
	],
	data: function () {
		//Changes to btnCmd:{} structure must also be made in BtnCmdDataFunctions.js
		return {
			editMode: false,
			createMode: false,
			settingsMode: false,
			dialog: false,
			showEdit: false,
			showTabEdit: false,
			showGSEdit: false,
			showESEdit: false,
			showInfo: false,
			showPanelEdit: false,
			showFileDialog: false,
			showBtnConfDialog: false,
			showAWCPanelEdit: false,
			showMMPanelEdit: false,
			objectToPass: null,
			tabObjectToPass: null,
			panelObjectToPass: null,
			currTab: 1,
			currTabIdx: 0,
			saveBtnCol: 'primary',
			brBtnCol: 'primary',
			backupMode: false,
			directory: Path.macros,
			actionResponse: null,
			altWebCamToPass: null,
			confirmRstSettings: false,
			code: '',
			doingCode: false,
			isSimulating: false,
			newData: null,
			currButtonObj: {},
			currButtonEventObj: {},
			currTabObj: {},
			currPanelObj: {},
			editDragging: false,
			showMenu: false,
			showPanelMenu: false,
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
			confirmDelTab: false,
			lastTabHeight: 0,
			getCurrTabIndex: "tab-1",
			currBtnPromptTxt: 'Are You Sure?',
			currHideTopPanel: false,
			btnCmdVersion: '0.9.01',
			btnCmd : {
				btnCmdVersion: '0.9.01',
				systemSettings: {
					lastID: 1,
					lastTabID: 2,
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
						caption: "Layout 1",
						numberOfColumns: 12,
						showWebCam: false,
						showAltWebCam : false,
						tabEnableSnap: false,
						tabGridSize: [1,1],
						lastZIndex: 2,
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
			}
		}
	},
	created() {
		window.addEventListener('resize', this.handleResize);
        this.handleResize();
    },
    destroyed() {
        alert("Destroyed");
		window.removeEventListener('resize', this.handleResize);
    },
    methods: {
		...mapActions('machine', ['sendCode']),
		...mapActions('machine', {machineDownload: 'download'}),
        ...mapActions('machine', ['upload']),
		...mapMutations('machine/settings', ['addCode', 'removeCode']),
		setupPage(){
			this.onChangeTab(this.btnCmd.tabs[0].tabID);
		},
		updateAR(ActionText){
			this.actionResponse=ActionText;
		},
		handleResize() {
            this.window.width = window.innerWidth;
            this.window.height = window.innerHeight;
        },
		toggleTopPanelBtn(){
			this.currHideTopPanel = !this.currHideTopPanel;
			this.toggleTopPanel(this.currHideTopPanel);
		},
		toggleTopPanel(bHideGCPanel){
			if(bHideGCPanel){
				window.document.getElementById("global-container").hidden = true;
				this.currHideTopPanel = true;
			}else {
				window.document.getElementById("global-container").hidden = false;
				this.currHideTopPanel = false;
			}
		},		
		getZidx(idxVal) {
			if(this.mobileActive && !this.editMode){
				return null;
			}else {
				return idxVal;
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
		doPanelMenu (e, panel) {
			e.preventDefault();
			this.panelObjectToPass = panel;
			this.showPanelMenu = false
			this.menuX = e.clientX
			this.menuY = e.clientY
			this.$nextTick(() => {
				this.showPanelMenu = true
			})
		},
		afterAddPanel(){
			//function runs after closing add panel dialog
			if(this.panelObjectToPass[0].panelType == "altwebcam"){
				this.showAWCPanelEdit = true;
			}
			if(this.panelObjectToPass[0].panelType == "mmValue"){
				this.showMMPanelEdit = true;
			}			
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
			this.currButtonObj = btnObj;
			return true;
		},
		saveBtnPosition(xPos, yPos){
			this.currButtonObj.btnXpos = xPos;
			this.currButtonObj.btnYpos = yPos;
		},
		onBtnResizestop: function (x, y, width, height){
			this.resizing = false;
			this.currButtonObj.btnXpos = x;
			this.currButtonObj.btnYpos = y;
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
			this.currPanelObj = panelObj;
			return true;
		},
		savePanelPosition(xPos, yPos){
			this.currPanelObj.panelXpos = xPos;
			this.currPanelObj.panelYpos = yPos;
		},
		onPanelResizestop: function (x, y, width, height){
			this.resizing = false;
			this.currPanelObj.panelXpos = x;
			this.currPanelObj.panelYpos = y;
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
		dialogDisplayed(){
			if(this.dialog || this.showEdit || this.showTabEdit || this.showGSEdit || this.showESEdit || this.showInfo || this.showPanelEdit || this.showFileDialog){
				return true;
			}else {
				return false;
			}
		},		
		getTabBtns(tabID){
			var result = this.btnCmd.btns.filter(item => item.btnGroupIdx === tabID);
			return result;
		},
		getTabPanels(tabID){
			//need to change this to a case
			var result = this.btnCmd.panels.filter(item => item.tabID === tabID && item.panelType != "webcam" && item.panelType != "altwebcam" && item.panelType != "remSrc" && item.panelType != "mmValue");
			return result;
		},
		getTabCamPanels(tabID){
			//need to change this to a case
			var result = this.btnCmd.panels.filter(item => (item.tabID === tabID) && (item.panelType == "webcam" || item.panelType == "altwebcam" || item.panelType == "remSrc" || item.panelType == "mmValue"));
			return result;
		},
		getAllCustomPanels(){
			var result = this.btnCmd.tabs.filter(item => item.embedTab === true);
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
		isLastTab(){
			var tmpArr = this.btnCmd.tabs.filter(item => item.embedTab === this.createMode);
			if(tmpArr.length > 1){
				return false;
			}else{
				return true;
			}
		},
		onTabDelBtnClick(tabObj) {
			this.setActionResponse('');
			var tmpTabInx = this.btnCmd.tabs.findIndex(item => item.tabID == tabObj.tabID);
			if(this.btnCmd.tabs.length >= 1){
				if(this.hasBtns()){
					this.confirmDelTab = true;
					return;
				}
				this.btnCmd.tabs.splice(tmpTabInx, 1);
			}
			var tmptabArr = this.btnCmd.tabs.filter(item => item.embedTab == this.createMode);
			this.onChangeTab(tmptabArr[0].tabID);
		},
		doTabDelete(){
			var tmpBtns = this.btnCmd.btns.filter(item => item.btnGroupIdx === this.currTab);
			var tmpPanels = this.btnCmd.panels.filter(item => item.tabID === this.currTab);
			if(tmpBtns.length >= 1){
				var newBtnsArray = this.btnCmd.btns.filter(item => item.btnGroupIdx !== this.currTab);
				this.btnCmd.btns = newBtnsArray;
			}
			if(tmpPanels.length >= 1){
				var newPanelsArray = this.btnCmd.panels.filter(item => item.tabID !== this.currTab);
				this.btnCmd.panels = newPanelsArray;
			}
			this.btnCmd.tabs.splice(this.btnCmd.tabs.findIndex(item => item.tabID == this.currTab), 1);
			var tmpTabs = this.btnCmd.tabs.filter(item => item.embedTab == this.createMode);
			this.onChangeTab(tmpTabs[0].tabID);
		},
		onTabAddBtnClick() {
			this.setActionResponse('');
			var tmpTabID = this.btnCmd.systemSettings.lastTabID + 1;
			var newTab_object = this.getRefData().tabs[0];
			newTab_object.tabID = tmpTabID;
			newTab_object.lastZIndex = 1;
			newTab_object.caption = 'Group ' + tmpTabID;
			newTab_object.embedTab = this.createMode;
			this.btnCmd.systemSettings.lastTabID = tmpTabID;
			this.btnCmd.tabs.push(newTab_object);
			//var tmpTabInx = this.btnCmd.tabs.filter(item => item.embedTab == this.createMode);
			this.onChangeTab(tmpTabID);			
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
		customPanelClone(panelObj){
			this.setActionResponse('');
			const merge = deepmerge;
			var tmpPanel_object = merge(this.getRefData().panels[0], panelObj)
			var tmpPanelID = this.btnCmd.systemSettings.lastPanelID + 1;
			this.btnCmd.systemSettings.lastPanelID = tmpPanelID;
			this.currTabObj.lastZIndex = this.currTabObj.lastZIndex + 1;
			tmpPanel_object.panelID = tmpPanelID;
			tmpPanel_object.panelYpos = panelObj.panelYpos + 20;
			tmpPanel_object.panelXpos = panelObj.panelXpos + 20;
			tmpPanel_object.panelZIndex = this.currTabObj.lastZIndex;
			this.btnCmd.panels.push(tmpPanel_object);
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
		panelEdit(panelObj){
			this.panelObjectToPass = this.btnCmd.panels.filter(itemPanel => itemPanel.panelID == panelObj.panelID);
			if(this.panelObjectToPass[0].panelType == "altwebcam"){
				this.showAWCPanelEdit = true;
			}
			if(this.panelObjectToPass[0].panelType == "mmValue"){
				this.showMMPanelEdit = true;
			}
			if(this.panelObjectToPass[0].panelType == "remSrc"){
				this.showPanelEdit = true;
			}
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
				var tmpArr = this.btnCmd.tabs.filter(item => item.embedTab === false);
				this.onChangeTab(tmpArr[0].tabID);
				this.saveSettings();
				this.saveBtnCol = 'primary';
				this.createMode = false;
			}else {
				this.saveBtnCol = 'green';
			}
		},
		createModeToggle(){
			this.setActionResponse('');
			this.createMode = true;
			var tmpArr = this.btnCmd.tabs.filter(item => item.embedTab === true);
			if(tmpArr.length >= 1){
				this.onChangeTab(tmpArr[0].tabID);
			}
			this.editModeToggle()
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
		onChangeTab(tmpTabID){
			this.currTab = tmpTabID;
			//this.currTabIdx = tmpTabIndex;
			this.getCurrTabIndex = "tab-"+tmpTabID;
			var tmpTabObj = this.btnCmd.tabs.filter(item => item.tabID == tmpTabID);
			this.currTabObj = tmpTabObj[0];
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
		},
		$route (to, from){
			if(to.path === "/BtnCmd" && this.btnCmd.globalSettings.defaultGC_Hidden){
				this.toggleTopPanel(true);
			}
			if(from.path === "/BtnCmd"){
				this.toggleTopPanel(false);
			}
		}	
	}
}
</script>
