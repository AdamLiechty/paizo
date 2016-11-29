import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogQuizComponent } from './log-quiz/log-quiz.component'
import { LogQuizNewComponent } from './log-quiz-new/log-quiz-new.component'
import { LogQuizBigScreenComponent } from './log-quiz-big-screen/log-quiz-big-screen.component'

const routes: Routes = [
  { path: 'log-quizzes', component: LogQuizNewComponent },
  { path: 'log-quizzes/:id', component: LogQuizComponent },
  { path: 'log-quizzes/:id/big-screen', component: LogQuizBigScreenComponent },
  { path: '', redirectTo: '/log-quizzes', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
