import MyButton from './MyButton'
import MyInput from './MyInput'

const ALLCOMPS = [
    MyButton,
    MyInput
]

const MyUI = {}

ALLCOMPS.forEach(item => {
    item.install = Vue => Vue.component(item.name, item)
})

MyUI.install = function (Vue, options) {
    if (options && options.components) {
        const components = options.components
        components.forEach(compName => {
            ALLCOMPS.forEach(comp => {
                if (comp.name === compName) {
                    Vue.component(comp.name, comp)
                }
            })
        })
    } else {
        ALLCOMPS.forEach(comp => {
            Vue.component(comp.name, comp)
        })
    }
}

if (typeof window !== 'undefined' && window.Vue) {
    MyUI.install(window.Vue)
}

export {
    MyButton,
    MyInput
}
export default MyUI