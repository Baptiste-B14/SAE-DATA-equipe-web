import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {LineChartModule} from "@swimlane/ngx-charts";
import { WordchartService} from "../services/wordchart.service";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-word-chart',
  standalone: true,
  imports: [LineChartModule, ReactiveFormsModule],
  templateUrl: './word-chart.component.html',
  styleUrl: './word-chart.component.scss'
})
export class WordChartComponent{
  //@Input() words: string[] = [];
  chartData: any[] = [];
  view: [number, number] = [700, 400]; // Size of the chart
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };
//   form: FormGroup;
//
//   constructor(private wordchartService: WordchartService, private cdr: ChangeDetectorRef,  private sanitizer: DomSanitizer, private fb: FormBuilder) {
//     this.form = this.fb.group({
//       words: this.fb.array([])  // Initialisation d'un FormArray vide
//     });
//   }
//
//
//   ngOnInit() {
//     this.loadChartData();
//   }
//
//   loadChartData() {
//     this.wordchartService.getWordchartData(this.words).subscribe((data) => {
//       this.chartData = this.formatData(data);
//     });
//   }
//
//   formatData(rawData: any): any[] {
//     const { data , years } = rawData;
//    return Object.keys(data).map((key) => {
//       return {
//         name: key,
//         series: years.map((year: any, index: string | number) => ({
//           name: year,
//           value: data[key][index],
//         })),
//       };
//     });
//
//
// /*
//     return Object.keys(rawData).map((year) => ({
//       name: year,
//       series: Object.entries(rawData[year]).map(([word, value]) => ({
//         name: word,
//         value,
//       })),
//     }));
//     */
//
//   }
//
//
//
//
//   // Getter pour accéder au FormArray
//   get words(): FormArray {
//     return this.form.get('words') as FormArray;
//   }
//
//   // Ajouter un champ texte
//   addWord(): void {
//     this.words.push(this.fb.control(''));
//   }
//
//   // Supprimer un champ texte
//   removeWord(index: number): void {
//     this.words.removeAt(index);
//   }
//
//   // Méthode pour envoyer les données au graphique
//   updateChart(): void {
//     const wordList = this.words.value;
//     console.log('Mots à utiliser pour le graphique :', wordList);
//     // Appelle la logique de mise à jour du graphique avec wordList
//   }



  form: FormGroup;
  //chartData: any[] = [];  // Données formatées pour le graphique

  constructor(private fb: FormBuilder, private wordchartService: WordchartService) {
    this.form = this.fb.group({
      words: this.fb.array([])  // Initialisation d'un FormArray vide
    });
  }

  ngOnInit() {
    this.addWord();
  }

  get words(): FormArray {
    return this.form.get('words') as FormArray;
  }

  addWord(): void {
    this.words.push(this.fb.control(''));
  }

  removeWord(index: number): void {
    if (this.words.length > 1) {
      this.words.removeAt(index);
    } else {
      alert('Il doit y avoir au moins un mot.');
    }
  }

  loadChartData(): void {
    const wordsList = this.words.value.filter((word: string) => word.trim() !== '');

    if (wordsList.length === 0) {
      alert('Veuillez entrer au moins un mot.');
      return;
    }

    this.wordchartService.getWordchartData(wordsList).subscribe(
      (data) => {
        this.chartData = this.formatData(data);
        console.log('Données formatées pour le graphique :', this.chartData);
      },
      (error) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }

  formatData(rawData: any): any[] {
    const { data, years } = rawData;
    return Object.keys(data).map((key) => {
      return {
        name: key,
        series: years.map((year: any, index: string | number) => ({
          name: year,
          value: data[key][index],
        }))
      };
    });
  }
}
