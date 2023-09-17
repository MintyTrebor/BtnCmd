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
    .btn-fix:focus::before { opacity: 0 !important; }
    .btn-fix:hover::before { opacity: 0.08 !important; }
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
                        <v-col cols="4">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-col cols="12" v-bind="attrs" v-on="on">
                                        <span v-bind="attrs" v-on="on"><v-switch label="Link To OM" v-model="tmpPassedObject.inputLinkToOM" @change="clearModelPath()"></v-switch></span>
                                    </v-col>
                                </template>
                                <span>Link to a value in the OM</span>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="8">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-col cols="12" v-bind="attrs" v-on="on">
                                        <v-select @change="clearConfig()" :disabled="bToggleExInp" :items="radioVarTypeItems" class="custom-label-color" item-text="text" item-value="value" label="Type" required v-model="tmpPassedObject.inputType"></v-select>
                                    </v-col>
                                </template>
                                <span>Note: Changing this value can clear existing configuration data</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense align="center">
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                                <v-col cols="11" v-bind="attrs" v-on="on">
                                    <v-select @change="clearConfig()" :disabled="bToggleExInp" v-if="tmpPassedObject.inputType" :items="dispTypeList()" class="custom-label-color" item-text="text" item-value="value" label="Input Control Type" required v-model="tmpPassedObject.inputDispType"></v-select>
                                </v-col>
                            </template>
                            <span>Note: Changing this value can clear existing configuration data</span>
                        </v-tooltip>
                        <v-col cols="1">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-bind="attrs" v-on="on" :disabled="bICTType" @click="bToggleExInp = !bToggleExInp"><v-icon>{{!bToggleExInp ? 'mdi-arrow-expand-down' : 'mdi-arrow-expand-up'}}</v-icon></v-btn>
                                </template>
                                <span>{{!bToggleExInp ? `Open ${tmpPassedObject.inputDispType} Config` : `Close ${tmpPassedObject.inputDispType} Config` }}</span>
                        </v-tooltip>
                        </v-col>
                    </v-row>
                    <div v-if="bToggleExInp">
                        <div v-if="tmpPassedObject.inputDispType == 'selection'">
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
                                        <draggable v-model="tmpPassedObject.inputControlVals" group="people" @start="drag=true" @end="drag=false">
                                            <v-card class="list-group-item ma-1" v-for="(element, i) in tmpPassedObject.inputControlVals" :key="i" :id="`listcontent${i}`">                                        
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
                        <div v-if="tmpPassedObject.inputDispType == 'slider'">
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
                                    <v-text-field :rules="[rules.divisable]" label="Step Value" v-model="tmpPassedObject.inputControlSteps"></v-text-field>
                                </v-col>
                            </v-row>                              
                        </div>
                    </div>
                    <div v-if="!bToggleExInp">
                        <v-row dense>
                            <v-col cols="6">
                                <v-text-field :label="getPrefixLabel()" v-model="tmpPassedObject.inputPrefixText"></v-text-field>
                            </v-col>
                            <v-col cols="6" v-if="tmpPassedObject.inputDispType != 'slider' && tmpPassedObject.inputDispType != 'selection'">
                                <v-text-field :label="getSuffixLabel()" v-model="tmpPassedObject.inputSuffixText"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row dense>
                        <v-col cols="7">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-bind="attrs" v-on="on" label="Top Icon [mdi-*]" v-model="tmpPassedObject.inputIconAbove" placeholder="mdi-"></v-text-field>
                                </template>
                                <span>Material design icon name (Format = mdi-[icon name])</span>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="1">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <a v-bind="attrs" v-on="on" href="https://pictogrammers.com/library/mdi/" target="_blank">
                                        <v-icon v-if="tmpPassedObject.inputIconAbove" class="mr-1 pt-3">{{ tmpPassedObject.inputIconAbove }}</v-icon>
                                        <v-icon v-else class="mr-1 pt-3">mdi-cog</v-icon>
                                    </a>
                                </template>
                                <span>Click to open Material Design Icons web page</span>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="4">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-bind="attrs" v-on="on" label="Icon Size" v-model="tmpPassedObject.inputIconAboveSize" placeholder="25" number></v-text-field>
                                </template>
                                <span>Size (num [def=25])</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                        <v-row dense>
                            <v-col cols="12">
                                <v-text-field label="Hover Text" v-model="tmpPassedObject.panelHoverText"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row v-if="!tmpPassedObject.inputLinkToOM" dense>
                            <v-col cols="12">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field class="custom-label-color" v-bind="attrs" v-on="on" required label="Global Variable Name*" v-model="tmpModelPath"></v-text-field>
                                    </template>
                                    <span>Variables must be pre-defined before use.</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                        <v-row v-if=" tmpPassedObject.inputLinkToOM" dense>
                            <v-col cols="11">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field class="custom-label-color" v-bind="attrs" v-on="on" required label="Object Model Path*" v-model="tmpModelPath"></v-text-field>
                                    </template>
                                    <span>Enter OM Path to link to</span>
                                </v-tooltip>
                            </v-col>
                            <v-col cols="1">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn v-bind="attrs" v-on="on" class="mt-4 btn-fix" fab x-small @click="closeOMSelector()"><v-icon>mdi-toy-brick-search-outline</v-icon></v-btn>
                                    </template>
                                    <span>Lookup Object Model</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col cols="12">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-bind="attrs" v-on="on" label="Post Change Gcode Command*" v-model="tmpPassedObject.inputAfterChangeGCodeCMD"></v-text-field>
                                    </template>
                                    <span>Enter Gcode command to execute after change (Use ##VALUE## to include inputted value in command)</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>                   
                        <v-row dense> 
                            <v-col cols="12">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-radio-group v-bind="attrs" v-on="on" label="Text Size :" v-model="tmpPassedObject.panelMMTextSize" row required>
                                            <v-radio v-for="typex in textSizeItems" :key="'MMTS'+typex.value" :label="typex.text" :value="typex.value"></v-radio>
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
                                            <v-col v-bind="attrs" v-on="on" @click="setColor('panelColor')" :style="'background-color: ' + tmpPassedObject.panelColor" align-self="center"><div align="center" style="cursor:pointer">Click to edit color</div></v-col>
                                            <v-col cols="3" align-self="center"><div align="center" style="cursor:pointer"><v-btn x-small @click="tmpPassedObject.panelColor = ''">Reset</v-btn></div></v-col>
                                        </v-row>
                                    </template>
                                    <span>Click to edit panel colour</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                        <v-row v-if="tmpPassedObject.inputDispType != 'selection'">
                            <v-col>
                                <v-row dense><v-col><span style="font-weight: bold">{{txtColorLabel}}</span></v-col></v-row>
                            </v-col>
                            <v-col>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-row dense>
                                            <v-col v-bind="attrs" v-on="on" @click="setColor('MMPrefixColor')" :style="'background-color: ' + tmpPassedObject.panelColor" align-self="center"><div align="center" style="cursor:pointer"><span :style="'color: ' + tmpPassedObject.panelMMPrefixColor">{{txtColorHover}}</span></div></v-col>
                                            <v-col cols="3" align-self="center"><div align="center" style="cursor:pointer"><v-btn x-small @click="tmpPassedObject.panelMMPrefixColor = ''">Reset</v-btn></div></v-col>
                                        </v-row>
                                    </template>
                                    <span>{{txtColorHover}}</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                        <v-row v-if="tmpPassedObject.inputIconAbove">
                            <v-col>
                                <v-row dense><v-col><span style="font-weight: bold">Icon Colour</span></v-col></v-row>
                            </v-col>
                            <v-col>
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-row dense>
                                            <v-col align-self="center"><v-icon @click="setColor('inputIconAboveColor')" v-on="on" :color="tmpPassedObject.inputIconAboveColor">{{ tmpPassedObject.inputIconAbove }}</v-icon></v-col>
                                            <v-col cols="3" align-self="center"><div align="center" style="cursor:pointer"><v-btn x-small @click="tmpPassedObject.inputIconAboveColor = ''">Reset</v-btn></div></v-col>
                                        </v-row>
                                    </template>
                                    <span>Click to edit icon colour</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs" v-on="on"><v-switch label="Hide Panel Border" v-model="tmpPassedObject.borderless"></v-switch></span>
                                    </template>
                                    <span>Hide the panel border</span>
                                </v-tooltip>
                            </v-col>
                            <v-col cols="6" v-if="tmpPassedObject.inputType !='boolean' && tmpPassedObject.inputDispType != 'slider' && tmpPassedObject.inputDispType != 'selection'">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs" v-on="on"><v-switch label="Clear Button" v-model="tmpPassedObject.inputEnableClear"></v-switch></span>
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
            <BtnCmdColPickerDialogue v-if="showColPicker" v-model="showColPicker" :passedObject="tmpPassedObject" :colField="colField"></BtnCmdColPickerDialogue>
            <ObjectModelSelector @exit="closeOMSelector" v-model="showOMSelector"></ObjectModelSelector>
        </v-card>
    </v-dialog>
</template>


<script>
    import BtnCmdColPickerDialogue from './BtnCmdColPickDialogue.vue';
    import draggable from 'vuedraggable';
    import store from "@/store";
    import ObjectModelSelector from './ObjectModelSelector.vue'
    export default {
        components: {
            BtnCmdColPickerDialogue,
            draggable,
            ObjectModelSelector
        },
        props: {
            value: Boolean,
            passedObject: {
                type: Object
            }
        },
        computed: {
            darkTheme() {
                return store.state.settings.darkTheme;
            }, 
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
                    //if(this.tmpListItem.length() > 0){
                        if(isNaN(this.tmpListItem) && this.tmpPassedObject.inputType == 'number'){
                            return true;
                        }else{return false}
                    //}else{return true}
                }else{return true}
            },
            bICTType(){
                if(this.tmpPassedObject.inputDispType == 'selection' || this.tmpPassedObject.inputDispType == 'slider'){
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
                if(this.tmpPassedObject.inputDispType == 'slider'){return "Slider Color"}else{return "Prefix/Suffix Text Colour"}
            },
            txtColorHover(){
                if(this.tmpPassedObject.inputDispType == 'slider'){return "Click to edit Slider Color"}else{return "Click to edit text colour"}
            },
            bOMLink(){
                if(this.tmpPassedObject.inputLinkToOM){
                    return true;
                }else {
                    return false;
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
                tmpPassedObject: {},
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
                },
                showOMSelector: false
                
            }
        },
        methods: {
            async sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            },
            async validateData() {
                if(this.tmpModelPath && this.tmpPassedObject.inputType && this.tmpPassedObject.inputDispType) {
                    //req fields met so exit
                    this.tmpPassedObject.inputVarName = this.tmpModelPath;
                    this.$emit('exit', this.tmpPassedObject);
                    this.show = false;
                    return;
                } else {
                    this.alertReqVal = true;
                    await this.sleep(2000);
                    this.alertReqVal = false;
                }  
            },
            setRangeVals(){
                this.tmpPassedObject.inputControlRange = [this.tmpFromItem, this.tmpToItem];
            },
            clearConfig(){
                //clear selected fields when user changes key values
                this.tmpPassedObject.inputControlVals = [],
				this.tmpPassedObject.inputControlRange = [0,100],
				this.tmpPassedObject.inputControlSteps = 1
            },
            clearModelPath(){
                this.tmpModelPath = '';
            },
            setColor(colorField){
                this.colField = colorField;
                this.showColPicker = true;
            },
            getPrefixLabel(){
                if(this.tmpPassedObject.inputType == 'boolean'){
                    return "False Label"
                }if(this.tmpPassedObject.inputDispType == 'slider' || this.tmpPassedObject.inputDispType == 'selection'){
                    return "Label"
                }else {
                    return "Prefix Text"
                }
            },
            addListItem(){
                if(this.tmpListItem){
                    this.tmpPassedObject.inputControlVals.push(this.tmpListItem);
                    this.tmpListItem = null;                    
                    this.$nextTick(() => {
                        try{
                            let elem = document.getElementById(`listcontent${this.tmpPassedObject.inputControlVals.length - 1}`);
                            elem.scrollIntoView();
                        }catch{}
                    })
                }
            },
            delListItem(arrIndex){
                this.tmpPassedObject.inputControlVals.splice(arrIndex,1);
            },
            dispTypeList(){
                if(this.tmpPassedObject.inputType){
                    let tmpArr = this.radioVarTypeItems.filter(item => item.value == this.tmpPassedObject.inputType);
                    if(tmpArr[0].inputDispType.length === 1){this.tmpPassedObject.inputDispType = tmpArr[0].inputDispType[0].value}
                    return tmpArr[0].inputDispType;
                }else{
                    return [];
                }
            },
            getSuffixLabel(){
                if(this.tmpPassedObject.inputType == 'boolean'){
                    return "True Label"
                }else {
                    return "Suffix Text"
                }
            },
            closeOMSelector(txtVal){
                this.showOMSelector = !this.showOMSelector;
                if(txtVal){
                    this.tmpModelPath = txtVal;
                };
            }
        },
        mounted() {
            this.tmpPassedObject = JSON.parse(JSON.stringify(this.passedObject));
            this.tmpModelPath = this.tmpPassedObject.inputVarName;            
        }
    }
</script>