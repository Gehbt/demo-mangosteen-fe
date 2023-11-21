//? createSignal ?
// interface SL<in out T> {
//   get: () => T;
//   set: (value: T) => void;
// }
type GetterExtend<out T> = () => T;
type SetterSuper<in T> = (value: T) => void;
export const useSL = <T>(value: T) => {
  let store_value = value;
  const save: SetterSuper<T> = (newValue: T) => {
    store_value = newValue;
  };
  const load: GetterExtend<T> = () => {
    return store_value;
  };
  return {
    save,
    load,
  };
};
