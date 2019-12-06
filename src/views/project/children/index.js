const files = require.context(".", false, /\.vue$/);
const children = [];

files.keys().forEach(key =>
{
    if (key === "./index.js") return;

    // let name = key.replace(/(\.\/|\.vue)/g, "");
    let mod = files(key).default;

    children.push(mod);
});

children.sort((first, second) =>
{
    return first.weight > second.weight;
});

export default children