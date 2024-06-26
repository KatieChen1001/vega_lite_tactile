import vegaEmbed from "vega-embed";
import { modifySvg } from './modules/modifySvg/chartModifier';
import './style.css';
import { elaborateTVLSpec } from "./modules/modifySpec/elaborateSpec";
import { mergeSpec } from "./modules/modifySpec/mergeSpec";
import { selectDefaultSpec } from "./modules/modifySpec/selectDefault";
import { updateDefault } from "./modules/modifySpec/updateDefault";
import { terminateWorker } from "./modules/braille/translateBraille";
import * as monaco from 'monaco-editor';
import { initSvgPatterns } from "./modules/texture/initializeTexture";


document.addEventListener('DOMContentLoaded', () => {

  const submitButton = document.getElementById('render') as HTMLButtonElement;
  const downloadButton = document.getElementById('download') as HTMLButtonElement;
  // const downloadButtonPNG = document.getElementById('downloadPNG') as HTMLButtonElement;
  const editorContainer = document.getElementById('editorContainer') as HTMLDivElement;


  let userTVLSpec: any = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "Stock prices of 5 Tech Companies over Time.",
    "data": {
      "url": "https://raw.githubusercontent.com/vega/vega-datasets/main/data/stocks.csv"
    },
    "title": "Stock prices of 5 Tech Companies over Time.",
    "mark": {
      "type": "line"
    },
    "encoding": {
      "x": {
        "timeUnit": "year",
        "field": "date"
      },
      "y": {
        "aggregate": "mean",
        "field": "price",
        "type": "quantitative"
      },
      "strokeDash": {
        "field": "symbol",
        "type": "nominal"
      }
    },
    "width": 300,
    "config": {
      "legend": {
        "orient": "right"
      }
    }
  }






  // Initialize Monaco Editor
  const editor = monaco.editor.create(editorContainer, {
    value: JSON.stringify(userTVLSpec, null, 2), // Initial value set to userTVLSpec
    language: 'json',
    theme: 'vs-light',
    lineNumbers: 'on',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
  });

  // Listen for editor changes and update the input value
  editor.onDidChangeModelContent(() => {
    const editorValue = editor.getValue();
    // parse and validate the JSON as needed
    try {
      JSON.parse(editorValue);
    } catch (error) {
      // Handle JSON parsing errors, perhaps show a message in the UI
      console.error('Invalid JSON:', error);
    }
  });

  // function to render vega-lite spec
  function renderVegaLiteChart(spec: any) {
    // make a copy of the spec and call it vega-lite spec
    let VLSpec = JSON.parse(JSON.stringify(spec));
    if (VLSpec.encoding.texture) {
      VLSpec.encoding.color = VLSpec.encoding.texture;
      delete VLSpec.encoding.texture;
    }
    // VLSpec.encoding.color.scale.range exists 
    if (VLSpec.encoding.color && VLSpec.encoding.color.scale && VLSpec.encoding.color.scale.range) {
      delete VLSpec.encoding.color.scale.range;
    }
    vegaEmbed("#visual", VLSpec, { renderer: "svg" }).then(result => { }).catch(error => console.error(error));
  }

  function renderTactileChart(spec: any) {
    initSvgPatterns();
    let TVLSpec = JSON.parse(JSON.stringify(spec));
    if (TVLSpec.encoding.texture) {
      TVLSpec.encoding.color = TVLSpec.encoding.texture;
      delete TVLSpec.encoding.texture;
    }

    let mergedSpec = TVLSpec;
    let defaultSpec = selectDefaultSpec(TVLSpec);
    let updatedDefaultSpec = updateDefault(TVLSpec, defaultSpec);
    mergedSpec = mergeSpec(TVLSpec, updatedDefaultSpec);

    elaborateTVLSpec(mergedSpec).then((elaboratedTVLSpec) => {
      console.log("final updated Spec: ", elaboratedTVLSpec)
      vegaEmbed("#tactile", elaboratedTVLSpec, { renderer: "svg" }).then(result => {
        modifySvg(result, elaboratedTVLSpec);
        terminateWorker();
      }).catch(error => console.error(error));
    });
  };

  renderVegaLiteChart(userTVLSpec);
  renderTactileChart(userTVLSpec);

  function downloadSVG() {
    const svgElement = document.querySelector('#tactile svg');
    if (!svgElement) {
      console.error('SVG not found');
      return;
    }
    // Serialize the SVG to a string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    // Create a Blob object
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    // Create a download link and trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tactile-visualization.svg'; // Name of the file to download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  submitButton.addEventListener('click', () => {
    try {
      let spec = JSON.parse(editor.getValue()); // Get value from Monaco Editor
      renderTactileChart(spec);
      renderVegaLiteChart(spec);
    } catch (error) {
      console.error('Invalid JSON', error);
    }
  });

  // Bind the downloadSVG function to the download button's click event
  downloadButton.addEventListener('click', downloadSVG);
  // downloadButtonPNG.addEventListener('click', downloadPNG);

});
