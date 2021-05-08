<template>
    <v-card class="tab-item-wrapper">
        <v-container fluid class="pa-0 ma-0 tabs-default">
            <!-- <v-row mt-0><v-col><span class="text-caption">v-model = {{ mainData }}</span></v-col></v-row> -->
            <v-row class="pa-0 ma-0 tabs-default">
                <v-col cols="12">
                    <!--this div is here to constrain draggle items within the window-->
                    <div class="tabs-card" v-if="passedObject.panelZIndex">
                        <vue-draggable-resizable v-for="(btn) in getTabBtns(passedObject.customPanelID)" :key="'btn' + btn.btnID + btn.autoSize" :parent="true" :w="btn.btnWsize" :h="btn.btnHsize" class="ma-0 pa-0" :x="btn.btnXpos" :y="btn.btnYpos" :resizable="false" :draggable="false">
                            <v-card style="height: 98%; width: 98%" class="ma-0 pa-0" :key="'btnCard' + btn.btnID + btn.autoSize">
                                <v-row align="center" justify="center" class="tabs-card ma-0 pa-0">
                                    <div v-if="btn.btnGroupIdx==passedObject.customPanelID && !btn.autoSize" class="ma-0 pa-0" style="height: 100%; width: 100%" align="center" justify="center">
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
                                    <div v-if="btn.btnGroupIdx==passedObject.customPanelID && btn.autoSize">
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
                                </v-row>
                            </v-card>
                        </vue-draggable-resizable>
                        <vue-draggable-resizable v-for="(panel) in getTabPanels(passedObject.customPanelID)" :key="'dwcpan'+panel.panelID" :parent="true" class="ma-0 pa-0" :w="panel.panelWSize" :h="panel.panelHSize" :x="panel.panelXpos" :y="panel.panelYpos" :resizable="false" :draggable="false" :drag-handle="'.drag-handle'">
                            <v-card align="center" justify="center" class="tabs-card ma-0 pa-0">
                                <v-row dense  align="center" justify="center" class="tabs-card ma-0 pa-0">
                                    <td class="tabs-card">
                                        <job-info-panel v-if="panel.panelType == 'jobinfo'" lign="center" class="tabs-card pa-0 ma-0"></job-info-panel>
                                        <layer-chart v-if="panel.panelType == 'layerchart'" min-height="180px" align="center" class="tabs-card d-flex pa-0 ma-0"></layer-chart>
                                        <job-estimations-panel v-if="panel.panelType == 'jobestimates'" align="center" class="tabs-card pa-0 ma-0"></job-estimations-panel>
                                        <job-data-panel v-if="panel.panelType == 'collectdata'" align="center" class="tabs-card pa-0 ma-0"></job-data-panel>
                                        <fans-panel v-if="panel.panelType == 'fans'" align="center" class="tabs-card pa-0 ma-0"></fans-panel>
                                        <speed-factor-panel v-if="panel.panelType == 'speed'" align="center" class="tabs-card pa-0 ma-0"></speed-factor-panel>
                                    </td>
                                </v-row>
                            </v-card>
                        </vue-draggable-resizable>
                        <vue-draggable-resizable v-for="(panel) in getTabCamPanels(passedObject.customPanelID)" :key="'campan'+panel.panelID" :parent="true" class="ma-0 pa-0" :w="panel.panelWSize" :h="panel.panelHSize" :x="panel.panelXpos" :y="panel.panelYpos" :resizable="false" :draggable="false" :drag-handle="'.drag-handle'">
                            <v-card align="center" justify="center" class="tabs-card ma-0 pa-0">
                                <v-row dense align="center" justify="center" class="tabs-card ma-0 pa-0">
                                    <td class="tabs-card">
                                        <altWebCamPanel v-if="panel.panelType == 'altwebcam'" align="center" justify="center" :passedObject="panel.altWebCamParams" class="tabs-card pa-0 ma-0"></altWebCamPanel>
                                        <BtnCmdWebPanel v-if="panel.panelType == 'remSrc'" align="center" justify="center" :passedObject="panel.altWebCamParams" class="tabs-card pa-0 ma-0"></BtnCmdWebPanel>
                                        <BtnCmdMMPanel v-if="panel.panelType == 'mmValue'" :key="'mmV' + panel.panelMMPrefix + panel.panelID + panel.panelMMPath" align="center" justify="center" :passedObject="panel" class="tabs-card pa-0 ma-0"></BtnCmdMMPanel>
                                        <webcam-panel v-if="panel.panelType == 'webcam'" align="center" justify="center" class="tabs-card pa-0 ma-0"></webcam-panel>
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
    import BtnCmdBtnActionFunctions from './BtnCmdBtnActionFunctions.js';
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
            isPrinting() { return isPrinting(this.status); },
            isPaused() { return isPaused(this.status); },
            eventStatusText() { return this.status; },
            mobileActive() {
                if(!this.$vuetify.breakpoint.mdAndUp){
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
            BtnCmdBtnActionFunctions
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
                var result = this.mainData.panels.filter(item => item.tabID === tabID && item.panelType != "webcam" && item.panelType != "altwebcam" && item.panelType != "remSrc" && item.panelType != "mmValue");
                return result;
            },
            getTabCamPanels(tabID){
                //need to change this to a case
                var result = this.mainData.panels.filter(item => (item.tabID === tabID) && (item.panelType == "webcam" || item.panelType == "altwebcam" || item.panelType == "remSrc" || item.panelType == "mmValue"));
                return result;
            },
            chkJobEnabled(item){
			if(!item.btnEnableWhileJob && this.isPrinting){
				return true;
			}else {
				return false;
			}
		},
        }
    }
</script>
