import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SocialLink } from '../../../models';
import { SocialLinks } from '../social-links/social-links';

@Component({
  selector: 'app-site-footer',
  imports: [SocialLinks],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './site-footer.html',
})
export class SiteFooter {
  readonly ownerName = input.required<string>();
  readonly links = input.required<SocialLink[]>();

  protected readonly year = new Date().getFullYear();
}
