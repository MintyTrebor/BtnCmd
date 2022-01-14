import { DisconnectedError, OperationCancelledError } from '../../utils/errors.js';
import Path from '../../utils/path.js';
import axios from 'axios';

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
				await this.upload({ filename: setFileName, content, showSuccess: false });
			} catch (e) {
				console.warn(e);
			}
			this.reloadSBCCSet = true;
			this.restartSBCCSvs();
		},
		async loadSBCCSettingsFromFile() {
			//Load the main settings shared with the service
			try {
				const setFileName = Path.combine(this.systemDirectory, 'SBCC_Config.json');
				const response = await this.machineDownload({ filename: setFileName, type: 'json', showSuccess: false });
				this.btnCmd.SBCCSettings = response;
			} catch (e) {
				if (!(e instanceof DisconnectedError) && !(e instanceof OperationCancelledError)) {
					console.warn(e);
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
		}
    }
}