import { Injectable } from '@angular/core';
import { Game } from '../models/game.type';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly API_URL = 'http://localhost:3000/games';

  constructor(private http: HttpClient) { }

  getById(gameId: string) {
    return this.http.get<Game>(`${this.API_URL}/${gameId}`);
  }

  getList() {
    return this.http.get<Game[]>(this.API_URL)
  }

  private add(game: Game) {
    return this.http.post<Game>(this.API_URL, game);
  }

  private update(game: Game) {
    return this.http.put<Game>(`${this.API_URL}/${game.id}`, game);
  }

  save(game: Game) {
    return game.id ? this.update(game) : this.add(game);
  }

  remove(game: Game) {
    return this.http.delete<Game>(this.API_URL + game.id)
  }
}
