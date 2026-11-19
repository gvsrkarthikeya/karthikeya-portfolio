import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ColorTheme } from '../../../models';

@Component({
  selector: 'app-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
})
export class ThemeToggle {
  readonly theme = input.required<ColorTheme>();
  readonly toggled = output<void>();
}
