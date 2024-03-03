<style scoped>
iframe {
	width: 100%;
	height: 100%;
	border: 0px;
	overflow: hidden;
}

img {
	max-width: 100%;
	max-height: 100%;
}

.img-container {
	overflow: hidden;
}

.iframe-dialog {
		position: relative;
		/* overflow: auto; */
		background-color: transparent;
		width: 100%;
		height: 99%;
	}

.flip-x {
	-moz-transform: scaleX(-1);
	-o-transform: scaleX(-1);
	-webkit-transform: scaleX(-1);
	transform: scaleX(-1);
	filter: FlipH;
	-ms-filter: "FlipH";
}

.flip-y {
	-moz-transform: scaleY(-1);
	-o-transform: scaleY(-1);
	-webkit-transform: scaleY(-1);
	transform: scaleY(-1);
	filter: FlipV;
	-ms-filter: "FlipV";
}

.rotate-90 {
	transform: rotate(90deg);
	-ms-transform: rotate(90deg);
	-moz-transform: rotate(90deg);
	-webkit-transform: rotate(90deg);
	-o-transform: rotate(90deg);
}

.rotate-180 {
	transform: rotate(180deg);
	-ms-transform: rotate(180deg);
	-moz-transform: rotate(180deg);
	-webkit-transform: rotate(180deg);
	-o-transform: rotate(180deg);
}

.rotate-270 {
	transform: rotate(270deg);
	-ms-transform: rotate(270deg);
	-moz-transform: rotate(270deg);
	-webkit-transform: rotate(270deg);
	-o-transform: rotate(270deg);
}
.canvas {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

<template>
	<v-card>
		<v-card-text class="pa-0 img-container" style="position: absolute; top: 0px;">
			<v-btn v-if="showConfigBtn && !showCrossHair" right app fixed inset top fab small @click="showConfig()" style="background-color: transparent; opacity: 1;"><v-icon color="#F5F5F5">mdi-cog</v-icon></v-btn>
			<v-responsive v-if="passedObject.altWebCamiFrame" :aspect-ratio="16/9">
				<iframe :src="passedObject.altWebCamURL" :class="classList"></iframe>
			</v-responsive>

			<a v-else :href="passedObject.altWebCamClickURL ? passedObject.altWebCamClickURL : 'javascript:void(0)'">
				<img :alt="$t('panel.webcam.alt')" :src="active ? url : ''" :class="classList">
			</a>
			<v-overlay v-if="showCrossHair" :opacity="0">
				<canvas class="canvas" ref="crossHairCanvas" ></canvas>
				<v-btn v-if="showConfigBtn" right app fixed inset top fab small @click="showConfig()" style="background-color: transparent; opacity: 1;"><v-icon color="#F5F5F5">mdi-cog</v-icon></v-btn>
				<v-btn left app fixed bottom fab small class="ml-n2 mb-n2" @click="showNozzleConfig()" style="background-color: transparent; opacity: 1;"><v-icon color="#3aeb34">mdi-crosshairs-gps</v-icon></v-btn>
			</v-overlay>
		</v-card-text>
		
		<v-dialog v-model="showConfigDialog" width="80vw">
			<v-card height="80vh">
				<div class="iframe-dialog" width="100%" height="95%">
					<iframe :src="this.passedObject.altWebCamConfigURL" width="100%" height="95%" frameborder="0">
						<span>Your browser does not support iFrames</span>
					</iframe>
				</div>		
			</v-card>
		</v-dialog>

		<v-dialog v-model="showNozzleConfigDialog" width="500px">
			<v-card height="60px" style="overflow-y: hidden;">
				<v-card-text>
					<v-row dense>
						<v-col cols="5">
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<v-text-field v-bind="attrs" v-on="on" label="Nozzle Diameter" v-model.number="passedObject.nozzleDiameter" placeholder="0.4"></v-text-field>
								</template>
								<span>Nozzle diameter (eg 0.4)</span>
							</v-tooltip>
						</v-col>
						<v-col cols="5">
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<v-text-field v-bind="attrs" v-on="on" label="Pixels per 1mm" v-model.number="passedObject.pixelPerMM" placeholder="100"></v-text-field>
								</template>
								<span>Number of screen pixels per 1mm of travel</span>
							</v-tooltip>
						</v-col>
						<v-col cols="2">
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<v-btn small fab v-bind="attrs" v-on="on" @click="saveExitNozCfg()" class="mt-2 ml-4">
										<v-icon color="blue">mdi-content-save-move</v-icon>
									</v-btn>
								</template>
								<span>Save & Close</span>
							</v-tooltip>
						</v-col>
					</v-row>
				</v-card-text>	
			</v-card>
		</v-dialog>
	</v-card>
</template>

<script>
'use strict'

import { mapState, mapGetters } from 'vuex'

export default {
	props: {
		passedObject: {
			type: Object
		},
		currWSize: {
			type: Number
		},
		currHSize: {
			type: Number
		}
    },
	computed: {
		...mapState('settings', ['webcam']),
		...mapGetters('machine', ['connector']),
		classList() {
			const result = [];
			if (this.passedObject.altWebCamFlip === 'x' || this.passedObject.altWebCamFlip === 'both') {
				result.push('flip-x');
			}
			if (this.passedObject.altWebCamFlip === 'y' || this.passedObject.altWebCamFlip === 'both') {
				result.push('flip-y');
			}
			if (this.passedObject.altWebCamRotation === 90) {
				result.push('rotate-90');
			} else if (this.passedObject.altWebCamRotation === 180) {
				result.push('rotate-180');
			} else if (this.passedObject.altWebCamRotation === 270) {
				result.push('rotate-270');
			}
			return result;
		},
		showConfigBtn() {
			if(this.passedObject.altWebCamConfigURL){
				return true;
			}else{
				return false;
			}
		},
		showCrossHair() {
			if(this.passedObject.showCrossHair){
				return true;
			}else{
				return false;
			}
		},
		show: {
			get () {
				return this.value
			},
			set (value) {
				this.$emit('input', value)
			}
		},
		pxPerMM(){
			return this.passedObject.pixelPerMM;
		},
		nozDiam() {
			return this.passedObject.nozzleDiameter;
		}
	},
	data() {
		return {
			active: true,
			updateTimer: null,
			url: '',
			showConfigDialog: false,
			showNozzleConfigDialog: false,
			vueCanvas: null,
			canvas: null
		}
	},
	activated() {
		this.active = true;
	},
	deactivated() {
		this.active = false;
	},
	methods: {
		updateWebcam() {
			let url = this.passedObject.altWebCamURL.replace('[HOSTNAME]', this.connector ? this.connector.hostname : location.hostname);
			if (this.passedObject.altWebCamUpdateTimer > 0) {
				if (this.passedObject.altWebCamAppndHTTP) {
					url += "_" + Math.random();
				} else {
					if (url.indexOf("?") === -1) {
						url += "?dummy=" + Math.random();
					} else {
						url += "&dummy=" + Math.random();
					}
				}
			}
			this.url = url;
		},
		showConfig(){
			if(this.passedObject.altWebCamConfigNewWin){
				window.open(this.passedObject.altWebCamConfigURL, '_blank').focus();
			}else{
				this.showConfigDialog = true;
			}
		},
		showNozzleConfig(){
			this.showNozzleConfigDialog = true;
		},

		saveExitNozCfg(){
			this.$emit('exit', true);
			this.showNozzleConfigDialog = false;
		},
		
		drawCrossHairOverlay() {
			// adapted from klipper mainsail https://github.com/HelgeKeck/mainsail/blob/idex/src/components/webcams/streamers/MjpegstreamerAdaptive.vue
			// canvas center
			let canW = this.currWSize //Math.round(this.canvas.width);
			let canH = this.currHSize //Math.round(this.canvas.height);
			this.canvas.width = canW;
			this.canvas.height = canH;
			//console.log("w,h", canW, canH)
			let canvasCenterX = Math.round(canW / 2)
			let canvasCenterY = Math.round(canH / 2)
			//console.log("canvW, canvH", this.canvas.width, this.canvas.height)


			// ----------------------------------------------------------------
			// Overlay
			// ----------------------------------------------------------------
			this.vueCanvas.beginPath()
			this.vueCanvas.lineWidth = 3
			this.vueCanvas.fillStyle = 'transparent'
			this.vueCanvas.strokeStyle = '#3aeb34'

			// ----------------------------------------------------------------
			// draw crosshairs circles
			// ----------------------------------------------------------------
			let innerCircleRX = canW / (canW / (this.passedObject.nozzleDiameter * this.passedObject.pixelPerMM)) / 2
			let innerCircleRY = canH / (canH / (this.passedObject.nozzleDiameter * this.passedObject.pixelPerMM)) / 2
			let outerCircleRX = canW / (canW / (1.0 * this.passedObject.pixelPerMM)) / 2
			let outerCircleRY = canH / (canH / (1.0 * this.passedObject.pixelPerMM)) / 2
			this.vueCanvas.ellipse(canvasCenterX, canvasCenterY, innerCircleRX, innerCircleRY, 0, 0, 360)
			this.vueCanvas.ellipse(canvasCenterX, canvasCenterY, outerCircleRX, outerCircleRY, 0, 0, 360)
			this.vueCanvas.fill()

			// ----------------------------------------------------------------
			// draw crosshairs lines
			// ----------------------------------------------------------------
			let crosshairsLengthX = Math.round(canW / (canW / (1.5 * this.passedObject.pixelPerMM)))
			let crosshairsLengthY = Math.round(canH / (canH / (1.5 * this.passedObject.pixelPerMM)))
			this.vueCanvas.moveTo(canvasCenterX, canvasCenterY - crosshairsLengthY / 2)
			this.vueCanvas.lineTo(canvasCenterX, canvasCenterY + crosshairsLengthY / 2)
			this.vueCanvas.moveTo(canvasCenterX - Math.round(crosshairsLengthX / 2), canvasCenterY)
			this.vueCanvas.lineTo(canvasCenterX + Math.round(crosshairsLengthX / 2), canvasCenterY)

			this.vueCanvas.stroke()
		},
		
	},
	mounted() {
		if (!this.passedObject.altWebCamiFrame) {
			this.updateWebcam();
			if (this.passedObject.altWebCamUpdateTimer > 0) {
				this.updateTimer = setInterval(this.updateWebcam, this.passedObject.altWebCamUpdateTimer);
			}
		}
		if(this.passedObject.showCrossHair){
			this.canvas = this.$refs.crossHairCanvas;
			var ctx = this.canvas.getContext('2d');
			this.vueCanvas = ctx;
			this.drawCrossHairOverlay();
		}
	},
	watch: {
		webcam: {
			deep: true,
			handler() {
				if (this.passedObject.altWebCamUpdateTimer === 0) {
					// For persistent images we need to apply updates independently of the update loop
					this.updateWebcam();
				}
			}
		},
		pxPerMM(){
			if(this.passedObject.showCrossHair){
				this.canvas = this.$refs.crossHairCanvas;
				var ctx = this.canvas.getContext('2d');
				this.vueCanvas = ctx;
				this.drawCrossHairOverlay();
			}
		},
		nozDiam(){
			if(this.passedObject.showCrossHair){
				this.canvas = this.$refs.crossHairCanvas;
				var ctx = this.canvas.getContext('2d');
				this.vueCanvas = ctx;
				this.drawCrossHairOverlay();
			}
		}
	},
	beforeDestroy() {
		if (this.updateTimer) {
			clearInterval(this.updateTimer);
		}
	}
}
</script>
