import { DisconnectedError, OperationCancelledError } from '@/utils/errors';
import Path from '@/utils/path';
import axios from 'axios';
import store from "@/store";

export default {
    methods: {
        data: function () {
            return {
            }
        },
		//file & load functions
		async saveSBCCSettingsToFile() {
			const content = new Blob([JSON.stringify(this.btnCmd.SBCCSettings)]);
			const setFileName = Path.combine(this.systemDirectory, 'SBCC_Config.json');
			try {
				await store.dispatch("machine/upload", { filename: setFileName, content, showSuccess: false });
			} catch (e) {
				console.warn(e);
			}
			this.reloadSBCCSet = true;
		},
		async loadSBCCSettingsFromFile() {
			//Load the main settings shared with the service
			try {
				const setFileName = Path.combine(this.systemDirectory, 'SBCC_Config.json');
				const response = await store.dispatch("machine/download", { filename: setFileName, type: 'json', showSuccess: false, showError: false });
				//console.log("resp: ", response)
				this.btnCmd.SBCCSettings = response;
			} catch (e) {
				if (!(e instanceof DisconnectedError) && !(e instanceof OperationCancelledError)) {
					console.warn(e);
					console.warn("File Does Not Exist - Creating New Version with default Settings")
					this.createSBCCSettings()
				}
			}
		},
		async restartSBCCSvs(){
			//this triggers a hidden cmd (ID 0), which restarts the SBCC service - needed when the user changes settings
			var tmpHttpData = {"SBCCID": 0, "SBCCAPI": this.btnCmd.SBCCSettings["API_KEY"], "SBCCCmd": null, "SBCCTimeout": 30};
			var tmpHttpPort = this.btnCmd.SBCCSettings["HTTP_Port"];
			const axiosHtpp = axios;
			axiosHtpp.post(`http://${this.systemCurrIP}:${tmpHttpPort}`, tmpHttpData)
				.then(function (response) {
					//tmpParent.setActionResponse("Last Action : Restarting SBCC service.");
					console.log(response);
				})
				.catch(function (error) {
					console.log(error);
					//tmpParent.$makeNotification('error', 'SBCC Encountered an error. Response:', `${error}`);
				});
		},
		async createSBCCSettings(){
			//creates the settings file if it does not exist when SBCC is enabled
			var tmpJSON = {HTTP_Port: "8091", API_KEY: this.generateUUID('SBCC'), SUBNET: "0.0.0.0"}
			const content = new Blob([JSON.stringify(tmpJSON)]);
			const setFileName = Path.combine(this.systemDirectory, 'SBCC_Config.json');
			try {
				await store.dispatch("machine/upload", { filename: setFileName, content, showSuccess: false });
			} catch (e) {
				console.warn(e);
			}
			this.btnCmd.SBCCSettings = tmpJSON;
			this.$makeNotification('error', 'SBCC First Run:', `BtnCmd has detected that SBCC has not been run before. You must manually re-start the python service before further use.`);

		}
    }
}