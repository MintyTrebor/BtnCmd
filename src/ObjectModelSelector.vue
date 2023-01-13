<!--Taken from standard DWC 3.5 and buthered to work as a lookup tool-->

<template>
	<v-dialog v-model="show" max-width="80%" max-height="70%">
		<v-card>
			<v-row>
				<v-col ref="leftContainer" :cols="(active.length === 0) ? 12 : 6">
					<v-treeview :items="modelTree" open-on-click activatable :active.sync="active">
						<template #label="{ item }">
							{{ item.getLabel ? item.getLabel() : item.name }}
						</template>
						<template #append="{ item }">
							<v-chip v-if="item.type">
								{{ item.type }}
							</v-chip>
						</template>
					</v-treeview>
					<div class="d-flex justify-center">
						<v-btn v-show="active.length === 0" color="info" class="mt-3" :disabled="uiFrozen" :elevation="1"
							@click="refresh">
							<v-icon class="mr-1">mdi-refresh</v-icon>
							{{ $t("button.refresh.caption") }}
						</v-btn>
					</div>
				</v-col>
			</v-row>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import ObjectModel from "@duet3d/objectmodel";
import { getErrorMessage } from "@/utils/errors";
import Vue from "vue";

import store from "@/store";

interface ModelTreeItem {
	id: string;
	getLabel: () => string | number;
	type: "array" | "object" | "value";
	children: Array<ModelTreeItem>;
}

export default Vue.extend({
	props: {
		value: Boolean,
	},
	computed: {
		uiFrozen(): boolean { return store.getters["uiFrozen"]; },
		model(): ObjectModel { return store.state.machine.model; },
		darkTheme(): boolean { return store.state.settings.darkTheme; },
		show: {
			get () {
				return this.value
			},
			set (value) {
				this.$emit('input', value)
			}
		}
	},
	data() {
		return {
			active: new Array<string>(),
			modelTree: new Array<ModelTreeItem>,
			apiFile: null as Document | null,
			apiFileError: null,
			documentationFloating: false
		}
	},
	async activated() {
		if (this.apiFile === null) {
			try {
				const apiFileContent = await store.dispatch("machine/download", {
					filename: "0:/www/DuetAPI.xml",
					type: "text",
					showError: false,
					showSuccess: false
				});

				const parser = new DOMParser();
				this.apiFile = parser.parseFromString(apiFileContent, "application/xml");
				this.apiFileError = null;
			} catch (e) {
				this.apiFileError = getErrorMessage(e);
				console.warn(e);
			}
		}
		this.refresh();
	},
	mounted(){
		this.refresh();
	},
	methods: {
		makeModelTree(obj: object | Array<any> | null, path: Array<string>): Array<ModelTreeItem> {
			if (obj instanceof Array) {
				const that = this;
				return obj.map((item, index) => {
					const itemPath = path.slice(0);
					itemPath[itemPath.length - 1] += `[${index}]`;

					return {
						id: itemPath.join('.'),
						getLabel: () => that.getItemLabel(index, item),
						type: that.getItemType(item),
						children: that.makeModelTree(item, itemPath)
					}
				});
			} else if (obj instanceof Map) {
				return Array.from(obj.keys())
					.sort()
					.map((key) => {
						const itemPath = path.slice(0);
						itemPath.push(key);

						return {
							id: itemPath.join('.'),
							getLabel: () => this.getItemLabel(key, obj.get(key)),
							type: this.getItemType(obj.get(key)),
							children: this.makeModelTree(obj.get(key), itemPath)
						};
					}, this);
			} else if (obj instanceof Object) {
				return Object.keys(obj)
					.sort()
					.map((key) => {
						const itemPath = path.slice(0);
						itemPath.push(key);

						return {
							id: itemPath.join('.'),
							getLabel: () => this.getItemLabel(key, (obj as any)[key]),
							type: this.getItemType((obj as any)[key]),
							children: this.makeModelTree((obj as any)[key], itemPath)
						};
					}, this);
			}
			return [];
		},
		getItemLabel(name: string | number, value: any) {
			try {
				if (value === null) {
					return `${name} = null`;
				}
				if (typeof value === "string" && (value || value === "")) {
					return `${name} = "${value}"`;
				}
				if (value instanceof Object) {
					return name;
				}
				return `${name} = ${value}`;
			} catch {
				return `${name} = ${this.$t("generic.noValue")}`;
			}
		},
		getItemType(obj: any) {
			if (obj instanceof Array) {
				return "array";
			}
			if (obj !== null && obj instanceof Object) {
				return "object";
			}
			return "value";
		},
		selectInput(e: Event) {
			(e.target as HTMLInputElement).select();
		},
		refresh() {
			this.modelTree = this.makeModelTree(this.model, []);
		}
	},
	watch: {
		active(to) {
			if (to.length > 0) {
				//this.OMString.OMString = this.active[0];
				this.$emit('exit', this.active[0]);
                this.show = false;
			}
		}
	}
});
</script>
