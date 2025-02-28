import BtnCmdMainPanel from './BtnCmdMainPanel.vue';
import router, { registerRoute } from '@/routes';
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
			enableBounceAtLoad: false,
			enableChangeTopBar: false,
			bounceAtLoadDelay: 1,
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
				enableBounceAtLoad: false,
				enableChangeTopBar: false,
				bounceAtLoadDelay: 1,
				TopBarColor: ''
			},
		};
	}
}

function runStartup(){
	//console.log("router:", router.currentRoute.fullPath)
	//don't route if already on BtnCmd 
	if(router.currentRoute.fullPath != "/BtnCmd"){
		if(tmpSession.globalSettings.enableLaunchAtLoad && !tmpSession.globalSettings.enableBounceAtLoad){
			router.replace('/BtnCmd');
		}
		if(tmpSession.globalSettings.enableBounceAtLoad && !tmpSession.globalSettings.enableLaunchAtLoad){
			router.replace('/BtnCmd');
			delay(1000 * tmpSession.globalSettings.bounceAtLoadDelay).then(() => router.replace('/'));
		}
	}
	if(tmpSession.globalSettings.enableChangeTopBar && tmpSession.globalSettings.TopBarColor){
		let aptb = document.getElementsByClassName("v-app-bar")
		//console.log("curr color", aptb[0].style.backgroundColor)
		aptb[0].style.backgroundColor = tmpSession.globalSettings.TopBarColor;
		//aptb[0].style.backgroundColor = "";
	}
}

function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}
  
  