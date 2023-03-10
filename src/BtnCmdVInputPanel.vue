<style scoped>
	.switch-center {
		display: flex;
		justify-content: center;
	}
</style>

<template>
	<div>
		<v-card :id="`gip-${passedObject.panelID}`" class="pa-1 ma-0" :key="'vInput' + passedObject.inputPrefixText + passedObject.inputSuffixText + passedObject.inputVarName + passedObject.panelID + passedObject.panelHSize + passedObject.panelWSize" :flat="passedObject.borderless" :height="passedObject.panelHSize" :width="passedObject.panelWSize" :color="passedObject.panelColor" style="height: 100%; width: 100%">
			<v-row align="center" style="height: 98%; width: 98%" class="pa-0 ma-0">
				<v-card-text class="text-center pa-0 ma-0">
					<v-row v-if="passedObject.inputType == 'number' && passedObject.inputDispType == 'slider'" dense justify="center" align="center">
						<v-col class="d-flex flex-column pa-0 ma-0" justify="center" align="center" cols="10">
							<v-row v-if="passedObject.panelHoverText.length >= 1" justify="center" align="center">
								<v-tooltip bottom :style="`position: absolute; z-index:${LZIndex+1}`">
									<template v-slot:activator="{ on, attrs }">
										<v-row justify="center" align="center" style="height: 100%;" v-bind="attrs" v-on="on">
											<v-slider v-model="passedObject.inputLastVal" thumb-label="always" @start="setPauseUpdate()" @end="setVarVal($event)" :max="passedObject.inputControlRange[1]" :min="passedObject.inputControlRange[0]" :step="passedObject.inputControlSteps" :label="passedObject.inputPrefixText" style="height: 10px; margin-top: 10px;" :color="passedObject.panelMMPrefixColor" :class="`text-${passedObject.panelMMTextSize}`" align="center" justify="center" ></v-slider>
										</v-row>
									</template>
									<span >{{ passedObject.panelHoverText }}</span>
								</v-tooltip>
							</v-row>
							<v-row v-else justify="center" align="center">
								<v-slider v-model="passedObject.inputLastVal" thumb-label="always" @start="setPauseUpdate()" @end="setVarVal($event)" :max="passedObject.inputControlRange[1]" :min="passedObject.inputControlRange[0]" :step="passedObject.inputControlSteps" :label="passedObject.inputPrefixText" style="height: 10px; margin-top: 10px;" :color="passedObject.panelMMPrefixColor" :class="`text-${passedObject.panelMMTextSize}`" align="center" justify="center" ></v-slider>
							</v-row>
						</v-col>
					</v-row>
					<v-row v-if="passedObject.inputDispType == 'selection'" dense justify="center" align="center">
						<v-col class="d-flex flex-column pa-0 ma-0" justify="center" align="center" cols="10">
							<v-row v-if="passedObject.panelHoverText.length >= 1" justify="center" align="center">
								<v-tooltip bottom :style="`position: absolute; z-index:${LZIndex+1}`">
									<template v-slot:activator="{ on, attrs }">
										<v-row justify="center" align="center" style="height: 100%;" v-bind="attrs" v-on="on">
											<v-select :items="passedObject.inputControlVals" :value="matchedVarVal" @focus="setPauseUpdate()" :class="`text-${passedObject.panelMMTextSize}`" :label="passedObject.inputPrefixText" @change="setVarVal($event)"></v-select>
										</v-row>
									</template>
									<span >{{ passedObject.panelHoverText }}</span>
								</v-tooltip>
							</v-row>
							<v-row v-else justify="center" align="center">
								<v-select :items="passedObject.inputControlVals" :value="matchedVarVal" @focus="setPauseUpdate()" :class="`text-${passedObject.panelMMTextSize}`" :label="passedObject.inputPrefixText" @change="setVarVal($event)"></v-select>
							</v-row>
						</v-col>
					</v-row>
					<v-row v-if="passedObject.inputType != 'boolean' && passedObject.inputDispType == 'input'" dense justify="center" align="center">
						<v-col class="d-flex flex-column pa-0 ma-0" justify="center" align="center" cols="10">
							<v-row dense v-if="passedObject.panelHoverText.length >= 1" justify="center" align="center" style="height: 100%; width: 100%">
								<v-tooltip bottom :style="`position: absolute; z-index:${LZIndex+1}`">
									<template v-slot:activator="{ on, attrs }">
										<v-row justify="center" align="center" style="height: 100%; width: 100%!important;" v-bind="attrs" v-on="on">
											<v-text-field v-if="bPauseUpdates" ref="txtRef1" flat solo dense hide-details :style="`color: ${passedObject.panelMMPrefixColor};`" :class="`text-${passedObject.panelMMTextSize}`" :type="passedObject.inputType" :clearable="passedObject.inputEnableClear" :prefix="passedObject.inputPrefixText" :suffix="passedObject.inputSuffixText" v-model="newValTemp" :value="newValTemp" :background-color="passedObject.panelColor" :elevation="1" @keyup.enter="clearTextInputFocus($event, newValTemp)"></v-text-field>
											<v-text-field v-else flat solo dense hide-details :style="`color: ${passedObject.panelMMPrefixColor};`" :class="`text-${passedObject.panelMMTextSize}`" :type="passedObject.inputType" :clearable="passedObject.inputEnableClear" :prefix="passedObject.inputPrefixText" :suffix="passedObject.inputSuffixText" v-model="matchedVarVal" :value="matchedVarVal" :background-color="passedObject.panelColor" :elevation="1" @focus="setPauseUpdateText" ></v-text-field>
										</v-row>
									</template>
									<span >{{ passedObject.panelHoverText }}</span>
								</v-tooltip>
							</v-row>
							<v-row dense v-else justify="center" align="center" style="height: 100%; width: 100%">
								<v-row justify="center" align="center" style="height: 100%; width: 100%!important;">
									<v-text-field v-if="bPauseUpdates" ref="txtRef1" flat solo dense hide-details :style="`color: ${passedObject.panelMMPrefixColor};`" :class="`text-${passedObject.panelMMTextSize}`" :type="passedObject.inputType" :clearable="passedObject.inputEnableClear" :prefix="passedObject.inputPrefixText" :suffix="passedObject.inputSuffixText" v-model="newValTemp" :value="newValTemp" :background-color="passedObject.panelColor" :elevation="1" @keyup.enter="clearTextInputFocus($event, newValTemp)"></v-text-field>
									<v-text-field v-else flat solo dense hide-details :style="`color: ${passedObject.panelMMPrefixColor};`" :class="`text-${passedObject.panelMMTextSize}`" :type="passedObject.inputType" :clearable="passedObject.inputEnableClear" :prefix="passedObject.inputPrefixText" :suffix="passedObject.inputSuffixText" v-model="matchedVarVal" :value="matchedVarVal" :background-color="passedObject.panelColor" :elevation="1" @focus="setPauseUpdateText"></v-text-field>
								</v-row>
							</v-row>
						</v-col>
					</v-row>
					<v-row v-if="passedObject.inputType == 'boolean'" dense justify="center" align="center">
						<v-col class="d-flex flex-column pa-0 ma-0" justify="center" align="center" cols="10">
							<v-row v-if="passedObject.panelHoverText.length >= 1" justify="center" align="center">
								<v-tooltip bottom :style="`position: absolute; z-index:${LZIndex+1}`">
									<template v-slot:activator="{ on, attrs }">
										<v-row v-if="bHasPrefix && bHasSuffix" justify="center" align="center" style="height: 100%;" v-bind="attrs" v-on="on">
											<v-col cols="3" justify="right">
												<span v-bind="attrs" v-on="on" :style="'color: ' + passedObject.panelMMPrefixColor + ';'" :class="`text-${passedObject.panelMMTextSize}`">{{passedObject.inputPrefixText}}</span>
											</v-col>
											<v-col cols="4" justify="center">
												<v-layout column align-center><span justify="center"><v-switch :value="matchedVarVal" v-model="passedObject.inputLastVal" @change="setBoolVal($event)"></v-switch></span></v-layout>
											</v-col>
											<v-col cols="3" justify="left">
												<span :style="'color: ' + passedObject.panelMMPrefixColor + ';'" :class="`text-${passedObject.panelMMTextSize}`" :elevation="1" >{{passedObject.inputSuffixText}}</span>
											</v-col>
										</v-row>
										<v-row v-if="bHasPrefix && !bHasSuffix" justify="center" align="center" style="height: 100%;" v-bind="attrs" v-on="on">
											<v-col cols="5" justify="right">
												<span v-bind="attrs" v-on="on" :style="'color: ' + passedObject.panelMMPrefixColor + ';'" :class="`text-${passedObject.panelMMTextSize}`">{{passedObject.inputPrefixText}}</span>
											</v-col>
											<v-col cols="5" justify="left">
												<v-layout column align-center><span justify="center"><v-switch :value="matchedVarVal" v-model="passedObject.inputLastVal" @change="setBoolVal($event)"></v-switch></span></v-layout>
											</v-col>
										</v-row>
										<v-row v-if="!bHasPrefix && bHasSuffix" justify="center" align="center" style="height: 100%;" v-bind="attrs" v-on="on">
											<v-col cols="5" justify="right">
												<v-layout column align-center><span justify="center"><v-switch :value="matchedVarVal" v-model="passedObject.inputLastVal" @change="setBoolVal($event)"></v-switch></span></v-layout>
											</v-col>
											<v-col cols="5" justify="left">
												<span :style="'color: ' + passedObject.panelMMPrefixColor + ';'" :class="`text-${passedObject.panelMMTextSize}`" :elevation="1" >{{passedObject.inputSuffixText}}</span>
											</v-col>
										</v-row>
										<v-row v-if="!bHasPrefix && !bHasSuffix" justify="center" align="center" style="height: 100%;" v-bind="attrs" v-on="on">
											<v-switch justify="center" align="center" :value="matchedVarVal" v-model="passedObject.inputLastVal" @change="setBoolVal($event)"></v-switch>
										</v-row>
									</template>
									<span >{{ passedObject.panelHoverText }}</span>
								</v-tooltip>
							</v-row>
							<v-row v-else justify="center" align="center">
								<v-row v-if="bHasPrefix && bHasSuffix" justify="center" align="center" style="height: 100%;">
									<v-col cols="3" justify="right">
										<span v-bind="attrs" v-on="on" :style="'color: ' + passedObject.panelMMPrefixColor + ';'" :class="`text-${passedObject.panelMMTextSize}`">{{passedObject.inputPrefixText}}</span>
									</v-col>
									<v-col cols="4" justify="center">
										<v-layout column align-center><span justify="center"><v-switch :value="matchedVarVal" v-model="passedObject.inputLastVal" @change="setBoolVal($event)"></v-switch></span></v-layout>
									</v-col>
									<v-col cols="3" justify="left">
										<span :style="'color: ' + passedObject.panelMMPrefixColor + ';'" :class="`text-${passedObject.panelMMTextSize}`" :elevation="1" >{{passedObject.inputSuffixText}}</span>
									</v-col>
								</v-row>
								<v-row v-if="bHasPrefix && !bHasSuffix" justify="center" align="center" style="height: 100%;">
									<v-col cols="5" justify="right">
										<span v-bind="attrs" v-on="on" :style="'color: ' + passedObject.panelMMPrefixColor + ';'" :class="`text-${passedObject.panelMMTextSize}`">{{passedObject.inputPrefixText}}</span>
									</v-col>
									<v-col cols="5" justify="left">
										<v-layout column align-center><span justify="center"><v-switch :value="matchedVarVal" v-model="passedObject.inputLastVal" @change="setBoolVal($event)"></v-switch></span></v-layout>
									</v-col>
								</v-row>
								<v-row v-if="!bHasPrefix && bHasSuffix" justify="center" align="center" style="height: 100%;">
									<v-col cols="5" justify="right">
										<v-layout column align-center><span justify="center"><v-switch :value="matchedVarVal" v-model="passedObject.inputLastVal" @change="setBoolVal($event)"></v-switch></span></v-layout>
									</v-col>
									<v-col cols="5" justify="left">
										<span :style="'color: ' + passedObject.panelMMPrefixColor + ';'" :class="`text-${passedObject.panelMMTextSize}`" :elevation="1" >{{passedObject.inputSuffixText}}</span>
									</v-col>
								</v-row>
								<v-row v-if="!bHasPrefix && !bHasSuffix" justify="center" align="center" style="height: 100%;">
									<v-switch justify="center" align="center" :value="matchedVarVal" v-model="passedObject.inputLastVal" @change="setBoolVal($event)"></v-switch>
								</v-row>
							</v-row>
						</v-col>
					</v-row>
				</v-card-text>
			</v-row>
		</v-card>
	</div>		
</template>

<script>
'use strict'
import BtnCmdBtnActionFunctions from './BtnCmdBtnActionFunctions.js';
import store from "@/store";
import jsonpath from 'jsonpath';

export default {
	props: {
		passedObject: {
			type: Object
		},
		LZIndex: Number,
		finResize: Boolean
    },
	computed: {
		matchedVarVal() {return this.getModelValue();},
		currHSize() {return this.passedObject.panelHSize},
		currWSize() {return this.passedObject.panelWSize},
		currfinResize() {return this.passedObject.bPanelActivated},
		wInpType(){return this.passedObject.inputType},
		wInpDType(){return this.passedObject.inputDispType},
		darkTheme(){ return store.state.settings.darkTheme; },
		bHasPrefix(){
			if(this.passedObject.inputPrefixText){
				let tempText = this.passedObject.inputPrefixText.replace(/ /g, "");
				if(tempText.length > 0){
					return true;
				}else {
					return false;
				}
			}else {
				return false;
			}
		},
		bHasSuffix(){
			if(this.passedObject.inputSuffixText){
				let tempText = this.passedObject.inputSuffixText.replace(/ /g, "");
				if(tempText.length > 0){
					return true;
				}else {
					return false;
				}
			}else{
				return false;
			}
		},
		overlayTextColor(){
			if(!this.darkTheme){
				return "text-field-style-black"
			}else{
				return "text-field-style-white"
			}
		},
		overlayBackgroundColor(){
			if(this.passedObject.panelColor.length > 0){
				return this.passedObject.panelColor
			}else{
				if(!this.darkTheme){
					return "white"
				}else{
					return "black"
				}
			}
		}
	},
	mixins: [
		BtnCmdBtnActionFunctions
	],
	data: function () {
            return {
				showItems: false,
				code: '',
				newValTemp: null,
				bPauseUpdates: false
			}
	},
	methods: {
		getModelValue(){
			const jp = jsonpath;
			if(this.passedObject.inputVarName && !this.passedObject.inputLinkToOM){
				let tmpNum = null;
				let tmpArr = null;
				//detect if this is a global variable array and retrieve the array value - dwc 3.5
				tmpArr = this.passedObject.inputVarName.match(/(?<=\[)[0-9]+?(?=\])/g);
				if(tmpArr){
					tmpNum = Number(tmpArr[0]);
					let tmpStr = this.passedObject.inputVarName.replace(/\[.*\]/g, "");
					if(store.state.machine.model.global.has(tmpStr)){
						this.doRightALign();
						let globArr = store.state.machine.model.global.get(tmpStr);
						return globArr[tmpNum]
					}else{ 
						return "###";
					}
				} 
				if(store.state.machine.model.global.has(this.passedObject.inputVarName)){
					this.doRightALign();
					return store.state.machine.model.global.get(this.passedObject.inputVarName);
				}else{
					return "###";
				}
			}else if(this.passedObject.inputVarName && this.passedObject.inputLinkToOM){
				if(this.passedObject.inputVarName.startsWith("global.")){
					let tmpStr = this.passedObject.inputVarName.replace("global.", "");
					let tmpNum = null;
					let tmpArr = null;
					//detect if this is a global variable array and retrieve the array value - dwc 3.5
					tmpArr = tmpStr.match(/(?<=\[)[0-9]+?(?=\])/g);
					if(tmpArr){
						tmpNum = Number(tmpArr[0]);
						tmpStr = tmpStr.replace(/\[.*\]/g, "");
						if(store.state.machine.model.global.has(tmpStr)){
							let globArr = store.state.machine.model.global.get(tmpStr);
							return globArr[tmpNum]
						}else{
							return "###";
						}
					}
					if(store.state.machine.model.global.has(tmpStr)){
						return store.state.machine.model.global.get(tmpStr);
					}else{
						return "###";
					}
				}else if(this.passedObject.inputVarName.startsWith("plugins.")){
					return "plugins Object cannot be used here";
				}else{
					var matchInModel = jp.query(store.state.machine.model, (`$.${this.passedObject.inputVarName}`));
					if(JSON.stringify(matchInModel) != "[]"){
						return  matchInModel[0];
					}else{
						return "###";
					}
				}
			}else {
				return "###";
			}		
		},
		setPauseUpdate(){
			//console.log("Pausing")
			this.newValTemp = this.matchedVarVal;
			this.bPauseUpdates = true;
		},
		setPauseUpdateText(){
			//console.log("Pausing For Text")
			this.newValTemp = this.matchedVarVal;
			this.bPauseUpdates = true;
			setTimeout(() => {this.$refs.txtRef1.focus()},0);
		},
		unPauseUpdate(){
			//console.log("UnPausing")
			this.bPauseUpdates = false;
		},
		async setVarVal(newValue){
			//console.log("Run setvarval", newValue)
			var tmpParent = this;
			var tmpCmd = "";
			if(this.passedObject.inputVarName && !this.passedObject.inputLinkToOM){
				if(this.passedObject.inputType == "text" && this.passedObject.inputDispType == 'input'){
					//let tmpValue = newValue.target.value;
					let tmpValue = newValue;
					if(!tmpValue) {tmpValue="";}
					tmpCmd = `set global.${this.passedObject.inputVarName} = "${tmpValue}"`;
					tmpParent.code = tmpCmd;
					tmpParent.send();
					this.passedObject.inputLastVal = tmpValue;
				}else if(this.passedObject.inputType == "number" && this.passedObject.inputDispType == 'slider'){
					tmpCmd = `set global.${this.passedObject.inputVarName} = ${Number(this.passedObject.inputLastVal)}`;
					tmpParent.code = tmpCmd;
					tmpParent.send();
				}else if(this.passedObject.inputType == "text" && this.passedObject.inputDispType == 'selection'){
					if(newValue){
						tmpCmd = `set global.${this.passedObject.inputVarName} = "${newValue}"`;
						this.passedObject.inputLastVal = newValue;
						tmpParent.code = tmpCmd;
						tmpParent.send();
					}
				}else{
					//let tmpValue = newValue.target.value;
					let tmpValue = newValue;
					if(!tmpValue){
						tmpParent.$makeNotification('error', 'Invalid Number Entered!', 'The value of the variable has not been changed');
						return;
					}else{
						tmpCmd = `set global.${this.passedObject.inputVarName} = ${Number(tmpValue)}`;
					}
					tmpParent.code = tmpCmd;
					tmpParent.send();
					this.passedObject.inputLastVal = Number(tmpValue);
				}
			}
			if(this.passedObject.inputAfterChangeGCodeCMD){
				let tmpCmdStr = "";
				if(this.passedObject.inputType == "number"){
					tmpCmdStr = this.passedObject.inputAfterChangeGCodeCMD.replace("##VALUE##", Number(newValue));
				}else{
					tmpCmdStr = this.passedObject.inputAfterChangeGCodeCMD.replace("##VALUE##", newValue);
				}
				tmpParent.code = tmpCmdStr;
				tmpParent.send();
			}
			//console.log("endsetvar")
			var tmpParent = null;
			this.newValTemp = null;
			this.unPauseUpdate();
		},
		clearTextInputFocus(event, newValue) {
			//console.log("newvalue", newValue)
			this.setVarVal(newValue);
			if (event.keyCode === 13) {
				event.preventDefault();
				event.target.blur();
			}
		},
		async setBoolVal(newValue){
			this.bPauseUpdates = true;
			var tmpParent = this;
			var tmpCmd = "";
			var tmpValue = newValue;
			if (newValue != true){tmpValue = false;}
			if(this.passedObject.inputVarName && !this.passedObject.inputLinkToOM){
				tmpCmd = `set global.${this.passedObject.inputVarName} = ${tmpValue}`;
				tmpParent.code = tmpCmd;
				tmpParent.send();
				this.passedObject.inputLastVal = Number(tmpValue);
			}
			if(this.passedObject.inputAfterChangeGCodeCMD){
				let tmpCmdStr = this.passedObject.inputAfterChangeGCodeCMD.replace("##VALUE##", tmpValue.toString());
				tmpParent.code = tmpCmdStr;
				tmpParent.send();
			}
			this.bPauseUpdates = false;
		},
		doRightALign(){
			//dirty hack to align text inputs 
			if(this.passedObject.inputType != 'boolean' && this.passedObject.inputDispType == 'input'){
				const currCard = document.getElementById(`gip-${this.passedObject.panelID}`)
				if(currCard){
					const inputs = currCard.getElementsByTagName('input');
					//console.log("inputs: ", inputs)			
					for(var i = 0; i < inputs.length; i++) {
						try{
							if(inputs[i].type == "number") {
								inputs[i].style.textAlign = "right"
							}else if(inputs[i].type != "number"){
								inputs[i].style.textAlign = "center"
							}
						}catch{
							//do nothng
						}
					}
				}
			}
		}
	},
	mounted(){
		this.doRightALign();
		this.passedObject.inputLastVal = this.matchedVarVal;
	},
	activated(){
		this.doRightALign();
	},
	updated(){
		this.doRightALign();
	},
	watch:{
		currfinResize(to){
			if(!to){
				this.doRightALign()
			}
		},
		matchedVarVal(to){
			if(!this.bPauseUpdates){
				this.passedObject.inputLastVal = to;
			}
		},
		wInpType(){
			this.doRightALign()
		},
		wInpDType(){
			this.doRightALign()
		}
	}
}
</script>
