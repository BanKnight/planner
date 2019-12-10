import Vue from "vue"
import mavonEditor from "mavon-editor";

const it = mavonEditor.markdownIt

Vue.prototype.$md = function (text)
{
    return it.render(text)
}
