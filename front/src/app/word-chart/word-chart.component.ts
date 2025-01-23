import { Component } from '@angular/core';
import { LineChartModule } from "@swimlane/ngx-charts";
import { WordchartService } from "../services/wordchart.service";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-word-chart',
  standalone: true,
  imports: [LineChartModule, ReactiveFormsModule],
  templateUrl: './word-chart.component.html',
  styleUrl: './word-chart.component.scss'
})
export class WordChartComponent {
  chartData: any[] = [];
  view: [number, number] = [700, 400]; // Taille fixe du graphique
  form: FormGroup;

  constructor(private fb: FormBuilder, private wordchartService: WordchartService) {
    this.form = this.fb.group({
      words: this.fb.array([])
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
    const wordsList = this.words.value
      .filter((word: string) => word.trim() !== '') // Retirer les mots vides
      .map((word: string) => word.toLowerCase());  // Convertir en minuscule

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
