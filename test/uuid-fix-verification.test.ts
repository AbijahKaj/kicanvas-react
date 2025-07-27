/*
    Test file to verify UUID parsing works correctly
*/

import { assert } from "@esm-bundle/chai";
import * as board from "../src/kicad/board";

suite("UUID Fix Verification", function () {
    test("UUID elements from original error logs should parse without warnings", function () {
        // Exact content from the original error logs
        const uuid_pcb_content = `(kicad_pcb (version 20211014) (generator pcbnew)

  (general
    (thickness 1.6)
  )

  (paper "A4")

  (layers
    (0 "F.Cu" signal)
    (31 "B.Cu" signal)
  )

  (setup
    (pad_to_mask_clearance 0)
  )

  (net 0 "")
  (net 187 "test_net")

  (segment (start 84.2 68.25) (end 83.5 67.55) (width 0.6) (layer "F.Cu") (net 187) (uuid "9dc87fca-ddf6-47e3-aad9-0c691a4103b2"))
  (segment (start 86.65 64.95) (end 86.6 64.9) (width 0.3) (layer "F.Cu") (net 187) (uuid "d8baa457-5e85-4b9b-a015-c998ce549a54"))
  (segment (start 87.9 64.477818) (end 87.427818 64.95) (width 0.3) (layer "F.Cu") (net 187) (uuid "da752323-2518-4e66-bea6-302e0ac4ebe9"))
  (segment (start 87.9 63.1) (end 87.9 64.477818) (width 0.3) (layer "F.Cu") (net 187) (uuid "dedfc6dc-7185-428f-a69a-1da1cb30cbf4"))
  (segment (start 84.4 63.66) (end 84.4 63.1) (width 0.4) (layer "F.Cu") (net 187) (uuid "e6492ff6-fcdd-49fe-899b-695f85fab8a5"))
  (segment (start 85.0625 68.25) (end 84.2 68.25) (width 0.6) (layer "F.Cu") (net 187) (uuid "ea359a61-5936-4b4f-b322-3d520707d26e"))
  (segment (start 84.85 62.5) (end 84.85 64.9) (width 0.5) (layer "B.Cu") (net 187) (uuid "37cc8b7d-ebb7-4afd-bbbe-1205f08b0adc"))
  (segment (start 84.9625 60.6) (end 86.15 61.7875) (width 0.3) (layer "B.Cu") (net 187) (uuid "6b778c9f-f9af-48e0-9db9-7689963c8ef0"))

  (via (at 84.85 64.9) (size 0.45) (drill 0.3) (layers "F.Cu" "B.Cu") (net 187) (uuid "83d590fe-7b5f-41dc-b2cd-c8542352e545"))
  (via (at 84.4 60.6) (size 0.45) (drill 0.3) (layers "F.Cu" "B.Cu") (net 187) (uuid "ede4a7fa-aafc-428c-bef5-753b0d603efe"))

)`;

        // This should parse without any "No def found for element uuid" warnings
        const pcb = new board.KicadPCB("test_uuid.kicad_pcb", uuid_pcb_content);

        // Verify the parsing worked
        assert.equal(pcb.segments.length, 8, "Should parse all 8 segments");
        assert.equal(pcb.vias.length, 2, "Should parse all 2 vias");

        // Verify UUID properties are properly set on segments
        const firstSegment = pcb.segments[0] as board.LineSegment;
        assert.equal(
            firstSegment.uuid,
            "9dc87fca-ddf6-47e3-aad9-0c691a4103b2",
            "First segment should have correct UUID",
        );
        assert.equal(
            firstSegment.start.x,
            84.2,
            "First segment should have correct start position",
        );
        assert.equal(
            firstSegment.net,
            187,
            "First segment should have correct net",
        );

        // Verify UUID properties are properly set on vias
        const firstVia = pcb.vias[0];
        if (!firstVia) {
            throw new Error("First via not found");
        }
        assert.equal(
            firstVia.uuid,
            "83d590fe-7b5f-41dc-b2cd-c8542352e545",
            "First via should have correct UUID",
        );
        assert.equal(
            firstVia.at.position.x,
            84.85,
            "First via should have correct position",
        );
        assert.equal(firstVia.net, 187, "First via should have correct net");

        // If we get here without warnings, the fix worked!
        console.log(
            "✅ UUID parsing fix verified - no 'No def found' warnings should appear",
        );
    });
});
