<style>
    .container {
        display: flex;
        justify-content: center;
    }
    .custom-label-color .v-label {
        color: red;
        opacity: 1;
    }
</style>
<template>
    <v-dialog v-model="show" persistent max-width="600">
        <v-card style="overflow-x: hidden; position: relative; z-index: 99900">
			<v-card-title class="container">
				<v-toolbar dark dense>
                    <v-toolbar-title>Edit Button</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="validateData()">
                        Close
                    </v-btn>
                </v-toolbar>
                <v-alert style="position: absolute; z-index:99999;" :value="alertReqVal" type="error" transition="scale-transition">Required Values have not been entered!</v-alert>
			</v-card-title>
            <v-card-text>
                <v-form lazy-validation class="mx-2">
                    <v-row class="mx-2 my-n4" dense v-if="!enableSelects">
                        <v-col cols="12">
                            <v-radio-group v-model="passedObject.btnType" row required>
                                <v-subheader>Type:</v-subheader>
                                <v-radio v-for="type in radioItems" :key="'BtnT'+type.value" :label="type.text" :value="type.value"></v-radio>
                            </v-radio-group>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense v-if="enableSelects">
                        <v-col cols="12">
                            <v-select :items="radioItems" class="custom-label-color" item-text="text" item-value="value" label="Type*" required v-model="passedObject.btnType"></v-select>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense>
                        <v-col cols="12">
                            <v-text-field label="Label" v-model="passedObject.btnLabel"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense>
                        <v-col cols="12">
                            <v-text-field label="Hover Text" v-model="passedObject.btnHoverText"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-bind="attrs" v-on="on" label="Icon [mdi-#]" v-model="passedObject.btnIcon" placeholder="mdi-"></v-text-field>
                                </template>
                                <span>Material design icons from https://materialdesignicons.com/ (Format = mdi-[icon name])</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense v-if="!enableSelects && passedObject.btnType=='http'">
                        <v-col cols="12">
                            <v-radio-group v-model="passedObject.btnHttpType" row required>
                                <v-subheader>Http Type:</v-subheader>
                                <v-radio v-for="type in radioHttpItems" :key="'BtnHTTP'+type.value" :label="type.text" :value="type.value"></v-radio>
                            </v-radio-group>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense v-if="enableSelects && passedObject.btnType=='http'">
                        <v-col cols="12">
                            <v-select :items="radioHttpItems" class="custom-label-color" item-text="text" item-value="value" label="Http Type" required v-model="passedObject.btnHttpType"></v-select>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense v-if="!enableSelects && passedObject.btnType=='http' && passedObject.btnHttpType=='GET'">
                        <v-col cols="12">
                            <v-radio-group v-model="passedObject.btnHttpContType" row required>
                                <v-subheader>Get Type:</v-subheader>
                                <v-radio v-for="type in radioGetItems" :key="'BtnGT'+type.value" :label="type.text" :value="type.value"></v-radio>
                            </v-radio-group>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense v-if="enableSelects && passedObject.btnType=='http' && passedObject.btnHttpType=='GET'">
                        <v-col cols="12">
                            <v-select :items="radioGetItems" class="custom-label-color" item-text="text" item-value="value" label="Get Type*" required v-model="passedObject.btnHttpContType"></v-select>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense v-if="passedObject.btnType=='http' && passedObject.btnHttpType=='POST'">
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-bind="attrs" v-on="on" class="custom-label-color" required label="Post Data*" v-model="passedObject.btnHttpData" placeholder="{}"></v-text-field>
                                </template>
                                <span>Data to send with Post</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field class="custom-label-color" v-bind="attrs" v-on="on" :label="actionLabel()" v-model="passedObject.btnActionData"></v-text-field>
                                </template>
                                <span v-if="passedObject.btnType=='http'">Enter GET url. e.g http://[address]/params . </span>
                                <span v-if="passedObject.btnType=='Macro'">Enter the full macro filename [name.g].</span>
                                <span v-if="passedObject.btnType=='MQTT'">Enter the message text to send</span>
                                <span v-if="passedObject.btnType=='gcode'">Enter the gcode command to send</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense v-if="passedObject.btnType == 'MQTT'">
                        <v-col cols="12">
                            <v-text-field class="custom-label-color" label="MQTT Topic*" v-model="passedObject.btnTopicData" required></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Enabled In Job" v-model="passedObject.btnEnableWhileJob"></v-switch></span>
                                </template>
                                <span>Allow button to operate while a Job is active.</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense>
                        <v-col cols="12">
                            <div class="container"><v-color-picker class="ma-2" dot-size="30" v-model="passedObject.btnColour"></v-color-picker></div>
                        </v-col>
                    </v-row>
                    <small>*indicates required field. You must provide an icon and/or label.</small>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>


<script>
    export default {
        props: {
            value: Boolean,
            passedObject: {
                type: Object
            },
            bMQTT: Boolean,
            enableSelects: Boolean
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
            typeItems() {
                return [
                    {text: 'Macro', value: 'Macro', disabled: false},
                    {text: 'http', value: 'http', disabled: false},
                    {text: 'gcode', value: 'gcode', disabled: false},
                    {text: 'MQTT', value: 'MQTT', disabled: !this.bMQTT}
                ]
            },
            radioItems() {
                return this.typeItems.filter(item => {return item.disabled === false});
            },
            radioHttpItems() {
                return [
                    {text: 'Get', value: 'GET', disabled: false},
                    {text: 'Post', value: 'POST', disabled: false}
                ]
            },
            radioGetItems() {
                return [
                    {text: 'Text', value: 'text', disabled: false},
                    {text: 'JSON', value: 'json', disabled: false}
                ]
            }
        },
        data: function () {
            return {
                alertReqVal: false
            }
        },
        methods: {
            async sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            },
            actionLabel() {
                if (this.passedObject.btnType == "Macro") {return "Macro Name*";}
                if (this.passedObject.btnType == "http") {return "URL*";}
                if (this.passedObject.btnType == "MQTT") {return "MQTT MSG*";}
                if (this.passedObject.btnType == "gcode") {return "gcode Command*";}
            },
            async validateData() {
                if (this.passedObject.btnActionData) {
                    if (this.passedObject.btnType == "MQTT" && !this.passedObject.btnTopicData){
                        this.alertReqVal = true;
                        await this.sleep(2000);
                        this.alertReqVal = false;
                        return;
                    }else if(!this.passedObject.btnLabel && !this.passedObject.btnIcon){
                        this.alertReqVal = true;
                        await this.sleep(2000);
                        this.alertReqVal = false;
                        return;
                    } 
                    this.show = false;
                    return;
                }
                this.alertReqVal = true;
                await this.sleep(2000);
                this.alertReqVal = false;
            }
        }

    }
</script>
