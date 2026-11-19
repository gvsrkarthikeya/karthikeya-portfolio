import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DESIGN_STYLES, DesignStyle, isDesignStyle } from '../../../models';

const LABELS: Record<DesignStyle, string> = {
  minimalism: 'Minimalism',
  flat: 'Flat',
  material: 'Material',
  glassmorphism: 'Glassmorphism',
  neumorphism: 'Neumorphism',
  neubrutalism: 'Neubrutalism',
  skeuomorphism: 'Skeuomorphism',
  bento: 'Bento Grid',
};

@Component({
  selector: 'app-style-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './style-selector.html',
  styleUrl: './style-selector.scss',
})
export class StyleSelector {
  readonly style = input.required<DesignStyle>();
  readonly changed = output<DesignStyle>();

  protected readonly options = DESIGN_STYLES.map((value) => ({ value, label: LABELS[value] }));

  protected onChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (isDesignStyle(value)) {
      this.changed.emit(value);
    }
  }
}
