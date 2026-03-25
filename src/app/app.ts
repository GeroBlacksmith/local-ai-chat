import { CommonModule, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

const HOST_URL = 'http://localhost';
const PORT = '3000';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'chat';
  prompt = '';
  messages: Message[] = [];
  isLoading = false;
  response = '';
  constructor(private http: HttpClient) {}

  sendPrompt() {
    if (!this.prompt.trim()) return;

    this.isLoading = true;
    this.messages.push({ text: this.prompt, sender: 'user' });

    this.http
      .post(`${HOST_URL}:${PORT}/ask`, {
        question: this.prompt,
      })
      .subscribe({
        next: (res: any) => {
          this.messages.push({ text: res.answer, sender: 'bot' });
          this.prompt = '';
          this.isLoading = false;
        },
        error: (err) => {
          this.messages.push({
            text: 'Error al conectar con el modelo.',
            sender: 'bot',
          });
          this.isLoading = false;
        },
      });
  }
}
