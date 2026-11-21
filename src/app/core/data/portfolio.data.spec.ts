import { PORTFOLIO_CONTENT } from './portfolio.data';

describe('PORTFOLIO_CONTENT', () => {
  it('uses the published profile photo as the avatar', () => {
    expect(PORTFOLIO_CONTENT.profile.avatarUrl).toBe('images/profile.webp');
  });
});
