import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SocialLink } from '../../../models';

@Component({
  selector: 'app-social-links',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './social-links.html',
  styleUrl: './social-links.scss',
})
export class SocialLinks {
  readonly links = input.required<SocialLink[]>();

  protected isExternal(link: SocialLink): boolean {
    return /^https?:\/\//.test(link.url);
  }
}
