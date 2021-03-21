<template>
    <v-dialog v-model="show" persistent max-width="400">
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
                ]
            }
        },
        methods: {
            validateData() {
                if (this.passedObject.caption && this.passedObject.numberOfColumns) {
                    
                        this.show = false;
                        return;

                }
            }
        }

    }
</script>
