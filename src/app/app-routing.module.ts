import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuizComponent } from './quiz/quiz.component'
import { QuizNewComponent } from './quiz-new/quiz-new.component'
import { QuizBigScreenComponent } from './quiz-big-screen/quiz-big-screen.component'

const routes: Routes = [
  { path: 'quizzes', component: QuizNewComponent },
  { path: 'quizzes/:id', component: QuizComponent },
  { path: 'quizzes/:id/big-screen', component: QuizBigScreenComponent },
  { path: '', redirectTo: '/quizzes', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
