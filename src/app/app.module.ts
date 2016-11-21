import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LogQuizComponent } from './log-quiz/log-quiz.component';
import { LogQuizNewComponent } from './log-quiz-new/log-quiz-new.component';
import { LogQuizBigScreenComponent } from './log-quiz-big-screen/log-quiz-big-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    LogQuizComponent,
    LogQuizNewComponent,
    LogQuizBigScreenComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
