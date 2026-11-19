import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
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

  protected readonly emailUrl = computed(() => this.linkUrl('email'));
  protected readonly linkedinUrl = computed(() => this.linkUrl('linkedin'));

  private linkUrl(kind: SocialLinkKind): string | undefined {
    return this.profile().socialLinks.find((link) => link.kind === kind)?.url;
  }
}
