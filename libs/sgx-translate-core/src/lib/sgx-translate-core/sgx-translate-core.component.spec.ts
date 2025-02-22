import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SgxTranslateCoreComponent } from './sgx-translate-core.component';

describe('SgxTranslateCoreComponent', () => {
  let component: SgxTranslateCoreComponent;
  let fixture: ComponentFixture<SgxTranslateCoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgxTranslateCoreComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SgxTranslateCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
