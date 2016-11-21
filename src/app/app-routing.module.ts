import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogQuizComponent } from './log-quiz/log-quiz.component'
import { LogQuizNewComponent } from './log-quiz-new/log-quiz-new.component'

const routes: Routes = [
  { path: 'log-quiz', component: LogQuizNewComponent },
  { path: 'log-quiz/:id', component: LogQuizComponent },
  { path: '', redirectTo: '/log-quiz/foo', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
