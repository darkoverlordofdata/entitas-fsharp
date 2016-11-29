System.defaultJSExtensions = true
System.config({
    map: { 
        'core-js'   : 'src/core-js/core.min',   
        'fable-core': 'src/fable-core/umd',
        'PIXI'      : 'src/pixi.js/pixi.min'
    }
})
SystemJS.import('src/lib/ShmupWarz.js')
