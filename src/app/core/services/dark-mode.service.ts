import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  darkModeSignal = signal<string>('light');

  constructor() { }

  updateDarkMode() {
    this.darkModeSignal.update((value) => (value === "dark" ? "light" : "dark" ));
  }
}
