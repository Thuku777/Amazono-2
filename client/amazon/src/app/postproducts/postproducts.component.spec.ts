import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostproductsComponent } from './postproducts.component';

describe('PostproductsComponent', () => {
  let component: PostproductsComponent;
  let fixture: ComponentFixture<PostproductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostproductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
