import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { dateMask, priceMask, maskitoElement, parseDateMask, formatDateMask, parseNumberMask, formatNumberMask } from 'src/app/core/constants/mask.constants';
import { ApplicationValidators } from 'src/app/core/validators/url.validator';
import { GameService } from '../services/game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PlatformService } from '../services/platform.service';
import { Platform } from '../models/platform.type';
import { ToastController } from '@ionic/angular';
import { maskitoParseNumber, maskitoStringifyNumber } from '@maskito/kit';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.scss'],
  standalone: false,
})
export class GameFormComponent implements OnInit {

  dateMask = dateMask;
  priceMask = priceMask;
  maskitoElement = maskitoElement;

  gameForm: FormGroup = new FormGroup({
    title: new FormControl('', [
      Validators.required, Validators.minLength(3), Validators.maxLength(150)
    ]),
    image: new FormControl('', [
      Validators.required,
      ApplicationValidators.urlValidator
    ]),
    launchDate: new FormControl(''),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    category: new FormControl('', Validators.required),
    platforms: new FormControl('', Validators.required)
  });
  gameId!: number;
  platforms: Platform[] = []

  constructor(
    private gameService: GameService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private platformService: PlatformService,
    private toastController: ToastController
  ) {   // this.activatedRoute.snapshot.paramMap.get('gameId');
    const gameId = this.activatedRoute.snapshot.params['gameId'];
    if (gameId) {
      this.gameService.getById(gameId).subscribe({
        next: (game) => {
          if (game) {
            this.gameId = gameId;
            if (game.launchDate instanceof Date) {
              game.launchDate = formatDateMask(game.launchDate);
            }
            if (typeof game.launchDate === 'string') {
              game.launchDate = formatDateMask(parseDateMask(game.launchDate, 'yyyy/mm/dd'));
            }
            if (game.price && typeof game.price === 'number') {
              game.price = formatNumberMask(game.price);
            }
            this.gameForm.patchValue(game);
          }
        },
        error: (error) => {
          alert('Erro ao carregar o jogo com id ' + gameId)
          console.error(error);
        }
      });
    }
  }
  ngOnInit() {
    // this.platforms = this.platformService.getPlatforms();
    this.platformService.getPlatforms().subscribe({
      next: (data) => {
        console.log('platforms: ', data);
        this.platforms = data;
      },
      error: (error) => {
        alert('Erro ao carregar plataformas.');
        console.error(error)
      },
      // complete: () => { }
    });
  }

  compareWith(o1: Platform | null, o2: Platform | null): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }


  hasError(field: string, error: string) {
    const formControl = this.gameForm.get(field);
    return formControl?.touched && formControl?.errors?.[error]
  }

  save() {
    let { value } = this.gameForm;
    if (value.launchDate) {
      value.launchDate = parseDateMask(value.launchDate)
    }
    if (value.price) {
      value.price = parseNumberMask(value.price);
    }
    console.log(value);
    this.gameService.save({
      ...value,
      id: this.gameId
    }).subscribe({
      next: () => {
        this.toastController.create({
          message: 'Jogo salvo com sucesso!',
          duration: 3000,
        }).then(toast => toast.present());
        this.router.navigate(['/games']);
      },
      error: (error) => {
        alert('Erro ao salvar o jogo ' + value.title + '!');
        console.error(error);
      }
    });
  }
}
