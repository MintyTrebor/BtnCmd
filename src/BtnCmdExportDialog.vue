<style scoped>
.TUICardVars {
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 200px;
  min-height: 200px;
}

.TUICardDVars {
  overflow-y: auto;
  overflow-x: hidden;
  /* max-height: 98%; */
  /* max-width: 99%; */
}

.TUIButton:focus::before {
  opacity: 0 !important;
}

.TUIButton:hover::before {
  opacity: 0.08 !important;
}
</style>
<template>
  <v-dialog v-model="internalShown" @keydown.escape="dismissed" width="60vw">
    <v-card class="TUICardDVars" height="70vh">
      <v-card-title>
        <v-row justify="center">
          <v-chip color="info"><span class="headline">Select Items for Export</span></v-chip>
        </v-row>
      </v-card-title>
      <v-row justify="center" class="mt-2" align="center">
        <v-col cols="6"><v-text-field v-model="exportFileName" label="Enter Export File Name" required clearable @change="validateFileName()"></v-text-field></v-col>
      </v-row>
      <v-row justify="center" class="pl-4 ml-4 pr-4 mr-4 mt-n6" align="center">
        <v-text-field v-model="exportComment" label="Enter a Export Comment" clearable></v-text-field>
      </v-row>
      <v-row dense class="pa-2 ma-2 mb-n6">
        <span>Select Layouts for Export</span>
      </v-row>
      <v-row justify="start" class="pa-2 ma-2" align="center">
        <v-col>
          <v-card style="min-width: 75%; min-height: 20vh; max-height: 20vh; overflow-y: auto;`" tile elevation="4" :color="getDWCPanelBGColor">
              <v-list nav :color="getDWCPanelBGColor">
                <v-list-item-group v-model="tmpExportIndex" multiple>
                  <v-list-item v-for="(item, i) in listTabs" :key="i" :value="item.value">
                    <v-list-item-content>
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
          </v-card>
        </v-col>
      </v-row>
      <v-row dense class="pa-2 ma-2  mb-n6">
        <span>Select Custom Panels for Export</span>
      </v-row>
      <v-row justify="start" class="pa-2 ma-2" align="center">
        <v-col>
          <v-card style="min-width: 75%; min-height: 20vh; max-height: 20vh; overflow-y: auto;`" tile elevation="4" :color="getDWCPanelBGColor">
              <v-list nav :color="getDWCPanelBGColor">
                <v-list-item-group v-model="tmpExportCPIndex" multiple>
                  <v-list-item v-for="(item, i) in listCustPanels" :key="i" :value="item.value">
                    <v-list-item-content>
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
          </v-card>
        </v-col>
      </v-row>
      <!-- <v-row justify="start" class="pa-2 ma-2" align="center">
        {{exportData}}
      </v-row> -->
      <v-row class="pa-0 ma-0" justify="center" align="center">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn rounded medium class="mr-2" :disabled="checkReqVals" style="cursor: pointer" color="info" v-bind="attrs" v-on="on" @click="doExport()">
              Export
            </v-btn>
            <v-btn rounded medium class="mr-2" style="cursor: pointer" color="info" v-bind="attrs" v-on="on" @click="dismissed()">
              Close
            </v-btn>
          </template>
          <span>Save & Export Selected Components</span>
        </v-tooltip>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
"use strict";
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
import Path from '../../utils/path.js';

export default {
  props: {
    shown: {
      type: Boolean,
      required: true,
    },
    btnCmd: Object
  },
  computed: {
    ...mapState('machine/model', {
        status: state => state.state.status,
        macrosDirectory: state => state.directories.macros,
        systemDirectory: state => state.directories.system
    }),
    ...mapGetters('machine/model', ['jobProgress']),
    ...mapState('machine/settings', ['codes']),
    ...mapState({
        darkTheme: state => state.settings.darkTheme,
    }),
    internalShown: {
      get() {
        return this.shown;
      },
      set(value) {
        if (value) {
          if (value == "save") {
            this.save();
          }
        } else {
          this.dismissed();
        }
      },
    },
    checkReqVals() {
      if(!this.exportFileName){
        return true;
      }
      if(!this.tmpExportIndex.length >= 1 && !this.tmpExportCPIndex.length >= 1){
        return true;
      }
      return false;
    },
    listTabs(){
      var ni = 0;
      var tmpArr = [];
      for(ni in this.btnCmd.tabs){
        if(!this.btnCmd.tabs[ni].embedTab){
          tmpArr.push({text: this.btnCmd.tabs[ni].caption, value: this.btnCmd.tabs[ni].tabID})
        }
      }
      return tmpArr;
    },
    listCustPanels(){
      var ni = 0;
      var tmpArr = [];
      for(ni in this.btnCmd.tabs){
        if(this.btnCmd.tabs[ni].embedTab){
          tmpArr.push({text: this.btnCmd.tabs[ni].caption, value: this.btnCmd.tabs[ni].tabID})
        }
      }
      return tmpArr;
    },
    getDWCPanelBGColor(){
				if(this.darkTheme){
					return "#515151";
          //return "red"
				}else{
					return "#f5f5f5";
          //return "#E0D6D6ED"
				}
		}
  },
  data: function () {
    return {
      bTemp: null,
      tmpExportIndex: [],
      tmpExportCPIndex: [],
      bSelectAllPages: false,
      exportFileName: null,
      exportComment: null,
      exportData: {}
    };
  },
  methods: {
    ...mapActions('machine', ['sendCode']),
		...mapActions('machine', {machineDownload: 'download', getFileList: 'getFileList'}),
    ...mapActions('machine', ['upload']),
		...mapMutations('machine/settings', ['addCode', 'removeCode']),
    async saveJSONToFile(tmpJSON, tmpFName) {
			const content = new Blob([JSON.stringify(tmpJSON)]);
			const setFileName = Path.combine(this.systemDirectory, `${tmpFName}.json`);
			try {
				await this.upload({ filename: setFileName, content, showSuccess: true });
        return true;
			} catch (e) {
				console.warn(e);
        return false;
			}
		},
    dismissed() {
      this.tmpExportIndex = [];
      this.tmpExportCPIndex = [];
      this.bSelectAllPages = false;
      this.exportFileName = null;
      this.exportComment = null;
      this.exportData = {};
      this.$emit("update:shown", false);
    },
    doExport(){
      //export the selected data to a file
      //create the export object json
      var ni = 0;
      var ei = 0;
      //var vi = 0;
      var tmpJSON = {
        btns: [], 
        tabs: [],
        panels: [],
        exportDate: new Date().toJSON().slice(0,10).replace(/-/g,'/'),
        btnCmdVer: this.btnCmd.btnCmdVersion,
        exportComment: this.exportComment,
        exportResW: window.screen.width * window.devicePixelRatio,
        exportResH: window.screen.height * window.devicePixelRatio
      }
      //get the tabs to be exported into tmpJSON
      if(this.tmpExportIndex.length >= 1){
        ei = 0;
        for(ei in this.tmpExportIndex){
          tmpJSON.tabs = tmpJSON.tabs.concat(this.btnCmd.tabs.filter(item => item.tabID == this.tmpExportIndex[ei]))
          tmpJSON.panels = tmpJSON.panels.concat(this.btnCmd.panels.filter(item => item.tabID == this.tmpExportIndex[ei]))
          tmpJSON.btns = tmpJSON.btns.concat(this.btnCmd.btns.filter(item => item.btnGroupIdx == this.tmpExportIndex[ei]))
        }
        //identify any custom panels and ensure they are added to the custom panel import queue
        let tmpCustPanIdx = tmpJSON.panels.filter(item => item.tabID == this.tmpExportIndex[ei] && item.customPanelID)
        ni=0;
        for(ni in tmpCustPanIdx){
          if(this.tmpExportCPIndex.length >=1){
            this.tmpExportCPIndex = this.tmpExportCPIndex.filter(item => item != tmpCustPanIdx[ni].customPanelID);
          }
          this.tmpExportCPIndex.push(tmpCustPanIdx[ni].customPanelID)
        }
      }
      //Get the custom Panels
      if(this.tmpExportCPIndex.length >= 1){
        ei = 0;
        for(ei in this.tmpExportCPIndex){
          tmpJSON.tabs = tmpJSON.tabs.concat(this.btnCmd.tabs.filter(item => item.tabID == this.tmpExportCPIndex[ei]))
          tmpJSON.panels = tmpJSON.panels.concat(this.btnCmd.panels.filter(item => item.tabID == this.tmpExportCPIndex[ei]))
          tmpJSON.btns = tmpJSON.btns.concat(this.btnCmd.btns.filter(item => item.btnGroupIdx == this.tmpExportCPIndex[ei]))
        }
      }
      //export file
      this.exportData = tmpJSON;
      if(this.downloadFile(tmpJSON, this.exportFileName)){
        this.dismissed()
      }else{
        this.$makeNotification('error', 'Export Failed', 'The export file creation encountered an error');
      }
    },
    downloadFile(expData, expFileName){
      try{const data = JSON.stringify(expData)
        const blob = new Blob([data], {type: 'text/plain'})
        const e = new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: 20,
        });
        var a = document.createElement('a');
        a.download = `${expFileName}.json`;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        a.dispatchEvent(e);
        return true;
      }catch{
        return false;
      }
    },
    validateFileName(){
			if(this.exportFileName.length !== 0){
				var newName = this.exportFileName.replace(/\n/g," ").replace(/[<>:"/\\|?*]| +$/g,"").replace(/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/,x=>x+"_");
				this.exportFileName = newName;
      }		
		},
  },
};
</script>
