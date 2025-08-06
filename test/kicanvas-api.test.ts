/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import { expect } from '@esm-bundle/chai';
import { MemoryFileSystem } from '../src/services/vfs';
import { Project } from '../src/services/project';

suite('MemoryFileSystem', () => {
  test('should create file system with string content', () => {
    const vfs = new MemoryFileSystem({
      'test.txt': 'Hello, World!',
      'data.bin': new Blob(['binary data'])
    });

    const files = Array.from(vfs.list());
    expect(files).to.include('test.txt');
    expect(files).to.include('data.bin');
  });

  test('should retrieve files', async () => {
    const vfs = new MemoryFileSystem({
      'test.txt': 'Hello, World!'
    });

    const file = await vfs.get('test.txt');
    expect(file.name).to.equal('test.txt');
    expect(await file.text()).to.equal('Hello, World!');
  });

  test('should add files dynamically', async () => {
    const vfs = new MemoryFileSystem();
    
    vfs.addFile('dynamic.txt', 'Added dynamically');
    
    const file = await vfs.get('dynamic.txt');
    expect(file.name).to.equal('dynamic.txt');
    expect(await file.text()).to.equal('Added dynamically');
  });

  test('should check file existence', async () => {
    const vfs = new MemoryFileSystem({
      'exists.txt': 'content'
    });

    expect(await vfs.has('exists.txt')).to.be.true;
    expect(await vfs.has('not-exists.txt')).to.be.false;
  });

  test('should throw error for non-existent file', async () => {
    const vfs = new MemoryFileSystem();
    
    try {
      await vfs.get('non-existent.txt');
      expect.fail('Should have thrown error');
    } catch (error) {
      expect(error.message).to.include('not found');
    }
  });
});

suite('KiCanvas programmatic API core functionality', () => {
  test('should load schematic content through MemoryFileSystem and Project', async () => {
    const schematicContent = `(kicad_sch
      (version 20211123)
      (generator eeschema)
      (uuid c0326988-8693-490b-a3fb-e69d8c3ef544)
      (paper "A4")
      (title_block
        (title "")
        (date "")
        (rev "")
        (company "")
      )
      (lib_symbols)
      (sheet_instances
        (path "/" (page "1"))
      )
    )`;

    const vfs = new MemoryFileSystem({
      'test.kicad_sch': schematicContent
    });

    const project = new Project();
    await project.load(vfs);
    
    expect(project.has_schematics).to.be.true;
    
    project.dispose();
  });

  test('should load board content through MemoryFileSystem and Project', async () => {
    const boardContent = `(kicad_pcb
      (version 20211014)
      (generator pcbnew)
      (general
        (thickness 1.6)
      )
      (paper "A4")
      (layers
        (0 "F.Cu" signal)
        (31 "B.Cu" signal)
        (32 "B.Adhes" user "B.Adhesive")
        (33 "F.Adhes" user "F.Adhesive")
        (34 "B.Paste" user)
        (35 "F.Paste" user)
        (36 "B.SilkS" user "B.Silkscreen")
        (37 "F.SilkS" user "F.Silkscreen")
        (38 "B.Mask" user)
        (39 "F.Mask" user)
        (40 "Dwgs.User" user "User.Drawings")
        (41 "Cmts.User" user "User.Comments")
        (42 "Eco1.User" user "User.Eco1")
        (43 "Eco2.User" user "User.Eco2")
        (44 "Edge.Cuts" user)
        (45 "Margin" user)
        (46 "B.CrtYd" user "B.Courtyard")
        (47 "F.CrtYd" user "F.Courtyard")
        (48 "B.Fab" user)
        (49 "F.Fab" user)
      )
      (setup
        (stackup
          (layer "F.SilkS" (type "Top Silk Screen"))
          (layer "F.Paste" (type "Top Solder Paste"))
          (layer "F.Mask" (type "Top Solder Mask") (thickness 0.01))
          (layer "F.Cu" (type "copper") (thickness 0.035))
          (layer "dielectric 1" (type "core") (thickness 1.51) (material "FR4") (epsilon_r 4.5) (loss_tangent 0.02))
          (layer "B.Cu" (type "copper") (thickness 0.035))
          (layer "B.Mask" (type "Bottom Solder Mask") (thickness 0.01))
          (layer "B.Paste" (type "Bottom Solder Paste"))
          (layer "B.SilkS" (type "Bottom Silk Screen"))
          (copper_finish "None")
          (dielectric_constraints no)
        )
      )
    )`;

    const vfs = new MemoryFileSystem({
      'test.kicad_pcb': boardContent
    });

    const project = new Project();
    await project.load(vfs);
    
    expect(project.has_boards).to.be.true;
    
    project.dispose();
  });
});