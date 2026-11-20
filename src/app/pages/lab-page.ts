import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UiLab } from '../features/home/ui-lab/ui-lab';

@Component({
  imports: [UiLab],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<app-ui-lab />`,
})
export class LabPage {}
