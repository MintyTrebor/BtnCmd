<template>
	<div>
		<v-card :key="'vInput' + passedObject.inputVarName + passedObject.panelID + passedObject.panelHSize + passedObject.panelWSize" :flat="passedObject.borderless" :height="passedObject.panelHSize" :width="passedObject.panelWSize" :color="passedObject.panelColor" style="height: 100%; width: 100%">
			<v-row align="center" style="height: 98%; width: 98%" class="pa-0 ma-0">
				<v-card-text class="text-center pa-0 ma-0">
					<v-row v-if="passedObject.panelHoverText.length >= 1" dense justify="center" align="center">
						<v-col class="d-flex flex-column pa-0 ma-0" justify="center" align="center">
							<v-tooltip bottom :style="`position: absolute; z-index:${LZIndex+1}`">
								<template v-slot:activator="{ on, attrs }">
									<v-text-field flat solo dense hide-details :style="'color: ' + passedObject.panelMMPrefixColor + ';'"  :class="`text-${passedObject.panelMMTextSize}`" align="center" justify="center" :prefix="passedObject.inputPrefixText" :type="passedObject.inputType" :clearable="passedObject.inputEnableClear" :suffix="passedObject.inputSuffixText" :value="matchedVarVal" block style="height: 100%; width: 100%" v-bind="attrs" v-on="on" :background-color="passedObject.panelColor" :elevation="1" @keyup.enter="setVarVal($event)"></v-text-field>
								</template>
								<span >{{ passedObject.panelHoverText }}</span>
							</v-tooltip>
						</v-col>
					</v-row>
					<v-row v-else dense justify="center" align="center">
						<v-col class="d-flex flex-column pa-0 ma-0" justify="center" align="center">
							<v-text-field flat solo dense hide-details :style="'color: ' + passedObject.panelMMPrefixColor + ';'" :class="`text-${passedObject.panelMMTextSize}`" align="center" justify="center" :prefix="passedObject.inputPrefixText" :type="passedObject.inputType" :clearable="passedObject.inputEnableClear" :suffix="passedObject.inputSuffixText" :value="matchedVarVal" block style="height: 100%; width: 100%" :background-color="passedObject.panelColor" :elevation="1" @keyup.enter="setVarVal($event)"></v-text-field>
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
		LZIndex: Number
    },
	computed: {
		...mapState('machine', ['model']),
		...mapGetters(['uiFrozen']),
		matchedVarVal() {return this.getModelValue();}
	},
	mixins: [
		BtnCmdBtnActionFunctions
	],
	data: function () {
            return {
				showItems: false,
				code: '',
				newValTemp: null
			}
	},
	methods: {
		...mapActions('machine', ['sendCode']),
		getModelValue(){
			const jp = jsonpath;
			if(this.passedObject.inputVarName){
				var matchInModel = jp.query(this.model, (`$.global.${this.passedObject.inputVarName}`));
				if(JSON.stringify(matchInModel) != "[]"){
					return  matchInModel[0];
				}else{
					return "###";
				}
			}else {
				return "###";
			}		
		},
		async setVarVal(newValue){
			var tmpParent = this;
			var tmpCmd = "";
			var tmpValue = newValue.target.value;
			if(this.passedObject.inputVarName){
				if(this.passedObject.inputType == "text"){
					if(!tmpValue) {tmpValue="";}
					tmpCmd = `set global.${this.passedObject.inputVarName} = "${tmpValue}"`;
					tmpParent.code = tmpCmd;
					tmpParent.send();
					this.passedObject.inputLastVal = tmpValue;
					return;
				} else{
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
		}
	}
}
</script>
