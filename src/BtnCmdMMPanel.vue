<template>
	<v-card :key="'mmVal' + passedObject.panelMMPrefix + passedObject.panelID">
		<v-card-text class="text-center pb-2">
			<v-row dense>
				<v-col class="d-flex flex-column">
					<strong>
						{{ passedObject.panelMMPrefix }}
					</strong>
				</v-col>
				<v-col class="d-flex flex-column">
					<span>
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
			var matchInModel = jp.query(this.model, (`$.${this.passedObject.panelMMPath}`));
			if(JSON.stringify(matchInModel) != "[]"){
				return  matchInModel[0];
			}else{
				return "###";
			}		
		}
	}
}
</script>
