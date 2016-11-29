module ShmupWarz

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
open Entities
open Systems
open System.Collections.Generic

(**
 * Create the Entity DataBase
 *) 
let CreateEntityDB(content) = 
    [
        CreatePlayer(content);
        CreateBang(content);
        CreateBang(content);
        CreateBang(content);
        CreateBang(content);
        CreateBang(content);
        CreateBang(content);
        CreateBang(content);
        CreateBang(content);
        CreateExplosion(content);
        CreateExplosion(content);
        CreateExplosion(content);
        CreateExplosion(content);
        CreateExplosion(content);
        CreateExplosion(content);
        CreateExplosion(content);
        CreateExplosion(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateBullet(content);
        CreateEnemy1(content);
        CreateEnemy1(content);
        CreateEnemy1(content);
        CreateEnemy1(content);
        CreateEnemy1(content);
        CreateEnemy1(content);
        CreateEnemy1(content);
        CreateEnemy1(content);
        CreateEnemy1(content);
        CreateEnemy2(content);
        CreateEnemy2(content);
        CreateEnemy2(content);
        CreateEnemy2(content);
        CreateEnemy2(content);
        CreateEnemy2(content);
        CreateEnemy3(content);
        CreateEnemy3(content);
        CreateEnemy3(content);
        CreateEnemy3(content);

    ]

let ASSETS = 
    dict[
        "background", "images/BackdropBlackLittleSparkBlack.png";
        "bang", "images/bang.png";
        "bullet", "images/bullet.png";
        "enemy1","images/enemy1.png";
        "enemy2","images/enemy2.png";
        "enemy3","images/enemy3.png";
        "explosion","images/explosion.png";
        "fighter","images/fighter.png";
        "font","images/tom-thumb-white.png"
        ]

(** ShmupWarz *)
type ShmupWarz(height, width0, mobile) as this =
    inherit SystemInterface(height, width0, Dictionary<string, string>ASSETS)
    let pixelFactor = (if mobile then 2.0 else 1.0)
    let width = ((float)width0/pixelFactor)
    let mutable entities = lazy(CreateEntityDB(this.Content))
    let fntImage = lazy(CreateSprite(unbox this.Content?font?texture))
    let bgdImage = lazy(CreateSprite(unbox this.Content?background?texture))
    let bgdRect = CreateRect(0., 0., width, height)
    let scaleX = (float) (width / 320.) // pixelFactor
    let scaleY = (float) (height / 480.) // pixelFactor

    let activeEntities (input:Entity list) =
        let rec _activeEntities (input:Entity list) (output:Entity list) =
            match input with
            | x::xs when x.Active -> _activeEntities xs (x::output)
            | _::xs -> _activeEntities xs output 
            | [] -> output
        _activeEntities input []
    (** Draw the sprite for an Entity *)
    let drawSprite(spriteBatch:PIXI.Container) (entity) =
        match entity.Sprite with
        | Some sprite ->
            let scale =
                match entity.Scale with
                | Some(scale) -> scale
                | None -> CreatePoint(1., 1.)
            let color = 
                match entity.Tint with 
                | Some(color) -> color
                | None -> Color.White
            sprite.x <- entity.Position.x
            sprite.y <- entity.Position.y
            sprite.scale <- scale
            sprite.tint <- float color
            spriteBatch.addChild(sprite) |> ignore

        | None -> ()

    member this.Initialize() =
        Keyboard.init()
        Mouse.init()
        base.Initialize()

    override this.LoadContent() =
        entities.Force() |> ignore
        ()

    override this.Draw(gameTime) =        
        this.spriteBatch.children?length <- 0
        this.spriteBatch.addChild(bgdImage.Value) |> ignore
        activeEntities(entities.Value)
        |> List.sortBy(fun e -> e.Layer) 
        |> List.iter(drawSprite(this.spriteBatch))
        ()

    override this.Update(gameTime) =
#if WINDOWS || LINUX
        if GamePad.GetState(PlayerIndex.One).Buttons.Back = ButtonState.Pressed then 
            this.Exit()
#endif
        let delta = gameTime
        let current = entities.Value

        EnemySpawningSystem(delta, this) |> ignore
        entities <-  // Everything happens here:
            lazy (current
                 |> List.map(InputSystem(delta, mobile, this))
                 |> List.map(EntitySystem(this, int width, int height))
                 |> List.map(MovementSystem(delta))
                 |> List.map(ExpiringSystem(delta))
                 |> List.map(TweenSystem(delta, this))
                 |> List.map(RemoveOffscreenShipsSystem(this, int width, int height))
                 |> CollisionSystem(this)
                 )

        // pick up the list when we draw
        //this.entityList <- ActiveEntities (entities.Force())
       
    (** Deactivate an Entity *)
    override this.RemoveEntity(id:int) =
        this.Deactivate <- id :: this.Deactivate

    (** Que a Bullet *)
    override this.AddBullet(x: float, y:float) =
        this.Bullets <- BulletQue(x, y) :: this.Bullets
        //Browser.console.log("AddBullet", x, y, this.Bullets.Length)

    (** Que a Enemy *)
    override this.AddEnemy(enemy : Enemies) =
        match enemy with 
        | Enemies.Enemy1 -> this.Enemies1 <- EnemyQue(enemy) :: this.Enemies1
        | Enemies.Enemy2 -> this.Enemies2 <- EnemyQue(enemy) :: this.Enemies2
        | Enemies.Enemy3 -> this.Enemies3 <- EnemyQue(enemy) :: this.Enemies3
        | _ -> ()

    (** Que an Explosion *)
    override this.AddExplosion(x: float, y:float, scale : float) =
        this.Explosions <- ExplosionQue(x, y, scale) :: this.Explosions

    (** Que a Bang *)
    override this.AddBang(x: float, y:float, scale : float) =
        this.Bangs <- ExplosionQue(x, y, scale) :: this.Bangs


let game = ShmupWarz(320.*1.5, 480.*1.5, false)
game.Run() |> ignore


