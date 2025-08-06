/*
    Copyright (c) 2025 Alethea Katherine Flowers.
    Published under the standard MIT License.
    Full text available at: https://opensource.org/licenses/MIT
*/

import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Project } from './services/project';
import { MemoryFileSystem, type VirtualFileSystem } from './services/vfs';
import { KiCanvasEmbed, ProjectContext } from './react';

/**
 * Programmatic KiCanvas API
 * 
 * Provides an imperative interface for loading and displaying KiCAD files
 */
export class KiCanvas {
  private container: HTMLElement;
  private project: Project;
  private root: Root | null = null;

  constructor(container: HTMLElement) {
    if (!container) {
      throw new Error('Container element is required');
    }
    this.container = container;
    this.project = new Project();
  }

  /**
   * Load a schematic from string content
   */
  public async loadSchematic(content: string, filename: string = 'schematic.kicad_sch'): Promise<void> {
    if (!filename.endsWith('.kicad_sch')) {
      filename = filename + '.kicad_sch';
    }

    const vfs = new MemoryFileSystem({
      [filename]: content
    });

    await this.loadFromVFS(vfs);
  }

  /**
   * Load a board from string content
   */
  public async loadBoard(content: string, filename: string = 'board.kicad_pcb'): Promise<void> {
    if (!filename.endsWith('.kicad_pcb')) {
      filename = filename + '.kicad_pcb';
    }

    const vfs = new MemoryFileSystem({
      [filename]: content
    });

    await this.loadFromVFS(vfs);
  }

  /**
   * Load multiple files from a record of filename -> content
   */
  public async loadFiles(files: Record<string, string>): Promise<void> {
    const vfs = new MemoryFileSystem(files);
    await this.loadFromVFS(vfs);
  }

  /**
   * Load from a virtual file system
   */
  public async loadFromVFS(vfs: VirtualFileSystem): Promise<void> {
    await this.project.load(vfs);
    this.render();
  }

  /**
   * Get the current project
   */
  public getProject(): Project {
    return this.project;
  }

  /**
   * Dispose of resources
   */
  public dispose(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    this.project.dispose();
  }

  /**
   * Render the KiCanvas component into the container
   */
  private render(): void {
    if (!this.root) {
      this.root = createRoot(this.container);
    }

    this.root.render(
      React.createElement(
        ProjectContext.Provider,
        { value: this.project },
        React.createElement(KiCanvasEmbed, {
          controls: 'full',
          className: 'kc-programmatic-embed'
        })
      )
    );
  }
}