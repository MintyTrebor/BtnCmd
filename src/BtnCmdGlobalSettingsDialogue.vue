<template>
    <v-dialog v-model="show" persistent max-width="360">
        <v-row align="center" justify="center">
            <v-card>
                <v-card-title >
                    <span class="headline">BtnCmd Plugin Settings</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <div>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <span v-bind="attrs" v-on="on"><v-checkbox label="Show Action Messages in Footer" v-model="passedObject.enableActionMsg"></v-checkbox></span>
                                        </template>
                                        <span>Enable to see any relevant information in the page footer following a button click.</span>
                                    </v-tooltip>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <div>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <span v-bind="attrs" v-on="on"><v-checkbox label="Enable MQTT" v-model="passedObject.enableMQTT"></v-checkbox></span>
                                        </template>
                                        <span>MQTT commands will only work with MQTT brokers using the websockets protocol. It does not support SSL/TLS. </span>
                                    </v-tooltip>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" v-if="passedObject.enableMQTT">
                                <div>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-bind="attrs" v-on="on" label="MQTT Server*" v-model="passedObject.MQTTServer" placeholder="mqtt://<broker addr>:<port>"></v-text-field>
                                        </template>
                                        <span>Normally mqtt://[address]:[port] (port is optional)</span>
                                    </v-tooltip>
                                </div>
                            </v-col>
                        </v-row>
                        <!--<v-row>
                            <v-col cols="12" v-if="passedObject.enableMQTT">
                                <v-text-field label="MQTT Port*" v-model="passedObject.MQTTPort" placeholder="1883"></v-text-field>
                            </v-col>
                        </v-row>-->
                        <v-row>
                            <v-col cols="12" v-if="passedObject.enableMQTT">
                                <v-text-field label="MQTT Client ID*" v-model="passedObject.MQTTClientID" placeholder="BtnCmd"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" v-if="passedObject.enableMQTT">
                                <v-text-field label="MQTT User Name" v-model="passedObject.MQTTUserName"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" v-if="passedObject.enableMQTT">
                                <v-text-field label="MQTT Password" v-model="passedObject.MQTTPassword"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <div><span> </span></div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <div><span> </span></div>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-card-actions>
                                <small>*indicates required field</small>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="validateData()">
                                    Close
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-row>
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
        methods: {
            validateData() {
                if(!this.passedObject.enableMQTT){
                    this.$emit('exit', true)
                    this.show = false;
                    return;
                }else if (this.passedObject.enableMQTT && this.passedObject.MQTTServer && this.passedObject.MQTTClientID) {
                    this.$emit('exit', true)
                    this.show = false;
                    return;
                }
                
            }
        }
    }
</script>