module AnimationSystem
open Microsoft.Xna.Framework
open Microsoft.Xna.Framework.Graphics
open Microsoft.Xna.Framework.Content
open Components

(** Update an Animation Component*)
let UpdateAnimationComponent (gameTime:GameTime) animation =
    let time = animation.CurrentTime + (int gameTime.ElapsedGameTime.TotalMilliseconds)
    let newFrame = if time > animation.TimePerFrame then
                        let n = animation.CurrentFrame + 1
                        if n >= animation.FrameCount then 0 else n
                    else animation.CurrentFrame
    let counter = if time > animation.TimePerFrame then 0 else time
    { 
        animation with 
            CurrentFrame = newFrame; 
            CurrentTime = counter; 
    }

(** Draw an Animation Component*)
let DrawAnimation (spriteBatch:SpriteBatch) animation (position:Vector2) =
    let rect = System.Nullable(Rectangle(animation.CurrentFrame * animation.Width, 0, animation.Width, animation.Height))
    spriteBatch.Draw(animation.Texture, position, rect, Color.White)    

   
(** Update an Entity Animation Component*)
let AnimationSystemExecute gameTime (entity:Entity) =
    { 
        entity with 
            Sprite = if entity.Sprite.IsSome then Some(UpdateAnimationComponent gameTime entity.Sprite.Value)
                        else None 
    }

