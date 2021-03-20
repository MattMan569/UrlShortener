import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UrlService } from './url.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'client';
  form!: FormGroup;
  redirectUrl?: string;
  error?: string;

  constructor(private urlService: UrlService, private renderer: Renderer2) { }

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
    try {
      const response = await this.urlService.createUrl(this.form.controls.url.value, this.form.controls.slug.value);
      if (response instanceof HttpErrorResponse) {
        // TODO error handling
        this.error = response.message;
        console.error('error', this.error);
        return;
      }
      this.error = '';
      this.redirectUrl = response;
    } catch (error) {
      this.error = error;
    }
  }
}
