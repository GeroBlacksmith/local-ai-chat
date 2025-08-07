import { CommonModule, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

const HOST_URL = "http://192.168.1.44";
const PORT = "3000";
const MODEL = 'gemma3:4b-it-qat';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'chat';
  prompt = '';
  messages: Message[] = [];
  isLoading = false;
  response = "";
  constructor(private http: HttpClient) { }

  model_selected = MODEL;
  askOllama() {
    this.http.post(`${HOST_URL}:${PORT}/api/ask-ollama`, {
      prompt: this.prompt, model: this.model_selected,
      stream: true
    })
      .subscribe((res: any) => {
        this.response = res.response;
      });
  }

  sendPrompt() {
    if (!this.prompt.trim()) return;

    this.isLoading = true;
    this.messages.push({ text: this.prompt, sender: 'user' });

    this.http.post(`${HOST_URL}:${PORT}/api/ask-ollama`, {
      prompt: this.prompt, model: this.model_selected,
      stream: true
    })
      .subscribe({
        next: (res: any) => {
          this.messages.push({ text: res.response, sender: 'bot' });
          this.prompt = '';
          this.isLoading = false;
        },
        error: (err) => {
          this.messages.push({ text: 'Error al conectar con el modelo.', sender: 'bot' });
          this.isLoading = false;
        }
      });
  }
}
