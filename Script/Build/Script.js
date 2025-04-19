"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static { this.iSubclass = ƒ.Component.registerSubclass(CustomComponentScript); }
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "CustomComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                        ƒ.Debug.log(this.message, this.node);
                        break;
                    case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    var fAid = FudgeAid;
    let viewport;
    window.addEventListener("load", init);
    async function init() {
        let graphId = document.head.querySelector("meta[autoView]").getAttribute("autoView");
        await f.Project.loadResourcesFromHTML();
        let graph = f.Project.resources[graphId];
        if (!graph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        // setup the viewport
        let cmpCamera = new f.ComponentCamera();
        cmpCamera.clrBackground.setCSS("skyblue");
        let canvas = document.querySelector("canvas");
        viewport = new f.Viewport();
        viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
        let nodeCameraOrbit = fAid.Viewport.expandCameraToInteractiveOrbit(viewport);
        // nodeCameraOrbit.translateZ(-5);
        // nodeCameraOrbit.rotateX(-45);
        // nodeCameraOrbit.rotateY(-150);
        nodeCameraOrbit.positionCamera(new f.Vector3(-5.5, 7.4, -5));
        let nodeCameraAO = graph.getChildrenByName("Camera")[0];
        cmpCamera.node.addComponent(nodeCameraAO.getComponent(f.ComponentAmbientOcclusion));
        let nodeFloor = graph.getChildrenByName("Floor")[0];
        nodeFloor.activate(true); // hide the floor node
        let nodeFloorPlan = graph.getChildrenByName("FloorPlan")[0];
        nodeFloorPlan.activate(false); // show the floorplan node
        let btnToggleFloorPlan = document.getElementById("toggleFloorPlan");
        btnToggleFloorPlan.onclick = () => {
            nodeFloor.activate(!nodeFloor.isActive); // hide the floor node
            nodeFloorPlan.activate(!nodeFloorPlan.isActive); // show the floorplan node
            viewport.draw();
        };
        f.Render.prepare(nodeCameraOrbit);
        viewport.draw();
        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
        // f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        function update(_event) {
            viewport.draw();
        }
    }
    function update(_event) {
        // f.Physics.simulate();  // if physics is included and used
        viewport.draw();
        f.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map