import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkillGroup } from '../../../models';

@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  readonly groups = input.required<SkillGroup[]>();
}
