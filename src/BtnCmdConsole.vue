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

<script lang="ts">
	import Vue from "vue";

	import store from "@/store";

	export default Vue.extend({
		activated() {
			store.commit("hideCodeReplyNotifications");
		},
		deactivated() {
			store.commit("showCodeReplyNotifications");
		}
	});
</script>
