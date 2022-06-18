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
    <v-card class="TUICardDVars" height="70vh" >
      <v-card-title>
        <v-row justify="center">
          <v-chip color="info"><span class="headline">Import Layouts & Custom Panels</span></v-chip>
        </v-row>
      </v-card-title>
      <v-row justify="start" class="pt-2 mt-2 pl-2 ml-2"  align="center">
        <v-col cols="5"><v-file-input accept=".json" v-model="exportFile" label="Choose File" required clearable @change="processFile()" @click:clear="clearData()"></v-file-input></v-col>
        <v-spacer></v-spacer>
        <v-col cols="6" v-if="exportData">Comment : {{exportData.exportComment}}</v-col>
      </v-row>
      <v-row v-if="bShowResWarning && !bShowVerWarning" dense class="mt-n6" justify="center">
        <v-chip color="red"><span>WARNING! Your screen resolution does not match source. Imported items may not display correctly!</span></v-chip>
      </v-row>
      <v-row v-if="bShowVerWarning" dense justify="center">
        <v-chip color="red"><span>IMPORT DISABLED : This file was created on a newer version of btnCmd</span></v-chip>
      </v-row>
      <v-row dense class="pa-2 ma-2 mb-n6">
        <span>Select Layouts for Import</span>
      </v-row>
      <v-row justify="start" class="pa-2 ma-2" align="center">
        <v-col>
          <v-card style="min-width: 75%; min-height: 20vh; max-height: 20vh; overflow-y: auto;`" tile elevation="4" :color="getDWCPanelBGColor">
              <v-list nav :color="getDWCPanelBGColor">
                <v-list-item-group v-model="tmpExportIndex" multiple>
                  <v-list-item v-for="(item, i) in listTabs" :key="i" :value="item.value">
                    <v-list-item-content>
                      <span :class="item.color"><v-list-item-title v-text="item.text"></v-list-item-title></span>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
          </v-card>
        </v-col>
      </v-row>
      <v-row dense class="pa-2 ma-2  mb-n6">
        <span>Select Custom Panels for Import</span>
      </v-row>
      <v-row justify="start" class="pa-2 ma-2" align="center">
        <v-col>
          <v-card style="min-width: 75%; min-height: 20vh; max-height: 20vh; overflow-y: auto;`" tile elevation="4" :color="getDWCPanelBGColor">
              <v-list nav :color="getDWCPanelBGColor">
                <v-list-item-group v-model="tmpExportCPIndex" multiple>
                  <v-list-item v-for="(item, i) in listCustPanels" :key="i" :value="item.value">
                    <v-list-item-content >
                      <span :class="item.color"><v-list-item-title v-text="item.text"></v-list-item-title></span>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
          </v-card>
        </v-col>
      </v-row>
      <v-row dense class="pa-2 ma-2 mt-n6" v-if="bSHowExistWarning" justify="center">
        <span class="red--text text-caption">Items shown in RED already exist in your current configuration. Importing them will overwrite your current configuration.</span>
      </v-row>
      <!-- <v-row justify="start" class="pa-2 ma-2" align="center">
        {{exportData}}
      </v-row> -->
      <v-row class="pa-2 ma-2" justify="center" align="center">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn rounded medium class="mr-2" :disabled="checkReqVals || bShowVerWarning" style="cursor: pointer" color="info" v-bind="attrs" v-on="on" @click="doImport()">
              Import
            </v-btn>
          </template>
          <span>Import Selected Items</span>
        </v-tooltip>
        <v-btn rounded medium class="mr-2" style="cursor: pointer" color="info" @click="dismissed()">
          Close
        </v-btn>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
"use strict";
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';
//import Path from '../../utils/path.js';

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
      if(!this.tmpExportIndex.length >= 1 && !this.tmpExportCPIndex.length >= 1){
        return true;
      }
      return false;
    },
    listTabs(){
      var ni = 0;
      var tmpArr = [];
      if(this.exportData){
        for(ni in this.exportData.tabs){
          if(!this.exportData.tabs[ni].embedTab){
            let tmpTabInx = this.btnCmd.tabs.findIndex(item => item.tabID == this.exportData.tabs[ni].tabID);
            if(tmpTabInx >= 0){
              tmpArr.push({text: this.exportData.tabs[ni].caption, value: this.exportData.tabs[ni].tabID, color: "red--text"})
              //this.bSHowExistWarning = true;
            }else{
              tmpArr.push({text: this.exportData.tabs[ni].caption, value: this.exportData.tabs[ni].tabID, color: null})
            }
          }
        }
        return tmpArr;
      }else{
        return []
      }
    },
    listCustPanels(){
      var ni = 0;
      var tmpArr = [];
      if(this.exportData){
        for(ni in this.exportData.tabs){
          if(this.exportData.tabs[ni].embedTab){
            let tmpTabInx = this.btnCmd.tabs.findIndex(item => item.tabID == this.exportData.tabs[ni].tabID);
            if(tmpTabInx >= 0){
              tmpArr.push({text: this.exportData.tabs[ni].caption, value: this.exportData.tabs[ni].tabID, color: "red--text"})
              //this.bSHowExistWarning = true;
            }else{
              tmpArr.push({text: this.exportData.tabs[ni].caption, value: this.exportData.tabs[ni].tabID, color: null})
            }
          }
        }
        return tmpArr;
      }else{
        return []
      }
    },
    bSHowExistWarning(){
      if(this.exportData){
        var ni = 0;
        for(ni in this.exportData.tabs){
          let tmpTabInx = this.btnCmd.tabs.findIndex(item => item.tabID == this.exportData.tabs[ni].tabID);
          if(tmpTabInx >= 0){
            return true
          }
        }
        return false;
      }else{
        return false;
      }
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
      exportFile: null,
      exportData: null,
      bShowResWarning: false,
      bShowVerWarning: false
    };
  },
  methods: {
    ...mapActions('machine', ['sendCode']),
		...mapActions('machine', {machineDownload: 'download', getFileList: 'getFileList'}),
    ...mapActions('machine', ['upload']),
		...mapMutations('machine/settings', ['addCode', 'removeCode']),
    clearData(){
      this.tmpExportIndex = [];
      this.tmpExportCPIndex = [],
      this.bSelectAllPages = false;
      this.exportFileName = null;
      this.exportComment = null;
      this.exportData = null;
      this.exportFile = null;
      this.bShowResWarning = false;
      this.bShowVerWarning = false;
    },
    save(){
      this.clearData();
      this.$emit("save");
      this.$emit("update:shown", false);
    },
    dismissed() {
      this.clearData();
      this.$emit("update:shown", false);
    },
    doSelectAll(){
      this.tmpExportIndex = [];
      var ni = 0;
      if(this.bSelectAllPages){
        for(ni in this.exportData.pages){
          if(this.exportData.pages[ni].pageID != "home"){
            this.tmpExportIndex.push(this.exportData.pages[ni].pageID);
          }
        }
      }
    },
    processFile(){
      //load the file contents and check its of the expected structure for import
      var tmpData = null;
      if(this.exportFile){
        var reader = new FileReader();
        reader.readAsText(this.exportFile);
        reader.onload = () => {
          tmpData = JSON.parse(reader.result);
          //validate data structure (Simple check may need expanding later)
          try{
            if(tmpData.tabs.length >=1){
              this.exportData = JSON.parse(reader.result);
              let tmpSW = window.screen.width * window.devicePixelRatio;
              let tmpSH = window.screen.height * window.devicePixelRatio;
              if(this.exportData.exportResW != tmpSW || this.exportData.exportResH != tmpSH){
                this.bShowResWarning = true;
              }
              if(this.exportData.btnCmdVer > this.btnCmd.btnCmdVersion){
                this.bShowVerWarning = true;
              }
            }
          }catch{
            this.$makeNotification('error', 'Invalid Data', 'The selected file has failed validation checks');
            this.$nextTick(this.clearData())
          }
        }
      }
    },
    checkDataTxt(tmpPageID){
      if(tmpPageID){
        var ni=0;
        for(ni in this.touchUI.pages){
          if(this.touchUI.pages[ni].pageID == tmpPageID){
            return "WARNING! This page already exists in your existing setup. Importing it will overwrite the current version"
          }
        }
        return "";
      }
    },
    checkData(tmpPageID){
      if(tmpPageID){
        var ni=0;
        for(ni in this.touchUI.pages){
          if(this.touchUI.pages[ni].pageID == tmpPageID){
            return true;
          }
        }
        return false;
      }
    },
    doImport(){
      //Import the selected file
      var ei = 0;
        //get the tabs to be Imported
      for(ei in this.tmpExportIndex){
        //console.log(ei)
        //check if tab already exists and delete + delete all releated btns and panels
        let tmpTabInx = this.btnCmd.tabs.findIndex(item => item.tabID == this.tmpExportIndex[ei]);
        if(tmpTabInx >= 0){
            this.btnCmd.btns = this.btnCmd.btns.filter(item => item.btnGroupIdx != this.tmpExportIndex[ei]);
            this.btnCmd.panels = this.btnCmd.panels.filter(item => item.tabID != this.tmpExportIndex[ei]);
            this.btnCmd.tabs = this.btnCmd.tabs.filter(item => item.tabID != this.tmpExportIndex[ei]);    
        }
        //add the tab, & assoicated panels, & btns
        this.btnCmd.tabs = this.btnCmd.tabs.concat(this.exportData.tabs.filter(item => item.tabID == this.tmpExportIndex[ei]));
        this.btnCmd.panels = this.btnCmd.panels.concat(this.exportData.panels.filter(item => item.tabID == this.tmpExportIndex[ei]));
        this.btnCmd.btns = this.btnCmd.btns.concat(this.exportData.btns.filter(item => item.btnGroupIdx == this.tmpExportIndex[ei]));
        //look for custom panels in the layout and import the custom panel 
        let tmpCustPanFilt = this.exportData.panels.filter(item => item.tabID == this.tmpExportIndex[ei] && item.customPanelID);
        let ni=0;
        for(ni in tmpCustPanFilt){
          if(this.tmpExportCPIndex.length >=1){
            this.tmpExportCPIndex = this.tmpExportCPIndex.filter(item => item != tmpCustPanFilt[ni].customPanelID);
          }
          this.tmpExportCPIndex.push(tmpCustPanFilt[ni].customPanelID)
        }        
      }
      //process custom panels
      ei = 0;
      for(ei in this.tmpExportCPIndex){
        //check if tab already exists and delete + delete all releated btns and panels
        let tmpTabInx = this.btnCmd.tabs.findIndex(item => item.tabID == this.tmpExportCPIndex[ei]);
        if(tmpTabInx >= 0){
            this.btnCmd.btns = this.btnCmd.btns.filter(item => item.btnGroupIdx != this.tmpExportCPIndex[ei]);
            this.btnCmd.panels = this.btnCmd.panels.filter(item => item.tabID != this.tmpExportCPIndex[ei]);
            this.btnCmd.tabs = this.btnCmd.tabs.filter(item => item.tabID != this.tmpExportCPIndex[ei]);    
        }
        //add the tab, & assoicated panels, & btns
        this.btnCmd.tabs = this.btnCmd.tabs.concat(this.exportData.tabs.filter(item => item.tabID == this.tmpExportCPIndex[ei]));
        this.btnCmd.panels = this.btnCmd.panels.concat(this.exportData.panels.filter(item => item.tabID == this.tmpExportCPIndex[ei]));
        this.btnCmd.btns = this.btnCmd.btns.concat(this.exportData.btns.filter(item => item.btnGroupIdx == this.tmpExportCPIndex[ei]));
      }
      this.$makeNotification('success', 'Import Complete', 'The selected items have been imported.');
      this.save();
    },
    validateFileName(){
			if(this.exportFileName.length !== 0){
				var newName = this.exportFileName.replace(/\n/g," ").replace(/[<>:"/\\|?*]| +$/g,"").replace(/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/,x=>x+"_");
				this.exportFileName = newName;
      }		
		},
  }
};
</script>
