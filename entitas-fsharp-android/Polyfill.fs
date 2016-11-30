namespace ShmupWarz

[<AutoOpen>]
module PolyfillFunctions =


    let isNull x = match x with null -> true | _ -> false

