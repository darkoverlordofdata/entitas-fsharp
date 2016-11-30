namespace ShmupWarz
module ShmupWarzModule =

    [<EntryPoint>]
    let main argv = 
        // (int)(320.*1.5)
        // (int)(480.*1.5)
        use g = new ShmupWarz(800, 600)
        //use g = new ShmupWarz(320, 480)
        g.Run()
        0 // return an integer exit code OK
