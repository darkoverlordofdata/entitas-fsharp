namespace ShmupWarz
(** Android Activity *)
open System
open Android.App
open Android.Content.PM
open Android.OS
open Android.Views


[<Activity (Label = "ShmupWarz"
    , MainLauncher = true
    , Icon = "@drawable/icon"
    , AlwaysRetainTaskState = true
    , LaunchMode = Android.Content.PM.LaunchMode.SingleInstance
    , ScreenOrientation = ScreenOrientation.Portrait
    , ConfigurationChanges = (ConfigChanges.Orientation ||| ConfigChanges.Keyboard ||| ConfigChanges.KeyboardHidden ||| ConfigChanges.ScreenSize)
    )>]
type MainActivity () =
    inherit Microsoft.Xna.Framework.AndroidGameActivity()

    override this.OnCreate(bundle) =
        
        base.OnCreate(bundle)

        let g = new ShmupWarz(this.Resources.DisplayMetrics.WidthPixels, this.Resources.DisplayMetrics.HeightPixels, true)
        this.SetContentView(g.Services.GetService(typedefof<View>) :?> View)
        g.Run()




