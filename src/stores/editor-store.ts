'use client';

import {create} from 'zustand';

export type EditorTool = 'select' | 'text' | 'shape' | 'image';

export type EditorGuides = {
  bleed: boolean;
  safe: boolean;
  print: boolean;
};

type EditorState = {
  projectId?: string;
  projectName: string;
  productId?: string;
  activeTool: EditorTool;
  zoom: number;
  guides: EditorGuides;
  isDirty: boolean;
  backgroundColor: string;
  setProjectId: (id: string | undefined) => void;
  setProjectName: (name: string) => void;
  setProductId: (id: string | undefined) => void;
  setActiveTool: (tool: EditorTool) => void;
  setZoom: (zoom: number) => void;
  setGuides: (guides: Partial<EditorGuides>) => void;
  setBackgroundColor: (color: string) => void;
  markDirty: (dirty: boolean) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  projectId: undefined,
  projectName: 'Nouveau projet',
  productId: undefined,
  activeTool: 'select',
  zoom: 1,
  guides: {bleed: true, safe: true, print: true},
  isDirty: false,
  backgroundColor: '#ffffff',
  setProjectId: (id) => set({projectId: id}),
  setProjectName: (name) => set({projectName: name}),
  setProductId: (id) => set({productId: id}),
  setActiveTool: (tool) => set({activeTool: tool}),
  setZoom: (zoom) => set({zoom}),
  setGuides: (guides) => set((state) => ({guides: {...state.guides, ...guides}})),
  setBackgroundColor: (color) => set({backgroundColor: color}),
  markDirty: (dirty) => set({isDirty: dirty})
}));
