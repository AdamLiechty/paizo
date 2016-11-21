/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LogQuizNewComponent } from './log-quiz-new.component';

describe('LogQuizNewComponent', () => {
  let component: LogQuizNewComponent;
  let fixture: ComponentFixture<LogQuizNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogQuizNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogQuizNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
