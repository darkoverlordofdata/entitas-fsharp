namespace Systems
#if HTML5
open Fable.Core
open Fable.Import
open Fable.Import.Browser
open Fable.Core.JsInterop
open Bosco
#endif
open Components
open Entities
open System.Collections.Generic

(**
 * The abstract SystemInterface provides interface and lists to
 * use for adding and removing entities
 * This allows systems to hold a forward reference to the game object
 *)
[<AbstractClass>]
type SystemInterface(height, width, images) =
    inherit Game(height, width, images)
    member val Bullets = List.empty<BulletQueItem> with get,set
    member val Deactivate = List.empty<int> with get,set
    member val Enemies1 = List.empty<EnemyQueItem> with get,set
    member val Enemies2 = List.empty<EnemyQueItem> with get,set
    member val Enemies3 = List.empty<EnemyQueItem> with get,set
    member val Explosions = List.empty<ExplosionQueItem> with get,set
    member val Bangs = List.empty<ExplosionQueItem> with get,set

    abstract member AddBullet : float * float -> unit
    abstract member AddEnemy : Enemies -> unit 
    abstract member AddExplosion : float * float * float -> unit
    abstract member AddBang : float * float * float -> unit
    abstract member RemoveEntity: int -> unit

