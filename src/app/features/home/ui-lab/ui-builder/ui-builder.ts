import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { EDITOR_CSS, EXPORT_CSS } from './builder-css';
import { resolveDrop } from './builder-drop';
import { History, amend, commit, createHistory, redo, undo } from './builder-history';
import { PRESETS, starterPage } from './builder-presets';
import { renderPage } from './builder-render';
import { STORAGE_KEY, deserialize, serialize } from './builder-storage';
import {
  NODE_DEFS,
  NodeType,
  PropSchema,
  PropValue,
  UbNode,
  canDrop,
  createNode,
  duplicateNode,
  findNode,
  findParent,
  insertNode,
  isContainer,
  moveNode,
  removeNode,
  updateProps,
} from './builder-tree';
import { ShadowHtml } from './shadow-html';

export type DropPayload =
  { kind: 'new'; type: NodeType } | { kind: 'preset'; id: string } | { kind: 'move'; id: string };

interface DropTarget {
  parentId: string;
  index: number;
}

interface Layer {
  id: string;
  label: string;
  level: number;
}

interface DropBox {
  top: number;
  left: number;
  width: number;
  height: number;
  line: boolean;
}

const DEVICES = [
  { id: 'desktop', label: 'Desktop', width: '100%' },
  { id: 'tablet', label: 'Tablet', width: '768px' },
  { id: 'mobile', label: 'Mobile', width: '375px' },
] as const;

type DeviceId = (typeof DEVICES)[number]['id'];

function loadInitial(): UbNode {
  try {
    return deserialize(localStorage.getItem(STORAGE_KEY)) ?? starterPage();
  } catch {
    return starterPage();
  }
}

const NODE_TYPES = Object.keys(NODE_DEFS) as NodeType[];

/** Compose a page from nested components: drag or click to add, select to edit, export HTML/CSS. */
@Component({
  selector: 'app-ui-builder',
  imports: [ShadowHtml],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ui-builder.html',
  styleUrl: './ui-builder.scss',
})
export class UiBuilder {
  protected readonly palette = NODE_TYPES.map((type) => ({ type, ...NODE_DEFS[type] }));
  protected readonly presets = PRESETS;
  protected readonly devices = DEVICES;
  protected readonly device = signal<DeviceId>('desktop');
  protected readonly deviceWidth = computed(
    () => DEVICES.find((d) => d.id === this.device())?.width ?? '100%',
  );
  protected readonly history = signal<History<UbNode>>(createHistory(loadInitial()));
  protected readonly root = computed(() => this.history().present);
  protected readonly selectedId = signal<string | null>(null);
  protected readonly drop = signal<DropTarget | null>(null);
  protected readonly dropBox = signal<DropBox | null>(null);
  protected readonly exportTab = signal<'html' | 'css'>('html');
  protected readonly status = signal('');
  protected readonly canUndo = computed(() => this.history().past.length > 0);
  protected readonly canRedo = computed(() => this.history().future.length > 0);
  private dragging: DropPayload | null = null;
  /** True while a burst of typing in one field is being folded into a single undo step. */
  private editing = false;

  constructor() {
    effect(() => {
      const json = serialize(this.root());
      try {
        localStorage.setItem(STORAGE_KEY, json);
      } catch {
        // Storage can be full or blocked; the builder still works without autosave.
      }
    });
  }

  protected readonly selected = computed(() => {
    const id = this.selectedId();
    return id ? findNode(this.root(), id) : null;
  });
  protected readonly selectedLabel = computed(() => {
    const node = this.selected();
    return node ? NODE_DEFS[node.type].label : '';
  });
  protected readonly schema = computed<PropSchema[]>(() => {
    const node = this.selected();
    return node ? NODE_DEFS[node.type].props : [];
  });
  /** Position of the selection among its siblings, or null for the root / no selection. */
  protected readonly position = computed(() => {
    const id = this.selectedId();
    const where = id ? findParent(this.root(), id) : null;
    return where ? { index: where.index, count: where.parent.children.length } : null;
  });
  protected readonly layers = computed<Layer[]>(() => {
    const out: Layer[] = [];
    const walk = (node: UbNode, level: number) => {
      out.push({ id: node.id, label: this.layerLabel(node), level });
      node.children.forEach((c) => walk(c, level + 1));
    };
    walk(this.root(), 1);
    return out;
  });
  protected readonly pageHtml = computed(() => renderPage(this.root(), { editor: true }));
  protected readonly canvasCss = computed(() => {
    const id = this.selectedId();
    const outline = id
      ? `[data-ub-id="${id}"]{outline:2px solid var(--ub-primary);outline-offset:2px}`
      : '';
    return `${EXPORT_CSS}${EDITOR_CSS}${outline}`;
  });
  protected readonly code = computed(() =>
    this.exportTab() === 'html' ? renderPage(this.root(), { editor: false }) : EXPORT_CSS,
  );

  protected add(payload: DropPayload): void {
    const selected = this.selected();
    const parent = selected && isContainer(selected.type) ? selected : this.root();
    this.dropAt(parent.id, parent.children.length, payload);
  }

  /** Places a new, preset or existing node at `index` inside `parentId`; invalid drops change nothing. */
  dropAt(parentId: string, index: number, payload: DropPayload): void {
    const root = this.root();
    let next = root;
    let newId = '';
    let label = '';
    if (payload.kind === 'move') {
      next = moveNode(root, payload.id, parentId, index);
      newId = payload.id;
      label = 'Component moved';
    } else {
      const node =
        payload.kind === 'new'
          ? createNode(payload.type)
          : PRESETS.find((p) => p.id === payload.id)?.build();
      if (!node) return;
      next = insertNode(root, node, parentId, index);
      newId = node.id;
      label = `${payload.kind === 'new' ? NODE_DEFS[payload.type].label : this.presetLabel(payload.id)} added`;
    }
    if (next === root) {
      this.status.set("You can't drop that here.");
      return;
    }
    this.apply(next);
    this.selectedId.set(newId);
    this.status.set(`${label}.`);
  }

  private presetLabel(id: string): string {
    return PRESETS.find((p) => p.id === id)?.label ?? 'Preset';
  }

  private layerLabel(node: UbNode): string {
    const base = NODE_DEFS[node.type].label;
    const text = node.props['text'] ?? node.props['label'];
    return typeof text === 'string' && text.trim() ? `${base}: ${text.trim().slice(0, 24)}` : base;
  }

  protected value(key: string): PropValue {
    return this.selected()?.props[key] ?? '';
  }

  protected setProp(schema: PropSchema, raw: PropValue): void {
    const id = this.selectedId();
    if (!id) return;
    let value = raw;
    if (schema.kind === 'number') {
      const n = Number(raw);
      if (raw === '' || !Number.isFinite(n)) return;
      value = Math.min(schema.max ?? n, Math.max(schema.min ?? n, Math.round(n)));
    }
    const next = updateProps(this.root(), id, { [schema.key]: value });
    const typed = schema.kind === 'text' || schema.kind === 'textarea' || schema.kind === 'number';
    if (typed && this.editing) {
      this.history.update((h) => amend(h, next));
      return;
    }
    this.apply(next);
    this.editing = typed;
  }

  protected beginEdit(): void {
    this.editing = false;
  }

  protected removeSelected(): void {
    const id = this.selectedId();
    if (!id || !this.position()) return;
    const label = this.selectedLabel();
    this.apply(removeNode(this.root(), id));
    this.selectedId.set(null);
    this.status.set(`${label} deleted.`);
  }

  protected duplicateSelected(): void {
    const id = this.selectedId();
    if (!id || !this.position()) return;
    const { root, newId } = duplicateNode(this.root(), id);
    if (root === this.root()) {
      this.status.set("You can't duplicate that here.");
      return;
    }
    this.apply(root);
    this.selectedId.set(newId);
    this.status.set(`${this.selectedLabel()} duplicated.`);
  }

  protected shift(delta: -1 | 1): void {
    const id = this.selectedId();
    const where = id ? findParent(this.root(), id) : null;
    if (!id || !where) return;
    const to = where.index + delta;
    if (to < 0 || to >= where.parent.children.length) return;
    // moveNode takes an insertion point, so moving down must land after the neighbour.
    this.apply(moveNode(this.root(), id, where.parent.id, delta > 0 ? to + 1 : to));
    this.status.set(`Moved to position ${to + 1} of ${where.parent.children.length}.`);
  }

  protected onLayerKey(event: KeyboardEvent, id: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectedId.set(id);
    }
  }

  private apply(next: UbNode): void {
    this.editing = false;
    this.history.update((h) => commit(h, next));
  }

  protected undo(): void {
    this.travel(undo, 'Undid last change.');
  }

  protected redo(): void {
    this.travel(redo, 'Redid change.');
  }

  private travel(step: (h: History<UbNode>) => History<UbNode>, message: string): void {
    const before = this.history();
    const after = step(before);
    if (after === before) return;
    this.editing = false;
    this.history.set(after);
    const id = this.selectedId();
    if (id && !findNode(after.present, id)) this.selectedId.set(null);
    this.status.set(message);
  }

  protected reset(): void {
    this.apply(starterPage());
    this.selectedId.set(null);
    this.status.set('Page reset to the starter layout.');
  }

  protected setDevice(id: DeviceId): void {
    this.device.set(id);
    this.status.set(`${DEVICES.find((d) => d.id === id)?.label} preview.`);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const origin = event.composedPath()[0];
    if (
      origin instanceof HTMLInputElement ||
      origin instanceof HTMLTextAreaElement ||
      origin instanceof HTMLSelectElement ||
      (origin instanceof HTMLElement && origin.isContentEditable)
    ) {
      return;
    }
    const mod = event.metaKey || event.ctrlKey;
    const key = event.key.toLowerCase();
    if (mod && key === 'z') {
      event.preventDefault();
      if (event.shiftKey) this.redo();
      else this.undo();
    } else if (mod && key === 'y') {
      event.preventDefault();
      this.redo();
    } else if (mod && key === 'd') {
      event.preventDefault();
      this.duplicateSelected();
    } else if (!mod && (key === 'delete' || key === 'backspace') && this.selectedId()) {
      event.preventDefault();
      this.removeSelected();
    }
  }

  protected onCanvasClick(event: Event): void {
    const el = this.nodeFrom(event);
    if (el) event.preventDefault();
    this.selectedId.set(el?.dataset['ubId'] ?? null);
  }

  /** First element on the composed path that is an editor node (or an empty-container target). */
  private nodeFrom(event: Event): HTMLElement | null {
    for (const target of event.composedPath()) {
      if (!(target instanceof HTMLElement)) continue;
      if (target.dataset['ubId'] || target.dataset['ubEmpty']) return target;
    }
    return null;
  }

  protected dragNew(event: DragEvent, payload: DropPayload): void {
    this.startDrag(event, payload, 'copy');
  }

  protected onCanvasDragStart(event: DragEvent): void {
    const id = this.nodeFrom(event)?.dataset['ubId'];
    if (!id || id === this.root().id) {
      event.preventDefault();
      return;
    }
    this.startDrag(event, { kind: 'move', id }, 'move');
  }

  private startDrag(event: DragEvent, payload: DropPayload, effect: 'copy' | 'move'): void {
    this.dragging = payload;
    event.dataTransfer?.setData('text/plain', JSON.stringify(payload));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = effect;
  }

  protected onCanvasDragOver(event: DragEvent): void {
    const payload = this.dragging;
    const el = this.nodeFrom(event);
    if (!payload || !el) return;
    const target = this.resolveTarget(el, event);
    const parentOk =
      target && canDrop(this.root(), payload.kind === 'move' ? payload.id : null, target.parentId);
    if (!target || !parentOk) {
      this.drop.set(null);
      this.dropBox.set(null);
      return;
    }
    event.preventDefault();
    this.drop.set({ parentId: target.parentId, index: target.index });
    this.dropBox.set(target.box);
  }

  private resolveTarget(el: HTMLElement, event: DragEvent): (DropTarget & { box: DropBox }) | null {
    const root = this.root();
    const emptyId = el.dataset['ubEmpty'];
    const id = emptyId ?? el.dataset['ubId']!;
    const node = findNode(root, id);
    if (!node) return null;
    const rect = el.getBoundingClientRect();
    // The indicator is positioned inside the stage, which is wider than a centred tablet/mobile canvas.
    const host = (event.currentTarget as HTMLElement).parentElement!.getBoundingClientRect();
    const box = (line: boolean, top: number, height: number): DropBox => ({
      top: top - host.top,
      left: rect.left - host.left,
      width: rect.right - rect.left,
      height,
      line,
    });
    const zone =
      emptyId || node.id === root.id
        ? 'inside'
        : resolveDrop(
            rect,
            { x: event.clientX, y: event.clientY },
            isContainer(node.type),
            node.children.length > 0,
          );
    if (zone === 'inside') {
      return {
        parentId: node.id,
        index: node.children.length,
        box: box(false, rect.top, rect.bottom - rect.top),
      };
    }
    const where = findParent(root, node.id)!;
    return {
      parentId: where.parent.id,
      index: zone === 'before' ? where.index : where.index + 1,
      box: box(true, zone === 'before' ? rect.top : rect.bottom, 4),
    };
  }

  protected onCanvasDrop(event: DragEvent): void {
    event.preventDefault();
    const target = this.drop();
    const payload = this.dragging;
    this.dragEnd();
    if (target && payload) this.dropAt(target.parentId, target.index, payload);
  }

  protected onCanvasDragLeave(event: DragEvent): void {
    const next = event.relatedTarget as Node | null;
    if (!next || !(event.currentTarget as HTMLElement).contains(next)) {
      this.drop.set(null);
      this.dropBox.set(null);
    }
  }

  protected dragEnd(): void {
    this.dragging = null;
    this.drop.set(null);
    this.dropBox.set(null);
  }

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.status.set(`${this.exportTab().toUpperCase()} copied to clipboard.`);
    } catch {
      this.status.set('Copy is not available here. Select the code and copy it manually.');
    }
  }
}
