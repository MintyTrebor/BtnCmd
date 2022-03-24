<style scoped>
.conCard {
	flex-grow: 1;
	overflow-y: auto;
	overflow-x: hidden;
}
</style>
<template>
	<v-container flex class="conCard">
		<v-card flat>
			<v-row :dense="$vuetify.breakpoint.mobile" class="ma-2">
				<v-col cols="12" class="pt-1">
					<code-input solo></code-input>
				</v-col>
				<v-col cols="12">
					<event-list></event-list>
				</v-col>
			</v-row>
		</v-card>
	</v-container>
</template>

<script>
'use strict'

import { mapMutations } from 'vuex'

//import { registerRoute } from '../../routes'

export default {
	// install() {
	// 	// Register a route via Control -> Console
	// 	registerRoute(this, {
	// 		Control: {
	// 			Console: {
	// 				icon: 'mdi-code-tags',
	// 				caption: 'menu.control.console',
	// 				path: '/Console'
	// 			}
	// 		}
	// 	});
	// },
	methods: mapMutations(['hideCodeReplyNotifications', 'showCodeReplyNotifications']),
	activated() {
		this.hideCodeReplyNotifications();
	},
	deactivated() {
		this.showCodeReplyNotifications();
	}
}
</script>
