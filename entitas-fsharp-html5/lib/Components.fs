module Components
#if HTML5
open Fable.Core
open Fable.Import
open Fable.Import.Browser
open Fable.Core.JsInterop
#endif
#if WINDOWS || LINUX
open Microsoft.Xna.Framework
open Microsoft.Xna.Framework.Graphics
#endif

(** Layer - All entities need a display layer *)
type Layer =
    | DEFAULT           = 0
    | BACKGROUND        = 1
    | TEXT              = 2
    | LIVES             = 3
    | ENEMY1            = 4
    | ENEMY2            = 5
    | ENEMY3            = 6
    | PLAYER            = 7
    | BULLET            = 8
    | EXPLOSION         = 9
    | BANG              = 10
    | PARTICLE          = 11
    | HUD               = 12

(** EntityType Component *)
type EntityType =
    | Background        = 0
    | Bullet            = 1
    | Enemy             = 2
    | Explosion         = 3
    | Particle          = 4
    | Player            = 5

(** Sound Effect Component *)
type Effect =
    | PEW               = 0
    | ASPLODE           = 1
    | SMALLASPLODE      = 2

(** Enemy Type Component *)
type Enemies =
    | Enemy1            = 0
    | Enemy2            = 1
    | Enemy3            = 2

(** Health Component *)
type Health =
    {
        CurHealth: int;
        MaxHealth: int;
    }

(** Create a Health Component *)
let CreateHealth(curHealth: int, maxHealth : int) =
    {
        CurHealth = curHealth;
        MaxHealth = maxHealth;
    }

(** Tween Component *)
type Tween =
    {
        Min : float;
        Max : float;
        Speed : float;
        Repeat : bool;
        Active : bool;
    }
(** Create a Scale Animation Component *)
let CreateTween(min: float, max: float, speed: float, repeat: bool, active: bool) =
    {
        Min = min;
        Max = max;
        Speed = speed;
        Repeat = repeat;
        Active = active;
    } 



(** Request an enemy *)
type EnemyQueItem =
    {
        Enemy : Enemies;
    }
let EnemyQue(enemy : Enemies) : EnemyQueItem =
    {
        Enemy = enemy;
    }


(** Request an explosion *)
type ExplosionQueItem =
    {
        X: float;
        Y: float;
        Scale : float;
    }
let ExplosionQue(x:float, y:float, scale : float) : ExplosionQueItem =
    {
        X = x;
        Y = y;
        Scale = scale;
    }

(** Request a bullet *)
type BulletQueItem =
    {
        X: float;
        Y: float;
    }
let BulletQue(x:float, y:float) : BulletQueItem =
    {
        X = x;
        Y = y;
    }
    

#if HTML5
let CreatePoint(x, y) =
    PIXI.Point(x, y)

let CreateSprite(texture) =
    PIXI.Sprite(texture)

let CreateRect(x, y, w, h) =
    PIXI.Rectangle(x, y, w, h)

#endif

#if WINDOWS || LINUX
let CreatePoint(x, y) =
    Vector2(x, y)

let CreateSprite(texture) =
    Texture2D(texture)

let CreateRect(x, y, w, h) =
    Rectangle(x, y, w, h)
#endif
