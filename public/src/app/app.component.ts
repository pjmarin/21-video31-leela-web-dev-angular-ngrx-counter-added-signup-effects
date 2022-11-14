import { getErrorMessage, getLoading } from './store/Shared/shared.selector';
import { Observable, of } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ngrx-counter';
  showLoading: Observable<boolean> = of(false);
  errorMessage: Observable<string> = of('');
  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.showLoading = this.store.select(getLoading);
    this.errorMessage = this.store.select(getErrorMessage);
  }
}