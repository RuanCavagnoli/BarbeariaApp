import { Component, OnInit } from '@angular/core';
import { Game } from './models/game.type';
import { GameService } from './services/game.service';
import { AlertController, ToastController, ViewDidEnter, ViewDidLeave, ViewWillEnter, ViewWillLeave } from '@ionic/angular';


@Component({
  selector: 'app-games',
  templateUrl: './games.page.html',
  styleUrls: ['./games.page.scss'],
  standalone: false,
})
export class GamesPage implements OnInit, ViewWillEnter,
  ViewDidEnter, ViewWillLeave, ViewDidLeave {

  gamesList: Game[] = [];

  constructor(
    private gameService: GameService,
    private alertController: AlertController,
    private toastController: ToastController,
  ) { }

  ionViewDidLeave(): void {
    console.log('ionViewDidLeave');
  }
  ionViewWillLeave(): void {
    console.log('ionViewWillLeave');
  }
  ionViewDidEnter(): void {
    console.log('ionViewDidEnter');
  }
  ionViewWillEnter(): void {
    console.log('ionViewWillEnter');

    this.gameService.getList().subscribe({
      next: (response) => {
        this.gamesList = response;
      },
      error: (error) => {
        alert('Erro ao carregar lista de jogos');
        console.error(error);
      }
    });
  }

  ngOnInit() { }

  remove(game: Game) {
    this.alertController.create({
      header: 'Exclusão',
      message: `Confirma a exclusão do jogo ${game.title}?`,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.gameService.remove(game).subscribe({
              next: (response) => {
                this.gamesList = this.gamesList.filter(g => g.id !== response.id);
                this.toastController.create({
                  message: `Jogo ${game.title} excluído com sucesso!`,
                  duration: 3000,
                  color: 'secondary',
                  keyboardClose: true,
                }).then(toast => toast.present());
              },
              error: (error) => {
                alert('Erro ao excluir o jogo ' + game.title);
                console.error(error);
              }
            });
            // this.gamesList = this.gameService.getList();
          }
        },
        'Não'
      ]
    }).then(alert => alert.present());
  }

}
