import { TestBed } from '@angular/core/testing';
import { AppearanceService, APPEARANCE_STORAGE_KEY } from './appearance.service';

describe('AppearanceService', () => {
  const root = document.documentElement;

  function create(): AppearanceService {
    TestBed.resetTestingModule();
    return TestBed.inject(AppearanceService);
  }

  beforeEach(() => {
    localStorage.clear();
    root.removeAttribute('data-design');
    root.removeAttribute('data-bs-theme');
  });

  afterEach(() => vi.restoreAllMocks());

  it('defaults to minimalism and light and applies them to the root element', () => {
    const service = create();

    expect(service.designStyle()).toBe('minimalism');
    expect(service.colorTheme()).toBe('light');
    expect(root.getAttribute('data-design')).toBe('minimalism');
    expect(root.getAttribute('data-bs-theme')).toBe('light');
  });

  it('switches style and theme independently', () => {
    const service = create();

    service.setDesignStyle('bento');
    expect(service.colorTheme()).toBe('light');
    expect(root.getAttribute('data-design')).toBe('bento');

    service.setColorTheme('dark');
    expect(service.designStyle()).toBe('bento');
    expect(root.getAttribute('data-bs-theme')).toBe('dark');
  });

  it('toggles the color theme', () => {
    const service = create();

    service.toggleColorTheme();
    expect(service.colorTheme()).toBe('dark');
    service.toggleColorTheme();
    expect(service.colorTheme()).toBe('light');
  });

  it('persists changes and restores them in a new instance', () => {
    const first = create();
    first.setDesignStyle('glassmorphism');
    first.setColorTheme('dark');

    const second = create();

    expect(second.designStyle()).toBe('glassmorphism');
    expect(second.colorTheme()).toBe('dark');
    expect(root.getAttribute('data-design')).toBe('glassmorphism');
  });

  it('ignores invalid values passed to setters', () => {
    const service = create();

    service.setDesignStyle('nope' as never);
    service.setColorTheme('purple' as never);

    expect(service.designStyle()).toBe('minimalism');
    expect(service.colorTheme()).toBe('light');
  });

  it('falls back per field when stored values are invalid', () => {
    localStorage.setItem(
      APPEARANCE_STORAGE_KEY,
      JSON.stringify({ designStyle: 'bogus', colorTheme: 'dark' }),
    );

    const service = create();

    expect(service.designStyle()).toBe('minimalism');
    expect(service.colorTheme()).toBe('dark');
  });

  it('falls back to defaults for malformed stored JSON', () => {
    localStorage.setItem(APPEARANCE_STORAGE_KEY, '{not json');
    expect(create().designStyle()).toBe('minimalism');

    localStorage.setItem(APPEARANCE_STORAGE_KEY, 'null');
    expect(create().colorTheme()).toBe('light');
  });

  it('keeps working when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    const service = create();
    service.setColorTheme('dark');

    expect(service.colorTheme()).toBe('dark');
    expect(root.getAttribute('data-bs-theme')).toBe('dark');
  });
});
