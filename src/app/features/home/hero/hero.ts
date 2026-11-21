import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Profile, SocialLinkKind } from '../../../models';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  readonly profile = input.required<Profile>();

  protected readonly initials = computed(() => {
    const words = this.profile().displayName.trim().split(/\s+/);
    const first = words[0] ?? '';
    const last = words.length > 1 ? words[words.length - 1] : '';
    return (first.charAt(0) + last.charAt(0)).toUpperCase();
  });

  protected readonly photoFailed = signal(false);
  protected readonly photoUrl = computed(() =>
    this.photoFailed() ? undefined : this.profile().avatarUrl || undefined,
  );

  protected readonly emailUrl = computed(() => this.linkUrl('email'));
  protected readonly linkedinUrl = computed(() => this.linkUrl('linkedin'));

  protected readonly typed = signal('');

  private readonly phrases = [
    'Angular & React',
    'Micro-frontend architecture',
    'Accessible, responsive UIs',
    'AI-assisted workflows',
  ];

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        this.typed.set(this.phrases[0]);
        return;
      }
      let phrase = 0;
      let chars = 0;
      let deleting = false;
      let timer: ReturnType<typeof setTimeout>;
      const tick = (): void => {
        const text = this.phrases[phrase];
        chars += deleting ? -1 : 1;
        this.typed.set(text.slice(0, chars));
        let wait = deleting ? 35 : 70;
        if (!deleting && chars === text.length) {
          deleting = true;
          wait = 1600;
        } else if (deleting && chars === 0) {
          deleting = false;
          phrase = (phrase + 1) % this.phrases.length;
          wait = 300;
        }
        timer = setTimeout(tick, wait);
      };
      tick();
      destroyRef.onDestroy(() => clearTimeout(timer));
    });
  }

  private linkUrl(kind: SocialLinkKind): string | undefined {
    return this.profile().socialLinks.find((link) => link.kind === kind)?.url;
  }
}
