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
    f.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let graph;
    function start(_event) {
        viewport = _event.detail;
        viewport.camera.node.addComponent(new f.ComponentAmbientOcclusion());
        graph = viewport.getBranch();
        let toggled = false;
        let nodeFloor = graph.getChildrenByName("Floor")[0];
        nodeFloor.activate(!toggled); // hide the floor node
        let nodeFloorPlan = graph.getChildrenByName("FloorPlan")[0];
        nodeFloorPlan.activate(toggled); // show the floorplan node
        let btnToggleFloorPlan = document.getElementById("toggleFloorPlan");
        btnToggleFloorPlan.onclick = () => {
            toggled = !toggled;
            nodeFloor.activate(!toggled); // hide the floor node
            nodeFloorPlan.activate(toggled); // show the floorplan node
        };
        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
        // f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        f.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map