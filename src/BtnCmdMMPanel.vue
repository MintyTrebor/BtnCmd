<style>
	.boxturtle {
		background-image: url('BoxTurtle.svg');
		background-size: cover;
	}
</style>
<template>
	<div>
	<v-card :class="`${cardClass}`" v-if="passedObject.panelMMPrefix" :key="'mmVal' + passedObject.panelMMPrefix + passedObject.panelID + passedObject.panelHSize + passedObject.panelWSize" :flat="passedObject.borderless" :height="passedObject.panelHSize" :width="passedObject.panelWSize" :color="passedObject.panelColor" style="height: 100%; width: 100%">
		<v-row align="center" style="height: 100%; width: 100%" class="pa-0 ma-0">
			<v-card-text v-if="passedObject.panelMMOrientation == 'V'" class="text-center pa-0 ma-0" align="center">
				<v-row v-if="passedObject.inputIconAbove && passedObject.inputIconAbove !='boxturtle'" justify="center" align="center" class="d-flex pa-0 ma-0">
					<v-col cols="12" justify="center">
						<v-layout column align-center><span justify="center"><v-icon :size="passedObject.inputIconAboveSize" :color="passedObject.inputIconAboveColor">{{ passedObject.inputIconAbove }}</v-icon></span></v-layout>
					</v-col>
				</v-row>
				<v-row dense>
					<v-col class="d-flex flex-column pa-0 ma-0">
						<strong :style="'color: ' + passedObject.panelMMPrefixColor" :class="`text-${passedObject.panelMMTextSize}`">
							{{ passedObject.panelMMPrefix }}
						</strong>
					</v-col>
				</v-row>
				<v-row v-if="passedObject.panelType == 'mmValue'" dense>
					<v-col class="d-flex flex-column pa-0 ma-0">
						<span :style="'color: ' + passedObject.panelMMValueColor" :class="`text-${passedObject.panelMMTextSize}`">
							{{ matchedMMVal }}
						</span>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-text v-else class="text-center pa-0 ma-0">
				<v-row v-if="passedObject.inputIconAbove && passedObject.inputIconAbove !='boxturtle'" justify="center" align="center" class="d-flex pa-0 ma-0">
					<v-col cols="12" justify="center">
						<v-layout column align-center><span justify="center"><v-icon :size="passedObject.inputIconAboveSize" :color="passedObject.inputIconAboveColor">{{ passedObject.inputIconAbove }}</v-icon></span></v-layout>
					</v-col>
				</v-row>
				<v-row dense justify="center" align="center">
					<v-col class="d-flex flex-column pa-0 ma-0" justify="center" align="center">
						<strong :style="'color: ' + passedObject.panelMMPrefixColor" :class="`text-${passedObject.panelMMTextSize}`" justify="center" align="center">
							{{ passedObject.panelMMPrefix }}
						</strong>
					</v-col>
					<v-col v-if="passedObject.panelType == 'mmValue'" class="d-flex flex-column pa-0 ma-0">
						<span :style="'color: ' + passedObject.panelMMValueColor" :class="`text-${passedObject.panelMMTextSize}`">
							{{ matchedMMVal }}
						</span>
					</v-col>
				</v-row>
			</v-card-text>
		</v-row>
	</v-card>
	<v-card :class="`${cardClass}`" v-else :key="'mmVal' + passedObject.panelMMPrefix + passedObject.panelID + passedObject.panelHSize + passedObject.panelWSize" :flat="passedObject.borderless" :height="passedObject.panelHSize" :width="passedObject.panelWSize" :color="passedObject.panelColor" style="height: 100%; width: 100%">
		<v-row align="center" style="height: 100%; width: 100%" class="pa-0 ma-0">
			<v-card-text v-if="passedObject.panelMMOrientation == 'V'" class="text-center pa-0 ma-0" align="center">
				<v-row v-if="passedObject.inputIconAbove && passedObject.inputIconAbove !='boxturtle'" justify="center" align="center" class="d-flex pa-0 ma-0">
					<v-col cols="12" justify="center">
						<v-layout column align-center><span justify="center"><v-icon :size="passedObject.inputIconAboveSize" :color="passedObject.inputIconAboveColor">{{ passedObject.inputIconAbove }}</v-icon></span></v-layout>
					</v-col>
				</v-row>
				<v-row v-if="passedObject.panelType == 'mmValue'" dense>
					<v-col class="d-flex flex-column pa-0 ma-0">
						<span :style="'color: ' + passedObject.panelMMValueColor" :class="`text-${passedObject.panelMMTextSize}`">
							{{ matchedMMVal }}
						</span>
					</v-col>
				</v-row>
			</v-card-text>
			<v-card-text v-else class="text-center pa-0 ma-0">
				<v-row v-if="passedObject.inputIconAbove && passedObject.inputIconAbove !='boxturtle'" justify="center" align="center" class="d-flex pa-0 ma-0">
					<v-col cols="12" justify="center">
						<v-layout column align-center><span justify="center"><v-icon :size="passedObject.inputIconAboveSize" :color="passedObject.inputIconAboveColor">{{ passedObject.inputIconAbove }}</v-icon></span></v-layout>
					</v-col>
				</v-row>
				<v-row dense>
					<v-col v-if="passedObject.panelType == 'mmValue'" class="d-flex flex-column pa-0 ma-0">
						<span :style="'color: ' + passedObject.panelMMValueColor" :class="`text-${passedObject.panelMMTextSize}`">
							{{ matchedMMVal }}
						</span>
					</v-col>
				</v-row>
			</v-card-text>
		</v-row>
	</v-card>
	</div>		
</template>

<script>
import jsonpath from 'jsonpath';
import store from "@/store";
import { evaluate } from 'mathjs'

export default {
	props: {
		passedObject: {
			type: Object
		}
    },
	computed: {
		matchedMMVal() {return this.getModelValue();},
		cardClass() {
			if(this.passedObject.inputIconAbove =='boxturtle'){
				return 'boxturtle';
			}else {
				return '';
			}
		}
	},
	methods: {
		getModelValue(){
			const jp = jsonpath;
			if(this.passedObject.panelMMPath){
				if(this.passedObject.panelMMPath.startsWith("global.")){
					let tmpStr = this.passedObject.panelMMPath.replace("global.", "");
					let tmpNum = null;
					let tmpArr = null;
					//detect if this is a global variable array and retrieve the array value - dwc 3.5
					tmpArr = tmpStr.match(/(?<=\[)[0-9]+?(?=\])/g);
					if(tmpArr){
						tmpNum = Number(tmpArr[0]);
						tmpStr = tmpStr.replace(/\[.*\]/g, "");
						if(store.state.machine.model.global.has(tmpStr)){
							let globArr = store.state.machine.model.global.get(tmpStr);
							if(!isNaN(globArr[tmpNum]) && this.passedObject.panelMMEvalMathStr.length > 0){
								let tmpMathStr3 = this.passedObject.panelMMEvalMathStr.replace("##VALUE##", globArr[tmpNum]);
								try{
									let tmpRet3 = evaluate(tmpMathStr3);
									return tmpRet3;
								}catch{
									return "#Invalid Expression#"
								}
							}else{
								return globArr[tmpNum];
							}
						}else{
							return "###";
						}
					}
					if(store.state.machine.model.global.has(tmpStr)){
						let tmpVal = store.state.machine.model.global.get(tmpStr)
						if(!isNaN(tmpVal) && this.passedObject.panelMMEvalMathStr.length > 0){
							let tmpMathStr = this.passedObject.panelMMEvalMathStr.replace("##VALUE##", tmpVal);
							try{
								let tmpRet = evaluate(tmpMathStr);
								return tmpRet;
							}catch{
								return "#Invalid Expression#"
							}
						}else{
							return tmpVal;
						}
					}else{
						return "###";
					}
				}else if(this.passedObject.panelMMPath.startsWith("plugins.")){
					return "plugins Object cannot be used here";
				}else{
					var matchInModel = jp.query(store.state.machine.model, (`$.${this.passedObject.panelMMPath}`));
					if(JSON.stringify(matchInModel) != "[]"){
						let tmpVal2 = matchInModel[0];
						if(!isNaN(tmpVal2) && this.passedObject.panelMMEvalMathStr.length > 0){
							let tmpMathStr2 = this.passedObject.panelMMEvalMathStr.replace("##VALUE##", tmpVal2);
							try{
								let tmpRet2 = evaluate(tmpMathStr2);
								return tmpRet2;
							}catch{
								return "#Invalid Expression#"
							}
						}else{
							return tmpVal2;
						}
					}else{
						return "###";
					}
				}
			}else {
				return "###";
			}		
		}
	}
}
</script>
