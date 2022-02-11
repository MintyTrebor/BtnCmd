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
                    <v-row dense>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Enable Selections in Settings" v-model="passedObject.enableSelects"></v-switch></span>
                                </template>
                                <span>Use selections instead of radio buttons in settings windows</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="!mobileActive">
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Enable Events" v-model="passedObject.enableEvents" @change="cnfrmEnableEvents()"></v-switch></span>
                                </template>
                                <span>Enable plugin Event based monitoring</span>
                            </v-tooltip>
                            <confirm-dialog :shown.sync="confirmEnableEvents" title="Confirm Enabling Events" :prompt="eventText" @dismissed="passedObject.enableEvents = false"></confirm-dialog>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="showToggButt">
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Enable Top Panel Show/Hide button" v-model="passedObject.enableGC_SH_Btn" @change="if(!passedObject.enableGC_SH_Btn){passedObject.defaultGC_Hidden = false}"></v-switch></span>
                                </template>
                                <span>Enable Button to show hide the default DWC top panel</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="showToggButt">
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Hide Top Panel by default" v-model="passedObject.defaultGC_Hidden" @change="if(passedObject.defaultGC_Hidden){passedObject.enableGC_SH_Btn = true}"></v-switch></span>
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
                                    <v-text-field class="custom-label-color" v-bind="attrs" v-on="on" label="Auto Backup file name*" v-model="passedObject.ABackupFileName" required placeholder="BtnCmdABMyPc"></v-text-field>
                                </template>
                                <span>Choose a unique filename per browser/device. The .json suffix will automatically be appended to the file name</span>
                            </v-tooltip>
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
            }          
        },
        mounted() {
            this.tmpPluginMinimumHeight = this.passedObject.pluginMinimumHeight;
        }
    }
</script>