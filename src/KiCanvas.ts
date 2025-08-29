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
 * 
 * @example
 * ```typescript
 * const kiCanvasViewer = new KiCanvas(document.getElementById('canvas-container'));
 * kiCanvasViewer.loadSchematic(schematicContent);
 * ```
 */
export class KiCanvas {
  private container: HTMLElement;
  private project: Project;
  private root: Root | null = null;
  private isDisposed: boolean = false;

  constructor(container: HTMLElement) {
    if (!container) {
      throw new Error('Container element is required');
    }
    this.container = container;
    this.project = new Project();
  }

  /**
   * Load a schematic from string content
   * @param content - The schematic file content as string
   * @param filename - Optional filename (will auto-append .kicad_sch if missing)
   */
  public async loadSchematic(content: string, filename: string = 'schematic.kicad_sch'): Promise<void> {
    this.checkNotDisposed();
    
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
   * @param content - The board file content as string
   * @param filename - Optional filename (will auto-append .kicad_pcb if missing)
   */
  public async loadBoard(content: string, filename: string = 'board.kicad_pcb'): Promise<void> {
    this.checkNotDisposed();
    
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
   * @param files - Record mapping filenames to their string content
   */
  public async loadFiles(files: Record<string, string>): Promise<void> {
    this.checkNotDisposed();
    const vfs = new MemoryFileSystem(files);
    await this.loadFromVFS(vfs);
  }

  /**
   * Load from a virtual file system
   * @param vfs - The virtual file system containing the files to load
   */
  public async loadFromVFS(vfs: VirtualFileSystem): Promise<void> {
    this.checkNotDisposed();
    await this.project.load(vfs);
    this.render();
  }

  /**
   * Get the current project instance
   * @returns The Project instance containing loaded files
   */
  public getProject(): Project {
    this.checkNotDisposed();
    return this.project;
  }

  /**
   * Check if the instance has been disposed
   * @returns true if disposed, false otherwise
   */
  public isDisposedInstance(): boolean {
    return this.isDisposed;
  }

  /**
   * Dispose of resources and cleanup
   */
  public dispose(): void {
    if (this.isDisposed) {
      return;
    }

    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    
    this.project.dispose();
    this.container.innerHTML = '';
    this.isDisposed = true;
  }

  /**
   * Render the KiCanvas component into the container
   */
  private render(): void {
    this.checkNotDisposed();

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

  /**
   * Check if the instance has been disposed and throw if it has
   */
  private checkNotDisposed(): void {
    if (this.isDisposed) {
      throw new Error('KiCanvas instance has been disposed');
    }
  }
}