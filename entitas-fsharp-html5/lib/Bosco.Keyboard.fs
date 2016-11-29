namespace Bosco

open Fable.Core
open Fable.Import
open Fable.Import.Browser
open Fable.Core.JsInterop

module Keyboard =
    let mutable keysPressed = Set.empty
    let reset () = keysPressed <- Set.empty
    let isPressed keyCode = Set.contains keyCode keysPressed
    let update (e : KeyboardEvent, pressed) =
        let keyCode = int e.keyCode
        let op = if pressed then Set.add else Set.remove
        keysPressed <- op keyCode keysPressed
        null
    let init () =
        window.addEventListener_keydown(fun e -> update(e, true))
        window.addEventListener_keyup(fun e -> update(e, false))

