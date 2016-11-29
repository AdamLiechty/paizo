import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-logquiz',
  template: `
    <p>
      logquiz Works!
    </p>
  `,
  styles: []
})
export class LogQuizComponent implements OnInit {
  paramsSub: any;
  id: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

}
