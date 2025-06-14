import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotinterfaceComponent } from './chatbotinterface.component';

describe('ChatbotinterfaceComponent', () => {
  let component: ChatbotinterfaceComponent;
  let fixture: ComponentFixture<ChatbotinterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatbotinterfaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatbotinterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
