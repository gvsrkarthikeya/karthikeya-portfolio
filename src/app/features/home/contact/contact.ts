import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Reveal } from '../../../shared/directives/reveal';
import { Profile } from '../../../models';
import { SocialLinks } from '../../../shared/components/social-links/social-links';

@Component({
  selector: 'app-contact',
  imports: [Reveal, SocialLinks],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  readonly profile = input.required<Profile>();
}
