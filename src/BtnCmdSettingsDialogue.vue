<template>
    <v-dialog v-model="show" persistent max-width="400">
        <v-row align="center" justify="center">
                <v-card>
                    <v-card-title>
                        <span class="headline">Edit Button</span>
                    </v-card-title>
                    <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Label" v-model="passedObject.btnLabel"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Hover Text" v-model="passedObject.btnHoverText"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <div>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-bind="attrs" v-on="on" label="Icon [mdi-#]" v-model="passedObject.btnIcon" placeholder="mdi-"></v-text-field>
                                        </template>
                                        <span>Material design icons from https://materialdesignicons.com/ (Format = mdi-[icon name])</span>
                                    </v-tooltip>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-select :items="typeItems" label="Type*" required v-model="passedObject.btnType"></v-select>
                            </v-col>  
                        </v-row>
                        <v-row>                         
                            <v-col cols="12">
                                <div>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-bind="attrs" v-on="on" :label="actionLabel()" required v-model="passedObject.btnActionData"></v-text-field>
                                        </template>
                                        <span v-if="passedObject.btnType=='http'">Enter GET url. e.g http://[address]/params . </span>
                                        <span v-if="passedObject.btnType=='Macro'">Enter the full macro filename [name.g].</span>
                                        <span v-if="passedObject.btnType=='MQTT'">Enter the message text to send</span>
                                    </v-tooltip>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" v-if="passedObject.btnType=='MQTT'">
                                <v-text-field label="MQTT Topic*" v-model="passedObject.btnTopicData"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row v-if="passedObject.btnType != 'Macro'">
                            <v-col cols="12">
                                <div>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <span v-bind="attrs" v-on="on"><v-checkbox label="Enabled In Job" v-model="passedObject.btnEnableWhileJob"></v-checkbox></span>
                                        </template>
                                        <span>Allow button to operate while a Job is active. (Note: All buttons of type "Macro" will be disabled while a Job is Active.)</span>
                                    </v-tooltip>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-card>
									<v-card-actions class="justify-center">
                                        <v-color-picker class="ma-2" dot-size="30" v-model="passedObject.btnColour"></v-color-picker>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-card-actions>
                        <small>*indicates required field</small>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="validateData()">
                            Close
                        </v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-row>
    </v-dialog>
</template>


<script>
    export default {
        props: {
            value: Boolean,
            passedObject: {
                type: Object
            },
            bMQTT: Boolean
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
                typeItems: [
                    {text: 'Macro', value: 'Macro', disabled: false},
                    {text: 'http', value: 'http', disabled: false},
                    {text: 'MQTT', value: 'MQTT', disabled: !this.bMQTT}
                ]
            }
        },
        methods: {
            actionLabel() {
                if (this.passedObject.btnType == "Macro") {return "Macro Name*";}
                if (this.passedObject.btnType == "http") {return "URL*";}
                if (this.passedObject.btnType == "MQTT") {return "MQTT MSG*";}
            },
            validateData() {
                if (this.passedObject.btnLabel && this.passedObject.btnActionData) {
                    if (this.passedObject.btnType == "MQTT" && !this.passedObject.btnTopicData){
                        return;
                    }
                    this.show = false;
                    return;
                }
            }
        }

    }
</script>