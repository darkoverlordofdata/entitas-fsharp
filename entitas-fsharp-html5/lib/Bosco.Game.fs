namespace Bosco
open Fable.Core
open Fable.Import
open Fable.Import.Browser
open Fable.Core.JsInterop
open System.Collections.Generic

(** Abstrct Game *)
[<AbstractClass>]
type Game(width, height, images:Dictionary<string, string>) as this =
    let mutable previousTime = 0.0
    let mutable elapsedTime = 0.0
    let mutable totalFrames = 0
    let renderer = PIXI.WebGLRenderer(width, height)
    do document.body.appendChild(renderer.view) |> ignore        
    let rec animate timeStamp =
        let t = if previousTime>0.0 then previousTime else timeStamp
        previousTime <- timeStamp
        let delta = (timeStamp - t) * 0.001
        totalFrames <- totalFrames + 1
        elapsedTime <- elapsedTime + delta
        if elapsedTime > 1.0 then
            this.fps <- totalFrames
            totalFrames <- 0
            elapsedTime <- 0.0

        window.requestAnimationFrame(FrameRequestCallback animate) |> ignore
        this.Update(delta)
        this.Draw(delta)
        renderer.render(this.spriteBatch)
    member val spriteBatch = PIXI.Container()
    member val fps = 0 with get,set
    [<DefaultValue>]val mutable Content:obj
    member this.Initialize() =
        this.LoadContent()
    abstract member LoadContent: unit -> unit
    abstract member Update: float -> unit
    abstract member Draw: float -> unit
    member this.Run() =
        for image in images do PIXI.Globals.loader?add(image.Key, image.Value) |> ignore    
        PIXI.Globals.loader.load(System.Func<_,_,_>(fun loader resources ->
            this.Content <- resources
            this.Initialize()
            animate 0. |> ignore
        ))

