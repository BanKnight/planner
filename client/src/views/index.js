import not_found from "./404"
import home from "./home"

const views = []

views.push(not_found)
views.push(home)

views.sort((first, second) => {
    return second.weight - first.weight;
})

export default views


