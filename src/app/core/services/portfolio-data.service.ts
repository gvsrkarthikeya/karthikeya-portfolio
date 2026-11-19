import { Injectable } from '@angular/core';
import { PortfolioContent } from '../../models';
import { PORTFOLIO_CONTENT } from '../data/portfolio.data';

@Injectable({ providedIn: 'root' })
export class PortfolioDataService {
  readonly content: PortfolioContent = PORTFOLIO_CONTENT;
}
