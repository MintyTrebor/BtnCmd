'use strict'

import BtnCmdMainPanel from './BtnCmdMainPanel.vue';
import { registerRoute } from '../../routes';

registerRoute(BtnCmdMainPanel, {
	Control: {
		BtnCmd: {
			icon: 'mdi-gesture-tap-button',
			caption: 'BtnCmd',
			path: '/BtnCmd'
		}
	}
});



