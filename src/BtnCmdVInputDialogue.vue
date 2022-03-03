<style>
    .custom-label-color .v-label {
        color: red;
        opacity: 1;
    }
    .flip-list-move {
    transition: transform 0.5s;
    }
    .no-move {
    transition: transform 0s;
    }
    .ghost {
    opacity: 0.5;
    background: #c8ebfb;
    }
    .list-group {
    min-height: 20px;
    }
    .list-group-item {
    cursor: move;
    }
    .list-group-item i {
    cursor: pointer;
    }
    .VInp-cardRLM__text {
		flex-grow: 1;
		overflow-y: auto;
		overflow-x: hidden;
        max-height: 150px;
        min-height: 200px;
	}
</style>
<template>
    <v-dialog v-model="show" persistent max-width="700">
        <v-card flex style="overflow-x: hidden;">
			<v-card-title>
				<v-toolbar dark dense>
                    <v-toolbar-title>Edit Input Panel Settings</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" :disabled="bToggleExInp" text @click="validateData()">
                        Close
                    </v-btn>
                </v-toolbar>
                <v-alert style="position: absolute; z-index:99999;" :value="alertReqVal" type="error" transition="scale-transition">Required Values have not been entered!</v-alert>
			</v-card-title>
            <v-card-text>
                <v-form lazy-validation class="mx-2">
                    <v-row dense>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-col cols="12" v-bind="attrs" v-on="on">
                                    <v-radio-group v-if="!enableSelects" v-model="passedObject.inputType" row required :disabled="bToggleExInp" @change="clearConfig()">
                                        <v-subheader>Variable Type:</v-subheader>
                                        <v-radio v-for="type in radioVarTypeItems" :key="'BtnT'+type.value" :label="type.text" :value="type.value"></v-radio>
                                    </v-radio-group>
                                    <v-select @change="clearConfig()" v-if="enableSelects" :disabled="bToggleExInp" :items="radioVarTypeItems" class="custom-label-color" item-text="text" item-value="value" label="Variable Type" required v-model="passedObject.inputType"></v-select>
                                </v-col>
                            </template>
                            <span>Note: Changing this value can clear existing configuration data</span>
                        </v-tooltip>
                    </v-row>
                    <v-row dense align="center">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-col cols="11" v-bind="attrs" v-on="on">
                                    <v-radio-group v-if="!enableSelects && passedObject.inputType" v-model="passedObject.inputDispType" row required :disabled="bToggleExInp" @change="clearConfig()">
                                        <v-subheader>Input Control Type:</v-subheader>
                                        <v-radio v-for="type in dispTypeList()" :key="'BtnT'+type.value" :label="type.text" :value="type.value"></v-radio>
                                    </v-radio-group>
                                    <v-select @change="clearConfig()" :disabled="bToggleExInp" v-if="enableSelects && passedObject.inputType" :items="dispTypeList()" class="custom-label-color" item-text="text" item-value="value" label="Input Control Type" required v-model="passedObject.inputDispType"></v-select>
                                </v-col>
                            </template>
                            <span>Note: Changing this value can clear existing configuration data</span>
                        </v-tooltip>
                        <v-col cols="1">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-bind="attrs" v-on="on" :disabled="bICTType" @click="bToggleExInp = !bToggleExInp"><v-icon>{{!bToggleExInp ? 'mdi-arrow-expand-down' : 'mdi-arrow-expand-up'}}</v-icon></v-btn>
                                </template>
                                <span>{{!bToggleExInp ? `Open ${passedObject.inputDispType} Config` : `Close ${passedObject.inputDispType} Config` }}</span>
                        </v-tooltip>
                        </v-col>
                    </v-row>
                    <div v-if="bToggleExInp">
                        <div v-if="passedObject.inputDispType == 'selection'">
                            <v-row dense align="center">
                                <v-col cols="9" offset="1">
                                    <v-text-field label="New List Item" v-model="tmpListItem"></v-text-field>
                                </v-col>
                                <v-col cols="1">
                                    <v-btn :disabled="bAddButtonDisabled" @click="addListItem()"><v-icon>mdi-plus</v-icon></v-btn>
                                </v-col>
                            </v-row>
                            <v-row dense>
                                <v-col cols="12">
                                    <v-card outlined class="VInp-cardRLM__text" id="listtarget" :style="`background-color: ${cardColor} !important;`">
                                        <draggable v-model="passedObject.inputControlVals" group="people" @start="drag=true" @end="drag=false">
                                            <v-card class="list-group-item ma-1" v-for="(element, i) in passedObject.inputControlVals" :key="i" :id="`listcontent${i}`">                                        
                                                <v-row dense class="ma-1" align="center">
                                                    <v-col cols="11">
                                                        <span>{{element}}</span>
                                                    </v-col>
                                                    <v-col cols="1">
                                                        <v-btn fab x-small @click="delListItem(i)"><v-icon>mdi-delete</v-icon></v-btn>
                                                    </v-col>
                                                </v-row>
                                            </v-card>
                                        </draggable>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </div>
                        <div v-if="passedObject.inputDispType == 'slider'">
                            <v-row dense align="center">
                                <v-col cols="4" offset="1">
                                    <v-text-field :rules="[rules.number]" label="Min Value" v-model="tmpFromItem" @change="setRangeVals()"></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field :rules="[rules.number]" label="Max Value" v-model="tmpToItem" @change="setRangeVals()"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row dense align="center">
                                <v-col cols="8" offset="1">
                                    <v-text-field :rules="[rules.divisable]" label="Step Value" v-model="passedObject.inputControlSteps"></v-text-field>
                                </v-col>
                            </v-row>                              
                        </div>
                    </div>
                    <div v-if="!bToggleExInp">
                        <v-row dense>
                            <v-col cols="6">
                                <v-text-field :label="getPrefixLabel()" v-model="passedObject.inputPrefixText"></v-text-field>
                            </v-col>
                            <v-col cols="6" v-if="passedObject.inputDispType != 'slider' && passedObject.inputDispType != 'selection'">
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
                                        <v-text-field class="custom-label-color" v-bind="attrs" v-on="on" required label="Global Variable Name*" v-model="tmpModelPath"></v-text-field>
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
                        <v-row v-if="passedObject.inputDispType != 'selection'">
                            <v-col>
                                <v-row dense><v-col><span style="font-weight: bold">{{txtColorLabel}}</span></v-col></v-row>
                            </v-col>
                            <v-col>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-row dense>
                                            <v-col v-bind="attrs" v-on="on" @click="setColor('MMPrefixColor')" :style="'background-color: ' + passedObject.panelColor" align-self="center"><div align="center" style="cursor:pointer"><span :style="'color: ' + passedObject.panelMMPrefixColor">{{txtColorHover}}</span></div></v-col>
                                            <v-col cols="3" align-self="center"><div align="center" style="cursor:pointer"><v-btn x-small @click="passedObject.panelMMPrefixColor = ''">Reset</v-btn></div></v-col>
                                        </v-row>
                                    </template>
                                    <span>{{txtColorHover}}</span>
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
                            <v-col cols="6" v-if="passedObject.inputType !='boolean' && passedObject.inputDispType != 'slider' && passedObject.inputDispType != 'selection'">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs" v-on="on"><v-switch label="Clear Button" v-model="passedObject.inputEnableClear"></v-switch></span>
                                    </template>
                                    <span>Enables a clear button next to input</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                    </div>
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
    import BtnCmdColPickerDialogue from './BtnCmdColPickDialogue.vue';
    import draggable from 'vuedraggable';
    import { mapState } from 'vuex';
    export default {
        components: {
            BtnCmdColPickerDialogue,
            draggable,
        },
        props: {
            value: Boolean,
            passedObject: {
                type: Object
            },
            enableSelects: Boolean
        },
        computed: {
            ...mapState({
                darkTheme: state => state.settings.darkTheme
            }),
            show: {
                get () {
                    return this.value
                },
                set (value) {
                    this.$emit('input', value)
                }
            },
            bAddButtonDisabled(){
                if(this.tmpListItem){
                    if(this.tmpListItem.length > 0){
                        if(isNaN(this.tmpListItem) && this.passedObject.inputType == 'number'){
                            return true;
                        }else{return false}
                    }else{return true}
                }else{return true}
            },
            bICTType(){
                if(this.passedObject.inputDispType == 'selection' || this.passedObject.inputDispType == 'slider'){
                    return false;
                }else{return true}
            },
            cardColor(){
                if(this.darkTheme){
                    return '#515151';
                }else{
                    return '#f5f5f5';
                }
            },
            txtColorLabel(){
                if(this.passedObject.inputDispType == 'slider'){return "Slider Color"}else{return "Prefix/Suffix Text Colour"}
            },
            txtColorHover(){
                if(this.passedObject.inputDispType == 'slider'){return "Click to edit Slider Color"}else{return "Click to edit text colour"}
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
                    {text: 'String', value: 'text', disabled: false, inputDispType: [{text: 'selection', value: 'selection'},{text: 'input', value: 'input'}]},
                    {text: 'Number', value: 'number', disabled: false, inputDispType: [{text: 'input', value: 'input'}, {text:'slider', value:'slider'}]},
                    {text: 'Boolean', value: 'boolean', disabled: false, inputDispType: [{text: 'switch', value: 'switch'}]}
                ],
                alertReqVal: false,
                showInfo: false,
                showColPicker: false,
                colField:'',
                tmpModelPath:'',
                bToggleExInp: false,
                tmpListItem: null,
                tmpToItem: 100,
                tmpFromItem: 0,
                rules:{
                    number: value => {
                        const pattern = /^[0-9]*$/;
                        return pattern.test(value) || 'Must Be Numeric'
                    },
                    divisable: value=>{
                        if((this.tmpToItem - this.tmpFromItem) % value !== 0){
                            return 'Range is not divisable by this value'
                        }else{
                            return true
                        }
                    }
                }
            }
        },
        methods: {
            async sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            },
            async validateData() {
                if(this.tmpModelPath && this.passedObject.inputType && this.passedObject.inputDispType) {
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
            setRangeVals(){
                this.passedObject.inputControlRange = [this.tmpFromItem, this.tmpToItem];
            },
            clearConfig(){
                //clear selected fields when user changes key values
                this.passedObject.inputControlVals = [],
				this.passedObject.inputControlRange = [0,100],
				this.passedObject.inputControlSteps = 1
            },
            setColor(colorField){
                this.colField = colorField;
                this.showColPicker = true;
            },
            getPrefixLabel(){
                if(this.passedObject.inputType == 'boolean'){
                    return "False Label"
                }if(this.passedObject.inputDispType == 'slider' || this.passedObject.inputDispType == 'selection'){
                    return "Label"
                }else {
                    return "Prefix Text"
                }
            },
            addListItem(){
                if(this.tmpListItem){
                    this.passedObject.inputControlVals.push(this.tmpListItem);
                    this.tmpListItem = null;
                    process.nextTick(() => {
                        let elem = document.getElementById(`listcontent${this.passedObject.inputControlVals.length - 1}`);
                        elem.scrollIntoView();
                    })
                }
            },
            delListItem(arrIndex){
                this.passedObject.inputControlVals.splice(arrIndex,1);
            },
            dispTypeList(){
                if(this.passedObject.inputType){
                    let tmpArr = this.radioVarTypeItems.filter(item => item.value == this.passedObject.inputType);
                    if(tmpArr[0].inputDispType.length === 1){this.passedObject.inputDispType = tmpArr[0].inputDispType[0].value}
                    return tmpArr[0].inputDispType;
                }else{
                    return [];
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