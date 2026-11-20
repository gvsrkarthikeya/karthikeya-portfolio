import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioDataService } from '../core/services/portfolio-data.service';
import { GithubActivity } from '../features/home/github-activity/github-activity';

@Component({
  imports: [GithubActivity],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (githubUrl; as url) {
      <app-github-activity [profileUrl]="url" />
    }
  `,
})
export class GithubPage {
  protected readonly githubUrl = inject(PortfolioDataService).content.profile.socialLinks.find(
    (link) => link.kind === 'github',
  )?.url;
}
