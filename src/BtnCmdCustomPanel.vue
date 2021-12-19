<template>
    <v-card :flat="passedObject.borderless" class="tab-item-wrapper">
        <v-container fluid class="pa-0 ma-0 tabs-default">
            <!-- <v-row mt-0><v-col><span class="text-caption">v-model = {{ mainData }}</span></v-col></v-row> -->
            <v-row class="pa-0 ma-0 tabs-default">
                <v-col cols="12">
                    <!--this div is here to constrain draggle items within the window-->
                    <div class="tabs-card" v-if="passedObject.panelZIndex">
                        <vue-draggable-resizable v-for="(panel) in getTabPanels(passedObject.customPanelID)" :z="getCustPanZidx(panel.panelZIndex)" :key="'dwcpan'+panel.panelID" :parent="true" class="ma-0 pa-0" :w="panel.panelWSize" :h="panel.panelHSize" :x="panel.panelXpos" :y="panel.panelYpos" :resizable="false" :draggable="false" :drag-handle="'.drag-handle'">
                            <v-card align="center" justify="center" class="tabs-card ma-0 pa-0">
                                <v-row dense  align="center" justify="center" class="tabs-card ma-0 pa-0">
                                    <td class="tabs-card">
                                        <job-info-panel v-if="panel.panelType == 'jobinfo'" lign="center" class="tabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></job-info-panel>
                                        <layer-chart v-if="panel.panelType == 'layerchart'" min-height="180px" align="center" class="tabs-card d-flex pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></layer-chart>
                                        <temperature-chart v-if="panel.panelType == 'temperature-chart'" min-height="180px" align="center" class="tabs-card d-flex pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></temperature-chart>
                                        <job-estimations-panel v-if="panel.panelType == 'jobestimates'" align="center" class="tabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></job-estimations-panel>
                                        <job-data-panel v-if="panel.panelType == 'collectdata'" align="center" class="tabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></job-data-panel>
                                        <fans-panel v-if="panel.panelType == 'fans'" align="center" class="tabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></fans-panel>
                                        <job-control-panel v-if="panel.panelType == 'job-control-panel'" align="center" class="tabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></job-control-panel>
                                        <speed-factor-panel v-if="panel.panelType == 'speed'" align="center" class="tabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></speed-factor-panel>
                                        <extrude-panel v-if="panel.panelType == 'extrude-panel'" align="center" class="tabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></extrude-panel>
                                        <extrusion-factors-panel v-if="panel.panelType == 'extrusion-factors-panel'" align="center" class="tabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></extrusion-factors-panel>
                                        <z-babystep-panel v-if="panel.panelType == 'z-babystep-panel'" align="center" class="tabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></z-babystep-panel>
                                        <status-panel v-if="panel.panelType == 'status-panel'" align="center" class="tabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></status-panel>
                                        <tools-panel v-if="panel.panelType == 'tools-panel'" align="center" class="tabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></tools-panel>
                                        <movement-panel v-if="panel.panelType == 'movement-panel'" align="center" class="tabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></movement-panel>
                                        <speed-factor-panel v-if="panel.panelType == 'speed'" align="center" class="tabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></speed-factor-panel>
                                        <webcam-panel v-if="panel.panelType == 'webcam'" align="center" justify="center" class="tabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></webcam-panel>
                                    </td>
                                </v-row>
                            </v-card>
                        </vue-draggable-resizable>
                        <vue-draggable-resizable v-for="(panel) in getTabPanelsEditable(passedObject.customPanelID)" :z="getCustPanZidx(panel.panelZIndex)" :key="'campan'+panel.panelID" :parent="true" class="ma-0 pa-0" :w="panel.panelWSize" :h="panel.panelHSize" :x="panel.panelXpos" :y="panel.panelYpos" :resizable="false" :draggable="false" :drag-handle="'.drag-handle'">
                            <v-card align="center" justify="center" flat class="tabs-card ma-0 pa-0">
                                <v-row dense align="center" justify="center" class="tabs-card ma-0 pa-0">
                                    <td class="tabs-card">
                                        <altWebCamPanel v-if="panel.panelType == 'altwebcam'" align="center" justify="center" :passedObject="panel.altWebCamParams" class="tabs-card pa-0 ma-0" :style="'background-color:' + getDWCPanelBGColor(panel.panelBGColor, panel.panelUseDWCThemeBGColor) + ' !important'"></altWebCamPanel>
                                        <BtnCmdWebPanel v-if="panel.panelType == 'remSrc'" align="center" justify="center" :passedObject="panel.altWebCamParams" class="tabs-card pa-0 ma-0"></BtnCmdWebPanel>
                                        <BtnCmdMMPanel v-if="panel.panelType == 'mmValue' || panel.panelType == 'txtLabel'" :key="'mmV' + panel.panelMMPrefix + panel.panelID + panel.panelMMPath" align="center" justify="center" :passedObject="panel" class="tabs-card pa-0 ma-0" style="height: 100%; width: 100%"></BtnCmdMMPanel>                                     
                                    </td>
                                </v-row>
                            </v-card>
                        </vue-draggable-resizable>
                        <vue-draggable-resizable v-for="(btn) in getTabBtns(passedObject.customPanelID)" :z="getCustPanZidx(btn.btnZIndex)" :key="'btn' + btn.btnID + btn.autoSize" :parent="true" :w="btn.btnWsize" :h="btn.btnHsize" class="ma-0 pa-0" :x="btn.btnXpos" :y="btn.btnYpos" :resizable="false" :draggable="false">
                            <v-card align="center" justify="center" style="height: 98%; width: 98%" class="ma-0 pa-0" :key="'btnCard' + btn.btnID + btn.autoSize + btn.btnWsize + btn.btnHsize + btn.btnXpos + btn.btnYpos">
                                <v-row align="center" justify="center" class="tabs-card ma-0 pa-0">
                                    <td class="tabs-card ma-0 pa-0" align="center" justify="center">
                                        <!--tooltip buttons-->
                                        <div v-if="btn.btnGroupIdx==passedObject.customPanelID && !btn.autoSize && btn.btnHoverText.length>0 && btn.btnType != 'vInput'" class="ma-0 pa-0" style="height: 100%; width: 100%" align="center" justify="center">
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
                                        <div v-if="btn.btnGroupIdx==passedObject.customPanelID && btn.autoSize && btn.btnHoverText.length>0 && btn.btnType != 'vInput'">
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
                                        <div v-if="btn.btnGroupIdx==passedObject.customPanelID && !btn.autoSize && btn.btnHoverText.length==0 && btn.btnType != 'vInput'" class="ma-0 pa-0" style="height: 100%; width: 100%" align="center" justify="center">
                                            <v-btn v-if="!btn.autoSize" block style="height: 100%; width: 100%" :color="btn.btnColour" :elevation="1" :disabled="chkJobEnabled(btn)" @click="onBtnClick($event, btn)">
                                                <span v-if="btn.btnIcon"><v-icon class="mr-1">{{ btn.btnIcon }}</v-icon>{{ btn.btnLabel }}</span>
                                                <span v-if="!btn.btnIcon">{{ btn.btnLabel }}</span>
                                            </v-btn>
                                        </div>
                                        <div v-if="btn.btnGroupIdx==passedObject.customPanelID && btn.autoSize && btn.btnHoverText.length==0 && btn.btnType != 'vInput'">
                                            <v-btn v-if="btn.autoSize" :color="btn.btnColour" :elevation="1" :disabled="chkJobEnabled(btn)" @click="onBtnClick($event, btn)">
                                                <span v-if="btn.btnIcon"><v-icon class="mr-1">{{ btn.btnIcon }}</v-icon>{{ btn.btnLabel }}</span>
                                                <span v-if="!btn.btnIcon">{{ btn.btnLabel }}</span>
                                            </v-btn>
                                        </div>
                                        <!--Input Buttons (yes I know they are not technically buttons, I'm just re-using existing code in a different way) -->
                                        <!--tooltip input buttons-->
                                        <div v-if="btn.btnGroupIdx==passedObject.customPanelID  && !btn.autoSize && btn.btnHoverText.length>0 && btn.btnType == 'vInput'" class="ma-0 pa-0" style="height: 100%; width: 100%" align="center" justify="center">
                                            <v-card flat align="center" justify="center" :key="btn.inputLastVal + btn.btnID + btn.autoSize + btn.btnWsize + btn.btnHsize + btn.btnXpos + btn.btnYpos">
                                            <v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field flat solo dense hide-details :style="'height :' + btn.btnHsize +'px'" align="center" justify="center" :prefix="btn.btnLabel" :key="btn.inputLastVal + btn.btnID + btn.autoSize + btn.btnWsize + btn.btnHsize + btn.btnXpos + btn.btnYpos" :type="btn.inputType" :clearable="btn.inputEnableClear" :suffix="btn.inputPostfixText" :value="getCurrGVarVal(btn.btnActionData)" v-if="!btn.autoSize" block style="height: 100%; width: 100%" v-bind="attrs" v-on="on" :background-color="btn.btnColour" :elevation="1" :disabled="chkJobEnabled(btn)" @change="setGVarVal(btn, $event)">
                                                    </v-text-field>
                                                </template>
                                                <span >{{ btn.btnHoverText }}</span>
                                            </v-tooltip>
                                            </v-card>
                                        </div>
                                        <div v-if="btn.btnGroupIdx==passedObject.customPanelID && btn.autoSize && btn.btnHoverText.length>0 && btn.btnType == 'vInput'">
                                            <v-card flat align="center" justify="center" :key="btn.inputLastVal + btn.btnID + btn.autoSize + btn.btnWsize + btn.btnHsize + btn.btnXpos + btn.btnYpos">
                                            <v-tooltip bottom :style="`position: absolute; z-index:${tab.lastZIndex+1}`">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-text-field flat solo dense hide-details :style="'height : 38px'" align="center" justify="center" :prefix="btn.btnLabel" :key="btn.inputLastVal + btn.btnID + btn.autoSize + btn.btnWsize + btn.btnHsize + btn.btnXpos + btn.btnYpos" :type="btn.inputType" :clearable="btn.inputEnableClear" :suffix="btn.inputPostfixText" :value="getCurrGVarVal(btn.btnActionData)" v-if="btn.autoSize" v-bind="attrs" v-on="on" :background-color="btn.btnColour" :elevation="1" :disabled="chkJobEnabled(btn)" @change="setGVarVal(btn, $event)">
                                                    </v-text-field>
                                                </template>
                                                <span >{{ btn.btnHoverText }}</span>
                                            </v-tooltip>
                                            </v-card>
                                        </div>
                                        <!--tooltip input buttons no hover-->
                                        <div v-if="btn.btnGroupIdx==passedObject.customPanelID  && !btn.autoSize && btn.btnHoverText.length==0 && btn.btnType == 'vInput'" class="ma-0 pa-0" style="height: 100%; width: 100%" align="center" justify="center">
                                            <v-card flat align="center" justify="center" :key="btn.inputLastVal + btn.btnID + btn.autoSize + btn.btnWsize + btn.btnHsize + btn.btnXpos + btn.btnYpos">
                                            <v-text-field flat solo dense hide-details :style="'height :' + btn.btnHsize +'px'" align="center" justify="center" :prefix="btn.btnLabel" :key="btn.inputLastVal + btn.btnID + btn.autoSize + btn.btnWsize + btn.btnHsize + btn.btnXpos + btn.btnYpos" :type="btn.inputType" :clearable="btn.inputEnableClear" :suffix="btn.inputPostfixText" :value="getCurrGVarVal(btn.btnActionData)" v-if="!btn.autoSize" block style="height: 100%; width: 100%" :background-color="btn.btnColour" :elevation="1" :disabled="chkJobEnabled(btn)" @change="setGVarVal(btn, $event)">
                                            </v-text-field>
                                            </v-card>
                                        </div>
                                        <div v-if="btn.btnGroupIdx==passedObject.customPanelID && btn.autoSize && btn.btnHoverText.length==0 && btn.btnType == 'vInput'">
                                            <v-card flat align="center" justify="center" :key="btn.inputLastVal + btn.btnID + btn.autoSize + btn.btnWsize + btn.btnHsize + btn.btnXpos + btn.btnYpos">
                                            <v-text-field flat solo dense hide-details :style="'height : 38px'" align="center" justify="center" :prefix="btn.btnLabel" :key="btn.inputLastVal + btn.btnID + btn.autoSize + btn.btnWsize + btn.btnHsize + btn.btnXpos + btn.btnYpos" :type="btn.inputType" :clearable="btn.inputEnableClear" :suffix="btn.inputPostfixText" :value="getCurrGVarVal(btn.btnActionData)" v-if="btn.autoSize" :background-color="btn.btnColour" :elevation="1" :disabled="chkJobEnabled(btn)" @change="setGVarVal(btn, $event)">
                                            </v-text-field>
                                            </v-card>
                                        </div>
                                    </td>
                                </v-row>
                            </v-card>
                        </vue-draggable-resizable>
                    </div>
                </v-col>
            </v-row>
            <confirm-dialog :shown.sync="showBtnConfDialog" title="Confirmation Required" :prompt="currBtnPromptTxt" @confirmed="onBtnConf()"></confirm-dialog>
        </v-container>
    </v-card>
</template>

<script>
    import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
    import { isPrinting, isPaused } from '../../store/machine/modelEnums.js';
    import altWebCamPanel from './altWebCamPanel.vue';
    import VueDraggableResizable from 'vue-draggable-resizable';
    import BtnCmdWebPanel from './BtnCmdWebPanel.vue';
    import BtnCmdMMPanel from './BtnCmdMMPanel.vue';
    import BtnCmdDataFunctions from './BtnCmdDataFunctions.js';
    import BtnCmdCustPanelBtnActionFunctions from './BtnCmdCustPanelBtnActionFunctions.js';
    import Path from '../../utils/path.js';

    export default {
        components: {
            altWebCamPanel,
            VueDraggableResizable,
            BtnCmdWebPanel,
            BtnCmdMMPanel
        },
        props: {
            passedObject: {
                type: Object
            },
            mainData: {
                type: Object
            }
        },
        computed: {
            ...mapState('machine/model', {
                status: state => state.state.status,
                macrosDirectory: state => state.directories.macros,
                systemDirectory: state => state.directories.system
            }),
            ...mapGetters('machine/model', ['jobProgress']),
            ...mapState('machine/settings', ['codes']),
            ...mapState({
                darkTheme: state => state.settings.darkTheme
            }),
            isPrinting() { return isPrinting(this.status); },
            isPaused() { return isPaused(this.status); },
            eventStatusText() { return this.status; },
            mobileActive() {
                if(this.$vuetify.breakpoint.smAndDown){
                    return true;
                }else {
                    return false;
                }
            },
            getTabs(){
                return this.btnCmd.tabs.filter(item => item.embedTab === true);
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
                directory: Path.macros                
            }
        },
        methods: {
            ...mapActions('machine', ['sendCode']),
            ...mapActions('machine', {machineDownload: 'download'}),
            ...mapActions('machine', ['upload']),
            ...mapMutations('machine/settings', ['addCode', 'removeCode']),
            getTabBtns(tabID){
                var result = this.mainData.btns.filter(item => item.btnGroupIdx === tabID);
                // var result = tabID;
                return result;
            },
            getTabPanels(tabID){
                //need to change this to a case
                var result = this.mainData.panels.filter(item => item.tabID === tabID && item.panelType != "altwebcam" && item.panelType != "remSrc" && item.panelType != "mmValue" && item.panelType != "txtLabel");
                return result;
            },
            getTabPanelsEditable(tabID){
                //need to change this to a case
                var result = this.mainData.panels.filter(item => (item.tabID === tabID) && (item.panelType == "altwebcam" || item.panelType == "remSrc" || item.panelType == "mmValue" || item.panelType == "txtLabel"));
                return result;
            },
            chkJobEnabled(item){
                if(!item.btnEnableWhileJob && this.isPrinting){
                    return true;
                }else {
                    return false;
                }
            },
            getCustPanZidx(idxVal) {
                if(this.mobileActive && !this.editMode){
                    return null;
                }else {
                    return idxVal;
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
