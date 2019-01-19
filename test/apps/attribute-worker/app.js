/* global document */
import {Deck} from '@deck.gl/core';
import * as Layers from '@deck.gl/layers';
import createWorker from 'webworkify-webpack';

import TEST_CASES from './test-cases';

const deck = new Deck({
  initialViewState: {
    latitude: 37.78,
    longitude: -122.4,
    zoom: 12
  },
  controller: true
});

const worker = createWorker(require.resolve('./worker.js'));
worker.onmessage = onDataLoaded;

renderButtons();

// Buttons to select test cases
function renderButtons() {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.margin = '10px';
  document.body.append(container);

  Object.keys(TEST_CASES).forEach(id => {
    const button = document.createElement('button');
    button.innerHTML = id;
    button.onclick = () => loadData(id);
    container.append(button);
  });
}

// Request data from worker
function loadData(id) {
  worker.postMessage({id});
}

// Update layers with data generated by worker
function onDataLoaded(evt) {
  const layerData = evt.data;
  const LayerType = Layers[layerData.type] || Layers[`_${layerData.type}`];
  deck.setProps({
    layers: [
      new LayerType(layerData, {
        pickable: true,
        onClick: console.log // eslint-disable-line
      })
    ]
  });
}
