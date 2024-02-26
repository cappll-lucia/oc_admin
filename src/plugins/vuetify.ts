import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import * as labs from 'vuetify/labs/components';
import Datepicker from 'vue3-datepicker';

const vuetify = createVuetify({
	components: {
		...components,
		...labs,
		Datepicker,
	},
	directives,
	icons: {
		defaultSet: 'mdi',
	},
});

export default vuetify;
