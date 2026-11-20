import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { SkillGroup } from '../../../models';
import { Reveal } from '../../../shared/directives/reveal';

@Component({
  selector: 'app-skills',
  imports: [Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  readonly groups = input.required<SkillGroup[]>();
  protected readonly selected = signal<string | null>(null);

  protected readonly visibleGroups = computed(() => {
    const title = this.selected();
    return title ? this.groups().filter((g) => g.title === title) : this.groups();
  });

  protected select(title: string | null): void {
    this.selected.set(title);
  }
}
