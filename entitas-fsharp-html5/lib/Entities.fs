module Entities

(** ShmupWarz Game Demo *)
#if HTML5
open Fable.Core
open Fable.Import
open Fable.Import.Browser
open Fable.Core.JsInterop
open Bosco
#endif
#if WINDOWS || LINUX
open Microsoft.Xna.Framework
open Microsoft.Xna.Framework.Graphics
#endif
open Components
open System.Collections.Generic
let rnd = System.Random()
let mutable UniqueId = 0
let NextUniqueId() = 
    UniqueId <- UniqueId + 1
    UniqueId

(** Entity is a record of components *)
type Entity = 
    {
        Id              : int;                  (* Unique sequential id *)
        Name            : string;               (* Display name *)
        Active          : bool;                 (* In use *)
        EntityType      : EntityType;           (* Category *)
        Layer           : Layer;                (* Display Layer *)
        Tint            : Color option;         (* Color to use as tint *)
        Bounds          : int option;           (* For Hit Detection *)
        Expires         : float option;         (* Entity duration *)
        Health          : Health option;        (* Points *)
        Tween           : Tween option;         (* Explosion tweens *)
#if HTML5
        Sprite          : PIXI.Sprite option;   (* Sprite *)
        Position        : PIXI.Point;           (* Position *)
        Scale           : PIXI.Point option;    (* Display Scale *)
        Size            : PIXI.Point;           (* Sprite size *)
        Velocity        : PIXI.Point option;    (* Movement speed *)
#endif
#if WINDOWS || LINUX
        Position        : Vector2;              (* Position *)
        Sprite          : Texture2D option;     (* Sprite *)
        Scale           : Vector2 option;       (* Display Scale *)
        Size            : Vector2;              (* Sprite size *)
        Velocity        : Vector2 option;       (* Movement speed *)
#endif
    }


(** Create a Player Entity *)
let CreatePlayer (content:obj) =
    let sprite = CreateSprite(unbox content?fighter?texture)
    sprite.anchor <- CreatePoint(0.5, 0.5)
    {
        Id = NextUniqueId();
        Name = "Player";
        Active = true;
        EntityType = EntityType.Player; 
        Layer = Layer.PLAYER;
        Position = CreatePoint(0., 0.); 
        Scale = None;
        Sprite = Some(sprite);
        Tint = None;

        Bounds = Some(43);
        Expires = None;
        Health = Some(CreateHealth(100, 100));
        Velocity = Some(CreatePoint(0., 0.));
        Tween = None;
        Size = CreatePoint(float sprite.width, float sprite.height);
    }
     
(** Create a Bullet Entity *)
let CreateBullet (content:obj) =
    let sprite = CreateSprite(unbox content?bullet?texture)
    sprite.anchor <- CreatePoint(0.5, 0.5)
    {
        Id = NextUniqueId();
        Name = "Bullet";
        Active = false;
        EntityType = EntityType.Bullet; 
        Layer = Layer.BULLET;
        Position = CreatePoint(0., 0.); 
        Scale = None;
        Sprite = Some(sprite);
        Tint = Some(Color.GreenYellow);

        Bounds = Some(5);
        Expires = Some(0.1);
        Health = None;
        Velocity = Some(CreatePoint(0., -800.));
        Tween = None;
        Size = CreatePoint(float sprite.width, float sprite.height);
    }

(** Create Enemy *)
let CreateEnemy1 (content:obj)  =
    let sprite = CreateSprite(unbox content?enemy1?texture)
    sprite.anchor <- CreatePoint(0.5, 0.5)
    {
        Id = NextUniqueId();
        Name = "Enemy1";
        Active = false;
        EntityType = EntityType.Enemy; 
        Layer = Layer.ENEMY1;
        Position = CreatePoint(0., 0.); 
        Scale = None;
        Sprite = Some(sprite);
        Tint = None;

        Bounds = Some(20);
        Expires = None
        Health = Some(CreateHealth(10, 10));
        Velocity = Some(CreatePoint(0., 40.));
        Tween = None;
        Size = CreatePoint(float sprite.width, float sprite.height);
    }
(** Create Enemy *)
let CreateEnemy2 (content:obj) =
    let sprite = CreateSprite(unbox content?enemy2?texture)
    sprite.anchor <- CreatePoint(0.5, 0.5)
    {
        Id = NextUniqueId();
        Name = "Enemy2";
        Active = false;
        EntityType = EntityType.Enemy; 
        Layer = Layer.ENEMY2;
        Position = CreatePoint(0., 0.); 
        Scale = None;
        Sprite = Some(sprite);
        Tint = None;

        Bounds = Some(40);
        Expires = None
        Health = Some(CreateHealth(20, 20));
        Velocity = Some(CreatePoint(0., 30.));
        Tween = None;
        Size = CreatePoint(float sprite.width, float sprite.height);
    }

(** Create Enemy *)
let CreateEnemy3 (content:obj)  =
    let sprite = CreateSprite(unbox content?enemy3?texture)
    sprite.anchor <- CreatePoint(0.5, 0.5)
    {
        Id = NextUniqueId();
        Name = "Enemy3";
        Active = false;
        EntityType = EntityType.Enemy; 
        Layer = Layer.ENEMY3;
        Position = CreatePoint(0., 0.); 
        Scale = None;
        Sprite = Some(sprite);
        Tint = None;

        Bounds = Some(70);
        Expires = None
        Health = Some(CreateHealth(60, 60));
        Velocity = Some(CreatePoint(0., 20.));
        Tween = None;
        Size = CreatePoint(float sprite.width, float sprite.height);
    }

(** Create Big Explosion *)
let CreateExplosion (content:obj) =
    let sprite = CreateSprite(unbox content?explosion?texture)
    sprite.anchor <- CreatePoint(0.5, 0.5)
    {
        Id = NextUniqueId();
        Name = "Explosion";
        Active = false;
        EntityType = EntityType.Explosion; 
        Layer = Layer.EXPLOSION;
        Position = CreatePoint(0., 0.); 
        Scale = Some(CreatePoint(1., 1.))
        Sprite = Some(sprite);
        Tint = Some(Color.LightGoldenrodYellow);

        Bounds = None;
        Expires = Some(0.5);
        Health = None;
        Velocity = None;
        Tween = Some(CreateTween(1./100., 1., -3., false, true));
        Size = CreatePoint(float sprite.width, float sprite.height);
    }

let CreateBang (content:obj) =
    let sprite = CreateSprite(unbox content?bang?texture)
    sprite.anchor <- CreatePoint(0.5, 0.5)
    {
        Id = NextUniqueId();
        Name = "Bang";
        Active = false;
        EntityType = EntityType.Explosion; 
        Layer = Layer.BANG;
        Position = CreatePoint(0., 0.); 
        Scale = Some(CreatePoint(1., 1.))
        Sprite = Some(sprite);
        Tint = Some(Color.PaleGoldenrod);

        Bounds = None;
        Expires = Some(0.5);
        Health = None;
        Velocity = None;
        Tween = Some(CreateTween(1./100., 1., -3., false, true));
        Size = CreatePoint(float sprite.width, float sprite.height);
    }

