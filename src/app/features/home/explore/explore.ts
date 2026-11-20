import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Reveal } from '../../../shared/directives/reveal';

@Component({
  selector: 'app-explore',
  imports: [RouterLink, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './explore.html',
  styleUrl: './explore.scss',
})
export class Explore {}
