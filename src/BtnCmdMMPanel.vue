<template>
	<div>
	<v-card v-if="passedObject.panelMMPrefix.length > 0" :key="'mmVal' + passedObject.panelMMPrefix + passedObject.panelID + passedObject.panelHSize + passedObject.panelWSize" :flat="passedObject.borderless" :height="passedObject.panelHSize" :width="passedObject.panelWSize" :color="passedObject.panelColor" style="height: 100%; width: 100%">
		<v-row align="center" style="height: 100%; width: 100%" class="pa-0 ma-0">
		<v-card-text v-if="passedObject.panelMMOrientation == 'V'" class="text-center pa-0 ma-0" align="center">
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
	<v-card v-if="passedObject.panelMMPrefix.length == 0" :key="'mmVal' + passedObject.panelMMPrefix + passedObject.panelID + passedObject.panelHSize + passedObject.panelWSize" :flat="passedObject.borderless" :height="passedObject.panelHSize" :width="passedObject.panelWSize" :color="passedObject.panelColor" style="height: 100%; width: 100%">
		<v-row align="center" style="height: 100%; width: 100%" class="pa-0 ma-0">
		<v-card-text v-if="passedObject.panelMMOrientation == 'V'" class="text-center pa-0 ma-0" align="center">
			<v-row v-if="passedObject.panelType == 'mmValue'" dense>
				<v-col class="d-flex flex-column pa-0 ma-0">
					<span :style="'color: ' + passedObject.panelMMValueColor" :class="`text-${passedObject.panelMMTextSize}`">
						{{ matchedMMVal }}
					</span>
				</v-col>
			</v-row>
		</v-card-text>
		<v-card-text v-else class="text-center pa-0 ma-0">
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

export default {
	props: {
		passedObject: {
			type: Object
		}
    },
	computed: {
		matchedMMVal() {return this.getModelValue();}
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
				}else if(this.passedObject.panelMMPath.startsWith("plugins.")){
					return "plugins Object cannot be used here";
				}else{
					var matchInModel = jp.query(store.state.machine.model, (`$.${this.passedObject.panelMMPath}`));
					if(JSON.stringify(matchInModel) != "[]"){
						return  matchInModel[0];
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
