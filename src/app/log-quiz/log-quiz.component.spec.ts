/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LogQuizComponent } from './log-quiz.component';

describe('LogQuizComponent', () => {
  let component: LogQuizComponent;
  let fixture: ComponentFixture<LogQuizComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogQuizComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
