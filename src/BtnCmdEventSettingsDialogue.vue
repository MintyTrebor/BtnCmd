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
    <v-dialog v-model="show" persistent max-width="1200px">
        <v-card style="overflow-x: hidden;">
            <v-card-text>
                <v-data-table :headers="headers" :items="passedObject.monitoredEvents" :options="eventTableOptions" item-key="eventID" sort-by="eventID" class="elevation-1">
                    <template v-slot:top>
                        <v-toolbar dark dense>
                            <v-toolbar-title>Monitored Status Events</v-toolbar-title>
                            <v-divider class="mx-4" inset vertical></v-divider>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="newEvent()">New Event</v-btn>
                            <v-btn color="blue darken-1" text @click="show = false;">Close</v-btn>
                            <v-dialog v-model="dialog" persistent max-width="700px">
                                <v-card>
                                    <v-card-title class="container">
                                        <v-toolbar dark dense>
                                            <v-toolbar-title>Edit Event</v-toolbar-title>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue darken-1" text @click="validateData()">Close</v-btn>
                                        </v-toolbar>
                                        <v-alert style="position: absolute; z-index:99999;" :value="alertReqVal" type="error" transition="scale-transition">Required Values have not been entered!</v-alert>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-row dense class="mx-2 my-n4" v-if="!enableSelects">
                                            <v-col cols="12">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-radio-group  v-bind="attrs" v-on="on" v-model="editItem.eventTrigActionType" row required>
                                                            <v-subheader class="custom-label-color" v-bind="attrs" v-on="on">Event Type:</v-subheader>
                                                            <v-radio v-bind="attrs" v-on="on" v-for="type in radioItems" :key="type" :label="type.text" :value="type.value"></v-radio>
                                                        </v-radio-group>
                                                    </template>
                                                    <span>Select the event on action type</span>
                                                </v-tooltip>    
                                            </v-col>
                                        </v-row>
                                        <v-row dense class="mx-2 my-n4" v-if="enableSelects">
                                            <v-col cols="12">
                                                <v-select :items="radioItems" class="custom-label-color" item-text="text" item-value="value" label="Event Type" required v-model="editItem.eventTrigActionType"></v-select>
                                            </v-col>
                                        </v-row>
                                        <v-row dense class="mx-2 my-n4">
                                            <v-col cols="12">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field v-bind="attrs" v-on="on" class="custom-label-color" label="Name*" v-model="editItem.eventName" placeholder=""></v-text-field>
                                                    </template>
                                                    <span>Event Name</span>
                                                </v-tooltip>
                                            </v-col>
                                        </v-row>
                                        <v-row dense class="mx-2 my-n4" v-if="!enableSelects">
                                            <v-col cols="12">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-radio-group v-bind="attrs" v-on="on" v-model="editItem.eventTrigValue" row required>
                                                            <v-subheader class="custom-label-color" v-bind="attrs" v-on="on" >Status:</v-subheader>
                                                            <v-radio v-bind="attrs" v-on="on" v-for="type in trigValueItems" :key="type" :label="type.text" :value="type.value"></v-radio>
                                                        </v-radio-group>
                                                    </template>
                                                    <span>Status value to trigger the event</span>
                                                </v-tooltip>
                                            </v-col>
                                        </v-row>
                                        <v-row dense class="mx-2 my-n4" v-if="enableSelects">
                                            <v-col cols="12">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-select :items="trigValueItems" class="custom-label-color" v-bind="attrs" v-on="on" item-text="text" item-value="value" label="Status" required v-model="editItem.eventTrigValue"></v-select>
                                                    </template>
                                                    <span>Status value to trigger the event</span>
                                                </v-tooltip>
                                            </v-col>
                                        </v-row>
                                        <v-row dense class="mx-2 my-n4">
                                            <v-col cols="12">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field v-bind="attrs" v-on="on" class="custom-label-color" :label="actionLabel()" v-model="editItem.eventTrigActionCmd" placeholder=""></v-text-field>
                                                    </template>
                                                    <span v-if="editItem.eventTrigActionType=='http'">Enter GET url. e.g http://[address]/params . </span>
                                                    <span v-if="editItem.eventTrigActionType=='MQTT'">Enter the message text to send</span>
                                                    <span v-if="editItem.eventTrigActionType=='telegram'">Enter message text to send to telegram</span>
                                                </v-tooltip>
                                            </v-col>
                                        </v-row>
                                        <v-row dense class="mx-2 my-n4" v-if="editItem.eventTrigActionType=='MQTT'">
                                            <v-col cols="12">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field v-bind="attrs" v-on="on" class="custom-label-color" label="MQTT Topic*" v-model="editItem.eventTrigActionTopic" placeholder=""></v-text-field>
                                                    </template>
                                                    <span>MQTT Topic</span>
                                                </v-tooltip>
                                            </v-col>
                                        </v-row>
                                        <v-row dense class="mx-2 my-n4" v-if="editItem.eventTrigActionType=='telegram'">
                                            <v-col cols="12">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field v-bind="attrs" v-on="on" class="custom-label-color" label="Chat ID*" v-model="editItem.eventTgrmChatID" placeholder=""></v-text-field>
                                                    </template>
                                                    <span>Telegram Chat ID</span>
                                                </v-tooltip>
                                            </v-col>
                                        </v-row>
                                        <v-row dense class="mx-2 my-n4" v-if="editItem.eventTrigActionType=='telegram'">
                                            <v-col cols="12">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <v-text-field v-bind="attrs" v-on="on" class="custom-label-color" label="API Token*" v-model="editItem.eventTgrmAPIToken" placeholder=""></v-text-field>
                                                    </template>
                                                    <span>Telegram API Token</span>
                                                </v-tooltip>
                                            </v-col>
                                        </v-row>
                                        <v-row dense class="mx-2 my-n4">
                                            <v-col cols="12">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on, attrs }">
                                                        <span v-bind="attrs" v-on="on"><v-checkbox label="Enable" v-model="editItem.eventEnabled"></v-checkbox></span>
                                                    </template>
                                                    <span>Enable this event</span>
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
                            <confirm-dialog :shown.sync="confirmDelEvents" title="Confirm Delete" prompt="Delete Event ?" @confirmed="delEventConfirm()"></confirm-dialog>
                        </v-toolbar>
                    </template>
                    <template v-slot:item.eventEnabled="{ item }">
                        <span v-if="item.eventEnabled">Yes</span>
                        <span v-if="!item.eventEnabled">No</span>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-icon small class="mr-2" @click="editEvent(item)">mdi-pencil</v-icon>
                        <v-icon small class="mr-2" @click="cloneEvent(item)">mdi-content-duplicate</v-icon>
                        <v-icon small class="mr-2" @click="deleteEvent(item.eventID)">mdi-delete</v-icon>
                    </template>
                </v-data-table>
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
            bMQTT: Boolean,
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
            },
            typeItems() {
                return [
                    {text: 'http', value: 'http', disabled: false},
                    {text: 'Telegram', value: 'telegram', disabled: false},
                    {text: 'MQTT', value: 'MQTT', disabled: !this.bMQTT}
                ]
            },
            radioItems() {
                return this.typeItems.filter(item => {return item.disabled === false});
            },
            
        },
        data: function () {
            return {
                alertReqVal: false,
                dialog: false,
                confirmDelEvents: false,
                deleteItem: null,
                eventTableOptions: {
                    itemsPerPage: 5,
                },
                trigValueItems:[
                    {text: 'halted', value: 'halted', disabled: false},
                    {text: 'paused', value: 'paused', disabled: false},
                    {text: 'busy', value: 'busy', disabled: false},
                    {text: 'changingTool', value: 'changingTool', disabled: false},
                    {text: 'idle', value: 'idle', disabled: false}
                ],
                headers: [
                    { text: 'Event ID', value: 'eventID' },
                    { text: 'Name', value: 'eventName' },
                    { text: 'Type', value: 'eventTrigActionType' },
                    { text: 'Status Trigger', value: 'eventTrigValue' },
                    { text: 'Enabled', value: 'eventEnabled' },
                    { text: 'Actions', value: 'actions', sortable: false },
                ],
                editItem: {
                    eventID: null,
                    eventType: 'status',
                    eventOnlyInPrint: true,
                    eventTrigValue: '',
                    eventTrigActionType: '',
                    eventTrigActionCmd: '',
                    eventTrigActionTopic: '',
                    eventEnabled: false,
                    eventName: '',
                    eventTgrmChatID: '',
                    eventTgrmAPIToken: ''
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
                    if(!this.editItem.eventTrigActionCmd){
                        bOKToClose = false;
                    }else if(this.editItem.eventTrigActionType === 'MQTT' && !this.editItem.eventTrigActionTopic){
                        bOKToClose = false;
                    }else if(this.editItem.eventTrigActionType === 'telegram'){
                        if(!this.editItem.eventTgrmChatID || !this.editItem.eventTgrmAPIToken){
                            bOKToClose = false;
                        }
                    }
                }
                if(!bOKToClose){
                    this.alertReqVal = true;
                    await this.sleep(2000);
                    this.alertReqVal = false;
                    return;
                }else {
                    localStorage.setItem('btnCmdsettings', JSON.stringify(this.passedObject));
                    this.dialog = false;
                    return;
                }                
            },
            delEventConfirm(){
                var requiredIndex = this.passedObject.monitoredEvents.findIndex(el => el.eventID == this.deleteItem);
                if(requiredIndex === -1){
                    return false;
                }
                this.passedObject.monitoredEvents.splice(requiredIndex, 1);
                this.deleteItem = null;
            },
            editEvent(eventItem){
                this.editItem = eventItem;
                this.dialog = true;
            },
            deleteEvent(eventItem){
                this.deleteItem = eventItem;
                this.confirmDelEvents = true;
            },
            newEvent(){
                var newEventID = this.passedObject.lastEventID + 1;
                this.passedObject.lastEventID = newEventID;
                var newEventObj ={
                    eventID: newEventID,
                    eventType: 'status',
                    eventOnlyInPrint: true,
                    eventTrigValue: '',
                    eventTrigActionType: 'http',
                    eventTrigActionCmd: '',
                    eventTrigActionTopic: '',
                    eventEnabled: false,
                    eventName: 'New Event ' + newEventID,
                    eventTgrmChatID: '',
                    eventTgrmAPIToken: ''
                }
                this.passedObject.monitoredEvents.push(newEventObj);
                this.editEvent(newEventObj);
            },
            cloneEvent(eventItem){
                var newEventID = this.passedObject.lastEventID + 1;
                this.passedObject.lastEventID = newEventID;
                var newEventObj ={
                    eventID: newEventID,
                    eventType: eventItem.eventType,
                    eventOnlyInPrint: eventItem.eventOnlyInPrint,
                    eventTrigValue: eventItem.eventTrigValue,
                    eventTrigActionType: eventItem.eventTrigActionType,
                    eventTrigActionCmd: eventItem.eventTrigActionCmd,
                    eventTrigActionTopic: eventItem.eventTrigActionTopic,
                    eventEnabled: eventItem.eventEnabled,
                    eventName: eventItem.eventName + ' ' + newEventID,
                    eventTgrmChatID: eventItem.eventTgrmChatID,
                    eventTgrmAPIToken: eventItem.eventTgrmAPIToken
                }
                this.passedObject.monitoredEvents.push(newEventObj);
                this.editEvent(newEventObj);
            },
            actionLabel() {
                if (this.editItem.eventTrigActionType == "http") {return "URL*";}
                if (this.editItem.eventTrigActionType == "MQTT") {return "MQTT MSG*";}
                if (this.editItem.eventTrigActionType == "telegram") {return "Telegram MSG*";}
            }
        }
    }
</script>