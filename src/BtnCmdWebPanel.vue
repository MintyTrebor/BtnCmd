<style scoped>
	.iframe-container {
		position: relative;
		overflow: auto;
		background-color: transparent;
	}
	.iframe-container iframe {
	position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}
</style>

<template>
	<div class="iframe-container">
		<iframe :src="passedObject.altWebCamURL" width="100%" height="100%" frameborder="0">
			<span>Your browser does not support iFrames</span>
		</iframe>
	</div>		
</template>

<script>
'use strict'

export default {
	props: {
		passedObject: {
			type: Object
		}
    },
}
</script>
