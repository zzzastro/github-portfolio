import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SakuraBlossomComponent } from './sakura-blossom.component';

describe('SakuraBlossomComponent', () => {
  let component: SakuraBlossomComponent;
  let fixture: ComponentFixture<SakuraBlossomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SakuraBlossomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SakuraBlossomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
