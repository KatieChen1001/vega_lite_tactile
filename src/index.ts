import vegaEmbed from "vega-embed";
import { Config, TopLevelSpec, compile } from 'vega-lite';
import { modifySvg } from './modules/modifySvg/chartModifier';
const d3 = require("d3");
// import { updateVLSpec } from "./modules/update/updateSpec";
import './style.css';
import { defaultTVLSpecBar } from "./modules/specs/defaultTVLSpecBar";
import { elaborateTVLSpec } from "./modules/update/elaborateSpec";
import { mergeSpec } from "./modules/modifySpec/mergeSpec";
import { selectDefaultSpec } from "./modules/modifySpec/selectDefault";
import { updateDefault } from "./modules/modifySpec/updateDefault";


document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input') as HTMLInputElement;
    const submitButton = document.getElementById('render') as HTMLButtonElement;
    const downloadButton = document.getElementById('download') as HTMLButtonElement;
    const downloadButtonPNG = document.getElementById('downloadPNG') as HTMLButtonElement;

    const userTVLSpec: any =
    {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "title": "Google Stock Price Over Time",
        "description": "Google's stock price over time.",
        "data": { "url": "https://raw.githubusercontent.com/vega/vega-datasets/main/data/stocks.csv" },
        "transform": [{ "filter": "datum.symbol==='GOOG'" }],
        "mode": "tactile",
        "mark": {
            "type": "line",
            "point": true
        },
        "encoding": {
            "x": {
                "field": "date",
                "type": "temporal",
                "axis": {
                    "ticks": true
                }
            },
            "y": {
                "field": "price",
                "type": "quantitative"
            }
        }
    }


    // function to render vega-lite spec
    function renderVegaLiteChart(spec: TopLevelSpec) {
        vegaEmbed("#visual", spec, { renderer: "svg" }).then(result => {
        }).catch(error => console.error(error));
    }

    function renderTactileChart(spec: any) {
        let mergedSpec = spec;
        if (spec.mode === "tactile") {
            let defaultSpec = selectDefaultSpec(spec);
            let updatedDefaultSpec = updateDefault(spec, defaultSpec);
            mergedSpec = mergeSpec(spec, updatedDefaultSpec);
        };

        elaborateTVLSpec(mergedSpec).then((elaboratedTVLSpec) => {
            console.log("final updated Spec: ", elaboratedTVLSpec)
            vegaEmbed("#tactile", elaboratedTVLSpec, { renderer: "svg" }).then(result => {
                modifySvg(result, elaboratedTVLSpec);
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

    function downloadPNG() {
        console.log("fixing png download issue");
    }


    input.addEventListener('input', () => {
        // format user input to be more readable json format
        const value = input.value.trim();
        try {
            // Attempt to parse the JSON input
            const parsed = JSON.parse(value);
            // Reformat and set back into the textarea with indentation
            input.value = JSON.stringify(parsed, null, 2);
        } catch (error) {
            // If there's a parsing error, do not attempt to format
            console.error("Invalid JSON input");
        }
    });

    submitButton.addEventListener('click', () => {
        // render button click event
        try {
            const spec = JSON.parse(input!.value);
            renderTactileChart(spec);
            // remove all the tactile part from the spec and set to a new spec called visualSpec
            let visualSpec = JSON.parse(JSON.stringify(spec));
            delete visualSpec.tactile;
            renderVegaLiteChart(visualSpec);
        } catch (error) {
            console.error('Invalid JSON', error);
        }
    });

    // Bind the downloadSVG function to the download button's click event
    downloadButton.addEventListener('click', downloadSVG);
    downloadButtonPNG.addEventListener('click', downloadPNG);

});
