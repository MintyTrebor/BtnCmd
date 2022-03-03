<template>
	<div>
		<v-card class="pa-1 ma-0" :key="'vInput' + passedObject.inputVarName + passedObject.panelID + passedObject.panelHSize + passedObject.panelWSize" :flat="passedObject.borderless" :height="passedObject.panelHSize" :width="passedObject.panelWSize" :color="passedObject.panelColor" style="height: 100%; width: 100%">
			<v-row align="center" style="height: 98%; width: 98%" class="pa-0 ma-0">
				<v-card-text class="text-center pa-0 ma-0">
					<v-row v-if="passedObject.panelHoverText.length >= 1" dense justify="center" align="center">
						<v-col class="d-flex flex-column pa-0 ma-0" justify="center" align="center" cols="10">
							<v-row justify="center" align="center">
								<v-tooltip bottom :style="`position: absolute; z-index:${LZIndex+1}`">
									<template v-slot:activator="{ on, attrs }">
										<v-row justify="center" align="center" style="height: 100%;" v-bind="attrs" v-on="on">
											<v-slider v-if="passedObject.inputType == 'number' && passedObject.inputDispType == 'slider'" v-model="passedObject.inputLastVal" thumb-label="always" @end="setVarVal($event)" :max="passedObject.inputControlRange[1]" :min="passedObject.inputControlRange[0]" :step="passedObject.inputControlSteps" :label="passedObject.inputPrefixText" style="height: 10px; margin-top: 10px;" :color="passedObject.panelMMPrefixColor" :class="`text-${passedObject.panelMMTextSize}`" align="center" justify="center" ></v-slider>
											<v-select v-if="passedObject.inputDispType == 'selection'" :items="passedObject.inputControlVals" :value="matchedVarVal" :class="`text-${passedObject.panelMMTextSize}`" :label="passedObject.inputPrefixText" @change="setVarVal($event)"></v-select>
											<v-text-field v-if="passedObject.inputType != 'boolean' && passedObject.inputDispType == 'input'" flat solo dense hide-details :style="`color: ${passedObject.panelMMPrefixColor};`"  :class="`text-${passedObject.panelMMTextSize}`" :prefix="passedObject.inputPrefixText" :type="passedObject.inputType" :clearable="passedObject.inputEnableClear" :suffix="passedObject.inputSuffixText" :value="matchedVarVal" :background-color="passedObject.panelColor" :elevation="1" @keyup.enter="setVarVal($event)"></v-text-field>
										</v-row>
										<v-row v-if="passedObject.inputType == 'boolean'" dense justify="center" align="center">
											<v-col cols="4" justify="left" align="center">
												<span v-bind="attrs" v-on="on" :style="'color: ' + passedObject.panelMMPrefixColor + ';'" :class="`text-${passedObject.panelMMTextSize}`">{{passedObject.inputPrefixText}}</span>
											</v-col>
											<v-col cols="4" justify="center" align="center">
												<v-layout column align-center><span v-bind="attrs" v-on="on" justify="center" align="center"><v-switch justify="center" align="center" :value="matchedVarVal" v-model="passedObject.inputLastVal" @change="setBoolVal($event)"></v-switch></span></v-layout>
											</v-col>
											<v-col cols="4" justify="right" align="center">
												<span v-bind="attrs" v-on="on" :style="'color: ' + passedObject.panelMMPrefixColor + ';'" :class="`text-${passedObject.panelMMTextSize}`">{{passedObject.inputSuffixText}}</span>
											</v-col>
										</v-row>
									</template>
									<span >{{ passedObject.panelHoverText }}</span>
								</v-tooltip>
							</v-row>
						</v-col>
					</v-row>
					<v-row v-else dense justify="center" align="center">
						<v-col class="d-flex flex-column pa-0 ma-0" justify="center" align="center" cols="10">
							<v-row justify="center" align="center" style="height: 100%;">
								<v-slider v-if="passedObject.inputType == 'number' && passedObject.inputDispType == 'slider'" v-model="passedObject.inputLastVal" thumb-label="always" @end="setVarVal($event)" :max="passedObject.inputControlRange[1]" :min="passedObject.inputControlRange[0]" :step="passedObject.inputControlSteps" :label="passedObject.inputPrefixText" style="height: 10px; margin-top: 10px;" :color="passedObject.panelMMPrefixColor" :class="`text-${passedObject.panelMMTextSize}`" align="center" justify="center" ></v-slider>
								<v-select v-if="passedObject.inputDispType == 'selection'" :items="passedObject.inputControlVals" :value="matchedVarVal" :class="`text-${passedObject.panelMMTextSize}`" :label="passedObject.inputPrefixText" @change="setVarVal($event)"></v-select>
								<v-text-field v-if="passedObject.inputType != 'boolean' && passedObject.inputDispType == 'input'" flat solo dense hide-details :style="`color: ${passedObject.panelMMPrefixColor};`"  :class="`text-${passedObject.panelMMTextSize}`" :prefix="passedObject.inputPrefixText" :type="passedObject.inputType" :clearable="passedObject.inputEnableClear" :suffix="passedObject.inputSuffixText" :value="matchedVarVal" :background-color="passedObject.panelColor" :elevation="1" @keyup.enter="setVarVal($event)"></v-text-field>
							</v-row>
							<v-row v-if="passedObject.inputType == 'boolean'" dense justify="center" align="center">
								<v-col cols="4" justify="left" align="center">
									<span :style="'color: ' + passedObject.panelMMPrefixColor + ';'" :class="`text-${passedObject.panelMMTextSize}`">{{passedObject.inputPrefixText}}</span>
								</v-col>
								<v-col cols="4" justify="center" align="center">
									<v-layout column align-center><span justify="center" align="center"><v-switch justify="center" align="center" :value="matchedVarVal" v-model="passedObject.inputLastVal" @change="setBoolVal($event)"></v-switch></span></v-layout>
								</v-col>
								<v-col cols="4" justify="right" align="center">
									<span :style="'color: ' + passedObject.panelMMPrefixColor + ';'" :class="`text-${passedObject.panelMMTextSize}`">{{passedObject.inputSuffixText}}</span>
								</v-col>
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
import { mapGetters, mapState, mapActions} from 'vuex';
import jsonpath from 'jsonpath';
import BtnCmdBtnActionFunctions from './BtnCmdBtnActionFunctions.js';

export default {
	props: {
		passedObject: {
			type: Object
		},
		LZIndex: Number,
		finResize: Boolean
    },
	computed: {
		...mapState('machine', ['model']),
		...mapGetters(['uiFrozen']),
		matchedVarVal() {return this.getModelValue();},
		currHSize() {return this.passedObject.panelHSize},
		currWSize() {return this.passedObject.panelWSize},
		currfinResize() {return this.passedObject.bPanelActivated},
		wInpType(){return this.passedObject.inputType},
		wInpDType(){return this.passedObject.inputDispType}
	},
	mixins: [
		BtnCmdBtnActionFunctions
	],
	data: function () {
            return {
				showItems: false,
				code: '',
				newValTemp: null,
			}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		getModelValue(){
			const jp = jsonpath;
			if(this.passedObject.inputVarName){
				var matchInModel = jp.query(this.model, (`$.global.${this.passedObject.inputVarName}`));
				if(JSON.stringify(matchInModel) != "[]"){
					this.doRightALign();
					return  matchInModel[0];
				}else{
					return "###";
				}
			}else {
				return "###";
			}		
		},
		setVal(newValue){
			console.log(newValue)
		},
		async setVarVal(newValue){
			var tmpParent = this;
			var tmpCmd = "";
			if(this.passedObject.inputVarName){
				if(this.passedObject.inputType == "text" && this.passedObject.inputDispType == 'input'){
					let tmpValue = newValue.target.value;
					if(!tmpValue) {tmpValue="";}
					tmpCmd = `set global.${this.passedObject.inputVarName} = "${tmpValue}"`;
					tmpParent.code = tmpCmd;
					tmpParent.send();
					this.passedObject.inputLastVal = tmpValue;
					return;
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
					let tmpValue = newValue.target.value;
					if(!tmpValue){
						tmpParent.$makeNotification('error', 'Invalid Number Entered!', 'The value of the variable has not been changed');
						return;
					}else{
						tmpCmd = `set global.${this.passedObject.inputVarName} = ${Number(tmpValue)}`;
					}
					tmpParent.code = tmpCmd;
					tmpParent.send();
					this.passedObject.inputLastVal = Number(tmpValue);
					return;
				}
			}
		},
		async setBoolVal(newValue){
			var tmpParent = this;
			var tmpCmd = "";
			var tmpValue = newValue;
			if (newValue != true){tmpValue = false;}
			if(this.passedObject.inputVarName){
				tmpCmd = `set global.${this.passedObject.inputVarName} = ${tmpValue}`;
				tmpParent.code = tmpCmd;
				tmpParent.send();
				this.passedObject.inputLastVal = Number(tmpValue);
				return;
			}
		},
		doRightALign(){
			//dirty hack to align text inputs 
			var inputs = document.getElementsByTagName('input');
			for(var i = 0; i < inputs.length; i++) {
				if(inputs[i].type == "number" && this.passedObject.inputLastVal && !isNaN(inputs[i].value)) {
					if(Number(inputs[i].value) == Number(this.passedObject.inputLastVal)){
						inputs[i].style.textAlign = "right"
					}
				}else if(inputs[i].type != "number" && this.passedObject.inputLastVal && inputs[i].value){
					if(inputs[i].value == this.passedObject.inputLastVal){
						inputs[i].style.textAlign = "center"
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
	watch:{
		currfinResize(to){
			if(!to){
				process.nextTick(() => {this.doRightALign();})
			}
		},
		matchedVarVal(to){
			this.passedObject.inputLastVal = to;
		},
		wInpType(){
			process.nextTick(() => {this.doRightALign();})
		},
		wInpDType(){
			process.nextTick(() => {this.doRightALign();})
		}
	}
}
</script>
