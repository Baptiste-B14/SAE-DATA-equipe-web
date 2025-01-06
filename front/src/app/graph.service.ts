import { Injectable } from '@angular/core';
import { MultipleData, SingleData } from './types';

/**
 * Nous n'avons pas eu le temps d'aborder le concept de service en Angular.
 *
 * Le but d'un service est de centraliser la logique réutilisable.
 * Nous allons appeler ce service dans chacun de nos composants de graphique pour faire le formatage des données.
 *
 *
 * Notez bien la façon dont on a défini le service :
 * Décorateur @Injectable
 * providedIn: 'root' : cela signifie que le service sera injecté dans le root de l'application,
 * Angular s'occupant de le rendre disponible partout dans l'application.
 *
 * On aura simplement à l'appeler dans nos constructeurs de composants
 */

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  /**
   * Pour les graphiques acceptant un seul jeu de données, si vous appelez cette fonction
   * avec un objet, elle le transformera en un tableau où chaque objet aura deux propriétés.
   *
   * Une propriété name représentant la clé et propriété value représentant une valeur.
   *
   * @example
   * ```ts
   * toSingleData({ a: 1, b: 2 }) -> [{ name: 'a', value: 1 }, { name: 'b', value: 2 }]
   * toSingleData({ satisfied: 10, unsatisfied: 20 }) -> [{ name: 'satisfied', value: 10 }, { name: 'unsatisfied', value: 20 }]
   * ```
   */
  toSingleData(data: Record<string, number>): SingleData {
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }

  /**
   *  Pour les graphiques acceptant plusieurs jeux de données (LineChart, StackedBarChart, etc.)
   *
   *  Chaque jeu de données est représenté par un objet de la forme { name: string, series: SingleData }
   *  où name est le nom de la série et series est un tableau de données.
   *
   *
   *  @example
   * ```ts
   * toMultipleData('Vaisseau 1', { satisfied: 1500, unsatisfied: 2500 }) -> [{ name: 'Vaisseau 1', series: [{ name: 'satisfied', value: 1500 }, { name: 'unsatisfied', value: 2500 }] }]
   * ```
   */
  toMultipleData(serie: string, data: any): MultipleData {
    return [
      {
        name: serie,
        series: this.toSingleData(data),
      },
    ];
  }

  /**
   * idem que sum, mais pour la moyenne.
   *
   * Il faudra déjà avoir extrait un tableau de nombres de vos données.
   */
  avg(arr: number[]): number {
    return this.sum(arr) / arr.length;
  }

  /**
   * On va être amené à faire pas mal de calculs sur les données, autant centraliser une fonction sum
   *
   * Remarquez que j'ai défini un tableau de nombres comme type, donc il faudra au préalable
   * trouver un moyen d'obtenir un tableau de nombres à partir de vos données.
   */
  sum(arr: number[]): number {
    return arr.reduce((acc, curr) => acc + curr, 0);
  }

  /**
   * En partant d'un tableau de données, on va grouper les éléments identiques et les compter.
   *
   * Notez que j'ai décidé d'utiliser un tableau de chaînes de caractères, donc il faudra au préalable
   * trouver un moyen d'obtenir un tableau de chaînes de caractères à partir de vos données.
   *
   * Le résultat en sortie est un "Record", qui est la représentation TypeScript d'un objet simple {}.
   *
   * Ce record aura pour clé une chaîne de caractères et pour valeur un nombre.
   * @example
   * ```ts
   * groupByUniqueValue(['a', 'a', 'b', 'c', 'c', 'c']) -> { a: 2, b: 1, c: 3 }
   * ```
   */
  groupByUniqueValue(arr: string[]): Record<string, number> {
    return arr.reduce<Record<string, number>>((acc, curr) => {
      // acc[curr] = (acc[curr] || 0) + 1; -- Cette syntaxe est équivalente à celle qui suit

      if (!acc[curr]) {
        acc[curr] = 0;
      }
      acc[curr]++;

      // la fonction reduce demande à ce que vous retourniez l'accumulateur à chaque itération
      return acc;
    }, {});
  }
}
