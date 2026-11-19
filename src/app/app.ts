import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioDataService } from './core/services/portfolio-data.service';
import { About } from './features/home/about/about';
import { Experience } from './features/home/experience/experience';
import { Hero } from './features/home/hero/hero';
import { Skills } from './features/home/skills/skills';
import { NavItem } from './models';
import { SiteFooter } from './shared/components/site-footer/site-footer';
import { SiteHeader } from './shared/components/site-header/site-header';

@Component({
  imports: [SiteHeader, Hero, About, Experience, Skills, SiteFooter],
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

  /** Add an entry here as each section ships. */
  protected readonly navItems: NavItem[] = [
    { label: 'Home', fragment: 'home' },
    { label: 'About', fragment: 'about' },
    { label: 'Experience', fragment: 'experience' },
    { label: 'Skills', fragment: 'skills' },
  ];
}
