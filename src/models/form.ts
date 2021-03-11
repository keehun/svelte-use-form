import type { ErrorMap } from "./errorMap";
import { FormControl } from "./formControl";
import type { FormProperties } from "./formProperties";
import type { Validator } from "./validator";

export class Form {
  [formControlName: string]: FormControl;

  // @ts-expect-error - Due to index signature
  get valid(): boolean {
    let valid = true;
    this.forEachFormControl((formControl) => {
      if (!formControl.valid) valid = false;
    });
    return valid;
  }

  // @ts-expect-error - Due to index signature
  get touched(): boolean {
    let touched = true;
    this.forEachFormControl((formControl) => {
      if (!formControl.touched) touched = false;
    });
    return touched;
  }

  // @ts-expect-error - Due to index signature
  get values(): { [formControlName: string]: string } {
    let values = {};
    this.forEachFormControl((formControl, key) => {
      values[key] = formControl.value;
    });

    return values;
  }

  constructor(initialData: FormProperties) {
    for (const [k, v] of Object.entries(initialData ?? {})) {
      this.addFormControl(k, v.initial, v.validators, v.errorMap);
    }
  }

  // @ts-expect-error - Due to index signature
  addFormControl(
    name: string,
    initial: string,
    validators: Validator[],
    errorMap: ErrorMap
  ) {
    this[name] = new FormControl(
      initial ?? "",
      validators ?? [],
      errorMap ?? {},
      () => this
    );
  }

  // @ts-expect-error - Due to index signature
  private forEachFormControl(
    callback: (formControl: FormControl, key?: string) => void
  ) {
    for (const [key, value] of Object.entries(this)) {
      if (value instanceof FormControl) {
        callback(value, key);
      }
    }
  }
}