import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Project } from '../../../models';

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  readonly projects = input.required<Project[]>();
}
