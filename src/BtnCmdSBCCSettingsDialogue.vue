<style>
    .custom-label-color .v-label {
        color: red;
        opacity: 1;
    }
</style>
<template>
    <v-dialog v-model="show" persistent max-width="1200px">
        <v-card style="overflow-x: hidden;" class="pa-0 ma-0">
            <v-card-text>
                <v-data-table :headers="headers" :items="tmpSBCCUsr.SBCC_Cmds" :options="SBCCTableOptions" item-key="SBCC_Cmd_ID" sort-by="SBCC_Cmd_ID" class="elevation-1 pa-0 ma-0">
                    <template v-slot:top>
                        <v-toolbar dark dense>
                            <v-toolbar-title><v-icon x-large>mdi-powershell</v-icon>SBC Commands</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-bind="attrs" medium v-on="on" @click="newSBCCmd()"><v-icon x-large>mdi-plus-box</v-icon></v-btn>
                                </template>
                                <span>Add New command</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-bind="attrs" medium v-on="on" @click="dialog2 = !dialog2"><v-icon x-large>mdi-cog</v-icon></v-btn>
                                </template>
                                <span>Edit SBCC Settings</span>
                            </v-tooltip>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-bind="attrs" medium v-on="on" @click="closeMainSBCCDialog()"><v-icon x-large>mdi-close-box</v-icon></v-btn>
                                </template>
                                <span>Close</span>
                            </v-tooltip>
                            <v-dialog v-model="dialog" persistent max-width="700px">
                                <v-card>
                                    <v-card-title>
                                        <v-toolbar dark dense>
                                            <v-toolbar-title>Edit Command</v-toolbar-title>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue darken-1" text @click="validateData()">Close</v-btn>
                                        </v-toolbar>
                                        <v-alert style="position: absolute; z-index:99999;" :value="alertReqVal" type="error" transition="scale-transition">Required Values have not been entered!</v-alert>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-row dense class="mx-2 my-n4">
                                            <v-col cols="12" class="ma-0 pa-0">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field v-bind="attrs" v-on="on" label="Command Name" v-model="editItem.SBCC_Cmd_Name"></v-text-field>
                                                    </template>
                                                    <span>Enter a friendly name for the command</span>
                                                </v-tooltip>    
                                            </v-col>
                                        </v-row>
                                        <v-row dense class="mx-2 my-n4">
                                            <v-col cols="12" class="ma-0 pa-0">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field v-bind="attrs" v-on="on" label="Command" v-model="editItem.SBCC_Cmd_CmdText"></v-text-field>
                                                    </template>
                                                    <span>Select the event on action type</span>
                                                </v-tooltip>    
                                            </v-col>
                                        </v-row>
                                        <v-row dense class="mx-2 my-n4">
                                            <v-col cols="12" class="ma-0 pa-0">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field v-bind="attrs" v-on="on" label="Timeout" number v-model="editItem.SBCC_Cmd_Timeout"></v-text-field>
                                                    </template>
                                                    <span>Timeout (sec)</span>
                                                </v-tooltip>    
                                            </v-col>
                                        </v-row>
                                        <v-row dense class="mx-2 my-n4">
                                            <v-col cols="6" class="ma-0 pa-0">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <span v-bind="attrs" v-on="on"><v-switch label="Enable In Job" v-model="editItem.Enable_In_Job"></v-switch></span>
                                                    </template>
                                                    <span>Enable In Job</span>
                                                </v-tooltip>    
                                            </v-col>
                                            <v-col cols="6" class="ma-0 pa-0">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <span v-bind="attrs" v-on="on"><v-switch label="Show Result" v-model="editItem.SBCC_ShowResult"></v-switch></span>
                                                    </template>
                                                    <span>Show a window with the raw command result</span>
                                                </v-tooltip>    
                                            </v-col>
                                        </v-row>
                                        <v-row dense class="mx-2 my-n4">
                                            <v-col cols="12">                                       
                                                <small>*indicates required field</small>
                                            </v-col>
                                        </v-row> 
                                    </v-card-text>
                                </v-card>
                            </v-dialog>
                            <v-dialog v-model="dialog2" persistent max-width="700px">
                                <v-card>
                                    <v-card-title>
                                        <v-toolbar dark dense>
                                            <v-toolbar-title>Edit SBCC Settings</v-toolbar-title>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue darken-1" text @click="closeSBCCSettings()">Close</v-btn>
                                        </v-toolbar>
                                        <v-alert style="position: absolute; z-index:99999;" :value="alertReqVal" type="error" transition="scale-transition">Required Values have not been entered!</v-alert>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-row align="center" justify="center">
                                            <v-col cols="10">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field v-bind="attrs" v-on="on" number required label="API Key*" v-model="tmpSBCCUsr.SBCCSettings['API_KEY']"></v-text-field>
                                                    </template>
                                                    <span>API Key</span>
                                                </v-tooltip>    
                                            </v-col>
                                            <v-col cols="1">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-btn v-bind="attrs" small v-on="on" @click="newAPI()"><v-icon>mdi-lock-reset</v-icon></v-btn>
                                                    </template>
                                                    <span>Generate a new Key - !WARNING! A New Key will require a manual re-start of the SBCC service.</span>
                                                </v-tooltip>    
                                            </v-col>
                                        </v-row>
                                        <v-row align="center" justify="center">
                                            <v-col cols="11" >
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field v-bind="attrs" number required v-on="on" label="Port*" v-model="tmpSBCCUsr.SBCCSettings['HTTP_Port']"></v-text-field>
                                                    </template>
                                                    <span>Specifiy the port the SBCC service listens on</span>
                                                </v-tooltip>    
                                            </v-col>
                                        </v-row>
                                        <v-row align="center" justify="center">
                                            <v-col cols="11" >
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field v-bind="attrs" number required v-on="on" label="Subnet*" v-model="tmpSBCCUsr.SBCCSettings['SUBNET']"></v-text-field>
                                                    </template>
                                                    <span>Specifiy the subnet the SBCC service will accept commands from eg 192.168.0.1/24 (0.0.0.0 = any)</span>
                                                </v-tooltip>    
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="12">                                       
                                                <small>*indicates required field</small>
                                            </v-col>
                                        </v-row> 
                                    </v-card-text>
                                </v-card>
                            </v-dialog>
                            <confirm-dialog :shown.sync="confirmDelEvents" title="Confirm Delete" prompt="Delete Command ?" @confirmed="delSBCCmdConfirm()"></confirm-dialog>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-icon small class="mr-2" @click="editSBCCmd(item)">mdi-pencil</v-icon>
                        <v-icon small class="mr-2" @click="deleteSBCCmd(item.SBCC_Cmd_ID)">mdi-delete</v-icon>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>


<script>
    import store from "@/store";
    export default {
        props: {
            value: Boolean,
            tmpSBCCUsr: {
                type: Object
            },
            bMQTT: Boolean
        },
        computed: {
            systemDirectory() {
                return store.state.machine.model.directories.system;
            },
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
                dialog: false,
                dialog2: false,
                confirmDelEvents: false,
                deleteItem: null,
                SBCCTableOptions: {
                    itemsPerPage: 5,
                },
                headers: [
                    { text: 'Command ID', value: 'SBCC_Cmd_ID' },
                    { text: 'Name', value: 'SBCC_Cmd_Name' },
                    { text: 'Command', value: 'SBCC_Cmd_CmdText' },
                    { text: 'Enable In Job', value: 'Enable_In_Job', sortable: false },
                    { text: 'Timeout', value: 'SBCC_Cmd_Timeout', sortable: false },
                    { text: 'Show Result', value: 'SBCC_ShowResult', sortable: false },
                    { text: 'Actions', value: 'actions', sortable: false },
                ],
                editItem: {
                    SBCC_Cmd_ID: null,
                    SBCC_Cmd_Name: "Enter Name",
                    SBCC_Cmd_CmdText: "Enter command to execute on SBC",
                    Enable_In_Job: false,
                    SBCC_Cmd_Timeout: 30,
                    SBCC_ShowResult: false
                }
            }
        },
        methods: {
            async sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            },
            async validateData() {
                var bOKToClose = true;
                if(this.editItem.eventEnabled){
                    if(!this.editItem.SBCC_Cmd_Name){
                        bOKToClose = false;
                    }else if(!this.editItem.SBCC_Cmd_CmdText){
                        bOKToClose = false;
                    }else if(this.editItem.SBCC_Cmd_Timeout < 1){
                        bOKToClose = false;
                    }
                }
                if(!bOKToClose){
                    this.alertReqVal = true;
                    await this.sleep(2000);
                    this.alertReqVal = false;
                    return;
                }else {
                    this.dialog = false;
                    return;
                }                
            },
            delSBCCmdConfirm(){
                var requiredIndex = this.tmpSBCCUsr.SBCC_Cmds.findIndex(el => el.SBCC_Cmd_ID == this.deleteItem);
                if(requiredIndex === -1){
                    return false;
                }
                this.tmpSBCCUsr.SBCC_Cmds.splice(requiredIndex, 1);
                this.deleteItem = null;
            },
            editSBCCmd(eventItem){
                this.editItem = eventItem;
                this.dialog = true;
            },
            deleteSBCCmd(eventItem){
                this.deleteItem = eventItem;
                this.confirmDelEvents = true;
            },
            newSBCCmd(){
                var newID = this.tmpSBCCUsr.systemSettings.last_SBCC_Cmd_ID + 1;
                this.tmpSBCCUsr.systemSettings.last_SBCC_Cmd_ID = newID;
                var newSBCCObj ={
                    SBCC_Cmd_ID: newID,
                    SBCC_Cmd_Name: "New SBCC",
                    SBCC_Cmd_CmdText: "Command",
                    Enable_In_Job: false,
                    SBCC_Cmd_Timeout: 30,
                    SBCC_ShowResult: false
                }
                this.tmpSBCCUsr.SBCC_Cmds.push(newSBCCObj);
                this.editSBCCmd(newSBCCObj);
            },
            newAPI(){
                this.tmpSBCCUsr.SBCCSettings['API_KEY'] = this.generateUUID('SBCC');
                this.$makeNotification('info', 'API Change:', `Because you have changed the API key, the SBCC Service requires a manual restart.`);

            },
            closeSBCCSettings(){
                this.dialog2 = false;
                this.$emit('updateSettings', true);
            },
            closeMainSBCCDialog(){
                this.$emit('exit', true);
                this.show = false;
            },
            generateUUID(strType) { 
                // based on code from Public Domain/MIT
                var d = new Date().getTime();
                if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
                    d += performance.now(); //use high-precision timer if available
                }
                var tmpMask = `xxxxxxxx-xxxx-${strType}xxx-yxxx-xxxxxxxxxxxx`
                var newGuid = tmpMask.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });            
                return newGuid;
            },
		},
    }
</script>