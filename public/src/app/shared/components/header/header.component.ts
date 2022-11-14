import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { isAuthenticated } from './../../../auth/state/auth.selector';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuthenticated: Observable<boolean> = of(false);
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.isAuthenticated = this.store.select(isAuthenticated);
  }

}
