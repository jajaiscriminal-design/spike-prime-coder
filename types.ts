export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface SpikeCodeResponse {
  code: string;
  explanation: string;
}
