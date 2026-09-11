#!/usr/bin/env python3
"""
Generate a realistic iPad-style tablet GLB for DWais Media hero.
Uses raw GLTF binary format (pygltflib) with PBR materials.
Output: assets/models/tablet.glb
"""

import struct
import json
import math
import base64
import os
import sys

# ── helpers ────────────────────────────────────────────────────────────────────

def pack_floats(values):
    return struct.pack(f"{len(values)}f", *values)

def pack_ints(values, fmt='H'):  # H = uint16
    return struct.pack(f"{len(values)}{fmt}", *values)

def make_box_vertices(cx, cy, cz, w, h, d):
    """Return 24 vertices (6 faces × 4 verts) for a box with normals and UVs."""
    hw, hh, hd = w/2, h/2, d/2
    # Each face: 4 vertices (pos3, norm3, uv2) = 8 floats per vert
    faces = [
        # front  (z+)
        ([[-hw,-hh,hd],[hw,-hh,hd],[hw,hh,hd],[-hw,hh,hd]], [0,0,1],
         [[0,0],[1,0],[1,1],[0,1]]),
        # back   (z-)
        ([[hw,-hh,-hd],[-hw,-hh,-hd],[-hw,hh,-hd],[hw,hh,-hd]], [0,0,-1],
         [[0,0],[1,0],[1,1],[0,1]]),
        # right  (x+)
        ([[hw,-hh,hd],[hw,-hh,-hd],[hw,hh,-hd],[hw,hh,hd]], [1,0,0],
         [[0,0],[1,0],[1,1],[0,1]]),
        # left   (x-)
        ([[-hw,-hh,-hd],[-hw,-hh,hd],[-hw,hh,hd],[-hw,hh,-hd]], [-1,0,0],
         [[0,0],[1,0],[1,1],[0,1]]),
        # top    (y+)
        ([[-hw,hh,hd],[hw,hh,hd],[hw,hh,-hd],[-hw,hh,-hd]], [0,1,0],
         [[0,0],[1,0],[1,1],[0,1]]),
        # bottom (y-)
        ([[-hw,-hh,-hd],[hw,-hh,-hd],[hw,-hh,hd],[-hw,-hh,hd]], [0,-1,0],
         [[0,0],[1,0],[1,1],[0,1]]),
    ]
    positions, normals, uvs, indices = [], [], [], []
    base = 0
    for verts, norm, uv_list in faces:
        for i, v in enumerate(verts):
            positions.extend([v[0]+cx, v[1]+cy, v[2]+cz])
            normals.extend(norm)
            uvs.extend(uv_list[i])
        # 2 triangles per face
        indices.extend([base, base+1, base+2, base, base+2, base+3])
        base += 4
    return positions, normals, uvs, indices


class GLBBuilder:
    def __init__(self):
        self.nodes = []
        self.meshes = []
        self.materials = []
        self.accessors = []
        self.buffer_views = []
        self.bin_data = bytearray()

    def add_material(self, name, base_color=(0.1,0.1,0.12,1.0), metallic=0.9,
                     roughness=0.15, emissive=(0,0,0), double_sided=False):
        mat = {
            "name": name,
            "pbrMetallicRoughness": {
                "baseColorFactor": list(base_color),
                "metallicFactor": metallic,
                "roughnessFactor": roughness,
            },
            "emissiveFactor": list(emissive),
            "doubleSided": double_sided,
        }
        self.materials.append(mat)
        return len(self.materials) - 1

    def _add_buffer_view(self, data, target=34962):  # 34962=ARRAY_BUFFER, 34963=ELEMENT_ARRAY
        offset = len(self.bin_data)
        self.bin_data.extend(data)
        # pad to 4 bytes
        while len(self.bin_data) % 4:
            self.bin_data.append(0)
        bv = {"buffer": 0, "byteOffset": offset, "byteLength": len(data)}
        if target:
            bv["target"] = target
        self.buffer_views.append(bv)
        return len(self.buffer_views) - 1

    def _add_accessor(self, bv_idx, component_type, count, type_str, mins=None, maxs=None):
        acc = {
            "bufferView": bv_idx,
            "componentType": component_type,
            "count": count,
            "type": type_str,
        }
        if mins is not None:
            acc["min"] = mins
            acc["max"] = maxs
        self.accessors.append(acc)
        return len(self.accessors) - 1

    def add_mesh(self, name, positions, normals, uvs, indices, material_idx):
        # positions
        pos_bytes = pack_floats(positions)
        bv_pos = self._add_buffer_view(pos_bytes, 34962)
        n = len(positions) // 3
        px = [positions[i*3] for i in range(n)]
        py = [positions[i*3+1] for i in range(n)]
        pz = [positions[i*3+2] for i in range(n)]
        acc_pos = self._add_accessor(bv_pos, 5126, n, "VEC3",
            [min(px), min(py), min(pz)], [max(px), max(py), max(pz)])

        # normals
        norm_bytes = pack_floats(normals)
        bv_norm = self._add_buffer_view(norm_bytes, 34962)
        acc_norm = self._add_accessor(bv_norm, 5126, n, "VEC3")

        # uvs
        uv_bytes = pack_floats(uvs)
        bv_uv = self._add_buffer_view(uv_bytes, 34962)
        acc_uv = self._add_accessor(bv_uv, 5126, n, "VEC2")

        # indices (uint16)
        idx_bytes = pack_ints(indices, 'H')
        bv_idx = self._add_buffer_view(idx_bytes, 34963)
        acc_idx = self._add_accessor(bv_idx, 5123, len(indices), "SCALAR",
            [min(indices)], [max(indices)])

        mesh = {
            "name": name,
            "primitives": [{
                "attributes": {
                    "POSITION": acc_pos,
                    "NORMAL": acc_norm,
                    "TEXCOORD_0": acc_uv,
                },
                "indices": acc_idx,
                "material": material_idx,
            }]
        }
        self.meshes.append(mesh)
        return len(self.meshes) - 1

    def add_node(self, name, mesh_idx, translation=(0,0,0), rotation=None, scale=None, children=None):
        node = {"name": name, "mesh": mesh_idx, "translation": list(translation)}
        if rotation:
            node["rotation"] = list(rotation)
        if scale:
            node["scale"] = list(scale)
        if children:
            node["children"] = children
        self.nodes.append(node)
        return len(self.nodes) - 1

    def add_empty_node(self, name, translation=(0,0,0), children=None):
        node = {"name": name, "translation": list(translation)}
        if children:
            node["children"] = children
        self.nodes.append(node)
        return len(self.nodes) - 1

    def build(self, output_path):
        gltf = {
            "asset": {"version": "2.0", "generator": "DWais GLB Builder"},
            "scene": 0,
            "scenes": [{"nodes": [len(self.nodes) - 1]}],
            "nodes": self.nodes,
            "meshes": self.meshes,
            "materials": self.materials,
            "accessors": self.accessors,
            "bufferViews": self.buffer_views,
            "buffers": [{"byteLength": len(self.bin_data)}],
        }

        json_bytes = json.dumps(gltf, separators=(',', ':')).encode('utf-8')
        # pad JSON to 4 bytes
        while len(json_bytes) % 4:
            json_bytes += b' '

        # pad BIN to 4 bytes
        while len(self.bin_data) % 4:
            self.bin_data.append(0)

        total_len = 12 + 8 + len(json_bytes) + 8 + len(self.bin_data)

        with open(output_path, 'wb') as f:
            # GLB header
            f.write(struct.pack('<III', 0x46546C67, 2, total_len))
            # JSON chunk
            f.write(struct.pack('<II', len(json_bytes), 0x4E4F534A))
            f.write(json_bytes)
            # BIN chunk
            f.write(struct.pack('<II', len(self.bin_data), 0x004E4942))
            f.write(self.bin_data)

        print(f"✓ GLB written: {output_path} ({os.path.getsize(output_path):,} bytes)")


# ── Build iPad ─────────────────────────────────────────────────────────────────

def build_ipad():
    g = GLBBuilder()
    output = os.path.join(os.path.dirname(__file__), '..', 'assets', 'models', 'tablet.glb')

    # iPad Pro 11" approximate proportions (in metres, scaled to ~0.25m wide)
    # Real: 247.6 × 178.5 × 5.9 mm  → scale to ~0.25 wide
    scale = 0.25 / 0.2476
    W   = 0.2476 * scale   # 0.250 m wide
    H   = 0.1785 * scale   # 0.180 m tall
    D   = 0.0059 * scale   # 0.006 m thick

    # Corner radius approximation: use flat quads (GLB doesn't bevel easily)
    # Screen inset: bezel ~10mm each side
    bezel = 0.010 * scale
    SW = W - bezel * 2      # screen width
    SH = H - bezel * 2      # screen height

    # ── Materials ──────────────────────────────────────────────────────────────
    mat_body  = g.add_material("iPad Body",   base_color=(0.78, 0.78, 0.80, 1), metallic=0.92, roughness=0.12)
    mat_bezel = g.add_material("iPad Bezel",  base_color=(0.06, 0.06, 0.07, 1), metallic=0.15, roughness=0.55)
    mat_screen = g.add_material("Screen",     base_color=(0.03, 0.03, 0.05, 1), metallic=0.0,  roughness=0.05,
                                 emissive=(0.28, 0.38, 0.55))   # subtle blue-ish glow
    mat_camera = g.add_material("Camera",     base_color=(0.05, 0.05, 0.06, 1), metallic=0.6,  roughness=0.2)
    mat_button = g.add_material("Button",     base_color=(0.70, 0.70, 0.72, 1), metallic=0.88, roughness=0.18)
    mat_logo   = g.add_material("Logo",       base_color=(0.75, 0.75, 0.77, 1), metallic=0.95, roughness=0.08)
    mat_port   = g.add_material("Port",       base_color=(0.04, 0.04, 0.05, 1), metallic=0.5,  roughness=0.3)

    all_nodes = []

    # ── Body shell ─────────────────────────────────────────────────────────────
    pos, nor, uv, idx = make_box_vertices(0, 0, 0, W, H, D)
    mi = g.add_mesh("Body", pos, nor, uv, idx, mat_body)
    all_nodes.append(g.add_node("Body", mi))

    # ── Front bezel (slightly in front of body) ────────────────────────────────
    pos, nor, uv, idx = make_box_vertices(0, 0, D/2 + 0.0001, W - 0.002*scale, H - 0.002*scale, 0.0005*scale)
    mi = g.add_mesh("Bezel", pos, nor, uv, idx, mat_bezel)
    all_nodes.append(g.add_node("Bezel", mi))

    # ── Screen panel (inset in bezel) ──────────────────────────────────────────
    sz = 0.0006 * scale
    pos, nor, uv, idx = make_box_vertices(0, 0, D/2 + sz, SW, SH, 0.0003*scale)
    mi = g.add_mesh("Screen", pos, nor, uv, idx, mat_screen)
    all_nodes.append(g.add_node("Screen", mi))

    # ── Home bar / indicator (bottom, iPad Pro style) ──────────────────────────
    bar_w, bar_h = 0.08 * scale, 0.003 * scale
    bar_y = -(SH/2 - bezel * 0.5)
    pos, nor, uv, idx = make_box_vertices(0, bar_y, D/2 + sz * 1.5, bar_w, bar_h, 0.0002*scale)
    mi = g.add_mesh("HomeBar", pos, nor, uv, idx, mat_bezel)
    all_nodes.append(g.add_node("HomeBar", mi))

    # ── Camera bump (back, top-left for landscape or top-center) ───────────────
    cam_x, cam_y, cam_z = -W/2 + 0.025*scale, H/2 - 0.025*scale, -D/2 - 0.002*scale
    # camera bump plate
    pos, nor, uv, idx = make_box_vertices(cam_x, cam_y, cam_z, 0.035*scale, 0.035*scale, 0.003*scale)
    mi = g.add_mesh("CamBump", pos, nor, uv, idx, mat_body)
    all_nodes.append(g.add_node("CamBump", mi))

    # camera lens ring
    lens_steps = 16
    def circle_verts(cx, cy, cz, r, nx, ny, nz, steps):
        """Flat disk approximation as triangle fan."""
        verts_pos, verts_norm, verts_uv = [], [], []
        idxs = []
        center_i = 0
        verts_pos.extend([cx, cy, cz])
        verts_norm.extend([nx, ny, nz])
        verts_uv.extend([0.5, 0.5])
        for i in range(steps):
            a = 2 * math.pi * i / steps
            verts_pos.extend([cx + r * math.cos(a) * (1 if nx == 0 else 0) +
                              r * math.cos(a) * (1 if ny == 0 else 0),
                              cy + r * math.sin(a) * (1 if nx == 0 else 0),
                              cz + r * math.sin(a) * (1 if nz == 0 else 0)])
            verts_norm.extend([nx, ny, nz])
            verts_uv.extend([0.5 + 0.5 * math.cos(a), 0.5 + 0.5 * math.sin(a)])
        for i in range(steps):
            idxs.extend([0, i+1, (i+1) % steps + 1])
        return verts_pos, verts_norm, verts_uv, idxs

    # Simple lens disk (XY plane facing -Z for back)
    lens_pos = []
    lens_nor = []
    lens_uv  = []
    lens_idx = []
    cx, cy, cz = cam_x, cam_y, cam_z - 0.0012*scale
    steps = 16
    lens_pos.append(cx); lens_pos.append(cy); lens_pos.append(cz)
    lens_nor.extend([0, 0, -1]); lens_uv.extend([0.5, 0.5])
    for i in range(steps):
        a = 2 * math.pi * i / steps
        r = 0.008 * scale
        lens_pos.extend([cx + r * math.cos(a), cy + r * math.sin(a), cz])
        lens_nor.extend([0, 0, -1])
        lens_uv.extend([0.5 + 0.5*math.cos(a), 0.5 + 0.5*math.sin(a)])
    for i in range(steps):
        lens_idx.extend([0, i+1, (i+1)%steps + 1])

    mi = g.add_mesh("Lens", lens_pos, lens_nor, lens_uv, lens_idx, mat_camera)
    all_nodes.append(g.add_node("Lens", mi))

    # ── Power button (right side, top) ─────────────────────────────────────────
    btn_x = W/2 + 0.001*scale
    btn_y = H/2 - 0.025*scale
    pos, nor, uv, idx = make_box_vertices(btn_x, btn_y, 0, 0.006*scale, 0.025*scale, D * 0.7)
    mi = g.add_mesh("PowerBtn", pos, nor, uv, idx, mat_button)
    all_nodes.append(g.add_node("PowerBtn", mi))

    # ── Volume buttons (right side) ─────────────────────────────────────────────
    for vy_offset in [H/4, H/4 - 0.035*scale]:
        pos, nor, uv, idx = make_box_vertices(btn_x, vy_offset, 0, 0.006*scale, 0.022*scale, D * 0.65)
        mi = g.add_mesh("VolBtn", pos, nor, uv, idx, mat_button)
        all_nodes.append(g.add_node("VolBtn", mi))

    # ── USB-C port (bottom center) ─────────────────────────────────────────────
    port_y = -H/2 - 0.001*scale
    pos, nor, uv, idx = make_box_vertices(0, port_y, 0, 0.02*scale, 0.007*scale, D * 0.6)
    mi = g.add_mesh("Port", pos, nor, uv, idx, mat_port)
    all_nodes.append(g.add_node("Port", mi))

    # ── Smart Connector dots (back, left side) ─────────────────────────────────
    for dot_y in [0.02*scale, 0, -0.02*scale]:
        dot_pos = []
        dot_nor = []
        dot_uv  = []
        dot_idx = []
        dcx, dcy, dcz = -W/2 - 0.001*scale, dot_y, 0
        steps2 = 8
        dot_pos.extend([dcx, dcy, dcz])
        dot_nor.extend([-1, 0, 0]); dot_uv.extend([0.5, 0.5])
        for i in range(steps2):
            a = 2 * math.pi * i / steps2
            r2 = 0.004 * scale
            dot_pos.extend([dcx, dcy + r2 * math.cos(a), dcz + r2 * math.sin(a)])
            dot_nor.extend([-1, 0, 0])
            dot_uv.extend([0.5 + 0.5*math.cos(a), 0.5 + 0.5*math.sin(a)])
        for i in range(steps2):
            dot_idx.extend([0, i+1, (i+1)%steps2+1])
        mi = g.add_mesh("Dot", dot_pos, dot_nor, dot_uv, dot_idx, mat_button)
        all_nodes.append(g.add_node("Dot", mi))

    # ── Root empty node ────────────────────────────────────────────────────────
    # Tilt slightly for a nice default presentation
    # Rotation: 15° around Y axis = quaternion [0, sin(7.5°), 0, cos(7.5°)]
    angle = math.radians(12)
    root_rot = [0, math.sin(angle/2), 0, math.cos(angle/2)]
    root = g.add_empty_node("iPad", children=all_nodes, translation=[0, 0, 0])
    # Override to add rotation
    g.nodes[root]["rotation"] = root_rot

    g.build(output)
    return output


if __name__ == "__main__":
    os.makedirs(os.path.join(os.path.dirname(__file__), '..', 'assets', 'models'), exist_ok=True)
    path = build_ipad()
    print(f"Model ready at: {path}")
