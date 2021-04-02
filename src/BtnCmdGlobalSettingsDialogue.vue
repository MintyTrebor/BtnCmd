<style>
    .container {
        display: flex;
        justify-content: center;
        overflow-x: hidden;
    }
    .custom-label-color .v-label {
        color: red;
        opacity: 1;
    }
</style>
<template>
    <v-dialog v-model="show" persistent max-width="600">
        <v-card class="pa-2" max-width="600">
			<v-card-title class="container">
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
                                    <span v-bind="attrs" v-on="on"><v-checkbox label="Show Action Messages in Footer" v-model="passedObject.enableActionMsg"></v-checkbox></span>
                                </template>
                                <span>Enable to see any relevant information in the page footer following a button click.</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-checkbox label="Enable Selections" v-model="passedObject.enableSelects"></v-checkbox></span>
                                </template>
                                <span>Enable dropdown selections instead of radio buttons in settings windows</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-checkbox label="Enable Events" v-model="passedObject.enableEvents" @click="cnfrmEnableEvents()"></v-checkbox></span>
                                </template>
                                <span>Enable plugin Event based monitoring</span>
                            </v-tooltip>
                            <confirm-dialog :shown.sync="confirmEnableEvents" title="Confirm Enabling Events" :prompt="eventText" @dismissed="passedObject.enableEvents = false"></confirm-dialog>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-checkbox label="Enable MQTT" v-model="passedObject.enableMQTT"></v-checkbox></span>
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
            value: Boolean,
            passedObject: {
                type: Object
            }
        },
        computed: {
            show: {
                get () {
                    return this.value
                },
                set (value) {
                    this.$emit('input', value)
                }
            }
        },
        data: function () {
            return {
                alertReqVal: false,
                confirmEnableEvents: false,
                eventText: "Event based monitoring relies on your browsers settings and the plugin being loaded in the window. If you run DWC in a browser tab, and DWC does not remain as the active tab then Event monitoring may fail. You sould not use event monitoring as part of any critical function. By clicking yes you are confirming that you understand and agree with the above statement.",
            }
        },
        methods: {
            async sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            },
            async validateData() {
                if(!this.passedObject.enableMQTT){
                    this.$emit('exit', true)
                    this.show = false;
                    return;
                }else if (this.passedObject.enableMQTT && this.passedObject.MQTTServer && this.passedObject.MQTTClientID) {
                    this.$emit('exit', true)
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
            }
            //Browser Notifications cannot work on non https sites - left here incase this changes
            /*requestAndShowPermission() {
                Notification.requestPermission(function (permission) {
                    if (permission === "granted") {
                            this.showNotification();
                    }
                });
            },
            showNotification() {
                var title = "BtnCmd Alert";
                var icon = "image-url"
                var body = "Browser Notifications have been enabled!";
                var notification = new Notification(title, { body, icon });
                notification.onclick = () => { 
                        notification.close();
                }
            },*/
        }
    }
</script>
