import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PortfolioDataService } from './core/services/portfolio-data.service';
import { Hero } from './features/home/hero/hero';
import { NavItem } from './models';
import { SiteFooter } from './shared/components/site-footer/site-footer';
import { SiteHeader } from './shared/components/site-header/site-header';

@Component({
  imports: [SiteHeader, Hero, SiteFooter],
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly profile = inject(PortfolioDataService).content.profile;

  /** Add an entry here as each section ships. */
  protected readonly navItems: NavItem[] = [{ label: 'Home', fragment: 'home' }];
}
