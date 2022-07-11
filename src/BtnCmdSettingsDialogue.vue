<style>
    .btnCmd-container {
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
        <v-card style="overflow-x: hidden;">
			<v-card-title>
				<v-toolbar dark dense>
                    <v-toolbar-title>Edit Button</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="validateData()">
                        Close
                    </v-btn>
                </v-toolbar>
                <v-alert style="position: absolute; z-index:99999;" :value="alertReqVal" type="error" transition="scale-transition">Required Values have not been entered!</v-alert>
                <v-alert style="position: absolute; z-index:99999;" :value="alertBadJSON" type="error" transition="scale-transition">Your Post Data is not valid JSON</v-alert>
			</v-card-title>
            <v-card-text>
                <!-- <v-row mt-0><v-col><span class="text-caption">debug value = {{ SBCCCombinedJson }}</span></v-col></v-row> -->
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
                        <v-col cols="11">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-bind="attrs" v-on="on" label="Icon [mdi-*]" v-model="passedObject.btnIcon" placeholder="mdi-"></v-text-field>
                                </template>
                                <span>Material design icon name (Format = mdi-[icon name])</span>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="1">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <a v-bind="attrs" v-on="on" href="https://materialdesignicons.com/" target="_blank">
                                        <v-icon v-if="passedObject.btnIcon.length>0" class="mr-1 pt-3">{{ passedObject.btnIcon }}</v-icon>
                                        <v-icon v-if="passedObject.btnIcon.length==0" class="mr-1 pt-3">mdi-cog</v-icon>
                                    </a>
                                </template>
                                <span>Go To https://materialdesignicons.com</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense v-if="!enableSelects && passedObject.btnType=='http'">
                        <v-col cols="12">
                            <v-radio-group v-model="passedObject.btnHttpType" row required :key="'htype' + passedObject.btnType + passedObject.btnID">
                                <v-subheader>Http Type:</v-subheader>
                                <v-radio v-for="type in radioHttpItems" :key="'BtnHTTP'+type.value" :label="type.text" :value="type.value"></v-radio>
                            </v-radio-group>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense v-if="enableSelects && passedObject.btnType=='http'">
                        <v-col cols="12">
                            <v-select :items="radioHttpItems" class="custom-label-color" :key="'htype' + passedObject.btnType + passedObject.btnID" item-text="text" item-value="value" label="Http Type" required v-model="passedObject.btnHttpType"></v-select>
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
                            <v-select :items="radioGetItems" :key="'gtype' + passedObject.btnType + passedObject.btnID" class="custom-label-color" item-text="text" item-value="value" label="Get Type*" required v-model="passedObject.btnHttpContType"></v-select>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense v-if="passedObject.btnType=='http' && passedObject.btnHttpType=='POST'">
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field ref="httpPostData" v-bind="attrs" v-on="on" :key="'pdata' + passedObject.btnType + passedObject.btnID" class="custom-label-color" required label="Post Data*" v-model="passedObject.btnHttpData" placeholder="{}" @blur="valJSONTxt()"></v-text-field>
                                </template>
                                <span>Data to send with Post</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense v-if="passedObject.btnType!='SBCC'" :key="'adr' + passedObject.btnType + passedObject.btnID">
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field class="custom-label-color" :key="'ad' + passedObject.btnType + passedObject.btnID" v-bind="attrs" v-on="on" :label="actionLabel()" v-model="passedObject.btnActionData"></v-text-field>
                                </template>
                                <span>{{ actionHover() }}</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense v-if="enableSelects && passedObject.btnType == 'SBCC'" :key="'sbcctype' + passedObject.btnType + passedObject.btnID">
                        <v-col cols="12">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-select v-bind="attrs" v-on="on" :items="SBCCmdListItems" item-text="text" item-value="value" label="Select Command" value="value" required v-model="passedObject.btnActionData" @change="setSBCCValues($event)"></v-select>
                                </template>
                                <span>Select Command</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense v-if="!enableSelects && passedObject.btnType == 'SBCC'" :key="'sbcctyper' + passedObject.btnType + passedObject.btnID">
                        <v-col cols="12">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-radio-group v-bind="attrs" v-on="on" label="Select Command:" v-model="passedObject.btnActionData" row required>
                                        <v-radio v-for="type in SBCCmdListItems" :key="'SBCC'+type.value" :label="type.text" :value="type.value" @change="setSBCCValues(type.value)"></v-radio>
                                    </v-radio-group>
                                </template>
                                <span>Select Command</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense v-if="passedObject.btnType == 'window'">
                        <v-col>
                            <v-text-field class="custom-label-color" label="Window Height*" v-model="passedObject.btnWinHSize" required placeholder="200"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field class="custom-label-color" label="Window Width*" v-model="passedObject.btnWinWSize" required placeholder="200"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense v-if="passedObject.btnType == 'MQTT'">
                        <v-col cols="12">
                            <v-text-field class="custom-label-color" label="MQTT Topic*" v-model="passedObject.btnTopicData" required></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense>
                        <v-col>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Enabled In Job" v-model="passedObject.btnEnableWhileJob"></v-switch></span>
                                </template>
                                <span>Allow button to operate while a Job is active.</span>
                            </v-tooltip>
                        </v-col>
                        <v-col>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Require Confirmation" v-model="passedObject.btnReqConf"></v-switch></span>
                                </template>
                                <span>Prompt User for confirmation before button action is undertaken</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense v-if="passedObject.btnReqConf">
                        <v-col cols="12">
                            <v-text-field class="custom-label-color" label="Confirmation Text*" v-model="passedObject.btnConfText" required placeholder="Are You Sure?"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense v-if="passedObject.btnType=='http' || passedObject.btnType == 'SBCC'">
                        <v-col cols="6" class="ma-0 pa-0">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Show Result" v-model="passedObject.btnSBCCShowResult"></v-switch></span>
                                </template>
                                <span>Show a msgbox with the action results</span>
                            </v-tooltip>    
                        </v-col>
                    </v-row>
                    <v-row class="mx-2 my-n4" dense>
                        <v-col cols="12">
                            <div class="btnCmd-container"><v-color-picker class="ma-2" dot-size="30" v-model="passedObject.btnColour"></v-color-picker></div>
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
            enableSelects: Boolean,
            enableSBCC: Boolean,
            SBCCCombinedJson: Array,
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
                    {text: 'MQTT', value: 'MQTT', disabled: !this.bMQTT},
                    {text: 'Window', value: 'window', disabled: false},
                    {text: 'SBC Cmd', value: 'SBCC', disabled: !this.enableSBCC}
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
            },
            SBCCmdListItems() {
                var SBCCItem = null;
                var tmpItems = [];
                var tmpItem = null;
                for (SBCCItem in this.SBCCCombinedJson) {
                    tmpItem = {
                        text: this.SBCCCombinedJson[SBCCItem].SBCC_Cmd_Name,
                        value: this.SBCCCombinedJson[SBCCItem].SBCC_Cmd_ID
                    };
                    tmpItems.push(tmpItem);
                }
                return tmpItems;
            }
        },
        data: function () {
            return {
                alertReqVal: false,
                alertBadJSON: false
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
                if (this.passedObject.btnType == "window") {return "PopUp URL*";}
            },
            actionHover() {
                if (this.passedObject.btnType == "Macro") {return "Enter the full macro filename [name.g]";}
                if (this.passedObject.btnType == "http") {return "Enter GET url. e.g http://[address]/params";}
                if (this.passedObject.btnType == "MQTT") {return "Enter the message text to send";}
                if (this.passedObject.btnType == "gcode") {return "Enter the gcode command to send";}
                if (this.passedObject.btnType == "window") {return "Enter the Window PopUp URL*";}
            },
            replaceModelKeys(textToCheckStr){
                //this is used to remove global variables so json parse check can work
                if(textToCheckStr){
                    var tmpStr = textToCheckStr;
                    var tmpArr = tmpStr.match(/#omv\[(.*?)\]/g);
                    var i = 0;
                    var tmpMMVal = null;
                    for(i in tmpArr){
                        let tmpMatchStr = tmpArr[i];
                        let tmpMMKey = tmpArr[i].slice(5);
                        tmpMMKey = tmpMMKey.slice(0, (tmpMMKey.length -1));
                        tmpMMVal = 0;
                        tmpStr = tmpStr.replace(tmpMatchStr, tmpMMVal)				
                    }
                    return tmpStr;
                }
                return "";
            },
            async valJSONTxt(){
                try{
                    JSON.parse(this.replaceModelKeys(this.passedObject.btnHttpData))
                }catch{
                    this.alertBadJSON = true;
                    await this.sleep(2000);
                    this.alertBadJSON = false;
                    //this.$refs.httpPostData.$el.focus()
                }
                return;
            },
            async validateData() {
                if (this.passedObject.btnActionData) {
                    if (this.passedObject.btnType == "MQTT" && !this.passedObject.btnTopicData){
                        this.alertReqVal = true;
                        await this.sleep(2000);
                        this.alertReqVal = false;
                        return;
                    }else if(this.passedObject.btnType == "window"){
                        if(!this.passedObject.btnWinHSize || !this.passedObject.btnWinWSize){
                            this.alertReqVal = true;
                            await this.sleep(2000);
                            this.alertReqVal = false;
                            return;
                        }
                    } else if(!this.passedObject.btnLabel && !this.passedObject.btnIcon){
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
            },
            setSBCCValues(e) {
                var SBCCItem = null;
                for (SBCCItem in this.SBCCCombinedJson) {
                    if(this.SBCCCombinedJson[SBCCItem].SBCC_Cmd_ID == e) {
                        this.passedObject.btnActionData = e;
                        this.passedObject.btnEnableWhileJob = this.SBCCCombinedJson[SBCCItem].Enable_In_Job;
                        this.passedObject.btnSBCCShowResult = this.SBCCCombinedJson[SBCCItem].SBCC_ShowResult;
                    }
                }
            }
        }

    }
</script>