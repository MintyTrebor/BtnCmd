<style>
    .custom-label-color .v-label {
        color: red;
        opacity: 1;
    }
</style>
<template>
    <v-dialog v-model="show" persistent max-width="600">
        <v-card class="pa-2" max-width="600" style="overflow-x: hidden;">
			<v-card-title>
                <v-toolbar dark dense>
                    <v-toolbar-title>BtnCmd Settings</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="validateData()">
                        Close
                    </v-btn>
                </v-toolbar>
                <v-alert style="position: absolute; z-index:99999;" :value="alertReqVal" type="error" transition="scale-transition">Required Values have not been entered!</v-alert>
            </v-card-title>
            <v-card-text>
                <v-form lazy-validation class="mx-2" ref="form">
                    <v-row dense>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Show Action Messages in Footer" v-model="passedObject.enableActionMsg"></v-switch></span>
                                </template>
                                <span>Enable to see any relevant information in the page footer following a button click.</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="showToggButt">
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Enable Top Panel Show/Hide button" v-model="passedObject.enableGC_SH_Btn" @change="!passedObject.enableGC_SH_Btn ? passedObject.defaultGC_Hidden = false : passedObject.defaultGC_Hidden = passedObject.defaultGC_Hidden"></v-switch></span>
                                </template>
                                <span>Enable Button to show hide the default DWC top panel</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="showToggButt">
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Hide Top Panel by default" v-model="passedObject.defaultGC_Hidden" @change="passedObject.defaultGC_Hidden ? passedObject.enableGC_SH_Btn = true : passedObject.enableGC_SH_Btn = passedObject.enableGC_SH_Btn"></v-switch></span>
                                </template>
                                <span>Hide the default DWC top panel by default</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="systemDSFVer">
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Enable SBC Commands" v-model="passedObject.enableSBCC" @change="cnfrmEnableSBCC()"></v-switch></span>
                                </template>
                                <span>SBC Commands require a python service to be installed on the SBC. </span>
                            </v-tooltip>
                            <confirm-dialog :shown.sync="confirmEnableSBCC" title="Confirm Enabling SBCC" :prompt="event2Text" @dismissed="passedObject.enableSBCC = false" @confirmed="triggerSBCCReload()"></confirm-dialog>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Enable AutoBackup" v-model="passedObject.enableAutoBackup"></v-switch></span>
                                </template>
                                <span>Automatically saves BtnCmd's configuration to a file when its changed. (Does not replace the manual backup/restore functions)</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row v-if="passedObject.enableAutoBackup" dense>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field class="custom-label-color" v-bind="attrs" v-on="on" label="Auto Backup file name*" @keydown.space.prevent v-model="passedObject.ABackupFileName" required placeholder="BtnCmdABMyPc"></v-text-field>
                                </template>
                                <span>Choose a unique filename per browser/device. The .json suffix will automatically be appended to the file name</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Enable Auto Load" v-model="passedObject.enableLaunchAtLoad" @change="passedObject.enableLaunchAtLoad ? passedObject.enableBounceAtLoad = false : passedObject.enableBounceAtLoad = passedObject.enableBounceAtLoad"></v-switch></span>
                                </template>
                                <span>Automatically Switch to BtnCmd on Start</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="6">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Enable AutoStart" v-model="passedObject.enableBounceAtLoad" @change="passedObject.enableBounceAtLoad ? passedObject.enableLaunchAtLoad = false : passedObject.enableLaunchAtLoad = passedObject.enableLaunchAtLoad"></v-switch></span>
                                </template>
                                <span>Launch BtnCmd on Start to begin chart data collection, then return to DWC Dashboard</span>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="6">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field class="custom-label-color" :disabled="!passedObject.enableBounceAtLoad" v-bind="attrs" v-on="on" label="Return Delay*" v-model="passedObject.bounceAtLoadDelay" required number></v-text-field>
                                </template>
                                <span>Load Delay before returning. To allow for slow browser/network/server processing</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="6">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Change Top Bar Color" v-model="passedObject.enableChangeTopBar" @change="doChangeColor()"></v-switch></span>
                                </template>
                                <span>Change the top bar color to aid in identification</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row v-if="passedObject.enableChangeTopBar" dense>
                        <v-col cols="12">
                            <div class="btnCmd-container"><v-color-picker class="ma-2" dot-size="30" v-model="passedObject.TopBarColor"></v-color-picker></div>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Enable MQTT" v-model="passedObject.enableMQTT"></v-switch></span>
                                </template>
                                <span>MQTT commands will only work with MQTT brokers using the websockets protocol. It does not support SSL/TLS. </span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row v-if="passedObject.enableMQTT" dense>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field class="custom-label-color" v-bind="attrs" v-on="on" label="MQTT Server*" v-model="passedObject.MQTTServer" required placeholder="mqtt://<broker addr>:<port>"></v-text-field>
                                </template>
                                <span>Normally mqtt://[address]:[port] (port is optional)</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row v-if="passedObject.enableMQTT" dense>
                        <v-col cols="12">
                            <v-text-field class="custom-label-color" label="MQTT Client ID*" v-model="passedObject.MQTTClientID" placeholder="BtnCmd" required></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row v-if="passedObject.enableMQTT" dense>
                        <v-col cols="12">
                            <v-text-field label="MQTT User Name" v-model="passedObject.MQTTUserName"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row v-if="passedObject.enableMQTT" dense>
                        <v-col cols="12">
                            <v-text-field label="MQTT Password" v-model="passedObject.MQTTPassword"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row v-if="passedObject.enableMQTT" dense>
                        <v-col cols="12">
                            <small>*indicates required field</small>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>


<script>
    'use strict'
    export default {
        props: {
            passedObject: {
                type: Object
            },
            value: Boolean,
            mobileActive: Boolean,
            systemDSFVer: Boolean,
            showBottomNavigation: Boolean           
        },
        computed: {
            show: {
                get () {
                    return this.value
                },
                set (value) {
                    this.$emit('input', value)
                }
            },
            showToggButt(){
                if(this.mobileActive && this.showBottomNavigation && this.$vuetify.breakpoint.smAndDown){
                    return false;
                }else if(this.mobileActive && !this.showBottomNavigation){
                    return false;
                }
                else{
                    return true;
                }
			},
            currTopBarCol(){
                return this.passedObject.TopBarColor
            }
		},
        data: function () {
            return {
                alertReqVal: false,
                confirmEnableEvents: false,
                confirmEnableSBCC: false,
                tmpPluginMinimumHeight: 0,
                eventText: "Event based monitoring relies on your browsers settings and the plugin being loaded in the window. If you run DWC in a browser tab, and DWC does not remain as the active tab then Event monitoring may fail. You sould not use event monitoring as part of any critical function. By clicking yes you are confirming that you understand and agree with the above statement.",
                event2Text: "SBC Command requires a Python Service to be running on the SBC. Please refer to the BtnCmd Wiki for more info. For security reasons it is not reccomended to use this feature if your SBC is exposed to the internet. This feature is for advanced users only - by clicking yes you are confirming that you understand and accept the risks of enabling this feature.",
            }
        },
        methods: {
            async sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            },
            async validateData() {
                if(this.enableAutoBackup && this.ABackupFileName.length < 1){
                    this.alertReqVal = true;
                    await this.sleep(2000);
                    this.alertReqVal = false;
                    return
                }
                if(!this.passedObject.enableMQTT){
                    this.passedObject.pluginMinimumHeight = this.tmpPluginMinimumHeight;
                    this.$emit('exit', true);
                    this.show = false;
                    return;
                }else if (this.passedObject.enableMQTT && this.passedObject.MQTTServer && this.passedObject.MQTTClientID) {
                    this.passedObject.pluginMinimumHeight = this.tmpPluginMinimumHeight;
                    this.$emit('exit', true);
                    this.show = false;
                    return;
                }
                this.alertReqVal = true;
                await this.sleep(2000);
                this.alertReqVal = false;
            },
            cnfrmEnableEvents(){
                if(this.passedObject.enableEvents) {
                    this.confirmEnableEvents = true;
                }
            },
            cnfrmEnableSBCC(){
                if(this.passedObject.enableSBCC) {
                    this.confirmEnableSBCC = true;
                }
            },
            triggerSBCCReload(){
                //tell the main window to reload the SBCC settings
                this.$emit('rldSBCCSet', true);                
            },
            doChangeColor(){
                let aptb = document.getElementsByClassName("v-app-bar")
                if(!this.passedObject.enableChangeTopBar || !this.passedObject.TopBarColor){
                    aptb[0].style.backgroundColor = "";
                }else{
                    aptb[0].style.backgroundColor = this.passedObject.TopBarColor;
                }
            }
        },
        mounted() {
            this.tmpPluginMinimumHeight = this.passedObject.pluginMinimumHeight;
        },
        watch:{
            currTopBarCol(){
                this.doChangeColor();
            }
        }
    }
</script>