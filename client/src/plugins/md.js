import Vue from "vue"
import mavonEditor from "mavon-editor";
import 'mavon-editor/dist/css/index.css';

const it = mavonEditor.markdownIt

Vue.prototype.$md = function (text)
{
    return it.render(text)
}

Vue.use(mavonEditor);
