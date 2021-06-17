<template>
	<v-card :key="'mmVal' + passedObject.panelMMPrefix + passedObject.panelID" :color="passedObject.panelColor">
		<v-card-text v-if="passedObject.panelMMOrientation == 'V'" class="text-center pb-1">
			<v-row dense>
				<v-col class="d-flex flex-column">
					<strong :style="'color: ' + passedObject.panelMMPrefixColor" :class="`text-${passedObject.panelMMTextSize}`">
						{{ passedObject.panelMMPrefix }}
					</strong>
				</v-col>
			</v-row>
			<v-row dense>
				<v-col class="d-flex flex-column">
					<span :style="'color: ' + passedObject.panelMMValueColor" :class="`text-${passedObject.panelMMTextSize}`">
						{{ matchedMMVal }}
					</span>
				</v-col>
			</v-row>
		</v-card-text>
		<v-card-text v-else class="text-center pb-1">
			<v-row dense>
				<v-col class="d-flex flex-column">
					<strong :style="'color: ' + passedObject.panelMMPrefixColor" :class="`text-${passedObject.panelMMTextSize}`">
						{{ passedObject.panelMMPrefix }}
					</strong>
				</v-col>
				<v-col class="d-flex flex-column">
					<span :style="'color: ' + passedObject.panelMMValueColor" :class="`text-${passedObject.panelMMTextSize}`">
						{{ matchedMMVal }}
					</span>
				</v-col>
			</v-row>
		</v-card-text> 
	</v-card>		
</template>

<script>
'use strict'
import { mapGetters, mapState} from 'vuex';
import jsonpath from 'jsonpath';

export default {
	props: {
		passedObject: {
			type: Object
		}
    },
	computed: {
		...mapState('machine', ['model']),
		...mapGetters(['uiFrozen']),
		matchedMMVal() {return this.getModelValue();}
	},
	methods: {
		getModelValue(){
			const jp = jsonpath;
			if(this.passedObject.panelMMPath){
				var matchInModel = jp.query(this.model, (`$.${this.passedObject.panelMMPath}`));
				if(JSON.stringify(matchInModel) != "[]"){
					return  matchInModel[0];
				}else{
					return "###";
				}
			}else {
				return "###";
			}		
		}
	}
}
</script>
