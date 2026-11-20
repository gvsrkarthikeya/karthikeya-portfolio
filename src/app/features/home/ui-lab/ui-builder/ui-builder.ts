import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  BLOCK_DEFS,
  Block,
  BlockField,
  BlockType,
  EXPORT_CSS,
  Tone,
  blockToHtml,
  createBlock,
  defFor,
  insertAt,
  moveBlock,
  removeBlock,
  toHtml,
} from './builder-model';
import { ShadowHtml } from './shadow-html';

const starter = (): Block[] => [
  createBlock('navbar'),
  createBlock('hero'),
  createBlock('cards'),
  createBlock('footer'),
];

/** Assemble a page from blocks: add, drag to reorder, edit props, and export HTML/CSS. */
@Component({
  selector: 'app-ui-builder',
  imports: [ShadowHtml],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ui-builder.html',
  styleUrl: './ui-builder.scss',
})
export class UiBuilder {
  protected readonly exportCss = EXPORT_CSS;
  protected readonly defs = BLOCK_DEFS;
  protected readonly blocks = signal<Block[]>(starter());
  protected readonly selectedId = signal<string | null>(null);
  protected readonly dropIndex = signal<number | null>(null);
  protected readonly draggingId = signal<string | null>(null);
  protected readonly exportTab = signal<'html' | 'css'>('html');
  protected readonly status = signal('');

  protected readonly selected = computed(
    () => this.blocks().find((b) => b.id === this.selectedId()) ?? null,
  );
  protected readonly selectedDef = computed(() => {
    const block = this.selected();
    return block ? defFor(block.type) : null;
  });
  protected readonly code = computed(() =>
    this.exportTab() === 'html' ? toHtml(this.blocks()) : EXPORT_CSS,
  );

  protected html(block: Block): string {
    return blockToHtml(block);
  }

  protected label(block: Block): string {
    return defFor(block.type).label;
  }

  protected add(type: BlockType, index = this.blocks().length): void {
    const block = createBlock(type);
    this.blocks.update((list) => insertAt(list, block, index));
    this.selectedId.set(block.id);
    this.status.set(`${defFor(type).label} added.`);
  }

  protected select(id: string): void {
    this.selectedId.set(id);
  }

  protected remove(block: Block): void {
    this.blocks.update((list) => removeBlock(list, block.id));
    if (this.selectedId() === block.id) this.selectedId.set(null);
    this.status.set(`${this.label(block)} removed.`);
  }

  protected shift(block: Block, delta: -1 | 1): void {
    const list = this.blocks();
    const from = list.findIndex((b) => b.id === block.id);
    const to = from + delta;
    if (to < 0 || to >= list.length) return;
    // moveBlock takes an insertion point, so moving down needs to land after the neighbour.
    this.blocks.set(moveBlock(list, block.id, delta > 0 ? to + 1 : to));
    this.status.set(`${this.label(block)} moved to position ${to + 1} of ${list.length}.`);
  }

  protected reset(): void {
    this.blocks.set(starter());
    this.selectedId.set(null);
    this.status.set('Canvas reset.');
  }

  protected clear(): void {
    this.blocks.set([]);
    this.selectedId.set(null);
    this.status.set('Canvas cleared.');
  }

  protected edit(field: BlockField, event: Event): void {
    const id = this.selectedId();
    const value = (event.target as HTMLInputElement).value;
    this.blocks.update((list) => list.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  }

  protected setTone(tone: Tone): void {
    const id = this.selectedId();
    this.blocks.update((list) => list.map((b) => (b.id === id ? { ...b, tone } : b)));
  }

  protected onKey(event: KeyboardEvent, block: Block): void {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.select(block.id);
    }
  }

  // Drag and drop (mouse). Keyboard and touch users get the move/remove buttons instead.
  protected dragNew(event: DragEvent, type: BlockType): void {
    event.dataTransfer?.setData('text/plain', `new:${type}`);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy';
  }

  protected dragMove(event: DragEvent, block: Block): void {
    event.dataTransfer?.setData('text/plain', `move:${block.id}`);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
    this.draggingId.set(block.id);
  }

  protected dragOverBlock(event: DragEvent, index: number): void {
    event.preventDefault();
    event.stopPropagation();
    const box = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.dropIndex.set(event.clientY < box.top + box.height / 2 ? index : index + 1);
  }

  protected dragOverCanvas(event: DragEvent): void {
    event.preventDefault();
    if (this.dropIndex() === null) this.dropIndex.set(this.blocks().length);
  }

  protected dragLeaveCanvas(event: DragEvent): void {
    const next = event.relatedTarget as Node | null;
    if (!next || !(event.currentTarget as HTMLElement).contains(next)) this.dropIndex.set(null);
  }

  protected drop(event: DragEvent): void {
    event.preventDefault();
    const payload = event.dataTransfer?.getData('text/plain') ?? '';
    const index = this.dropIndex() ?? this.blocks().length;
    if (payload.startsWith('new:')) {
      this.add(payload.slice(4) as BlockType, index);
    } else if (payload.startsWith('move:')) {
      this.blocks.update((list) => moveBlock(list, payload.slice(5), index));
      this.status.set('Block moved.');
    }
    this.dragEnd();
  }

  protected dragEnd(): void {
    this.dropIndex.set(null);
    this.draggingId.set(null);
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
