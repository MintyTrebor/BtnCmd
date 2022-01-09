import { DisconnectedError, OperationCancelledError } from '../../utils/errors.js';
import Path from '../../utils/path.js';
import deepmerge from 'deepmerge';
import axios from 'axios';

export default {
    methods: {
        data: function () {
            //Changes to btnCmd:{} structure must also be made in BtnCmdDataFunctions.js
            return {
            }
        },
		//file & load functions
		async saveSBCCSettingsToFile() {
			const content = new Blob([JSON.stringify(this.tmpSBCCUsr)]);
			const setFileName = Path.combine(this.systemDirectory, 'SBCC_Config.json');
			try {
				await this.upload({ filename: setFileName, content, showSuccess: false });
			} catch (e) {
				console.warn(e);
			}
			this.reloadSBCCSet = true;
			this.restartSBCCSvs();
		},
		async loadSBCCSettingsFromFile() {
			try {
				const setFileName = Path.combine(this.systemDirectory, 'SBCC_Config.json');
				const response = await this.machineDownload({ filename: setFileName, type: 'json', showSuccess: false });
				this.tmpSBCCUsr = response;
			} catch (e) {
				if (!(e instanceof DisconnectedError) && !(e instanceof OperationCancelledError)) {
					console.warn(e);
				}
			}
			try {
				const setFileName = Path.combine(this.systemDirectory, 'SBCC_Default_Cmds.json');
				const response = await this.machineDownload({ filename: setFileName, type: 'json', showSuccess: false });
				this.tmpSBCCDef = response;
			} catch (e) {
				if (!(e instanceof DisconnectedError) && !(e instanceof OperationCancelledError)) {
					console.warn(e);
				}
			}
			const SBCCMerge = deepmerge;
            //Merge the 2 json files together
			this.tmpSBCCSet = SBCCMerge(this.tmpSBCCUsr, this.tmpSBCCDef);
		},
        async loadSBCCUserSettingsFromFile() {
			try {
				const setFileName = Path.combine(this.systemDirectory, 'SBCC_Config.json');
				const response = await this.machineDownload({ filename: setFileName, type: 'json', showSuccess: false });
                this.tmpSBCCUsr = response;
			} catch (e) {
				if (!(e instanceof DisconnectedError) && !(e instanceof OperationCancelledError)) {
					console.warn(e);
				}
			}
		},
		async restartSBCCSvs(){
			//this triggers a hidden cmd (ID 0), which restarts the SBCC service - needed when the user changes settings
			var tmpHttpData = {"SBCCID": 0, "SBCCAPI": this.tmpSBCCSet.SBCC_Settings["API_KEY"]};
			var tmpHttpPort = this.tmpSBCCSet.SBCC_Settings["HTTP_Port"];
			var tmpRes = location.host.indexOf(':');
			var tmpLoc = "";
			const axiosHtpp = axios;
			if(tmpRes > 0){
				tmpLoc = location.host.substring(0, tmpRes);
			}else{
				tmpLoc = location.host;
			}
			axiosHtpp.post(`http://${tmpLoc}:${tmpHttpPort}`, tmpHttpData)
				.then(function (response) {
					//tmpParent.setActionResponse("Last Action : Restarting SBCC service.");
					console.log(response);
				})
				.catch(function (error) {
					console.log(error);
					//tmpParent.$makeNotification('error', 'SBCC Encountered an error. Response:', `${error}`);
				});
		},
		async checkSBCCSvs(){
			try {
				const files = await this.getFileList(this.systemDirectory);
				// console.log(files);
				// this.tmpDebgug = files;
				this.bSBCCInstalled = false;
				var tmpFile
				for(tmpFile in files){
					if(files[tmpFile].name === "SBCC_Config.json"){
						this.bSBCCInstalled = true;
					}
				}	
			} catch (e) {
				if (!(e instanceof DisconnectedError)) {
					console.warn(e);
					this.$makeNotification('error', this.$t('error.filelistRequestFailed'), e.message);
				}
				this.bSBCCInstalled = false;
				return
			}				
		}
    }
}