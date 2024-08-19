import { createApp } from "vue";
import "./style.css";
import './assets/iconfont/iconfont.css';
import elementPlus from './plugins/element-plus'
import App from "./App.vue";

const app = createApp(App);

app.use(elementPlus);
app.mount("#app");
