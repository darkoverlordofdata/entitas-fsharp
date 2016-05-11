namespace ShmupWarz

(**
 * Entitas Generated Systems for ShmupWarz
 *
 *)

open System
open System.Collections.Generic
open Bosco.ECS
open ShmupWarz
open UnityEngine

type SoundEffectSystem(world:World) =

    let AudioSources = new Dictionary<string, AudioSource>()

    let group = world.GetGroup(Matcher.AllOf(Matcher.SoundEffect))

    interface IExecuteSystem with
        member this.Execute() =

            for e in (group.GetEntities()) do
                match (int e.soundEffect.effect) with
                | 0 ->
                    AudioSources.["pew"].PlayOneShot(AudioSources.["pew"].clip, 0.5f)            
                | 1 ->
                    AudioSources.["asplode"].PlayOneShot(AudioSources.["asplode"].clip, 0.5f)            
                | 2 ->
                    AudioSources.["smallasplode"].PlayOneShot(AudioSources.["smallasplode"].clip, 0.5f)            
                | _ -> ()
            