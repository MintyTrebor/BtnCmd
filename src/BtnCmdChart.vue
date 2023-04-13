<style scoped>
.card {
	display: flex;
	flex-direction: column;
	width: 100%;
}

.content {
	position: relative;
}
.ttDiv {
	position: absolute;
	top: 8px;
	right: 60px;
}
.content > canvas {
	position: absolute;
}
.btn-fix:focus::before { opacity: 0 !important; }
.btn-fix:hover::before { opacity: 0.08 !important; }
</style>

<template>
	<v-card class="d-flex flex-column flex-grow-1" style="position: relative !important;">
		<v-card-title class="pt-2 pb-0">			
			<v-row dense>
				<v-col cols="11" align="left">
					<v-icon class="mr-1">mdi-chart-timeline-variant</v-icon>
					{{ passedObject.chartLabel }}
				</v-col>
				<!-- <v-col cols="6" align="right">
					
				</v-col> -->
				<v-col cols="1" align="right">
					<v-tooltip left>
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="primary" class="btn-fix" v-bind="attrs" v-on="on" fab x-small @click="downloadChartData()">
								<v-icon>mdi-floppy</v-icon>
							</v-btn>
						</template>
						<span>Save Chart Data</span>
					</v-tooltip>
				</v-col>
			</v-row>			
		</v-card-title>
		<v-card-text class="content flex-grow-1 px-2 py-0">
			<canvas :ref="passedObject.panelID"></canvas>
		</v-card-text>
		<div class="ttDiv" :id="selectedPanel"></div>
	</v-card>
</template>

<script lang="ts">

///This is a butcher/very hacky re-work of DWC 3.5 Temp Chart original ////


import Chart, { ChartDataSets, MajorTickOptions, NestedTickOptions, ChartTooltipOptions, TimeUnit } from "chart.js";
import dateFnsLocale from "date-fns/locale/en-US";
import Vue from "vue";
import i18n from "@/i18n";
import store from "@/store";
import Events from "@/utils/events";
import jsonpath from 'jsonpath';


/**
 * Extra values for Chart.JS dataset values
 */
interface ExtraDatasetValues {
	/**
	 * Index of the sensor
	 */
	index: number;

	/**
	 * Whether this is an extra sensor
	 */
	extra: boolean;

	/**
	 * Locale used when rendering
	 */
	locale: string;

	/**
	 * Raw label of this dataset (equal to to sensor.name)
	 */
	rawLabel: string | null;
}

/**
 * Type used for chart datasets in this component
 */
type TempChartDataset = ChartDataSets & ExtraDatasetValues & ChartTooltipOptions;

/**
 * Make a new dataset to render temperature data
 * @param index Sensor index
 * @param extra If this is an extra sensor
 * @param label Label of this sensor
 * @param numSamples Number of current samples to generate for the resulting datset
 */
function makeDataset(index: number, extra: boolean, label: string, numSamples: number, usrColor: string, showDataPoint: boolean): TempChartDataset {
	const color = getLineColor(usrColor);
	return {
		index,
		extra,
		label,
		fill: false,
		backgroundColor: color,
		borderColor: color,
		borderDash: extra ? [10, 5] : undefined,
		borderWidth: 2,
		data: (new Array<number>(numSamples)).fill(NaN),
		locale: i18n.locale,
		pointRadius: showDataPoint ? 1:0,
		pointHitRadius: 1,
		rawLabel: null,
		showLine: true,
		intersect: false
	};
}

/**
 * Temperature samples to save per connected machine
 */
interface TempSampleData {
	times: Array<number>,
	temps: TempChartDataset[]
}

/**
 * Collection of machines vs. collected temp samples
 */
 let tempSamples: Record<string, TempSampleData> = {
	['xxx']: {
		times: [],
		temps: []
	}
};

/**
 * Push sensor data of a given machine to the dataset
 * @param selPanel PanelID to add samples to
 * @param index Index of the sensor
 * @param extra If it is an extra sensor
 * @param sensor Sensor item
 * @param panelData Panel Data
 */
function pushSeriesData(selPanel: string, index: number, sensor: any, panelData: any) {
	// Get series from dataset
	const machineData = tempSamples[selPanel];
	let dataset = machineData.temps.find((item) => {
		if (item.index === index) {
			return item;
		}
	});

	// Check if the dataset has to be created first
	if (!dataset || dataset.locale !== i18n.locale || dataset.rawLabel !== sensor.OMString) {
		let name:string = "";
		if(sensor.name) {
			name = sensor.name;
		}else{
			name = sensor.OMString;
		}
		let useDP: boolean = false;
		if (panelData.chartTickValue > 0){
			useDP = sensor.showDataPoint;
		}else {
			useDP = false
		}		
		if (dataset) {
			dataset.rawLabel = sensor.OMString;
			dataset.label = name;
			dataset.locale = i18n.locale;
		} else {
			dataset = makeDataset(index, sensor.lineDash, name, tempSamples[selPanel].times.length, sensor.OMColor, useDP);
			machineData.temps.push(dataset);
		}
	}else{
		//always update the legend name incase its changed by the user
		dataset.label = sensor.name;
	}
	// Add new sample
	dataset.data!.push((sensor.lastReading !== null) ? sensor.lastReading : NaN);
}

/**
 * Get line color
 * @param usrColor color of the line
 */
function getLineColor(usrColor: string){
	const ghostSpan = document.createElement('span');
	document.body.querySelector('#app')!.appendChild(ghostSpan);
	ghostSpan.classList.add(`${usrColor}--text`);
	const trueColor = window.getComputedStyle(ghostSpan).color;
	ghostSpan.remove();
	return trueColor;
}

let storeSubscribed = false, instances: Array<{ update: () => void;  }> = [];

export default Vue.extend({
	props: {
		passedObject: {
			type: Object
		},
		cfgChgNum: Number,
		pauseChart: Boolean
    },
	computed: {
		darkTheme(): boolean { return store.state.settings.darkTheme; },
		selectedPanel(): string { return this.passedObject.panelID; },
		chgNum(): number | null {return this.cfgChgNum;},
		showLegendVals(): boolean {return this.passedObject.chartShowValueInLegend},
		isChartPaused(): boolean {return this.pauseChart}
	},
	data() {
		return {
			chart: {} as Chart,
			pauseUpdate: false,
			firstChgNum: 0,
			isChartCreated: false,
			//isChartPaused: false
		}
	},
	methods: {
		created(){
			//update to current panelID to keep chart instances seperate
			tempSamples = {
				[this.selectedPanel]: {
					times: [],
					temps: []
				}
			};
		},
		update() {
			this.chart.config.options!.scales!.yAxes![0].ticks!.max = this.passedObject.chartYaxisMax;
			this.chart.config.options!.scales!.xAxes![0].ticks!.min = (new Date()).getTime() - (this.passedObject.chartXaxisMaxSample * 1000);
			this.chart.config.options!.scales!.xAxes![0].ticks!.max = (new Date()).getTime();
			this.chart.update();
		},
		applyDarkTheme(active: boolean) {
			const ticksColor = active ? "#FFF" : "#666";
			this.chart.config.options!.legend!.labels!.fontColor = ticksColor;
			(this.chart.config.options!.scales!.xAxes![0].ticks!.minor as NestedTickOptions).fontColor = ticksColor;
			(this.chart.config.options!.scales!.xAxes![0].ticks!.major as MajorTickOptions).fontColor = ticksColor;
			(this.chart.config.options!.scales!.yAxes![0].ticks!.minor as NestedTickOptions).fontColor = ticksColor;
			(this.chart.config.options!.scales!.yAxes![0].ticks!.major as MajorTickOptions).fontColor = ticksColor;

			const gridLineColor = active ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)";
			this.chart.config.options!.scales!.xAxes![0].gridLines!.color = gridLineColor;
			this.chart.config.options!.scales!.yAxes![0].gridLines!.color = gridLineColor;
			this.chart.config.options!.scales!.yAxes![0].gridLines!.zeroLineColor = gridLineColor;

			this.chart.update();
		},
		getModelValue(omString: string, scaleFactor: number, setPrecision: boolean, precisionVal: number){
			const jp = jsonpath;
			let tmpScaleFactor:number = 1;
			if(scaleFactor && scaleFactor > 0){
				tmpScaleFactor = scaleFactor
			}
			if(omString){
				if(omString.startsWith("global.")){
					let tmpStr = omString.replace("global.", "");
					let tmpNum = null;
					let tmpArr = null;
					//detect if this is a global variable array and retrieve the array value - dwc 3.5
					tmpArr = tmpStr.match(/(?<=\[)[0-9]+?(?=\])/g);
					if(tmpArr){
						tmpNum = Number(tmpArr[0]);
						tmpStr = tmpStr.replace(/\[.*\]/g, "");
						if(store.state.machine.model.global.has(tmpStr)){
							let globArr = store.state.machine.model.global.get(tmpStr);
							if(!isNaN(globArr[tmpNum])){
								if(setPrecision){
									return parseFloat((globArr[tmpNum] * tmpScaleFactor).toFixed(precisionVal))
								}else{
									return (globArr[tmpNum] * tmpScaleFactor)
								}
							}else{
								return 0
							}
						}else{
							return 0;
						}
					}
					if(store.state.machine.model.global.has(tmpStr)){
						if(!isNaN(store.state.machine.model.global.get(tmpStr))){
							if(setPrecision){
								return parseFloat((store.state.machine.model.global.get(tmpStr) * tmpScaleFactor).toFixed(precisionVal))
							}else{
								return (store.state.machine.model.global.get(tmpStr) * tmpScaleFactor);
							}							
						}else{
							return 0;
						}
					}else{
						return 0;
					}
				}else if(omString.startsWith("plugins.")){
					return 0;
				}else{
					var matchInModel = jp.query(store.state.machine.model, (`$.${omString}`));
					if(JSON.stringify(matchInModel) != "[]"){
						if(!isNaN(matchInModel[0])){
							if(setPrecision){
								return parseFloat((matchInModel[0] * tmpScaleFactor).toFixed(precisionVal))
							}else{
								return (matchInModel[0] * tmpScaleFactor);
							}							
						}else{
							return 0;
						}
					}else{
						return 0;
					}
				}
			}else {
				return 0;
			}		
		},
		
		createChart(){
			// Create the chart
			var currPID = this.selectedPanel
			var tmpThis = this
			var yTimeMarks: TimeUnit = "minute"
			if(this.passedObject.chartXaxisMaxSample < 61){yTimeMarks="second"}
			this.chart = new Chart(this.$refs[this.passedObject.panelID] as HTMLCanvasElement, {
				type: "line",
				data: {
					labels: tempSamples[this.selectedPanel].times,
					datasets: tempSamples[this.selectedPanel].temps
				},
				options: {
					animation: {
						duration: 0					// general animation time
					},
					elements: {
						line: {
							tension: 0				// disable bezier curves
						}
					},
					legend: {
						labels: {
							generateLabels: (chart) => {
								const datasets:any = chart.data.datasets;
								return datasets.map((ds:any, i:number) => {
									let tmpLeg:string = `${ds.label}`;
									if(this.showLegendVals){
										tmpLeg = `${ds.label} [${parseFloat(ds.data[ds.data.length -1].toFixed(3))}]`;
									}
									return {
										text: tmpLeg,
										fillStyle: ds.backgroundColor,
										index: i,
										fontFamily: "Roboto,sans-serif"
									}
								})
							}
						}
					},
					tooltips: {
						// Disable the on-canvas tooltip
						enabled: false,

						custom: function(tooltipModel) {
							// Tooltip Element
							var tooltipEl:any  = document.getElementById(currPID);

							function getBody(bodyItem: any) {
								return bodyItem.lines;
							}

							// Set Text
							if (tooltipModel.body) {
								var titleLines = tooltipModel.title || [];
								var bodyLines = tooltipModel.body.map(getBody);
								var txtDataToShow: any = "";
								var txtColourToShow: any = "";
								titleLines.forEach(function(title) {
									txtDataToShow = `${title} - `;
								});			
								
								bodyLines.forEach(function(body, i) {
									var colors = tooltipModel.labelColors[i];
									txtColourToShow = colors.backgroundColor;
									txtDataToShow = txtDataToShow + body;
								});

								tooltipEl.innerHTML = "";
								
								var newSpan = document.createElement('span');
								newSpan.className = "mr-1 v-chip v-chip--label v-chip--no-color theme--dark v-size--default text-caption";
								newSpan.style.backgroundColor = txtColourToShow;
								newSpan.addEventListener('click', function () {tmpThis.clearToolTip();});
								newSpan.innerHTML = `<span class="v-chip__content" >${txtDataToShow}</span></span>`;
								tooltipEl.appendChild(newSpan);
							}
						}
					},
					//events: [],
					maintainAspectRatio: false,
					responsive: true,
					responsiveAnimationDuration: 0, // animation duration after a resize
					scales: {
						xAxes: [
							{
								adapters: {
									date: {
										locale: dateFnsLocale
									}
								},
								gridLines: {
									display: true
								},
								ticks: {
									min: (new Date()).getTime() - (this.passedObject.chartXaxisMaxSample * 1000),
									max: (new Date()).getTime(),
									minor: {
										fontFamily: "Roboto,sans-serif"
									},
									major: {
										fontFamily: "Roboto,sans-serif"
									}
								},
								time: {
									unit: yTimeMarks,
									displayFormats: {
										minute: "HH:mm:ss",
										second: "HH:mm:ss"
									},
									tooltipFormat: 'HH:mm:ss',
								},
								type: "time",
							}
						],
						yAxes: [
							{
								gridLines: {
									display: true
								},
								ticks: {
									minor: {
										fontFamily: "Roboto,sans-serif"
									},
									major: {
										fontFamily: "Roboto,sans-serif"
									},
									min: this.passedObject.chartYaxisMin,
									max: this.passedObject.chartYaxisMax,
									stepSize: this.passedObject.chartYaxisStep
								}
							}
						]
					}
				},
			});
			this.applyDarkTheme(this.darkTheme);
		},
		eventMonitors(){
			if (!storeSubscribed) {
				this.$root.$on(Events.machineAdded, (hostname: string) => {
					tempSamples[this.selectedPanel] = {
						times: [],
						temps: []
					};
				});
				this.$root.$on(Events.machineRemoved, (hostname: string) => {
					delete tempSamples[this.selectedPanel];
				});

				this.$root.$on(Events.machineModelUpdated, (hostname: string) => {
					const dataset = tempSamples[this.selectedPanel], now = (new Date()).getTime();
					if (dataset.times.length === 0 || now - dataset.times[dataset.times.length - 1] > (this.passedObject.chartTickValue * 1000)) {
						// Record sensor temperatures
						let tmpCount: any = 0;
						for(tmpCount in this.passedObject.chartOMDataArr){
							let currObj: any = this.passedObject.chartOMDataArr[tmpCount]
							currObj.lastReading = this.getModelValue(currObj.OMString, Number(currObj.scaleFactor), currObj.setPrecision, Number(currObj.precisionVal))
							pushSeriesData(this.selectedPanel, tmpCount, currObj, this.passedObject);
						}				
						// Record time and deal wih expired temperature samples
						while (dataset.times.length && now - dataset.times[0] > (this.passedObject.chartXaxisMaxSample * 1000) && !this.passedObject.chartRetainData) {
							dataset.times.shift();
							dataset.temps.forEach(data => data.data!.shift());
						}
						dataset.times.push(now);

						
						// Deal with visibility and tell chart instances to update
						dataset.temps.forEach((dataset) => {
							dataset.showLine = true;
						}, this);
					
						instances.forEach(instance =>{
							if(instance === this) {
								instance.update();
							}
						});
						
					}
				});
				storeSubscribed = true;
			}
		},
		cfgChangedActions(){
			if(this.isChartCreated && this.firstChgNum != this.cfgChgNum){
				//console.log("Refreshing");
				this.chart.destroy();
				instances = instances.filter(instance => instance !== this, this);
				storeSubscribed = false;
				delete tempSamples[this.selectedPanel]
				tempSamples[this.selectedPanel] = {
					times: [],
					temps: []
				};
				this.createChart();
				//this.chart.update();
				this.update();
				instances.push(this);
				this.eventMonitors();
				var tmpEle: HTMLElement | null = document.getElementById(this.selectedPanel);
				if(tmpEle){
					tmpEle.innerHTML = "";
				}
			}
		},
		downloadChartData(){
			try{
				const dataToExp = tempSamples[this.selectedPanel]
				var txtToExport: string = "";
				var headerArr: any = [];
				var dataArr:  any = [];
				var tmpArr: any = [];
				//construct csv data format
				//column headers
				headerArr.push('"Time"');
				dataToExp.temps.forEach((dataline: any) => {
					headerArr.push(`"${dataline.label}"`);
				});
				txtToExport = headerArr.toString();
				txtToExport = txtToExport + "\n";

				//data array
				dataToExp.times.forEach((item: any, index: number) => {
					var conDate = new Date(item);
					tmpArr = [];
					tmpArr.push(`${conDate.toTimeString().split(' ')[0]}:${conDate.getMilliseconds()}`)
					//console.log(tmpArr)
					dataToExp.temps.forEach((dataline: any) => {
						tmpArr.push(dataline.data[index])
					})
					//console.log(tmpArr)
					txtToExport = txtToExport + tmpArr.toString();
					txtToExport = txtToExport + "\n";
				});				
				const blob = new Blob([txtToExport], {type: 'text/plain'})
				const e = new MouseEvent("click", {
					view: window,
					bubbles: true,
					cancelable: true,
					clientX: 20,
					});
				var a = document.createElement('a');
				a.download = `ChartData.csv`;
				a.href = window.URL.createObjectURL(blob);
				a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
				a.dispatchEvent(e);
				return true;
			}catch(e){
				console.error("Failed to create csv: ", e)
				return false;
			}
		},
		clearToolTip(){
			var tmpHTML: HTMLElement | null = document.getElementById(this.selectedPanel);
			if(tmpHTML){
				tmpHTML.innerHTML = "";
			}
		}
	},
	mounted() {
		if(!this.isChartCreated){
			this.firstChgNum = this.cfgChgNum;
			instances = instances.filter(instance => instance !== this, this);
			storeSubscribed = false;
			delete tempSamples[this.selectedPanel]
			tempSamples[this.selectedPanel] = {
				times: [],
				temps: []
			};
			this.createChart();
			// Keep track of updates
			instances.push(this);
			this.eventMonitors();
			this.isChartCreated = true;
			var tmpEle: HTMLElement | null = document.getElementById(this.selectedPanel);
			if(tmpEle){
				tmpEle.innerHTML = "";
			}
		};
	},
	beforeDestroy() {
		// Don't update this instance any more...
		instances = instances.filter(instance => instance !== this, this);
		this.chart.destroy;
		this.$root.$off(Events.machineModelUpdated)
		this.isChartCreated = false;
	},
	watch: {
		darkTheme(to: boolean) {
			this.applyDarkTheme(to);
		},
		selectedPanel(machine: string) {
			// Each chart instance is fixed to the currently selected panel
			// Reassign the corresponding dataset whenever the selected panel changes - should not happen but just incase
			this.chart.config.data = {
				labels: tempSamples[machine].times,
				datasets: tempSamples[machine].temps
			};
			this.update();
		},
		chgNum: {
			handler: 'cfgChangedActions',
			immediate: true,
			deep: true
		},
		isChartPaused(to: boolean){
			if(to){
				//console.log("stopping")
				this.chart.stop();
			}else{
				//console.log("starting")
				this.chart.render();
			}
		}
	}
});
</script>
