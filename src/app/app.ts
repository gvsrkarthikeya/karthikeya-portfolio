import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppearanceService } from './core/services/appearance.service';
import { PortfolioDataService } from './core/services/portfolio-data.service';
import { About } from './features/home/about/about';
import { Contact } from './features/home/contact/contact';
import { Education } from './features/home/education/education';
import { Experience } from './features/home/experience/experience';
import { Hero } from './features/home/hero/hero';
import { Projects } from './features/home/projects/projects';
import { Skills } from './features/home/skills/skills';
import { NavItem } from './models';
import { BackToTop } from './shared/components/back-to-top/back-to-top';
import { ScrollProgress } from './shared/components/scroll-progress/scroll-progress';
import { SiteFooter } from './shared/components/site-footer/site-footer';
import { StyleSelector } from './shared/components/style-selector/style-selector';
import { ThemeToggle } from './shared/components/theme-toggle/theme-toggle';
import { SiteHeader } from './shared/components/site-header/site-header';

@Component({
  imports: [
    SiteHeader,
    StyleSelector,
    ThemeToggle,
    Hero,
    About,
    Experience,
    Skills,
    Projects,
    Education,
    Contact,
    SiteFooter,
    BackToTop,
    ScrollProgress,
  ],
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly appearance = inject(AppearanceService);
  private readonly content = inject(PortfolioDataService).content;
  protected readonly profile = this.content.profile;
  protected readonly experience = this.content.experience;
  protected readonly skillGroups = this.content.skillGroups;
  protected readonly projects = this.content.projects;
  protected readonly education = this.content.education;
  protected readonly certifications = this.content.certifications;

  /** Add an entry here as each section ships. */
  protected readonly navItems: NavItem[] = [
    { label: 'About', fragment: 'about' },
    { label: 'Experience', fragment: 'experience' },
    { label: 'Skills', fragment: 'skills' },
    { label: 'Projects', fragment: 'projects' },
    { label: 'Education', fragment: 'education' },
    { label: 'Contact', fragment: 'contact' },
  ];
}
