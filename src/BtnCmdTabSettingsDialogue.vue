<template>
    <v-dialog v-model="show" persistent max-width="450">
        <v-row align="center" justify="center">
            <v-card>
                <v-card-title>
                    <span class="headline">Edit Tab</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field label="Tab Caption*" required v-model="passedObject.caption"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <div>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-bind="attrs" v-on="on" label="Icon (mdi-[icon name])" v-model="passedObject.icon" placeholder="mdi-"></v-text-field>
                                        </template>
                                        <span>Material design icons from https://materialdesignicons.com/ (Format = mdi-[icon name])</span>
                                    </v-tooltip>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>                            
                            <v-col cols="12">
                                <v-select :items="colItems" label="Number of Columns*" required v-model="passedObject.numberOfColumns"></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-checkbox label="Enable WebCam Panel" v-model="passedObject.showWebCam"></v-checkbox>
                            </v-col>
                        </v-row>
                        <v-row v-if="passedObject.showWebCam">
                            <v-col cols="12">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs" v-on="on"><v-checkbox label="Use Alternative WebCam" v-model="passedObject.showAltWebCam"></v-checkbox></span>
                                    </template>
                                    <span>Use a different Webcam to the default</span>
                                </v-tooltip>                            
                            </v-col>
                        </v-row>
                        <v-row v-if="passedObject.showAltWebCam">
                            <v-col cols="12">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-bind="attrs" v-on="on" label="Webcam URL*" v-model="passedObject.altWebCamParams.altWebCamURL" placeholder="http://"></v-text-field>
                                    </template>
                                    <span>URL of the Alt Webcam</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                        <v-row v-if="passedObject.showAltWebCam">
                            <v-col cols="12">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-bind="attrs" v-on="on" label="Webcam Image Click URL" v-model="passedObject.altWebCamParams.altWebCamClickURL" placeholder="http://"></v-text-field>
                                    </template>
                                    <span>URL to open on click of the Alt Webcam Img</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                        <v-row v-if="passedObject.showAltWebCam">
                            <v-col cols="6">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-select v-bind="attrs" v-on="on" :items="rotateItems" label="Webcam Rotation" required v-model="passedObject.altWebCamParams.altWebCamRotation"></v-select>
                                    </template>
                                    <span>Rotation Angle</span>
                                </v-tooltip>
                            </v-col>
                            <v-col cols="6">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-select v-bind="attrs" v-on="on" :items="flipItems" label="Flip" required v-model="passedObject.altWebCamParams.altWebCamFlip"></v-select>
                                    </template>
                                    <span>Flip Webcam Image</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                        <v-row v-if="passedObject.showAltWebCam" >
                            <v-col cols="12">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field v-bind="attrs" v-on="on" label="Refresh Period (ms)*" v-model="passedObject.altWebCamParams.altWebCamUpdateTimer" placeholder="5000"></v-text-field>
                                    </template>
                                    <span>Period in milliseconds to refresh image (min 5000)</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                        <v-row v-if="passedObject.showAltWebCam" >
                            <v-col cols="12">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs" v-on="on"><v-checkbox label="Remove extra HTTP qualifier on reload" v-model="passedObject.altWebCamAppndHTTP"></v-checkbox></span>
                                    </template>
                                    <span>Do not append extra HTTP qualifier when reloading images</span>
                                </v-tooltip>
                            </v-col>
                        </v-row>
                        <v-row v-if="passedObject.showAltWebCam" >
                            <v-col cols="12">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs" v-on="on"><v-checkbox label="Embedd Webcam image in iFrame" v-model="passedObject.altWebCamiFrame"></v-checkbox></span>
                                    </template>
                                    <span>Embedd Webcam image in iFrame</span>
                                </v-tooltip>                     
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-card-actions>
                        <small>*indicates required field</small>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="validateData()">
                            Close
                        </v-btn>
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-row>
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
                colItems: [
                    {text: 1, value: 12, disabled: false},
                    {text: 2, value: 6, disabled: false},
                    {text: 3, value: 4, disabled: false},
                    {text: 4, value: 3, disabled: false}
                ],
                rotateItems: [
                    {text: '0°', value: 0, disabled: false},
                    {text: '90°', value: 90, disabled: false},
                    {text: '180°', value: 180, disabled: false},
                    {text: '270°', value: 270, disabled: false}
                ],
                flipItems: [
                    {text: 'None', value: 'none', disabled: false},
                    {text: 'Flip X', value: 'x', disabled: false},
                    {text: 'Flip Y', value: 'y', disabled: false},
                    {text: 'Flip Both', value: 'both', disabled: false}
                ]
            }
        },
        methods: {
            validateData() {
                if (this.passedObject.caption && this.passedObject.numberOfColumns && !this.passedObject.showAltWebCam) {
                    //Not alt webcam and req fields met so exit
                        this.show = false;
                        return;
                }
                if (this.passedObject.caption && this.passedObject.numberOfColumns && this.passedObject.showAltWebCam) {
                   //Alt Webcam Selected
                        if(this.passedObject.altWebCamParams.altWebCamURL && this.passedObject.altWebCamParams.altWebCamUpdateTimer >= 5000) {
                            //req fields met so exit
                            this.show = false;
                            return;
                        }    
                }
            }
        }

    }
</script>
