import backlogs from "./backlogs"
import wiki from "./wiki"

const files = require.context(".", false, /\.vue$/);
const children = [];

files.keys().forEach(key =>
{
    if (key === "./index.js") return;

    // let name = key.replace(/(\.\/|\.vue)/g, "");
    let mod = files(key).default;

    children.push(mod);
});

children.push(backlogs)
children.push(wiki)

children.sort((first, second) =>
{
    first = first.core || first
    second = second.core || second

    return second.weight - first.weight;
});

export default children