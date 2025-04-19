
namespace Script {
  import f = FudgeCore;
  import fAid = FudgeAid;

  let viewport: f.Viewport;
  window.addEventListener("load", init);

  async function init(): Promise<void> {
    let graphId: string = document.head.querySelector("meta[autoView]").getAttribute("autoView");
    await f.Project.loadResourcesFromHTML();
    let graph: f.Graph = <f.Graph>f.Project.resources[graphId];
    if (!graph) {
      alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
      return;
    }

    // setup the viewport
    let cmpCamera: f.ComponentCamera = new f.ComponentCamera();
    cmpCamera.clrBackground.setCSS("skyblue");

    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    viewport = new f.Viewport();
    viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
    let nodeCameraOrbit = <fAid.CameraOrbitMovingFocus>fAid.Viewport.expandCameraToInteractiveOrbit(viewport);

    // nodeCameraOrbit.translateZ(-5);
    // nodeCameraOrbit.rotateX(-45);
    // nodeCameraOrbit.rotateY(-150);
    nodeCameraOrbit.positionCamera(new f.Vector3(-5.5, 7.4, -5));

    let nodeCameraAO: f.Node = graph.getChildrenByName("Camera")[0];
    cmpCamera.node.addComponent(nodeCameraAO.getComponent(f.ComponentAmbientOcclusion));

    let nodeFloor: f.Node = graph.getChildrenByName("Floor")[0];
    nodeFloor.activate(true); // hide the floor node
    let nodeFloorPlan: f.Node = graph.getChildrenByName("FloorPlan")[0];
    nodeFloorPlan.activate(false); // show the floorplan node
    let btnToggleFloorPlan: HTMLButtonElement = document.getElementById("toggleFloorPlan") as HTMLButtonElement;
    btnToggleFloorPlan.onclick = () => {
      nodeFloor.activate(!nodeFloor.isActive); // hide the floor node
      nodeFloorPlan.activate(!nodeFloorPlan.isActive); // show the floorplan node
      viewport.draw();
    }

    f.Render.prepare(nodeCameraOrbit);
    viewport.draw();
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    // f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

    function update(_event: Event): void {
      viewport.draw();
    }
  }

  function update(_event: Event): void {
    // f.Physics.simulate();  // if physics is included and used
    viewport.draw();
    f.AudioManager.default.update();
  }
}