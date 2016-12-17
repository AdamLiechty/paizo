import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { AppRoutingModule } from './app-routing.module'

import { AppComponent } from './app.component'
import { QuizComponent } from './quiz/quiz.component'
import { QuizNewComponent } from './quiz-new/quiz-new.component'
import { QuizBigScreenComponent } from './quiz-big-screen/quiz-big-screen.component'
import { WebSocketService } from './web-socket.service'

@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    QuizNewComponent,
    QuizBigScreenComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
