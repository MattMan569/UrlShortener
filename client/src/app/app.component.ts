import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UrlService } from './url.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'client';
  form!: FormGroup;
  response?: any;

  constructor(private urlService: UrlService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      url: new FormControl(
        null, {
        validators: [
          Validators.required,
        ],
      }),
      slug: new FormControl(
        null, {
        validators: [
          Validators.pattern(/[\w\-]/i),
        ],
      }),
    });
  }

  async createUrl(): Promise<void> {
    this.response = await this.urlService.createUrl(this.form.controls.url.value, this.form.controls.slug.value);
  }
}
