import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Experience, SkillGroup } from '../../../models';
import { formatYearMonth } from '../../../shared/utils/format-year-month';

interface Fact {
  label: string;
  value: string;
}

const CORE_STACK_SIZE = 3;

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  readonly experience = input.required<Experience[]>();
  readonly skillGroups = input.required<SkillGroup[]>();

  protected readonly facts = computed<Fact[]>(() => {
    const roles = this.experience();
    const current = roles[0];
    const earliest = roles.reduce<string | undefined>(
      (min, role) => (min === undefined || role.startDate < min ? role.startDate : min),
      undefined,
    );
    const stack = (this.skillGroups()[0]?.skills ?? []).slice(0, CORE_STACK_SIZE);
    const facts: Fact[] = [];

    if (current) {
      facts.push({ label: 'Current role', value: `${current.role} at ${current.company}` });
    }
    if (earliest) {
      facts.push({ label: 'Working since', value: formatYearMonth(earliest) });
    }
    if (roles.length) {
      facts.push({ label: 'Companies', value: roles.map((r) => r.company).join(', ') });
    }
    if (stack.length) {
      facts.push({ label: 'Core stack', value: stack.map((s) => s.name).join(', ') });
    }
    return facts;
  });
}
