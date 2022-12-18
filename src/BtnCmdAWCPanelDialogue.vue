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
                    <v-toolbar-title>Edit Alt Webcam Settings</v-toolbar-title>
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
                                    <v-text-field class="custom-label-color" v-bind="attrs" v-on="on" label="URL*" v-model="tmpURL" placeholder="http://"></v-text-field>
                                </template>
                                <span>URL of the Alt Webcam</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-bind="attrs" v-on="on" label="Webcam Image Click URL" v-model="passedObject.altWebCamParams.altWebCamClickURL" placeholder="http://"></v-text-field>
                                </template>
                                <span>URL to open on click of the Alt Webcam Img</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="9">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-bind="attrs" v-on="on" label="Webcam Config URL" v-model="passedObject.altWebCamParams.altWebCamConfigURL" placeholder="http://"></v-text-field>
                                </template>
                                <span>URL to open on click of the Config Button</span>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="3">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Open in New Tab" v-model="passedObject.altWebCamParams.altWebCamConfigNewWin"></v-switch></span>
                                </template>
                                <span>Open Config Page in new browser tab</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-select v-bind="attrs" v-on="on" :items="rotateItems" item-text="text" item-value="value" label="Webcam Rotation" required v-model="passedObject.altWebCamParams.altWebCamRotation"></v-select>
                                </template>
                                <span>Rotation Angle</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-select v-bind="attrs" v-on="on" :items="flipItems" item-text="text" item-value="value" label="Flip Webcam Img" required v-model="passedObject.altWebCamParams.altWebCamFlip"></v-select>
                                </template>
                                <span>Flip Webcam Image</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-bind="attrs" v-on="on" label="Refresh Period (ms)*" v-model.number="passedObject.altWebCamParams.altWebCamUpdateTimer" placeholder="0"></v-text-field>
                                </template>
                                <span>Period in milliseconds to refresh image</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Remove extra HTTP qualifier on reload" v-model="passedObject.altWebCamParams.altWebCamAppndHTTP"></v-switch></span>
                                </template>
                                <span>Do not append extra HTTP qualifier when reloading images</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-switch label="Embedd Webcam image in iFrame" v-model="passedObject.altWebCamParams.altWebCamiFrame"></v-switch></span>
                                </template>
                                <span>Embedd Webcam image in iFrame</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                </v-form>
                <tbody style="position: absolute; z-index:99999; bottom: 10%; left: 10%;">
                    <v-alert dense color="#C5C4C6" border="left" dismissible v-model="showInfo" close-text="Close Info" transition="scale-transition" @close="showInfo=!showInfo">
                        <span>Enter the details of the Webcam connection & display</span>
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
                if(this.passedObject.altWebCamParams.altWebCamURL && this.passedObject.altWebCamParams.altWebCamUpdateTimer >= 0) {
                    //req fields met so exit
                    this.$emit('exit', true);
                    this.show = false;
                    return;
                }
                this.alertReqVal = true;
                await this.sleep(2000);
                this.alertReqVal = false;
            }
        },
        mounted() {
            this.tmpURL = this.passedObject.altWebCamParams.altWebCamURL;
            this.tmpModelPath = this.passedObject.panelMMPath;
        }
    }
</script>