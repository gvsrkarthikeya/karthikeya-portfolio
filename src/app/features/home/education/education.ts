import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Reveal } from '../../../shared/directives/reveal';
import { Certification, Education as EducationEntry } from '../../../models';

@Component({
  imports: [Reveal],
  selector: 'app-education',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './education.html',
  styleUrl: './education.scss',
})
export class Education {
  readonly entries = input.required<EducationEntry[]>();
  readonly certifications = input<Certification[]>([]);
}
