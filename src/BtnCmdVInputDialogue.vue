<style>
    .custom-label-color .v-label {
        color: red;
        opacity: 1;
    }
</style>
<template>
    <v-dialog v-model="show" persistent max-width="700">
        <v-card style="overflow-x: hidden;">
			<v-card-title>
				<v-toolbar dark dense>
                    <v-toolbar-title>Edit Input Panel Settings</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="validateData()">
                        Close
                    </v-btn>
                </v-toolbar>
                <v-alert style="position: absolute; z-index:99999;" :value="alertReqVal" type="error" transition="scale-transition">Required Values have not been entered!</v-alert>
			</v-card-title>
            <v-card-text>
                <v-form lazy-validation class="mx-2">
                    <v-row dense v-if="!enableSelects">
                        <v-col cols="12">
                            <v-radio-group v-model="passedObject.inputType" row required>
                                <v-subheader>Variable Type:</v-subheader>
                                <v-radio v-for="type in radioVarTypeItems" :key="'BtnT'+type.value" :label="type.text" :value="type.value"></v-radio>
                            </v-radio-group>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="enableSelects">
                        <v-col cols="12">
                            <v-select :items="radioVarTypeItems" class="custom-label-color" item-text="text" item-value="value" label="Variable Type" required v-model="passedObject.inputType"></v-select>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12">
                            <v-text-field :label="getPrefixLabel()" v-model="passedObject.inputPrefixText"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12">
                            <v-text-field :label="getSuffixLabel()" v-model="passedObject.inputSuffixText"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12">
                            <v-text-field label="Hover Text" v-model="passedObject.panelHoverText"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field class="custom-label-color" v-bind="attrs" v-on="on" label="Global Variable Name*" v-model="tmpModelPath"></v-text-field>
                                </template>
                                <span>Variables must be pre-defined before use.</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>                    
                    <v-row dense> 
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-radio-group v-bind="attrs" v-on="on" label="Text Size :" v-model="passedObject.panelMMTextSize" row required>
                                        <v-radio v-for="type in textSizeItems" :key="'MMTS'+type.value" :label="type.text" :value="type.value"></v-radio>
                                    </v-radio-group>
                                </template>
                                <span>Modify the font size</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row >
                        <v-col>
                            <v-row dense><v-col><span style="font-weight: bold">Background Colour</span></v-col></v-row>
                        </v-col>
                        <v-col>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-row dense>
                                        <v-col v-bind="attrs" v-on="on" @click="setColor('panelColor')" :style="'background-color: ' + passedObject.panelColor" align-self="center"><div align="center" style="cursor:pointer">Click to edit color</div></v-col>
                                        <v-col cols="3" align-self="center"><div align="center" style="cursor:pointer"><v-btn x-small @click="passedObject.panelColor = ''">Reset</v-btn></div></v-col>
                                    </v-row>
                                </template>
                                <span>Click to edit panel colour</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row >
                        <v-col>
                            <v-row dense><v-col><span style="font-weight: bold">Prefix/Suffix Text Colour</span></v-col></v-row>
                        </v-col>
                        <v-col>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-row dense>
                                        <v-col v-bind="attrs" v-on="on" @click="setColor('MMPrefixColor')" :style="'background-color: ' + passedObject.panelColor" align-self="center"><div align="center" style="cursor:pointer"><span :style="'color: ' + passedObject.panelMMPrefixColor">Click to edit text color</span></div></v-col>
                                        <v-col cols="3" align-self="center"><div align="center" style="cursor:pointer"><v-btn x-small @click="passedObject.panelMMPrefixColor = ''">Reset</v-btn></div></v-col>
                                    </v-row>
                                </template>
                                <span>Click to edit Prefix/Suffix text colour</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Hide Panel Border" v-model="passedObject.borderless"></v-switch></span>
                                </template>
                                <span>Hide the panel border</span>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="6" v-if="passedObject.inputType !='boolean'">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Clear Button" v-model="passedObject.inputEnableClear"></v-switch></span>
                                </template>
                                <span>Enables a clear button next to input</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                </v-form>
                <tbody style="position: absolute; z-index:99999; bottom: 10%; left: 10%;">
                    <v-alert dense color="#C5C4C6" border="left" dismissible v-model="showInfo" close-text="Close Info" transition="scale-transition" @close="showInfo=!showInfo">
                        <span>Use the Object Model Browser<br>plugin to lookup Model Path</span>
                    </v-alert>
                </tbody>
            </v-card-text>
            <BtnCmdColPickerDialogue v-if="showColPicker" v-model="showColPicker" :passedObject="passedObject" :colField="colField"></BtnCmdColPickerDialogue>
        </v-card>
    </v-dialog>
</template>


<script>
    import BtnCmdColPickerDialogue from './BtnCmdColPickDialogue.vue'
    export default {
        components: {
            BtnCmdColPickerDialogue
        },
        props: {
            value: Boolean,
            passedObject: {
                type: Object
            },
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
            }
        },
        data: function () {
            return {                
                textSizeItems: [
                    {text: 'STD', value: 'body-2'},
                    {text: '+1', value: 'h6'},
                    {text: '+2', value: 'h5'}
                ],
                radioVarTypeItems: [
                    {text: 'String', value: 'text', disabled: false},
                    {text: 'Number', value: 'number', disabled: false},
                    {text: 'Boolean', value: 'boolean', disabled: false}
                ],
                alertReqVal: false,
                showInfo: false,
                showColPicker: false,
                colField:'',
                tmpModelPath:''
            }
        },
        methods: {
            async sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            },
            async validateData() {
                if(this.tmpModelPath) {
                    //req fields met so exit
                    this.passedObject.inputVarName = this.tmpModelPath;
                    this.$emit('exit', true);
                    this.show = false;
                    return;
                } else {
                    this.alertReqVal = true;
                    await this.sleep(2000);
                    this.alertReqVal = false;
                }  
            },
            setColor(colorField){
                this.colField = colorField;
                this.showColPicker = true;
            },
            getPrefixLabel(){
                if(this.passedObject.inputType == 'boolean'){
                    return "False Label"
                }else {
                    return "Prefix Text"
                }
            },
            getSuffixLabel(){
                if(this.passedObject.inputType == 'boolean'){
                    return "True Label"
                }else {
                    return "Suffix Text"
                }
            }
        },
        mounted() {
            this.tmpModelPath = this.passedObject.inputVarName;
        }
    }
</script>