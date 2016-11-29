namespace Bosco

open Fable.Core
open Fable.Import
open Fable.Import.Browser
open Fable.Core.JsInterop

module Mouse =
    let mutable down = false
    let mutable buttonDown = false
    let mutable position = PIXI.Point(0., 0.)
    let onTouchStart(e: TouchEvent) =
        let event = e.targetTouches.[0]
        down <- true
        buttonDown <- true
        position.x <- event.clientX
        position.y <- event.clientY
        null

    let onTouchMove(e: TouchEvent) =
        let event = e.targetTouches.[0]
        position.x <- event.clientX
        position.y <- event.clientY
        null
        
    let onTouchEnd(e: TouchEvent) =
        down <- false
        buttonDown <- false
        null
        
    let onMouseStart(e: MouseEvent) =
        down <- true
        buttonDown <- true
        position.x <- e.clientX
        position.y <- e.clientY
        null

    let onMouseMove(e: MouseEvent) =
        position.x <- e.clientX
        position.y <- e.clientY
        null

    let onMouseEnd(e: MouseEvent) =
        down <- false
        buttonDown <- false
        null

    let init () =
        document.addEventListener_touchstart(fun e -> onTouchStart(e) )
        document.addEventListener_touchmove(fun e -> onTouchMove(e) )
        document.addEventListener_touchend(fun e -> onTouchEnd(e) )

        document.addEventListener_mousedown(fun e -> onMouseStart(e) )
        document.addEventListener_mousemove(fun e -> onMouseMove(e) )
        document.addEventListener_mouseup(fun e -> onMouseEnd(e) )
