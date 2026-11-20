import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  computed,
  inject,
  input,
} from '@angular/core';
import { GithubService } from '../../../core/services/github.service';
import { Reveal } from '../../../shared/directives/reveal';

@Component({
  selector: 'app-github-activity',
  imports: [Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './github-activity.html',
  styleUrl: './github-activity.scss',
})
export class GithubActivity {
  readonly profileUrl = input.required<string>();

  protected readonly github = inject(GithubService);
  protected readonly state = this.github.state;
  protected readonly username = computed(
    () => this.profileUrl().replace(/\/+$/, '').split('/').pop() ?? '',
  );

  constructor() {
    afterNextRender(() => void this.github.load(this.username()));
  }

  protected readonly languageColors = [
    'var(--color-primary)',
    'var(--color-accent)',
    '#e3a008',
    '#0e9f6e',
    '#d61f69',
    '#7e3af2',
  ];

  protected level(count: number): number {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 9) return 3;
    return 4;
  }

  protected dayLabel(date: string, count: number): string {
    const d = new Date(date + 'T00:00:00Z').toLocaleDateString('en', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
    return `${d}: ${count} commit${count === 1 ? '' : 's'}`;
  }

  protected weekTotal(days: { count: number }[], week: number): number {
    return days.slice(week * 7, week * 7 + 7).reduce((sum, d) => sum + d.count, 0);
  }

  protected weekLabel(start: string): string {
    const d = new Date(start + 'T00:00:00Z').toLocaleDateString('en', {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    });
    return `Week of ${d}`;
  }

  protected languageSummary(languages: { name: string; percent: number }[]): string {
    return languages.map((l) => `${l.name} ${l.percent}%`).join(', ');
  }

  protected since(iso: string): string {
    return iso ? new Date(iso).toLocaleDateString('en', { month: 'short', year: 'numeric' }) : '–';
  }

  protected retry(): void {
    void this.github.load(this.username());
  }

  protected ago(iso: string): string {
    const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
    if (days < 1) return 'today';
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  }
}
