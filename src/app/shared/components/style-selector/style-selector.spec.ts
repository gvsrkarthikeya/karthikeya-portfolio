import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DESIGN_STYLES } from '../../../models';
import { StyleSelector } from './style-selector';

describe('StyleSelector', () => {
  let fixture: ComponentFixture<StyleSelector>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(StyleSelector);
    fixture.componentRef.setInput('style', 'flat');
    await fixture.whenStable();
  });

  function select(): HTMLSelectElement {
    return (fixture.nativeElement as HTMLElement).querySelector('select')!;
  }

  it('has an accessible label', () => {
    const id = select().id;
    const label = (fixture.nativeElement as HTMLElement).querySelector(`label[for="${id}"]`);

    expect(label?.textContent).toContain('Design style');
  });

  it('lists every design style and selects the current one', () => {
    const values = Array.from(select().options).map((o) => o.value);

    expect(values).toEqual([...DESIGN_STYLES]);
    expect(select().value).toBe('flat');
  });

  it('emits the chosen style', () => {
    const spy = vi.fn();
    fixture.componentInstance.changed.subscribe(spy);

    select().value = 'bento';
    select().dispatchEvent(new Event('change'));

    expect(spy).toHaveBeenCalledWith('bento');
  });

  it('ignores unknown values', () => {
    const spy = vi.fn();
    fixture.componentInstance.changed.subscribe(spy);
    const option = document.createElement('option');
    option.value = 'zzz';
    select().appendChild(option);

    select().value = 'zzz';
    select().dispatchEvent(new Event('change'));

    expect(spy).not.toHaveBeenCalled();
  });
});
