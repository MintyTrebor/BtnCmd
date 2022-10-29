<style>
    .custom-label-color .v-label {
        color: red;
        opacity: 1;
    }
</style>
<template>
    <v-dialog v-model="show" persistent max-width="600" :key="passedObject.PanelType">
        <v-card style="overflow-x: hidden;">
			<!-- <v-row mt-0>
                <v-col><span class="text-caption">curr tab id = {{ customPanels }}</span></v-col>
            </v-row> -->
            <v-card-title>
				<v-toolbar dark dense>
                    <v-toolbar-title>Edit Panel {{isCNCMode}}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="validateData()">
                        <span v-if="passedObject.panelType == 'altwebcam' || passedObject.panelType == 'mmValue' || passedObject.panelType == 'txtLabel' || passedObject.panelType == 'vInput'">Click to Enter Settings</span>
                        <span v-else>Close</span>
                    </v-btn>
                </v-toolbar>
                <v-alert style="position: absolute; z-index:99999;" :value="alertReqVal" type="error" transition="scale-transition">Required Values have not been entered!</v-alert>
			</v-card-title>
            <v-card-text>
                <v-form lazy-validation class="mx-2">
                    <v-row dense v-if="enableSelects">
                        <v-col cols="12">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-select v-bind="attrs" v-on="on" :items="panelItems" item-text="text" item-value="value" label="Panel Type" required v-model="passedObject.panelType" ></v-select>
                                </template>
                                <span>Select Panel</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="!enableSelects">
                        <v-col cols="12">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-radio-group v-bind="attrs" v-on="on" label="Panel Type:" v-model="passedObject.panelType" row required>
                                        <v-radio v-for="type in panelItems" :key="'PT'+type.value" :label="type.text" :value="type.value"></v-radio>
                                    </v-radio-group>
                                </template>
                                <span>Select Panel</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="passedObject.panelType == 'remSrc'">
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field class="custom-label-color" v-bind="attrs" v-on="on" label="URL*" v-model="tmpURL" placeholder="http://"></v-text-field>
                                </template>
                                <span v-if="passedObject.panelType == 'altwebcam'">URL of the Alt Webcam</span>
                                <span v-if="passedObject.panelType == 'remSrc'">URL of the remote source</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="enableSelects && passedObject.panelType == 'custom'">
                        <v-col cols="12">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-select v-bind="attrs" v-on="on" :items="customPanelItems" item-text="text" item-value="value" label="Custom Panel" required v-model="passedObject.customPanelID" ></v-select>
                                </template>
                                <span>Select Custom Panel</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="!enableSelects && passedObject.panelType == 'custom'">
                        <v-col cols="12">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-radio-group v-bind="attrs" v-on="on" label="Custom Panel:" v-model="passedObject.customPanelID" row required>
                                        <v-radio v-for="type in customPanelItems" :key="'PT'+type.value" :label="type.text" :value="type.value"></v-radio>
                                    </v-radio-group>
                                </template>
                                <span>Select Custom Panel</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row>
                    <small>*indicates required field</small>
                    <v-spacer></v-spacer>
                    <div class="mx-2">
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn x-small fab color="primary" v-bind="attrs" v-on="on" :elevation="1" @click="showInfo = !showInfo">
                                    <v-icon>mdi-information</v-icon>
                                </v-btn>
                            </template>
                            <span>Panels Info</span>
                        </v-tooltip>
					</div>
                    </v-row>
                </v-form>
                <tbody style="position: absolute; z-index:99999; bottom: 10%; left: 10%;">
                    <v-alert dense color="#C5C4C6" border="left" dismissible v-model="showInfo" close-text="Close Info" transition="scale-transition" @close="showInfo=!showInfo">
                        <span v-if="passedObject.panelType != 'mmValue'">Choose from a selection of DWC panels to include<br>
                        in your tab layout. The Remote Source panel is <br>
                        intended to display internal LAN web services - <br>
                        for example: an rpi webcam control panel, or NodeDSF.<br>
                        Compatability will vary depending on the remote service.</span>
                    </v-alert>
                </tbody>
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
            customPanels: {
                type: Array
            },
            enableSelects: Boolean,
            createMode: Boolean,
            isCNCMode: Boolean
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
            currPanel: {
                get() {return this.passedObject.panelType;}
            },
            customPanelItems() {
                var custPan = null;
                var tmpItems = [];
                var tmpItem = null;
                for (custPan in this.customPanels) {
                    tmpItem = {
                        text: this.customPanels[custPan].caption,
                        value: this.customPanels[custPan].tabID
                    };
                    tmpItems.push(tmpItem);
                }
                return tmpItems;
            },
            panelItemsFull(){ return [
                {text: 'Alt Webcam', value: 'altwebcam', disabled: false, hSize: 275, wSize: 489},
                {text: 'DWC Webcam', value: 'webcam', disabled: false, hSize: 283, wSize: 354},
                {text: 'Baby-Stepping', value: 'z-babystep-panel', disabled: false, hSize: 200, wSize: 300},
                // {text: 'CNC Axes Position', value: 'cnc-axes-position', disabled: true, hSize: 300, wSize: 380},
                {text: 'CNC Info Panel', value: 'cnc-container-panel', disabled: !this.isCNCMode, hSize: 400, wSize: 800},
                {text: 'CNC Movement', value: 'cnc-movement-panel', disabled: !this.isCNCMode, hSize: 530, wSize: 1000},
                {text: 'CNC Spindle Speed', value: 'spindle-speed-panel', disabled: !this.isCNCMode, hSize: 175, wSize: 700},
                {text: 'Collected Data', value: 'collectdata', disabled: false, hSize: 110, wSize: 600},
                {text: 'Console', value: 'console', disabled: false, hSize: 200, wSize: 1100},
                {text: 'Extrusion Control', value: 'extrude-panel', disabled: this.isCNCMode, hSize: 243, wSize: 524},
                {text: 'Extrusion Factors', value: 'extrusion-factors-panel', disabled: false, hSize: 160, wSize: 358},
                {text: 'Event List Panel', value: 'eventlist', disabled: false, hSize: 250, wSize: 500},
                {text: 'Fan Control', value: 'fans', disabled: false, hSize: 200, wSize: 300},
                {text: 'Filament List Panel', value: 'filamentlist', disabled: false, hSize: 250, wSize: 500},
                {text: 'Global Variable Input', value: 'vInput', disabled: false, hSize: 60, wSize: 300},
                {text: 'Job Control', value: 'job-control-panel', disabled: false, hSize: 200, wSize: 300},
                {text: 'Job Estimations', value: 'jobestimates', disabled: false, hSize: 110, wSize: 280},
                {text: 'Job Info Panel', value: 'jobinfo', disabled: false, hSize: 200, wSize: 200},
                {text: 'Job List Panel', value: 'joblist', disabled: false, hSize: 250, wSize: 500},
                {text: 'Layer Chart', value: 'layerchart', disabled: false, hSize: 240, wSize: 280},
                {text: 'Macro File List Panel', value: 'macrolist', disabled: false, hSize: 250, wSize: 500},
                {text: 'Movement Panel', value: 'movement-panel', disabled: this.isCNCMode, hSize: 272, wSize: 800},
                {text: 'Object Model Value', value: 'mmValue', disabled: false, hSize: 100, wSize: 300},
                {text: 'Remote Source', value: 'remSrc', disabled: false, hSize: 145, wSize: 500},
                {text: 'Speed', value: 'speed', disabled: false, hSize: 230, wSize: 320},
                {text: 'Static Text / Label', value: 'txtLabel', disabled: false, hSize: 100, wSize: 300},
                {text: 'Status Panel', value: 'status-panel', disabled: this.isCNCMode, hSize: 288, wSize: 534},
                {text: 'Temperature Chart', value: 'temperature-chart', disabled: this.isCNCMode, hSize: 240, wSize: 280}, 
                {text: 'Tools', value: 'tools-panel', disabled: false, hSize: 235, wSize: 661},
                {text: 'Custom Panel', value: 'custom', disabled: this.createMode, hSize: 250, wSize: 250},
                
            ]},
            panelItems() {
                return this.panelItemsFull.filter(item => {return item.disabled === false});
            },
        },
        data: function () {
            return {
                rotateItems: [
                    {text: '0°', value: 0},
                    {text: '90°', value: 90},
                    {text: '180°', value: 180},
                    {text: '270°', value: 270}
                ],
                flipItems: [
                    {text: 'None', value: 'none'},
                    {text: 'Flip X', value: 'x'},
                    {text: 'Flip Y', value: 'y'},
                    {text: 'Flip Both', value: 'both'}
                ],
                alertReqVal: false,
                showInfo: false,
                tmpModelPath:'',
                tmpURL: ''
            }
        },
        methods: {
            async sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            },
            async validateData() {
                this.passedObject.altWebCamParams.altWebCamURL = this.tmpURL;
                if (this.passedObject.panelType == 'altwebcam') {
                    this.$emit('exit', true);
                    this.show = false;
                    return;
                }else if (this.passedObject.panelType == 'remSrc') {
                    if(this.passedObject.altWebCamParams.altWebCamURL) {
                        //req fields met so exit
                        this.show = false;
                        return;
                    }
                }else if (this.passedObject.panelType == 'mmValue' || this.passedObject.panelType == 'txtLabel') {
                    this.passedObject.panelMMPath = this.tmpModelPath;
                    this.$emit('exit', true);
                    this.show = false;
                    return;
                }else if (this.passedObject.panelType == 'vInput') {
                    this.$emit('exit', true);
                    this.show = false;
                    return;
                }else if (this.passedObject.panelType) {
                    //No Req fields so exit
                    this.show = false;
                    return;
                }
                this.alertReqVal = true;
                await this.sleep(2000);
                this.alertReqVal = false;
            }
        },
        watch: {
            currPanel: function (newVal) {
                var result = this.panelItems.filter(item => item.value === newVal);
                this.passedObject.panelHSize = result[0].hSize;
                this.passedObject.panelWSize = result[0].wSize;
            }
        },
        mounted() {
            this.tmpURL = this.passedObject.altWebCamParams.altWebCamURL;
            this.tmpModelPath = this.passedObject.panelMMPath;
        }
    }
</script>