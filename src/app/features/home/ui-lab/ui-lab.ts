import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Reveal } from '../../../shared/directives/reveal';
import { ComponentGallery } from './component-gallery/component-gallery';
import { EasingEditor } from './easing-editor/easing-editor';
import { UiBuilder } from './ui-builder/ui-builder';

@Component({
  selector: 'app-ui-lab',
  imports: [Reveal, EasingEditor, ComponentGallery, UiBuilder],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ui-lab.html',
  styleUrl: './ui-lab.scss',
})
export class UiLab {
  protected readonly hue = signal(220);
  protected readonly radius = signal(12);
  protected readonly shadow = signal(16);

  protected readonly previewStyle = computed(
    () => `--lab-hue:${this.hue()};--lab-radius:${this.radius()}px;--lab-shadow:${this.shadow()}px`,
  );

  protected set(target: 'hue' | 'radius' | 'shadow', event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this[target].set(value);
  }

  protected reset(): void {
    this.hue.set(220);
    this.radius.set(12);
    this.shadow.set(16);
  }
}
