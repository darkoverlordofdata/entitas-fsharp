(*
 * Entitas ECS
 *)
namespace Entitas

[<AutoOpen>]
module EntitasECS =

  open System
  open System.Text
  open System.Collections.Generic

  let IsNull x = match x with null -> true | _ -> false
  let NotNull x = match x with null -> false | _ -> true

  (**
    * Base Component Type
    *)
  [<AbstractClass>][<AllowNullLiteral>]
  type Component() = 
    class
      static member None with get() = 0
    end

  and IMatcher =
    interface
      abstract Id: int
      abstract Indices: int[]
      abstract Matches: Entity -> Boolean
    end

  and ICompoundMatcher =
    inherit IMatcher
    abstract AllOfIndices: int[] with get,set
    abstract AnyOfIndices: int[] with get,set
    abstract NoneOfIndices: int[] with get,set

  and INoneOfMatcher =
    inherit ICompoundMatcher
    abstract Ignore: Array -> INoneOfMatcher

  and IAnyOfMatcher =
    inherit ICompoundMatcher
    abstract NoneOf: Array -> INoneOfMatcher

  and IAllOfMatcher = 
    inherit ICompoundMatcher
    abstract AnyOf: Array -> IAnyOfMatcher
    abstract NoneOf: Array -> INoneOfMatcher

  and ISystem = 
    interface end

  and ISetPool =
    inherit ISystem
    abstract SetPool: Pool -> unit


  (**
    * Interface: System with an Initialization phase
    * Initialize is called before the game loop is started
    *)
  and IInitializeSystem = 
    inherit ISystem
    abstract Initialize: unit -> unit

  (**
    * Interface: System with an Execute
    * Execute is called once per game loop
    *)
  and IExecuteSystem =
    inherit ISystem
    abstract Execute: unit -> unit

  and IReactiveExecuteSystem =
    inherit ISystem
    abstract Execute: Array -> unit

  and IReactiveSystem = 
    inherit IReactiveExecuteSystem
    abstract Trigger: TriggerOnEvent

  and IMultiReactiveSystem = 
    inherit IReactiveExecuteSystem
    abstract Triggers: TriggerOnEvent[]

  and IEnsureComponents =
    abstract EnsureComponents: IMatcher

  and IExcludeComponents =
    abstract ExcludeComponents: IMatcher

  and IClearReactiveSystem =
    abstract ClearAfterExecute: Boolean

  and TriggerOnEvent(trigger, eventType) =
    inherit System.EventArgs()
    member this.Trigger = trigger
    member this.EventType = eventType

  and TriggerOnEventDelegate = delegate of obj * TriggerOnEvent -> unit

  (** 
   * Entity Events
   *)
  and EntityReleasedArgs() =
    inherit System.EventArgs() 

  and ComponentAddedArgs(index, newComponent) =
    inherit System.EventArgs()
    member this.Index = index
    member this.Component = newComponent

  and ComponentRemovedArgs(index, previous) =
    inherit System.EventArgs()
    member this.Index = index
    member this.Component = previous

  and ComponentReplacedArgs(index, previous, replacement) =
    inherit System.EventArgs()
    member this.Index = index
    member this.Component = previous
    member this.Replacement = replacement

  and EntityReleasedDelegate = delegate of obj * EntityReleasedArgs -> unit
  and ComponentAddedDelegate = delegate of obj * ComponentAddedArgs -> unit
  and ComponentRemovedDelegate = delegate of obj * ComponentRemovedArgs -> unit
  and ComponentReplacedDelegate = delegate of obj * ComponentReplacedArgs -> unit

  (** 
   * Entity
   *)
  and Entity(totalComponents:int) =

    (**
     * Component Active Pattern  
     * parse component class name
     *)
    let (|Component|) (s:string) =
        let s0 = s.Split(if s.IndexOf('+') = -1 then '.' else '+')
        let s1 = s0.[1]
        if s1.EndsWith("Component") then
            s1.Substring(0, s1.LastIndexOf("Component"))
        else
            s1

    (** parse component class name **)
    let parsec s =
        match s with 
        | Component (c) -> c

    let _onComponentAdded               = new Event<ComponentAddedDelegate, ComponentAddedArgs>()
    let _onComponentRemoved             = new Event<ComponentRemovedDelegate, ComponentRemovedArgs>()
    let _onComponentReplaced            = new Event<ComponentReplacedDelegate, ComponentReplacedArgs>()
    let _onEntityReleased               = new Event<EntityReleasedDelegate, EntityReleasedArgs>()

    let _components: Component array    = (Array.zeroCreate totalComponents)
    let mutable _componentsCache        = Array.empty<Component>
    let mutable _toStringCache          = "" 
    let mutable _name                   = ""
    let mutable _id                     = 0
    let mutable _isEnabled              = false
        
    member val OnComponentAdded         = _onComponentAdded.Publish
    member val OnComponentRemoved       = _onComponentRemoved.Publish
    member val OnComponentReplaced      = _onComponentReplaced.Publish
    member val OnEntityReleased         = _onEntityReleased.Publish

    member val internal RefCount        = 0 with get, set 
    member this.Id with get()           = _id
    member this.Name with get()         = _name
    member this.IsEnabled with get()    = _isEnabled
         
    (** 
     * support for Pool.NullEntity 
     * Returned instead of null for Group::GetSingleEntity
     *)
    member this.IsNull with get() = if totalComponents = 0 then true else false
    member this.NotNull with get() = if totalComponents = 0 then false else true
    //static member Empty with get() = new Entity(0)
    static member Empty = lazy(new Entity(0))
        

    member this.Init(name:string, creationIndex:int) =
      _name <- name
      _id <- creationIndex
      _isEnabled <- true

     (** 
     * AddComponent 
     *
     * @param index
     * @param component
     * @returns this entity
     *)
    member this.AddComponent(index:int, c:Component) =
      if not _isEnabled then 
        failwith "Entity is disabled, cannot add component"
      if this.HasComponent(index) then 
        failwithf "Entity already has component, cannot add at index %d, %s" index (this.ToString())

      _components.[index] <- c
      _componentsCache <- Array.empty<Component>
      _toStringCache <- ""
      _onComponentAdded.Trigger(this, new ComponentAddedArgs(index, c))
      this
    
    (** 
     * RemoveComponent 
     *
     * @param index
     * @returns this entity
     *)
    member this.RemoveComponent(index:int) =
      if not _isEnabled then 
        failwith "Entity is disabled, cannot remove component"
      if not(this.HasComponent(index)) then 
        failwithf "Entity does not have component, cannot remove at index %d, %s" index (this.ToString())
    
      this._replaceComponent(index, null)
      this

    (** 
     * ReplaceComponent 
     *
     * @param index
     * @param component
     * @returns this entity
     *)
    member this.ReplaceComponent(index:int, c:Component) =
      if not _isEnabled then 
        failwith "Entity is disabled, cannot replace at index %d, %s" index (this.ToString())
   
      if this.HasComponent(index) then
        this._replaceComponent(index, c)
      elif NotNull(c) then
        this.AddComponent(index, c) |> ignore
      this

    (** 
     * GetComponent 
     *
     * @param index
     * @returns the component at index
     *)
    member this.GetComponent(index:int) =
      if not(this.HasComponent(index)) then 
        failwithf "Entity does not have component, cannot get at index %d, %s" index (this.ToString())

      _components.[index]

    (** 
     * GetComponents 
     *
     * @returns a list of components
     *)
    member this.GetComponents() =
      if _componentsCache.Length = 0 then
        _componentsCache <- Array.filter NotNull _components
      _componentsCache

    (** 
     * HasComponent
     *
     * @param index
     * @returns true if entity has component at index
     *)
    member this.HasComponent(index:int) =
      NotNull(_components.[index])

    (** 
     * HasComponents
     *
     * @param indices array
     * @returns true if entity has all components in array
     *)
    member this.HasComponents(indices:int[]) =
      let mutable flag = true
      for index in indices do
        if IsNull(_components.[index]) then
          flag <- false
      flag

    (** 
     * HasAnyComponent
     *
     * @param indices array
     * @returns true if entity has any component in array
     *)
    member this.HasAnyComponent(indices:int[]) =
      let mutable flag = false
      for index in indices do
        if NotNull(_components.[index]) then
          flag <- true
      flag

    (** 
     * RemoveAllComponents
     *
     *)
    member this.RemoveAllComponents() =
      for i = 0 to _components.Length-1 do
        if NotNull(_components.[i]) then
          this._replaceComponent(i, null)

    (** 
     * Retain (reference count)
     *
     *)
    member this.Retain() =
      this.RefCount <- this.RefCount + 1


    (** 
     * Release (reference count)
     *
     *)
    member this.Release() =
      this.RefCount <- this.RefCount - 1
      if this.RefCount = 0 then
        _onEntityReleased.Trigger(this, new EntityReleasedArgs())
      elif this.RefCount < 0 then
        failwithf "Entity is already released %s" (this.ToString())

    (** 
     * ToString
     *
     *)
    override this.ToString() =
      if _toStringCache = "" then
        let sb = new StringBuilder()
        sb.Append("Entity_") |> ignore
        sb.Append(_name) |> ignore
        sb.Append("(") |> ignore
        sb.Append(_id.ToString()) |> ignore
        sb.Append(")(") |> ignore
        let c = Array.filter NotNull _components
        for i = 0 to c.Length-1 do
          sb.Append(parsec(c.[i].GetType().ToString())) |> ignore
          if i < c.Length-1 then sb.Append(",") |> ignore
        sb.Append(")") |> ignore
        _toStringCache <- sb.ToString()

      _toStringCache

    (** 
     * destroy an entity
     *
     *)
    member this.destroy() =
      this.RemoveAllComponents()
      _componentsCache <- Array.empty<Component>
      _name <- ""
      _isEnabled <- false

    (** 
     * replaceComponent 
     *
     * @param index
     * @param component
     *)
    member private this._replaceComponent(index, replacement) =
      let previousComponent = _components.[index]
      if obj.ReferenceEquals(previousComponent, replacement) then
        _onComponentReplaced.Trigger(this, new ComponentReplacedArgs(index, previousComponent, replacement))
      else
        _components.[index] <- replacement
        _componentsCache <- Array.empty<Component> 
        _toStringCache <- ""
        if obj.ReferenceEquals(replacement, null) then
          _onComponentRemoved.Trigger(this, new ComponentRemovedArgs(index, previousComponent))
        else
          _onComponentReplaced.Trigger(this, new ComponentReplacedArgs(index, previousComponent, replacement))

  and EntityEqualityComparer() =
    static member comparer with get() = new EntityEqualityComparer()
    interface IEqualityComparer<Entity> with

      member this.Equals(x, y) =
        if x.Id = y.Id then true else false

      member this.GetHashCode(e) =
        e.Id
      
  (** 
   * Matcher
   * matchers can match an entity by components used
   *)
  and Matcher() =
    static let mutable uniqueId           = 0
    do uniqueId <- uniqueId+1

    let _id                               = uniqueId
    let mutable _indices                  = Array.empty
    let mutable _allOfIndices             = Array.empty
    let mutable _anyOfIndices             = Array.empty
    let mutable _noneOfIndices            = Array.empty
    let mutable _toStringCache             = ""

    static let toStringHelper(sb:StringBuilder, text:string, indices:int[]) =
      if indices.Length > 0 then
        sb.Append(text+"(") |> ignore
        for i=0 to indices.Length-1 do
          sb.Append(indices.[i].ToString()) |> ignore
          if i < indices.Length-1 then sb.Append(",") |> ignore
        sb.Append(")") |> ignore

    member val uuid = System.Guid.NewGuid().ToString() with get

    (** 
     * AnyOf 
     *
     * @param indices
     * @returns this 
     *)
    member this.AnyOf([<ParamArray>] indices: int[]) =
      _anyOfIndices <- Matcher.distinctIndices(_indices)
      _indices <- Array.empty
      this

    member this.AnyOf([<ParamArray>] matchers: Matcher[]) =
      this.AnyOf(Matcher.mergeIndices(matchers))

    (** 
     * NoneOf 
     *
     * @param indices
     * @returns this 
     *)
    member this.NoneOf([<ParamArray>] indices: int[]) =
      _noneOfIndices <- Matcher.distinctIndices(_indices)
      _indices <- Array.empty
      this

    member this.NoneOf([<ParamArray>] matchers: Matcher[]) =
      this.NoneOf(Matcher.mergeIndices(matchers))
     
    member this.mergeIndices():int[] =
      let indicesList = new ResizeArray<int>()
      indicesList.AddRange(_allOfIndices)
      indicesList.AddRange(_anyOfIndices)
      indicesList.AddRange(_noneOfIndices)
      _indices <- Matcher.distinctIndices(indicesList.ToArray())
      _indices

    //static member Empty with get() = new Matcher() 
    static member Empty = lazy(new Matcher())


    (** 
     * AllOf 
     *
     * @param indices
     * @returns this 
     *)
    static member AllOf([<ParamArray>] indices: int[]) =
      let matcher = new Matcher():>ICompoundMatcher
      matcher.AllOfIndices <- Matcher.distinctIndices(indices)
      matcher

    static member AllOf([<ParamArray>] matchers: Matcher[]) =
      Matcher.AllOf(Matcher.mergeIndices(matchers))

    (** 
     * AnyOf 
     *
     * @param indices
     * @returns this 
     *)
    static member AnyOf([<ParamArray>] indices: int[]) =
      let matcher = new Matcher():>ICompoundMatcher
      matcher.AnyOfIndices <- Matcher.distinctIndices(indices)
      matcher

    static member AnyOf([<ParamArray>] matchers: Matcher[]) =
      Matcher.AnyOf(Matcher.mergeIndices(matchers))

    (** 
     * mergeIndicse 
     *
     * @param matchers
     * @returns array of indices for the matchers
     *)
    static member mergeIndices(matchers:Matcher[]):int[] =
      let mutable indices = (Array.zeroCreate matchers.Length)
      for i=0 to matchers.Length-1 do
        let matcher = matchers.[i]:>IMatcher
        if matcher.Indices.Length <> 1 then
          failwithf "Matcher indices length not = 1 %s" (matchers.[i].ToString())
        indices.[i] <- matcher.Indices.[0]   //.GetValue(0)
      indices

    (** 
     * distinctIndicse 
     *
     * @param indices
     * @returns array of indices with duplicates removed
     *)
    static member distinctIndices(indices:int[]):int[] = 
      let indicesSet = new HashSet<int>(indices)
      let mutable uniqueIndices = (Array.zeroCreate indicesSet.Count)
      indicesSet.CopyTo(uniqueIndices)
      Array.Sort(uniqueIndices)
      uniqueIndices

    (** 
     * ToString
     *
     * @returns the string representation of this matcher
     *)
    override this.ToString() =
      if _toStringCache = "" then
        let sb = new StringBuilder()
        toStringHelper(sb, "AllOf", _allOfIndices)
        toStringHelper(sb, "AnyOf", _anyOfIndices)
        toStringHelper(sb, "NoneOf", _noneOfIndices)
        _toStringCache <- sb.ToString()
      _toStringCache

    (** *)
    interface INoneOfMatcher with
      member this.Ignore(indices:Array) =
        this:>INoneOfMatcher
    interface IAnyOfMatcher with
      member this.NoneOf(indices:Array) =
        this:>INoneOfMatcher
    interface IAllOfMatcher with
      member this.AnyOf(indices:Array) =
        this:>IAnyOfMatcher
      member this.NoneOf(indices:Array) =
        this:>INoneOfMatcher
    interface ICompoundMatcher with
      member this.AllOfIndices
        with get() = _allOfIndices
        and  set(value) = _allOfIndices <- value
      member this.AnyOfIndices
        with get() = _anyOfIndices
        and  set(value) = _anyOfIndices <- value
      member this.NoneOfIndices
        with get() = _noneOfIndices
        and  set(value) = _noneOfIndices <- value
    interface IMatcher with
      member this.Id with get() = _id
      member this.Indices with get():int[] = if _indices.Length = 0 then
                                               _indices <- this.mergeIndices()
                                             _indices
        (** 
         * Matches 
         *
         * @param entity
         * @returns true if entity is a match 
         *)
      member this.Matches(entity:Entity) =
        let matchesAllOf = if _allOfIndices.Length = 0 then true else entity.HasComponents(_allOfIndices)
        let matchesAnyOf = if _anyOfIndices.Length = 0 then true else entity.HasAnyComponent(_allOfIndices)
        let matchesNoneOf = if _noneOfIndices.Length = 0 then true else not(entity.HasAnyComponent(_allOfIndices))
        matchesAllOf && matchesAnyOf && matchesNoneOf


  (** 
   * Group Events
   *)
  and GroupChangedArgs(entity, index, newComponent) =
    inherit System.EventArgs()
    member this.Entity = entity
    member this.Index = index
    member this.Component = newComponent

  and GroupUpdatedArgs(entity, index, prevComponent, newComponent) =
    inherit System.EventArgs()
    member this.Entity = entity
    member this.Index = index
    member this.Component = prevComponent
    member this.Replacement = newComponent

  and GroupChangedDelegate = delegate of obj * GroupChangedArgs -> unit
  and GroupUpdatedDelegate = delegate of obj * GroupUpdatedArgs -> unit

  (** 
   * Group
   *)
  and Group(matcher:IMatcher) =

    let _onEntityAdded                  = new Event<GroupChangedDelegate, GroupChangedArgs>()
    let _onEntityRemoved                = new Event<GroupChangedDelegate, GroupChangedArgs>()
    let _onEntityUpdated                = new Event<GroupUpdatedDelegate, GroupUpdatedArgs>()
    let _entities:HashSet<Entity>       = new HashSet<Entity>(EntityEqualityComparer.comparer)
    let mutable _entitiesCache          = Array.empty<Entity>
    let mutable _toStringCache          = ""

    member val OnEntityAdded            = _onEntityAdded.Publish
    member val OnEntityRemoved          = _onEntityRemoved.Publish
    member val OnEntityUpdated          = _onEntityUpdated.Publish

    member this.Count with get()        = _entities.Count

    //member this.CreateObserver
    (** 
     * HandleEntitySilently
     *
     * @param entity
     *)
    member this.HandleEntitySilently(entity) =
      if matcher.Matches(entity) then
        this.AddEntitySilently(entity)
      else
        this.RemoveEntitySilently(entity)

    (** 
     * HandleEntity
     *
     * @param entity
     * @param index
     * @param component
     *)
    member this.HandleEntity(entity, index, comp) =
      if matcher.Matches(entity) then
        this.AddEntity(entity, index, comp)
      else
        this.RemoveEntity(entity, index, comp)

    (** 
     * HandleEntity
     *
     * @param entity
     * @param index
     * @param previous component
     * @paran new component
     *)
    member this.UpdateEntity(entity, index, previousComponent, newComponent) =
      if _entities.Contains(entity) then
        _onEntityAdded.Trigger(this, new GroupChangedArgs(entity, index, previousComponent))
        _onEntityAdded.Trigger(this, new GroupChangedArgs(entity, index, newComponent))
        _onEntityUpdated.Trigger(this, new GroupUpdatedArgs(entity, index, previousComponent, newComponent))

    (** 
     * addEntitySilently
     *
     * @param entity
     *)
    member this.AddEntitySilently(entity) =
      let added  = _entities.Add(entity)
      if added then
        _entitiesCache <- Array.empty<Entity>
        entity.Retain()
      added

    (** 
     * removeEntitySilently
     *
     * @param entity
     *)
    member this.RemoveEntitySilently(entity) =
      let removed = _entities.Remove(entity)
      if removed then
        _entitiesCache <- Array.empty<Entity>
        entity.Release()
      removed

    member this.AddEntity(entity, index, comp) =
      if this.AddEntitySilently(entity) then
        _onEntityAdded.Trigger(this, new GroupChangedArgs(entity, index, comp))

    (** 
     * removeEntity
     *
     * @param entity
     * @param index
     * @param component
     *)
    member this.RemoveEntity(entity, index, comp) =
      if this.RemoveEntitySilently(entity) then
        _onEntityRemoved.Trigger(this, new GroupChangedArgs(entity, index, comp))

    (** 
     * ContainsEntity
     *
     * @param entity
     * @returns true if the group has the entity
     *)
    member this.ContainsEntity(entity) =
      _entities.Contains(entity)
    
    (** 
     * GetSingleEntity
     *
     * @returns entity or null
     *)
    member this.GetSingleEntity() =
      match _entities.Count with
      | 1 ->
        use mutable enumerator = _entities.GetEnumerator()
        enumerator.MoveNext() |> ignore
        enumerator.Current
      | 0 -> 
        //Entity.Empty
        Entity.Empty.Force()
      | _ ->
        failwithf "Single Entity Execption %s" (matcher.ToString())
    
    (** 
     * GetEntities
     *
     * @returns the array of entities
     *)
    member this.GetEntities() =
      if _entitiesCache.Length = 0 then
        _entitiesCache <- (Array.zeroCreate _entities.Count)  
        _entities.CopyTo(_entitiesCache)
      _entitiesCache

  and GroupEventType =
    | OnEntityAdded = 0
    | OnEntityRemoved = 1
    | OnEntityAddedOrRemoved = 2

  and GroupObserver(groups: Group[], eventTypes: GroupEventType[]) as this =

    let _collectedEntities              = new HashSet<Entity>()

    do
      if groups.Length <> eventTypes.Length then
        failwithf "Unbalanced count with groups (%d) and event types (%d)" groups.Length eventTypes.Length
      this.Activate()

    //static member Empty with get() = new GroupObserver(Array.empty<Group>, Array.empty<GroupEventType>) 
    static member Empty = lazy(new GroupObserver(Array.empty<Group>, Array.empty<GroupEventType>))

    member this.CollectedEntities with get() = _collectedEntities

    member this.AddEntity =
      new GroupChangedDelegate(fun sender evt ->
        if not(_collectedEntities.Contains(evt.Entity)) then
          _collectedEntities.Add(evt.Entity) |> ignore
          evt.Entity.Retain()
      )

    member this.Activate() =
      for i=0 to groups.Length-1 do
        let group:Group = groups.[i]
        let eventType = eventTypes.[i]
        match eventType with 
        | GroupEventType.OnEntityAdded ->
            group.OnEntityAdded.RemoveHandler(this.AddEntity)
            group.OnEntityAdded.AddHandler(this.AddEntity)
        | GroupEventType.OnEntityRemoved ->
            group.OnEntityRemoved.RemoveHandler(this.AddEntity)
            group.OnEntityRemoved.AddHandler(this.AddEntity)
        | GroupEventType.OnEntityAddedOrRemoved ->
            group.OnEntityAdded.RemoveHandler(this.AddEntity)
            group.OnEntityAdded.AddHandler(this.AddEntity)
            group.OnEntityRemoved.RemoveHandler(this.AddEntity)
            group.OnEntityRemoved.AddHandler(this.AddEntity)
        | _ ->
            failwithf "Invalid eventType $s in GroupObserver::activate" eventType

    member this.Deactivate() =
      for group in groups do
        group.OnEntityAdded.RemoveHandler(this.AddEntity)
        group.OnEntityRemoved.RemoveHandler(this.AddEntity)
      this.ClearCollectedEntities()

    member this.ClearCollectedEntities() = 
      for entity in _collectedEntities do
        entity.Release()
      _collectedEntities = new HashSet<Entity>() |> ignore

  (** 
   * Pool Events
   *)
  and EntityEventArgs(entity) =
    inherit System.EventArgs()
    member this.Entity = entity

  and GroupEventArgs(group) =
    inherit System.EventArgs()
    member this.Group = group

  and GroupCreatedDelegate = delegate of obj * GroupEventArgs -> unit
  and GroupClearedDelegate = delegate of obj * GroupEventArgs -> unit
  and EntityCreatedDelegate = delegate of obj * EntityEventArgs -> unit
  and EntityWillBeDestroyedDelegate = delegate of obj * EntityEventArgs -> unit
  and EntityDestroyedDelegate = delegate of obj * EntityEventArgs -> unit

  (** 
   * Pool
   *)
  and Pool(totalComponents:int) as this =

    let _onEntityCreated                = new Event<EntityCreatedDelegate, EntityEventArgs>() 
    let _onEntityWillBeDestroyed        = new Event<EntityWillBeDestroyedDelegate, EntityEventArgs>()
    let _onEntityDestroyed              = new Event<EntityDestroyedDelegate, EntityEventArgs>()
    let _onGroupCreated                 = new Event<GroupCreatedDelegate, GroupEventArgs>()
    let _onGroupCleared                 = new Event<GroupClearedDelegate, GroupEventArgs>()
    let _entities                       = new HashSet<Entity>(EntityEqualityComparer.comparer)
    let _groups                         = new Dictionary<string,Group>()
    let _groupsForIndex                 = (Array.zeroCreate (totalComponents+1))
    let _reusableEntities               = new Stack<Entity>()
    let _retainedEntities               = new HashSet<Entity>()
    let mutable _creationIndex          = 0
    let mutable _entitiesCache          = (Array.zeroCreate 0)

    [<DefaultValue>]
    static val mutable private _instance:Pool
    static member Instance with get() = Pool._instance
    do Pool._instance <- this

    member val OnEntityCreated          = _onEntityCreated.Publish
    member val OnEntityWillBeDestroyed  = _onEntityWillBeDestroyed.Publish
    member val OnEntityDestroyed        = _onEntityDestroyed.Publish
    member val OnGroupCreated           = _onGroupCreated.Publish
    member val OnGroupCleared           = _onGroupCleared.Publish

    member this.TotalComponents         with get() = totalComponents 
    member this.Count                   with get() = _entities.Count
    member this.ReusableEntitiesCount   with get() = _reusableEntities.Count
    member this.RetainedEntitiesCount   with get() = _retainedEntities.Count
    member this.ReusableEntities        with get() = _reusableEntities

    (** 
     * CreateEntity
     *
     * @returns new entity
     *)
    member this.CreateEntity(name) =
      let mutable entity = 
        match _reusableEntities.Count with
        | 0 -> new Entity(totalComponents+1)
        | _ -> _reusableEntities.Pop()

      entity.Init(name, _creationIndex+1)
      entity.Retain()
      entity.OnComponentAdded.AddHandler(this.UpdateGroupsComponentAdded)
      entity.OnComponentRemoved.AddHandler(this.UpdateGroupsComponentRemoved)
      entity.OnComponentReplaced.AddHandler(this.UpdateGroupsComponentReplaced)
      entity.OnEntityReleased.AddHandler(this.OnEntityReleased)
      _creationIndex <- entity.Id
      _entities.Add(entity) |> ignore    
      _entitiesCache <- (Array.zeroCreate 0)
      _onEntityCreated.Trigger(this, new EntityEventArgs(entity))
      entity

    (** 
     * DestroyEntity
     *
     * @param entity
     * @returns new entity
     *)
    member this.DestroyEntity(entity:Entity) =
      let removed = _entities.Remove(entity)
      if not removed then 
        failwithf "Pool does not contain entity, could not destroy %s" (entity.ToString())

      _entitiesCache <- (Array.zeroCreate 0)
      _onEntityWillBeDestroyed.Trigger(this, new EntityEventArgs(entity))
      entity.destroy() |> ignore
      _onEntityDestroyed.Trigger(this, new EntityEventArgs(entity))
      if entity.RefCount = 1 then
        entity.OnEntityReleased.RemoveHandler(this.OnEntityReleased)
        _reusableEntities.Push(entity)
      else
        _retainedEntities.Add(entity) |> ignore
      entity.Release()

    (** 
     * DestroyAllEntities
     *
     *)
    member this.DestroyAllEntities() =
      for entity in this.GetEntities() do
        this.DestroyEntity(entity)
      _entities.Clear()
      if this.RetainedEntitiesCount <> 0 then
        failwith "Pool still has retained entities" 
    
    (** 
     * HasEntity
     *
     * @param entity
     * @returns true if entity is found
     *)
    member this.HasEntity(entity) =
      _entities.Contains(entity)

    (** 
     * GetEntities
     *
     * @returns array of entities
     *)
    member this.GetEntities() =
      if _entitiesCache.Length = 0 then
        _entitiesCache <- (Array.zeroCreate _entities.Count)
        _entities.CopyTo(_entitiesCache)
      _entitiesCache

    static member SetPool(system: ISystem, pool: Pool) =
        match system with
        | :? ISetPool as s -> s.SetPool(pool)
        | _ -> ()
        system

    member this.CreateSystem(system: ISystem):ISystem =
        Pool.SetPool(system, this) |> ignore
        match system with 
        | :? IReactiveSystem as s ->
            ReactiveSystem(this, s) :> ISystem
        | :? IMultiReactiveSystem as s ->
            ReactiveSystem(this, s) :> ISystem
        | _ -> system


    (** 
     * GetGroup
     *
     * @param matcher
     * @returns group for matcher
     *)
    member this.GetGroup(matcher) =
      match _groups.ContainsKey(matcher.ToString()) with
      | true -> 
        _groups.[matcher.ToString()]
      | _ ->
        let group = new Group(matcher)
        for entity in this.GetEntities() do
          group.HandleEntitySilently(entity) |> ignore
        _groups.Add(matcher.ToString(), group) |> ignore
        for index in (matcher:>IMatcher).Indices do
          if (IsNull(_groupsForIndex.[index])) then
            _groupsForIndex.[index] <- new ResizeArray<Group>()
          _groupsForIndex.[index].Add(group)
        _onGroupCreated.Trigger(this, new GroupEventArgs(group))
        group

    (** 
     * ClearGroup
     *
     *)
    member this.ClearGroups() =
      for group in _groups.Values do
        for i=0 to group.GetEntities().Length-1 do
          group.GetEntities().[i].Release()
        _onGroupCleared.Trigger(this, GroupEventArgs(group))

      _groups.Clear()
      for i=0 to _groupsForIndex.Length-1 do
        _groupsForIndex.[i] <- null

    (** 
     * ResetCreationIndex
     *
     *)
    member this.ResetCreationIndex() =
      _creationIndex <- 0

    (** 
     * OnComponentAdded
     *
     *)
    member this.UpdateGroupsComponentAdded =
      new ComponentAddedDelegate(fun sender evt ->
        let groups = _groupsForIndex.[evt.Index]
        if not(IsNull(groups)) then
          for group in groups do
            group.HandleEntity(sender:?>Entity, evt.Index, evt.Component)
      )

    (** 
     * OnComponentRemoved
     *
     *)
    member this.UpdateGroupsComponentRemoved =
      new ComponentRemovedDelegate(fun sender evt ->
        let groups = _groupsForIndex.[evt.Index]
        if not(IsNull(groups)) then
          for group in groups do
            group.HandleEntity(sender:?>Entity, evt.Index, evt.Component)
      )

    (** 
     * OnComponentReplaced
     *
     *)
    member this.UpdateGroupsComponentReplaced =
      new ComponentReplacedDelegate(fun sender evt ->
        let groups = _groupsForIndex.[int evt.Index]
        if not(IsNull(groups)) then
          for group in groups do
            group.UpdateEntity(sender:?>Entity, evt.Index, evt.Component, evt.Replacement)
      )

    (** 
     * OnComponentReleased
     *
     *)
    member this.OnEntityReleased =
      new EntityReleasedDelegate (fun sender evt ->
        let entity = sender:?>Entity

        if entity.IsEnabled then
          failwithf "Entity is not destroyed, cannot release entity %d/%s" (entity.RefCount) (entity.ToString())

        entity.OnEntityReleased.RemoveHandler(this.OnEntityReleased)
        _retainedEntities.Remove(entity) |> ignore
      )



  and Systems() =

    let _initializeSystems              = new ResizeArray<IInitializeSystem>()
    let _executeSystems                 = new ResizeArray<IExecuteSystem>()

    (** 
     * Add 
     *
     * @param system
     *)
    member this.Add(system:ISystem):Systems =

      match system with 
      | :? ReactiveSystem as reactiveSystem ->
        match box reactiveSystem.subsystem with
        | :? IInitializeSystem as initializeSystem ->
            _initializeSystems.Add(initializeSystem)
        | _ -> ()
      | :? IInitializeSystem as initializeSystem ->
        _initializeSystems.Add(initializeSystem)
      | _ -> ()

      match system with 
      | :? IExecuteSystem as executeSystem ->
        _executeSystems.Add(executeSystem)
      | _ -> ()
      this

    (** 
     * Initialize 
     *
     *)
    member this.Initialize() =
      for system in _initializeSystems do
        system.Initialize()
    
    (** 
     * Execute
     *
     *)
    member this.Execute() =
      for system in _executeSystems do
        system.Execute()

    member this.ClearReactiveSystems() =
      for system in _executeSystems do
        match system with
        | :? ReactiveSystem as system -> system.Clear()
        | :? Systems as system -> system.ClearReactiveSystems()
        | _ -> ()


  and ReactiveSystem(pool:Pool, subsystem: IReactiveExecuteSystem) =

    let mutable _buffer = new ResizeArray<Entity>()

    let _clearAfterExecute = subsystem :? IClearReactiveSystem 

    let _ensureComponents =
        match subsystem with
        | :? IEnsureComponents as s -> s.EnsureComponents
        | _ -> Matcher.Empty.Force():>IMatcher

    let _excludeComponents = 
        match subsystem with
        | :? IExcludeComponents as s -> s.ExcludeComponents
        | _ -> Matcher.Empty.Force():>IMatcher

    let groups = new ResizeArray<Group>()
    let eventTypes = new ResizeArray<GroupEventType>()
    let _observer = 
      match subsystem with

      | :? IReactiveSystem as s -> 
        let groups = Array.init 1 (fun i -> s.Trigger.Trigger)
        let eventTypes = Array.init 1 (fun i -> s.Trigger.EventType)
        new GroupObserver(groups, eventTypes)

      | :? IMultiReactiveSystem as s -> 
        let groups = Array.init s.Triggers.Length (fun i -> s.Triggers.[i].Trigger)
        let eventTypes = Array.init s.Triggers.Length (fun i -> s.Triggers.[i].EventType)
        new GroupObserver(groups, eventTypes)

      | _ ->  
        GroupObserver.Empty.Force()

    member this.subsystem with get() = subsystem

    member this.Clear() =
      _observer.ClearCollectedEntities()

    member this.Activate() =
      _observer.Activate()

    member this.Deactivate() =
      _observer.Deactivate()


    interface IExecuteSystem with
      member this.Execute() = 
        let collectedEntities = _observer.CollectedEntities //|> Seq.toArray
        if collectedEntities.Count <> 0 then
          if _ensureComponents.Indices.Length > 0 then
            if _excludeComponents.Indices.Length > 0 then
              for entity in collectedEntities do
                if _ensureComponents.Matches(entity) && _excludeComponents.Matches(entity) then
                  entity.Retain()
                  _buffer.Add(entity)

            else
              for entity in collectedEntities do
                if _ensureComponents.Matches(entity) then
                  entity.Retain()
                  _buffer.Add(entity)

          else
            if _excludeComponents.Indices.Length > 0 then
              for entity in collectedEntities do
                if _excludeComponents.Matches(entity) then
                  entity.Retain()
                  _buffer.Add(entity)


        else
          for entity in collectedEntities do
            entity.Retain()
            _buffer.Add(entity)

        _observer.ClearCollectedEntities()
        if _buffer.Count <> 0 then
          subsystem.Execute(_buffer.ToArray())
          for buf in _buffer do
            buf.Release()
          _buffer.Clear()
          if _clearAfterExecute then _observer.ClearCollectedEntities()
