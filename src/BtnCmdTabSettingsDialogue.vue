<style>
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
                    <v-toolbar-title>{{labelTitle}}</v-toolbar-title>
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
                            <v-text-field class="custom-label-color" :label="labelCaption" v-model="passedObject.caption"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="11">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-bind="attrs" v-on="on" label="Icon (mdi-[icon name])" v-model="passedObject.icon" placeholder="mdi-"></v-text-field>
                                </template>
                                <span>Material design icon (Format = mdi-[icon name])</span>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="1">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <a v-bind="attrs" v-on="on" href="https://pictogrammers.com/library/mdi/" target="_blank">
                                        <v-icon v-if="passedObject.icon.length>0" class="mr-1 pt-3">{{ passedObject.icon }}</v-icon>
                                        <v-icon v-if="passedObject.icon.length==0" class="mr-1 pt-3">mdi-cog</v-icon>
                                    </a>
                                </template>
                                <span>Click to open Material Design Icons web page</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Snap Buttons to Grid" v-model="passedObject.tabEnableSnap" @change="setGridSize()"></v-switch></span>
                                </template>
                                <span>Snap items to a grid when dragging</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>                    
                    <small>*indicates required field</small>
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
                alertReqVal: false,
                labelCaption: '',
                labelTitle: ''
            }
        },
        methods: {
            async sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            },
            async validateData() {
                if (this.passedObject.caption) {
                    //req fields met so exit
                        this.show = false;
                        return;
                }
                this.alertReqVal = true;
                await this.sleep(2000);
                this.alertReqVal = false;
            },
            setGridSize(){
                if(this.passedObject.tabEnableSnap){
                    this.passedObject.tabGridSize = [20,20];
                }else {
                    this.passedObject.tabGridSize = [1,1];
                }
            }
        },
        //automated functions
        mounted() {
            if(this.passedObject.embedTab){
                this.labelCaption = "Custom Panel Name*";
                this.labelTitle = "Edit Custom Panel";
            }else{
                this.labelCaption = "Tab Caption*";
                this.labelTitle = "Edit Tab";
            }
        }
    }
</script>
