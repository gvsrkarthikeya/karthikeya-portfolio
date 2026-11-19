import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioDataService } from './core/services/portfolio-data.service';
import { About } from './features/home/about/about';
import { Contact } from './features/home/contact/contact';
import { Education } from './features/home/education/education';
import { Experience } from './features/home/experience/experience';
import { Hero } from './features/home/hero/hero';
import { Projects } from './features/home/projects/projects';
import { Skills } from './features/home/skills/skills';
import { NavItem } from './models';
import { SiteFooter } from './shared/components/site-footer/site-footer';
import { SiteHeader } from './shared/components/site-header/site-header';

@Component({
  imports: [SiteHeader, Hero, About, Experience, Skills, Projects, Education, Contact, SiteFooter],
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly content = inject(PortfolioDataService).content;
  protected readonly profile = this.content.profile;
  protected readonly experience = this.content.experience;
  protected readonly skillGroups = this.content.skillGroups;
  protected readonly projects = this.content.projects;
  protected readonly education = this.content.education;
  protected readonly certifications = this.content.certifications;

  /** Add an entry here as each section ships. */
  protected readonly navItems: NavItem[] = [
    { label: 'Home', fragment: 'home' },
    { label: 'About', fragment: 'about' },
    { label: 'Experience', fragment: 'experience' },
    { label: 'Skills', fragment: 'skills' },
    { label: 'Projects', fragment: 'projects' },
    { label: 'Education', fragment: 'education' },
    { label: 'Contact', fragment: 'contact' },
  ];
}
