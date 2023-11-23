import {component} from './lib/components';
import {computed, signal} from './lib/signals';

export const counter = component<'span'>(h => {
  const count = signal(0);
  const doubleCount = computed(
      (count) => count * 2,
      count
  );

  return h`<span 
    class="test test-2 test-25 toto-${count} " 
    id="toto"
  >
      ${count}
      ${doubleCount}
      ${12}
      ${{ get value() {return 'tralala'} }}
      ${{ value: 'tralala' }}
      ${{ value: () => 'tilili' }}
  </span>`
}, 'counter');

export function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1))
  setCounter(0)
}
