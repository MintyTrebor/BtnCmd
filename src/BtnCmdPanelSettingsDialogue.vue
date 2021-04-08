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
        <v-card style="overflow-x: hidden;">
			<v-card-title class="container">
				<v-toolbar dark dense>
                    <v-toolbar-title>Edit Panel</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="validateData()">
                        Close
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
                                    <v-select v-bind="attrs" v-on="on" :items="panelItems" item-text="text" item-value="value" label="Webcam Rotation" required v-model="passedObject.panelType"></v-select>
                                </template>
                                <span>Select Panel</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="!enableSelects">
                        <v-col cols="12">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-radio-group v-bind="attrs" v-on="on" label="Flip Webcam Img:" v-model="passedObject.panelType" row required>
                                        <v-radio v-for="type in panelItems" :key="type" :label="type.text" :value="type.value"></v-radio>
                                    </v-radio-group>
                                </template>
                                <span>Select Panel</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="passedObject.panelType == 'altwebcam'">
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field class="custom-label-color" v-bind="attrs" v-on="on" label="Webcam URL*" v-model="passedObject.altWebCamParams.altWebCamURL" placeholder="http://"></v-text-field>
                                </template>
                                <span>URL of the Alt Webcam</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="passedObject.panelType == 'altwebcam'">
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-bind="attrs" v-on="on" label="Webcam Image Click URL" v-model="passedObject.altWebCamParams.altWebCamClickURL" placeholder="http://"></v-text-field>
                                </template>
                                <span>URL to open on click of the Alt Webcam Img</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="passedObject.panelType == 'altwebcam'">
                        <v-col cols="12">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-radio-group v-bind="attrs" v-on="on" label="Webcam Rotation:" v-model="passedObject.altWebCamParams.altWebCamRotation" row required>
                                        <v-radio v-for="type in rotateItems" :key="type" :label="type.text" :value="type.value"></v-radio>
                                    </v-radio-group>
                                </template>
                                <span>Rotation Angle</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="passedObject.panelType == 'altwebcam' && enableSelects">
                        <v-col cols="12">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-select v-bind="attrs" v-on="on" :items="rotateItems" item-text="text" item-value="value" label="Webcam Rotation" required v-model="passedObject.altWebCamParams.altWebCamRotation"></v-select>
                                </template>
                                <span>Rotation Angle</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="passedObject.panelType == 'altwebcam'&& !enableSelects">
                        <v-col cols="12">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-radio-group v-bind="attrs" v-on="on" label="Flip Webcam Img:" v-model="passedObject.altWebCamParams.altWebCamFlip" row required>
                                        <v-radio v-for="type in flipItems" :key="type" :label="type.text" :value="type.value"></v-radio>
                                    </v-radio-group>
                                </template>
                                <span>Flip Webcam Image</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="passedObject.panelType == 'altwebcam' && enableSelects">
                        <v-col cols="12">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-select v-bind="attrs" v-on="on" :items="flipItems" item-text="text" item-value="value" label="Flip Webcam Img" required v-model="passedObject.altWebCamParams.altWebCamFlip"></v-select>
                                </template>
                                <span>Flip Webcam Image</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="passedObject.panelType == 'altwebcam'">
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-bind="attrs" v-on="on" label="Refresh Period (ms)*" v-model="passedObject.altWebCamParams.altWebCamUpdateTimer" placeholder="5000"></v-text-field>
                                </template>
                                <span>Period in milliseconds to refresh image (min 5000)</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="passedObject.panelType == 'altwebcam'">
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-checkbox label="Remove extra HTTP qualifier on reload" v-model="passedObject.altWebCamAppndHTTP"></v-checkbox></span>
                                </template>
                                <span>Do not append extra HTTP qualifier when reloading images</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row dense v-if="passedObject.panelType == 'altwebcam'">
                        <v-col cols="12">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on"><v-checkbox label="Embedd Webcam image in iFrame" v-model="passedObject.altWebCamiFrame"></v-checkbox></span>
                                </template>
                                <span>Embedd Webcam image in iFrame</span>
                            </v-tooltip>
                        </v-col>
                    </v-row>
                    <v-row>
                    <small>*indicates required field</small>
                    <v-spacer></v-spacer>
                    <div class="mx-2">
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn x-small fab color="primary" v-bind="attrs" v-on="on" :elevation="1" :disabled="editMode || backupMode" @click="showInfo = !showInfo">
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
                        Choose from a selection of DWC panels to include<br>
                        in your tab layout. Webcam panels can be fully<br>
                        resized. Other DWC panels are restricted to<br>
                        resizing by width only.
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
                panelItems: [
                    {text: 'DWC Webcam', value: 'webcam'},
                    {text: 'Alt Webcam', value: 'altwebcam'},
                    {text: 'Job Info', value: 'jobinfo'},
                    {text: 'Layer Chart', value: 'layerchart'},
                    {text: 'Collected Data', value: 'collectdata'},
                    {text: 'Job Estimations', value: 'jobestimates'},
                    {text: 'Speed', value: 'speed'},
                    {text: 'Fans', value: 'fans'}
                ],
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
                showInfo: false
            }
        },
        methods: {
            async sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            },
            async validateData() {
                if (this.passedObject.panelType == 'altwebcam') {
                   //Alt Webcam Selected
                    if(this.passedObject.altWebCamParams.altWebCamURL && this.passedObject.altWebCamParams.altWebCamUpdateTimer >= 5000) {
                        //req fields met so exit
                        this.show = false;
                        return;
                    }
                }else if (this.passedObject.panelType) {
                    //Not alt webcam and req fields met so exit
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