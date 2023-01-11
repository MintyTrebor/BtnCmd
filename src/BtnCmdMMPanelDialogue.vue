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
                    <v-toolbar-title>Edit Panel Settings</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="validateData()">
                        Close
                    </v-btn>
                </v-toolbar>
                <v-alert style="position: absolute; z-index:99999;" :value="alertReqVal" type="error" transition="scale-transition">Required Values have not been entered!</v-alert>
			</v-card-title>
            <v-card-text>
                <v-form lazy-validation class="mx-2">
                    <v-row dense>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-if="passedObject.panelType == 'mmValue'"  v-bind="attrs" v-on="on" label="Model Value Prefix" v-model="passedObject.panelMMPrefix"></v-text-field>
                                    <v-text-field v-if="passedObject.panelType == 'txtLabel'" required v-bind="attrs" v-on="on" label="Enter Text" v-model="passedObject.panelMMPrefix"></v-text-field>
                                </template>
                                <span v-if="passedObject.panelType == 'mmValue'" >Text to display prefixing the model value (optional)</span>
                                <span v-if="passedObject.panelType == 'txtLabel'" >Text to display. (Enter a space for a blank panel)</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="passedObject.panelType == 'mmValue'" >
                        <v-col cols="11">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field required v-bind="attrs" v-on="on" label="Model Path" v-model="tmpModelPath" placeholder="heat.heaters[0].current"></v-text-field>
                                </template>
                                <span>Use the Object Model Browser Plugin to get Model Paths</span>
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
                    <v-row dense v-if="passedObject.panelType == 'mmValue'">
                        <v-col class="d-flex flex-column">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-select v-bind="attrs" v-on="on" :items="orientationItems" item-text="text" item-value="value" label="Text Orientation" required v-model="passedObject.panelMMOrientation"></v-select>
                                </template>
                                <span>Change the text orientation</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row >
                        <v-col>
                            <v-row dense><v-col><span style="font-weight: bold">Panel Background Colour</span></v-col></v-row>
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
                            <v-row dense><v-col><span style="font-weight: bold">Text Colour</span></v-col></v-row>
                        </v-col>
                        <v-col>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-row dense>
                                        <v-col v-bind="attrs" v-on="on" @click="setColor('MMPrefixColor')" :style="'background-color: ' + passedObject.panelColor" align-self="center"><div align="center" style="cursor:pointer"><span :style="'color: ' + passedObject.panelMMPrefixColor">Click to edit Prefix color</span></div></v-col>
                                        <v-col cols="3" align-self="center"><div align="center" style="cursor:pointer"><v-btn x-small @click="passedObject.panelMMPrefixColor = ''">Reset</v-btn></div></v-col>
                                    </v-row>
                                </template>
                                <span>Click to edit text colour</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row v-if="passedObject.panelType == 'mmValue'" >
                        <v-col>
                            <v-row dense><v-col><span style="font-weight: bold">Value Colour</span></v-col></v-row>
                        </v-col>
                        <v-col>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-row dense>
                                        <v-col v-bind="attrs" v-on="on" @click="setColor('MMValueColor')" :style="'background-color: ' + passedObject.panelColor" align-self="center"><div align="center" style="cursor:pointer"><span :style="'color: ' + passedObject.panelMMValueColor">Click to edit Value color</span></div></v-col>
                                        <v-col cols="3" align-self="center"><div align="center" style="cursor:pointer"><v-btn x-small @click="passedObject.panelMMValueColor = ''">Reset</v-btn></div></v-col>
                                    </v-row>
                                </template>
                                <span>Click to edit value colour</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Hide Panel Border" v-model="passedObject.borderless"></v-switch></span>
                                </template>
                                <span>Hide the panel border</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <!-- <v-row mt-0><v-col><span class="text-caption">v-model = {{ passedObject }}</span></v-col></v-row> -->
                </v-form>
                <tbody style="position: absolute; z-index:99999; bottom: 10%; left: 10%;">
                    <v-alert dense color="#C5C4C6" border="left" dismissible v-model="showInfo" close-text="Close Info" transition="scale-transition" @close="showInfo=!showInfo">
                        <span>Use the Object Model Browser<br>plugin to lookup Model Path</span>
                    </v-alert>
                </tbody>
            </v-card-text>
            <BtnCmdColPickerDialogue v-if="showColPicker" v-model="showColPicker" :passedObject="passedObject" :colField="colField"></BtnCmdColPickerDialogue>
            <ObjectModelSelector @exit="closeOMSelector" v-model="showOMSelector"></ObjectModelSelector>
        </v-card>
    </v-dialog>
</template>


<script>
    import BtnCmdColPickerDialogue from './BtnCmdColPickDialogue.vue'
    import ObjectModelSelector from './ObjectModelSelector.vue'
    export default {
        components: {
            BtnCmdColPickerDialogue,
            ObjectModelSelector
        },
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
                orientationItems: [
                    {text: 'Horizontal', value: 'H'},
                    {text: 'Vertical', value: 'V'}
                ],
                textSizeItems: [
                    {text: 'STD', value: 'body-2'},
                    {text: '+1', value: 'h6'},
                    {text: '+2', value: 'h5'},
                    {text: '+3', value: 'h4'},
                    {text: '+4', value: 'h3'},
                    {text: '+5', value: 'h2'},
                    {text: '+6', value: 'h1'}
                ],
                alertReqVal: false,
                showInfo: false,
                showColPicker: false,
                colField:'',
                tmpModelPath:'',
                showOMSelector: false
            }
        },
        methods: {
            async sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            },
            async validateData() {
                if(this.passedObject.panelType == 'mmValue'){
                    if(this.tmpModelPath) {
                        //req fields met so exit
                        this.passedObject.panelMMPath = this.tmpModelPath;
                        this.$emit('exit', true);
                        this.show = false;
                        return;
                    } else {
                        this.alertReqVal = true;
                        await this.sleep(2000);
                        this.alertReqVal = false;
                    }
                }else if (this.passedObject.panelType != 'mmValue'){
                    if(this.passedObject.panelMMPrefix) {
                        //req fields met so exit
                        this.passedObject.panelMMPath = this.tmpModelPath;
                        this.$emit('exit', true);
                        this.show = false;
                        return;
                    }
                }    
            },
            setColor(colorField){
                this.colField = colorField;
                this.showColPicker = true;
            },
            closeOMSelector(txtVal){
                this.showOMSelector = !this.showOMSelector;
                if(txtVal){
                    this.tmpModelPath = txtVal;
                };
            }
        },
        mounted() {
            this.tmpModelPath = this.passedObject.panelMMPath;
        }
    }
</script>