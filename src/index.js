'use strict'

import BtnCmdMainPanel from './BtnCmdMainPanel.vue';
import router, { registerRoute } from '../../routes';
import Vue from 'vue';
import VueRouter from 'vue-router'



registerRoute(BtnCmdMainPanel, {
	Control: {
		BtnCmd: {
			icon: 'mdi-gesture-tap-button',
			caption: 'BtnCmd',
			path: '/BtnCmd'
		}
	}
});


Vue.use(VueRouter);

try{
	var tmpSession = {
		globalSettings: {
			enableLaunchAtLoad: false,
			enableChangeTopBar: false,
			TopBarColor: ''
		},
	};
	getFromCache()
	setTimeout(runStartup, 250)
}catch(e) {
	console.warn("BtnCmd: Unable to autostart - ", e)
}

function getFromCache() {
	var tmpString = localStorage.getItem('btnCmdsettings');
	if(tmpString) {
		tmpSession = JSON.parse(tmpString);
	} else {
		tmpSession = {
			globalSettings: {
				enableLaunchAtLoad: false,
				enableChangeTopBar: false,
				TopBarColor: ''
			},
		};
	}
}

function runStartup(){
	if(tmpSession.globalSettings.enableLaunchAtLoad){
		router.replace('/BtnCmd');
	}
	if(tmpSession.globalSettings.enableChangeTopBar && tmpSession.globalSettings.TopBarColor){
		let aptb = document.getElementsByClassName("v-app-bar")
		//console.log(aptb[0].style.backgroundColor)
		aptb[0].style.backgroundColor = tmpSession.globalSettings.TopBarColor;
		//aptb[0].style.backgroundColor = "";
	}
}
