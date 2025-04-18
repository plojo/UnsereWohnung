namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  let graph: f.Node;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    viewport.camera.node.addComponent(new f.ComponentAmbientOcclusion());
    graph = viewport.getBranch();

    let toggled: boolean = false;
    let nodeFloor: f.Node = graph.getChildrenByName("Floor")[0];
    nodeFloor.activate(!toggled); // hide the floor node
    let nodeFloorPlan: f.Node = graph.getChildrenByName("FloorPlan")[0];
    nodeFloorPlan.activate(toggled); // show the floorplan node
    let btnToggleFloorPlan: HTMLButtonElement = document.getElementById("toggleFloorPlan") as HTMLButtonElement;
    btnToggleFloorPlan.onclick = () => {
      toggled = !toggled;
      nodeFloor.activate(!toggled); // hide the floor node
      nodeFloorPlan.activate(toggled); // show the floorplan node
    }

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    // f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    f.AudioManager.default.update();
  }
}