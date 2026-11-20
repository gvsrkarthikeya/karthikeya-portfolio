import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Tilt } from '../../../shared/directives/tilt';
import { Reveal } from '../../../shared/directives/reveal';
import { Project } from '../../../models';

@Component({
  imports: [Reveal, Tilt],
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  readonly projects = input.required<Project[]>();
}
