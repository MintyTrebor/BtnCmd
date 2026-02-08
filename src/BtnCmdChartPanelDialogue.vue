<style scoped>
    .custom-label-color .v-label {
        color: red;
        opacity: 1;
    }
    .btn-fix:focus::before { opacity: 0 !important; }
    .btn-fix:hover::before { opacity: 0.08 !important; }
</style>
<template>
    <v-dialog v-model="show" persistent max-width="80%" max-height="70%">
        <v-card style="overflow-x: hidden;">
            <v-card-title>
                <v-toolbar dark dense rounded>
                    <v-toolbar-title>Edit Panel Settings</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="validateData()">
                        Save & Close
                    </v-btn>
                </v-toolbar>
                <v-alert style="position: absolute; z-index:99999;" :value="alertReqVal" type="error" transition="scale-transition">Required Values have not been entered!</v-alert>
            </v-card-title>
            <v-card-text>
                <v-form lazy-validation class="mx-2">
                    <v-row dense class="mb-n8 mt-n2">
                        <v-col cols="8">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-bind="attrs" v-on="on" label="Chart Name" v-model="tmpPassedObject.chartLabel"></v-text-field>
                                </template>
                                <span>Chart Name</span>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="2">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-bind="attrs" v-on="on" number label="Update Frequency (Sec)" v-model="tmpPassedObject.chartTickValue"></v-text-field>
                                </template>
                                <span>How often to update chart data (0 = Real Time)</span>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="2">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-bind="attrs" v-on="on" number label="Y Axis Steps" v-model="tmpPassedObject.chartYaxisStep"></v-text-field>
                                </template>
                                <span>Y Axis Place a Grid Line Every Step Value</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense class="mb-n8">
                        <v-col cols="2">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-bind="attrs" v-on="on" label="Y-Axis Min" v-model="tmpPassedObject.chartYaxisMin"></v-text-field>
                                </template>
                                <span>Lowest Value on Chart</span>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="2">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-bind="attrs" v-on="on" label="Y-Axis Max" v-model="tmpPassedObject.chartYaxisMax"></v-text-field>
                                </template>
                                <span>Highest Value on Chart</span>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="2">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-bind="attrs" v-on="on" label="X-Axis Time Range (Secs)" v-model="tmpPassedObject.chartXaxisMaxSample" @change="setShowSeconds()"></v-text-field>
                                </template>
                                <span>Time Range to show on X-Axis</span>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="2">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on" align="center"><v-switch label="Retain All Data" v-model="tmpPassedObject.chartRetainData" @change="alertRetainData = tmpPassedObject.chartRetainData"></v-switch></span>
                                </template>
                                <span>Retain All recorded chart data in Memory (not just visible data)</span>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="2">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on" align="center"><v-switch label="Show Seconds" v-model="tmpPassedObject.chartShowSeconds"></v-switch></span>
                                </template>
                                <span>Show Seconds on Y axis</span>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="2">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on" align="center"><v-switch label="Legend Values" v-model="tmpPassedObject.chartShowValueInLegend"></v-switch></span>
                                </template>
                                <span>Show Latest Values In Lengend</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-alert style="position: absolute; z-index:99999;" dark color="deep-purple accent-4" :value="alertRetainData" dismissible transition="scale-transition" maxWidth="90%">
                        Enabling this option retains all the chart data in memory, which may impact performance or cause other issues if you leave a chart gathering data for extended periods of time.
                        This option is only useful if you intend to save the chart data as a csv file, and want to save the entire dataset not just the data currently visible on screen.
                    </v-alert>
                    <v-row dense class="mt-4 mb-n2">
                        <v-col cols="4" align="left" class="align-self-end">
                            <span>Data Lines</span>                        
                        </v-col>
                        <v-col cols="8" align="right">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-bind="attrs" v-on="on" small @click="addListItem()"><v-icon>mdi-plus</v-icon></v-btn>
                                </template>
                                <span>Add Data Line</span>
                            </v-tooltip>                           
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12">
                            <v-card outlined height="20vh" style="overflow-y: scroll">
                                <v-container fluid >
                                    <v-card class="ma-1" v-for="(element, i) in tmpPassedObject.chartOMDataArr" :key="i" :id="`listcontent${i}`" max-height="70" :color="editArrIndex == i ? 'grey lighten-2': ''">                                        
                                        <v-row dense class="ma-1 text-body-2" align="center">
                                            <v-col cols="2">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn v-bind="attrs" v-on="on" class="mr-1 btn-fix" fab x-small @click="editListItem(i)"><v-icon>mdi-cog</v-icon></v-btn>
                                                    </template>
                                                    <span>Configure Data Line</span>
                                                </v-tooltip>
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn v-bind="attrs" v-on="on" class="ml-1 btn-fix" fab x-small @click="delListItem(i)"><v-icon>mdi-delete</v-icon></v-btn>
                                                    </template>
                                                    <span>Delete Data Line</span>
                                                </v-tooltip>
                                            </v-col>
                                            <v-col cols="4" align="left">
                                                <span><v-chip label class="mr-1">OM</v-chip>{{element.OMString}}</span>
                                            </v-col>
                                            <v-col cols="1" align="center">
                                                <v-spacer></v-spacer>
                                            </v-col>
                                            <v-col cols="4" align="left">
                                                <span><v-chip label class="mr-1">Legend</v-chip>{{element.name}}</span>
                                            </v-col>
                                            <v-col cols="1" align="center">
                                                <span><v-icon :color="element.OMColor">mdi-chart-line-variant</v-icon></span>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                </v-container>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="editArrObj">
                        <v-col cols="12">
                            <v-card flex outlined>
                                <v-row dense>
                                    <v-col cols="4">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field v-bind="attrs" v-on="on" label="Object Model Path" v-model="editArrObj.OMString"></v-text-field>
                                            </template>
                                            <span>Enter Object Model Path</span>
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
                                    <v-col cols="5">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field v-bind="attrs" v-on="on" label="Legend" v-model="editArrObj.name"></v-text-field>
                                            </template>
                                            <span>Name of Data Line to Display</span>
                                        </v-tooltip>
                                    </v-col>
                                    <v-col cols="2">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field v-bind="attrs" v-on="on" number label="Scale Factor" v-model="editArrObj.scaleFactor"></v-text-field>
                                            </template>
                                            <span>Scale Value</span>
                                        </v-tooltip>
                                    </v-col>
                                </v-row>
                                <v-row dense>
                                    <v-col cols="3">
                                        <v-select label="Line Colour" :items="lineColors" v-model="editArrObj.OMColor"></v-select>
                                    </v-col>
                                    <v-spacer></v-spacer>
                                    <v-col cols="2" align="center">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <span v-bind="attrs" v-on="on" align="center"><v-switch label="Enable Datapoints" v-model="editArrObj.showDataPoint"></v-switch></span>
                                            </template>
                                            <span>Show datapoints with mouseover info</span>
                                        </v-tooltip>
                                    </v-col>
                                    <v-col cols="2" align="center">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <span v-bind="attrs" v-on="on" align="center"><v-switch label="Dashed Line" v-model="editArrObj.lineDash"></v-switch></span>
                                            </template>
                                            <span>Show line with dashes</span>
                                        </v-tooltip>
                                    </v-col>
                                    <v-col cols="2" align="center">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <span v-bind="attrs" v-on="on" align="center"><v-switch label="Set Precision" v-model="editArrObj.setPrecision"></v-switch></span>
                                            </template>
                                            <span>Enable Fixed Precision</span>
                                        </v-tooltip>
                                    </v-col>
                                    <v-col cols="2" align="center" v-if="editArrObj.setPrecision">
                                        <v-tooltip bottom>
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field v-bind="attrs" v-on="on" number label="Precision" v-model="editArrObj.precisionVal"></v-text-field>
                                            </template>
                                            <span>Precison Places (number)</span>
                                        </v-tooltip>
                                    </v-col>
                                    <v-col cols="2" align="center" v-else>
                                        <v-spacer/>
                                    </v-col>
                                </v-row>
                                <v-tooltip left>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn color="primary" class="mb-6 btn-fix" v-bind="attrs" v-on="on" fab small absolute bottom right @click="saveListItem()">
                                            <v-icon>mdi-floppy</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Save Data Line Configuration</span>
                                </v-tooltip>
                            </v-card>
                        </v-col>
                    </v-row>
                    <!-- <v-row mt-0><v-col><span class="text-caption">v-model = {{ editArrObj }}</span></v-col></v-row> -->
                    <!-- <v-row mt-0><v-col><span class="text-caption">v-model = {{ tmpPassedObject }}</span></v-col></v-row> -->
                </v-form>
            </v-card-text>
            <ObjectModelSelector @exit="closeOMSelector" v-model="showOMSelector"></ObjectModelSelector>
        </v-card>
    </v-dialog>
</template>


<script>
    import ObjectModelSelector from './ObjectModelSelector.vue'
    
    export default {
        components:{
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
            },
            bAddButtonDisabled(){
                if(this.tmpNewOMPath){
                    if(this.tmpNewOMPath.length > 0){
                        if(isNaN(this.tmpNewOMPath)){
                            return false;
                        }else{return true}
                    }else{return true}
                }else{return true}
            },
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
                showColPicker: false,
                colField:'',
                tmpChartLabel:'',
                tmpPassedObject: {},
                tmpNewOMPath: null,
                lineColors: [
                    'primary',
                    'red',
                    'green',
                    'orange',
                    'grey',
                    'lime',
                    'black',
                    'purple',
                    'yellow',
                    'teal',
                    'brown',
                    'deep-orange',
                    'pink',
                    'blue-grey'
                ],
                editArrIndex: null,
                editArrObj: null,
                alertRetainData: false,
                showOMSelector: false,
                //After 01.01.02 any changes to refOMDataArrItem also need to be accounted for in mounted() data upgrade below
                refOMDataArrItem: {OMString: 'NEW', OMColor: 'primary', name: 'NEW', lastReading: 0, lineDash: false, showDataPoint: false, scaleFactor: 1, setPrecision: false, precisionVal: 4}
            }
        },
        methods: {
            async sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            },
            async validateData() {
               if(this.tmpPassedObject.chartLabel && !isNaN(this.tmpPassedObject.chartYaxisMin) && !isNaN(this.tmpPassedObject.chartYaxisMax)) {
                    //req fields met so exit
                    this.passedObject.chartLabel = this.tmpPassedObject.chartLabel;
                    this.passedObject.chartYaxisMin = Number(this.tmpPassedObject.chartYaxisMin);
                    this.passedObject.chartYaxisMax = Number(this.tmpPassedObject.chartYaxisMax);
                    this.passedObject.chartOMDataArr = this.tmpPassedObject.chartOMDataArr;
                    this.passedObject.chartUpdateKey = this.passedObject.chartUpdateKey + 1;
                    this.passedObject.chartXaxisMaxSample = this.tmpPassedObject.chartXaxisMaxSample;
                    this.passedObject.chartTickValue = this.tmpPassedObject.chartTickValue;
                    this.passedObject.chartXaxisOMData = this.tmpPassedObject.chartXaxisOMData;  
                    this.passedObject.chartYaxisStep = Number(this.tmpPassedObject.chartYaxisStep);
                    this.passedObject.chartRetainData = this.tmpPassedObject.chartRetainData;
                    this.passedObject.chartShowValueInLegend = this.tmpPassedObject.chartShowValueInLegend;
                    this.passedObject.chartShowSeconds = this.tmpPassedObject.chartShowSeconds;        
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
            addListItem(){
                let tmpNewDL = JSON.parse(JSON.stringify(this.refOMDataArrItem));
                this.tmpPassedObject.chartOMDataArr.push(tmpNewDL);
                this.editArrObj = this.tmpPassedObject.chartOMDataArr[this.tmpPassedObject.chartOMDataArr.length - 1];
                this.editArrIndex = (this.tmpPassedObject.chartOMDataArr.length - 1);
            },
            delListItem(arrIndex){
                this.tmpPassedObject.chartOMDataArr.splice(arrIndex,1);
                this.editArrObj = null;
                this.editArrIndex = null;
            },
            editListItem(arrIndex){
                this.editArrIndex = arrIndex;
                this.editArrObj = this.tmpPassedObject.chartOMDataArr[arrIndex];
            },
            saveListItem(){
                //saving is done elsewhere this just clears the line editing card of the current line
                this.editArrObj = null;
                this.editArrIndex = null;
            },
            closeOMSelector(txtVal){
                this.showOMSelector = !this.showOMSelector;
                if(txtVal){
                    this.editArrObj.OMString = txtVal;
                };
            },
            setShowSeconds(){
                if(this.tmpPassedObject.chartXaxisMaxSample < 61){
                    this.tmpPassedObject.chartShowSeconds = true;
                }else{
                    this.tmpPassedObject.chartShowSeconds = false;
                }
            }
        },
        mounted() {
            this.tmpPassedObject = JSON.parse(JSON.stringify(this.passedObject));
            //chart data lines array setup/validation
            if(this.tmpPassedObject.chartOMDataArr.length === 0){                
                this.tmpPassedObject.chartOMDataArr.push(JSON.parse(JSON.stringify(this.refOMDataArrItem)))
            }else{
                //DATA UPGRADE
                //validate the array contains the correct items - this will be needed if any updates are made to the array contents in future releases past 01.01.02 when charts introduced
                this.tmpPassedObject.chartOMDataArr.forEach(item => {
                    item.setPrecision ||= false;
                    item.precisionVal ||= 4;
                });
            }
        }
    }
</script>