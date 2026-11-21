import { PORTFOLIO_CONTENT } from './portfolio.data';

describe('PORTFOLIO_CONTENT', () => {
  it('uses the published profile photo as the avatar', () => {
    expect(PORTFOLIO_CONTENT.profile.avatarUrl).toBe('images/profile.webp');
  });

  it('lists Prokarma Softech under its current name, Concentrix Catalyst', () => {
    const entry = PORTFOLIO_CONTENT.experience.find((e) => e.startDate === '2020-12');

    expect(entry?.company).toBe('Concentrix Catalyst');
    expect(entry?.formerName).toBe('Prokarma Softech');
  });
});
