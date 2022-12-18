<template>
    <v-card :flat="passedObject.borderless" class="tab-item-wrapper">
        <v-container fluid class="pa-0 ma-0 tabs-default">
            <!-- <v-row mt-0><v-col><span class="text-caption">v-model = {{ mainData }}</span></v-col></v-row> -->
            <v-row class="pa-0 ma-0 tabs-default">
                <v-col cols="12">
                    <!--this div is here to constrain draggle items within the window-->
                    <div class="mytabs-card" v-if="passedObject.panelZIndex">
                        <vue-draggable-resizable v-for="(panel) in getTabPanels(passedObject.customPanelID)" :z="panel.panelZIndex" :key="'dwcpan'+panel.panelID" :parent="true" class="ma-0 pa-0" :w="panel.panelWSize" :h="panel.panelHSize" :x="panel.panelXpos" :y="panel.panelYpos" :resizable="false" :draggable="false" :drag-handle="'.drag-handle'">
                            <v-card align="center" justify="center" class="mytabs-card ma-0 pa-0">
                                <v-row dense  align="center" justify="center" class="mytabs-card ma-0 pa-0">
                                    <td class="mytabs-card">
                                        <job-info-panel v-if="panel.panelType == 'jobinfo'" lign="center" class="mytabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></job-info-panel>
                                        <layer-chart v-if="panel.panelType == 'layerchart'" min-height="180px" align="center" class="mytabs-card d-flex pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></layer-chart>
                                        <temperature-chart v-if="panel.panelType == 'temperature-chart'" min-height="180px" align="center" class="mytabs-card d-flex pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></temperature-chart>
                                        <job-estimations-panel v-if="panel.panelType == 'jobestimates'" align="center" class="mytabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></job-estimations-panel>
                                        <job-data-panel v-if="panel.panelType == 'collectdata'" align="center" class="mytabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></job-data-panel>
                                        <fans-panel v-if="panel.panelType == 'fans'" align="center" class="mytabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></fans-panel>
                                        <job-control-panel v-if="panel.panelType == 'job-control-panel'" align="center" class="mytabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></job-control-panel>
                                        <speed-factor-panel v-if="panel.panelType == 'speed'" align="center" class="mytabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></speed-factor-panel>
                                        <extrude-panel v-if="panel.panelType == 'extrude-panel'" align="center" class="mytabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></extrude-panel>
                                        <extrusion-factors-panel v-if="panel.panelType == 'extrusion-factors-panel'" align="center" class="mytabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></extrusion-factors-panel>
                                        <z-babystep-panel v-if="panel.panelType == 'z-babystep-panel'" align="center" class="mytabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></z-babystep-panel>
                                        <status-panel v-if="panel.panelType == 'status-panel'" align="center" class="mytabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></status-panel>
                                        <tools-panel v-if="panel.panelType == 'tools-panel'" align="center" class="mytabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></tools-panel>
                                        <movement-panel v-if="panel.panelType == 'movement-panel'" align="center" class="mytabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></movement-panel>
                                        <speed-factor-panel v-if="panel.panelType == 'speed'" align="center" class="mytabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></speed-factor-panel>
                                        <cnc-axes-position v-if="panel.panelType == 'cnc-axes-position'" align="center" class="mytabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></cnc-axes-position>
                                        <cnc-container-panel v-if="panel.panelType == 'cnc-container-panel'" align="center" class="mytabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></cnc-container-panel>
                                        <cnc-movement-panel v-if="panel.panelType == 'cnc-movement-panel'" align="center" class="mytabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></cnc-movement-panel>
                                        <spindle-speed-panel v-if="panel.panelType == 'spindle-speed-panel'" align="center" class="mytabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></spindle-speed-panel>
										<webcam-panel v-if="panel.panelType == 'webcam'" align="center" justify="center" class="mytabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></webcam-panel>
                                    </td>
                                </v-row>
                            </v-card>
                        </vue-draggable-resizable>
                        <vue-draggable-resizable v-for="(panel) in getTabPanelsEditable(passedObject.customPanelID)" :z="panel.panelZIndex" :key="'campan'+panel.panelID" :parent="true" class="ma-0 pa-0" :w="panel.panelWSize" :h="panel.panelHSize" :x="panel.panelXpos" :y="panel.panelYpos" :resizable="false" :draggable="false" :drag-handle="'.drag-handle'">
                            <v-card align="center" justify="center" flat class="mytabs-card ma-0 pa-0">
                                <v-row dense align="center" justify="center" class="mytabs-card ma-0 pa-0">
                                    <td class="mytabs-card">
                                        <altWebCamPanel v-if="panel.panelType == 'altwebcam'" align="center" justify="center" :passedObject="panel.altWebCamParams" class="mytabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></altWebCamPanel>
                                        <BtnCmdWebPanel v-if="panel.panelType == 'remSrc'" align="center" justify="center" :passedObject="panel.altWebCamParams" class="mytabs-card pa-0 ma-0"></BtnCmdWebPanel>
                                        <BtnCmdMMPanel v-if="panel.panelType == 'mmValue' || panel.panelType == 'txtLabel'" :key="'mmV' + panel.panelMMPrefix + panel.panelID + panel.panelMMPath" align="center" justify="center" :passedObject="panel" class="mytabs-card pa-0 ma-0" style="height: 100%; width: 100%"></BtnCmdMMPanel>                                     
                                        <BtnCmdVInputPanel v-if="panel.panelType == 'vInput'" :key="'vInput' + panel.inputVarName + panel.panelID" align="center" justify="center" class="mytabs-card pa-0 ma-0" :passedObject="panel" style="height: 100%; width: 100%" :LZIndex="LZIndex"></BtnCmdVInputPanel>
                                    </td>
                                </v-row>
                            </v-card>
                        </vue-draggable-resizable>
                        <vue-draggable-resizable v-for="(btn) in getTabBtns(passedObject.customPanelID)" :z="btn.btnZIndex" :key="'btn' + btn.btnID + btn.autoSize" :parent="true" :w="btn.btnWsize" :h="btn.btnHsize" class="ma-0 pa-0" :x="btn.btnXpos" :y="btn.btnYpos" :resizable="false" :draggable="false">
                            <v-card align="center" justify="center" style="height: 98%; width: 98%" class="ma-0 pa-0" :key="'btnCard' + btn.btnID + btn.autoSize + btn.btnWsize + btn.btnHsize + btn.btnXpos + btn.btnYpos">
                                <v-row align="center" justify="center" class="mytabs-card ma-0 pa-0">
                                    <div v-if="btn.btnGroupIdx==passedObject.customPanelID && !btn.autoSize && btn.btnHoverText.length>0" class="ma-0 pa-0" style="height: 100%; width: 100%" align="center" justify="center">
                                        <v-tooltip bottom :style="`position: absolute; z-index:${passedObject.panelZIndex+1}`">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn v-if="!btn.autoSize" block style="height: 100%; width: 100%" v-bind="attrs" v-on="on" :color="btn.btnColour" :elevation="1" :disabled="chkJobEnabled(btn)" @click="onBtnClick($event, btn)">
                                                    <span v-if="btn.btnIcon"><v-icon class="mr-1">{{ btn.btnIcon }}</v-icon>{{ btn.btnLabel }}</span>
                                                    <span v-if="!btn.btnIcon">{{ btn.btnLabel }}</span>
                                                </v-btn>
                                            </template>
                                            <span >{{ btn.btnHoverText }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div v-if="btn.btnGroupIdx==passedObject.customPanelID && btn.autoSize && btn.btnHoverText.length>0">
                                        <v-tooltip bottom :style="`position: absolute; z-index:${passedObject.panelZIndex+1}`">
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn v-if="btn.autoSize" v-bind="attrs" v-on="on" :color="btn.btnColour" :elevation="1" :disabled="chkJobEnabled(btn)" @click="onBtnClick($event, btn)">
                                                    <span v-if="btn.btnIcon"><v-icon class="mr-1">{{ btn.btnIcon }}</v-icon>{{ btn.btnLabel }}</span>
                                                    <span v-if="!btn.btnIcon">{{ btn.btnLabel }}</span>
                                                </v-btn>
                                            </template>
                                            <span >{{ btn.btnHoverText }}</span>
                                        </v-tooltip>
                                    </div>
                                    <div v-if="btn.btnGroupIdx==passedObject.customPanelID && !btn.autoSize && btn.btnHoverText.length==0" class="ma-0 pa-0" style="height: 100%; width: 100%" align="center" justify="center">
                                        <v-btn v-if="!btn.autoSize" block style="height: 100%; width: 100%" :color="btn.btnColour" :elevation="1" :disabled="chkJobEnabled(btn)" @click="onBtnClick($event, btn)">
                                            <span v-if="btn.btnIcon"><v-icon class="mr-1">{{ btn.btnIcon }}</v-icon>{{ btn.btnLabel }}</span>
                                            <span v-if="!btn.btnIcon">{{ btn.btnLabel }}</span>
                                        </v-btn>
                                    </div>
                                    <div v-if="btn.btnGroupIdx==passedObject.customPanelID && btn.autoSize && btn.btnHoverText.length==0">
                                        <v-btn v-if="btn.autoSize" :color="btn.btnColour" :elevation="1" :disabled="chkJobEnabled(btn)" @click="onBtnClick($event, btn)">
                                            <span v-if="btn.btnIcon"><v-icon class="mr-1">{{ btn.btnIcon }}</v-icon>{{ btn.btnLabel }}</span>
                                            <span v-if="!btn.btnIcon">{{ btn.btnLabel }}</span>
                                        </v-btn>
                                    </div>
                                </v-row>
                            </v-card>
                        </vue-draggable-resizable>
                    </div>
                </v-col>
            </v-row>
            <confirm-dialog :shown.sync="showBtnConfDialog" title="Confirmation Required" :prompt="currBtnPromptTxt" @confirmed="onBtnConf()"></confirm-dialog>
            <BtnCmdMsgDialog :shown.sync="showBtnSBCCDialog" title="Command Response" :prompt="currBtnPromptTxt" @confirmed="showBtnSBCCDialog = !showBtnSBCCDialog"></BtnCmdMsgDialog>
        </v-container>
    </v-card>
</template>

<script>
    import { isPrinting } from "@/utils/enums";
    import Path from '@/utils/path';
    import store from "@/store";
    import altWebCamPanel from './altWebCamPanel.vue';
    import VueDraggableResizable from 'vue-draggable-resizable';
    import BtnCmdWebPanel from './BtnCmdWebPanel.vue';
    import BtnCmdMMPanel from './BtnCmdMMPanel.vue';
    import BtnCmdDataFunctions from './BtnCmdDataFunctions';
    import BtnCmdCustPanelBtnActionFunctions from './BtnCmdCustPanelBtnActionFunctions';    
    import BtnCmdVInputPanel from './BtnCmdVInputPanel.vue';
    import BtnCmdMsgDialog from './BtnCmdMsgDialog.vue';

    export default {
        components: {
            altWebCamPanel,
            VueDraggableResizable,
            BtnCmdWebPanel,
            BtnCmdMMPanel,
            BtnCmdVInputPanel,
            BtnCmdMsgDialog
        },
        props: {
            passedObject: {
                type: Object
            },
            mainData: {
                type: Object
            },
            tmpSBCCSet: Array,
            LZIndex: Number,
            systemDSFVer: Boolean
        },
        computed: {
            status() {
			    return store.state.machine.model.state.status;
            },
            macrosDirectory() {
                return store.state.machine.model.directories.macros;
            },
            systemDirectory() {
                return store.state.machine.model.directories.system;
            },
            systemCurrIP() {
                return store.state.machine.model.network.interfaces[0].actualIP;
            },
            darkTheme() {
                return store.state.settings.darkTheme;
            }, 
            isPrinting() {
                return isPrinting(store.state.machine.model.state.status);
            },
            mobileActive() {
                if(this.$vuetify.breakpoint.smAndDown){
                    return true;
                }else {
                    return false;
                }
            },
            getTabs(){
                return this.mainData.tabs.filter(item => item.embedTab === true);
            }	
        },
        mixins: [
            BtnCmdDataFunctions,
            BtnCmdCustPanelBtnActionFunctions
        ],
        data: function () {
            //Changes to btnCmd:{} structure must also be made in BtnCmdDataFunctions.js
            return {
                showBtnConfDialog: false,
                code: '',
                doingCode: false,
                isSimulating: false,
                newData: null,
                currButtonObj: {},
                currButtonEventObj: {},
                currBtnPromptTxt: 'Are You Sure?',
                directory: Path.macros,
                showBtnSBCCDialog: false
            }
        },
        methods: {
            getTabBtns(tabID){
                var result = this.mainData.btns.filter(item => item.btnGroupIdx === tabID);
                // var result = tabID;
                return result;
            },
            getTabPanels(tabID){
                //need to change this to a case
                var result = this.mainData.panels.filter(item => item.tabID === tabID && item.panelType != "altwebcam" && item.panelType != "remSrc" && item.panelType != "mmValue" && item.panelType != "txtLabel" && item.panelType != "vInput");
                return result;
            },
            getTabPanelsEditable(tabID){
                //need to change this to a case
                var result = this.mainData.panels.filter(item => (item.tabID === tabID) && (item.panelType == "altwebcam" || item.panelType == "remSrc" || item.panelType == "mmValue" || item.panelType == "txtLabel" || item.panelType == "vInput"));
                return result;
            },
            chkJobEnabled(item){
                if(!item.btnEnableWhileJob && this.isPrinting){
                    return true;
                }else {
                    return false;
                }
            },
            getDWCPanelBGColor(panBGColor, panUseDWCThemeBGColor){
			//Sets the background colour of the std DWC panels
			//Done this way to allow for future user defined background color functionality
			if(panUseDWCThemeBGColor){
				if(this.darkTheme){
					return "#515151";
				}else{
					return "#f5f5f5";
				}
			}else{
				return panBGColor;
			}
		}
        }
    }
</script>
