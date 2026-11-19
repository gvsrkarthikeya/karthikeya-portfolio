import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Experience as ExperienceEntry } from '../../../models';
import { formatYearMonth } from '../../../shared/utils/format-year-month';

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience {
  readonly entries = input.required<ExperienceEntry[]>();

  protected dateRange(entry: ExperienceEntry): string {
    const end = entry.endDate ? formatYearMonth(entry.endDate) : 'Present';
    return `${formatYearMonth(entry.startDate)} – ${end}`;
  }
}
