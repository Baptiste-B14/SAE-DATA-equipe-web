import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search-line',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './search-line.component.html',
  styleUrls: ['./search-line.component.scss']
})
export class SearchLineComponent implements OnInit, OnChanges, OnDestroy {
  @Input() formGroup!: FormGroup;
  @Input() searchLineId!: number;
  @Input() isFirst: boolean = false;
  @Input() isLast: boolean = false;
  @Input() column: string = '';
  @Input() operator: string = 'EQUALS';
  @Input() value: string = '';
  @Input() selectedTable: string = '';
  @Input() columns: string[] = [];

  @Output() onAdd = new EventEmitter<void>();
  @Output() onRemove = new EventEmitter<number>();
  @Output() onUpdate = new EventEmitter<any>();

  operators = [
    'EQUALS',
    'LIKE',
    'GT',
    'LT',
    'GTE',
    'LTE'
  ] as const;

  private destroy$ = new Subject<void>();
  private valueChanges$ = new Subject<string>();
  private columnChanges$ = new Subject<string>();
  private operatorChanges$ = new Subject<string>();

  constructor() {}

  ngOnInit() {
    // Setup debounced value changes
    this.valueChanges$.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.value = value;
      this.emitUpdate();
    });

    // Setup debounced column changes
    this.columnChanges$.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(column => {
      this.column = column;
      this.emitUpdate();
    });

    // Setup debounced operator changes
    this.operatorChanges$.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(operator => {
      this.operator = operator;
      this.emitUpdate();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columns'] && this.columns.length > 0 && !this.column) {
      this.column = this.columns[0];
      this.emitUpdate();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeOperator(newValue: string) {
    this.operatorChanges$.next(newValue);
  }

  updateColumn(newValue: string) {
    this.columnChanges$.next(newValue);
  }

  updateValue(newValue: string) {
    this.valueChanges$.next(newValue);
  }

  private emitUpdate() {
    this.onUpdate.emit({
      column: this.column,
      operator: this.operator,
      value: this.value
    });
  }

  addSearchLine() {
    this.onAdd.emit();
  }

  removeSearchLine() {
    this.onRemove.emit(this.searchLineId);
  }
}
