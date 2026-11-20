import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioDataService } from '../core/services/portfolio-data.service';
import { About } from '../features/home/about/about';
import { Contact } from '../features/home/contact/contact';
import { Education } from '../features/home/education/education';
import { Experience } from '../features/home/experience/experience';
import { Explore } from '../features/home/explore/explore';
import { Hero } from '../features/home/hero/hero';
import { Projects } from '../features/home/projects/projects';
import { Skills } from '../features/home/skills/skills';

@Component({
  imports: [Hero, About, Experience, Skills, Projects, Explore, Education, Contact],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-hero [profile]="content.profile" />
    <app-about [experience]="content.experience" [skillGroups]="content.skillGroups" />
    <app-experience [entries]="content.experience" />
    <app-skills [groups]="content.skillGroups" />
    <app-projects [projects]="content.projects" />
    <app-explore />
    <app-education [entries]="content.education" [certifications]="content.certifications" />
    <app-contact [profile]="content.profile" />
  `,
})
export class HomePage {
  protected readonly content = inject(PortfolioDataService).content;
}
