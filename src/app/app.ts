import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommandPaletteService } from './core/services/command-palette.service';
import { AppearanceService } from './core/services/appearance.service';
import { PortfolioDataService } from './core/services/portfolio-data.service';
import { About } from './features/home/about/about';
import { Contact } from './features/home/contact/contact';
import { Education } from './features/home/education/education';
import { Experience } from './features/home/experience/experience';
import { Hero } from './features/home/hero/hero';
import { Projects } from './features/home/projects/projects';
import { GithubActivity } from './features/home/github-activity/github-activity';
import { UiLab } from './features/home/ui-lab/ui-lab';
import { Skills } from './features/home/skills/skills';
import { NavItem } from './models';
import { BackToTop } from './shared/components/back-to-top/back-to-top';
import { ScrollProgress } from './shared/components/scroll-progress/scroll-progress';
import { CommandPalette } from './shared/components/command-palette/command-palette';
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
    UiLab,
    GithubActivity,
    Education,
    Contact,
    SiteFooter,
    BackToTop,
    ScrollProgress,
    CommandPalette,
  ],
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly appearance = inject(AppearanceService);
  protected readonly palette = inject(CommandPaletteService);
  private readonly content = inject(PortfolioDataService).content;
  protected readonly profile = this.content.profile;
  protected readonly experience = this.content.experience;
  protected readonly skillGroups = this.content.skillGroups;
  protected readonly projects = this.content.projects;
  protected readonly education = this.content.education;
  protected readonly certifications = this.content.certifications;

  protected readonly githubUrl = this.profile.socialLinks.find((link) => link.kind === 'github')
    ?.url;

  protected readonly shortcut = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K';

  protected toggleTheme(): void {
    const active = document.activeElement;
    const box = active instanceof HTMLElement ? active.getBoundingClientRect() : undefined;
    this.appearance.toggleColorTheme(
      box ? { x: box.left + box.width / 2, y: box.top + box.height / 2 } : undefined,
    );
  }

  /** Add an entry here as each section ships. */
  protected readonly navItems: NavItem[] = [
    { label: 'About', fragment: 'about' },
    { label: 'Experience', fragment: 'experience' },
    { label: 'Skills', fragment: 'skills' },
    { label: 'Projects', fragment: 'projects' },
    { label: 'UI Lab', fragment: 'ui-lab' },
    { label: 'Education', fragment: 'education' },
    { label: 'Contact', fragment: 'contact' },
  ];
}
