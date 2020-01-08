import home from "./home";

const views = [];

const files = require.context(".", false, /\.vue$/);

files.keys().forEach(key => {
  if (key === "./index.js") return;

  // let name = key.replace(/(\.\/|\.vue)/g, "");
  let mod = files(key).default;

  views.push(mod);
});

views.push(home);

views.sort((first, second) => {
  first = first.core || first;
  second = second.core || second;
  return second.weight - first.weight;
});

export default views;
